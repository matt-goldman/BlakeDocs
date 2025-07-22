$(document).ready(function () {

    var tinyMDE = new TinyMDE.Editor({ textarea: "Chapter_Content" });
    var commandBar = new TinyMDE.CommandBar({
        element: "toolbar",
        editor: tinyMDE,
    });
    
    const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]').value;
    
    $('#editPageForm').submit(async function (e) {
        e.preventDefault();
        
        let chapterId = $('#Chapter_ChapterId').val();
        let title = $('#Chapter_Title').val();
        let description = $('#Chapter_Description').val();
        let content = $('#Chapter_Content').val();
        
        const errorToast = document.getElementById('errorToast')
        const successToast = document.getElementById('successToast');
        
        var saveSucceeded = await fetch('/Admin/EditPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': csrfToken
            },
            body: JSON.stringify({ chapterId: chapterId, Title: title, Description: description, Content: content })
        })
            .then(response => response.json())
            .then(result => {
                console.log('Got result:');
                console.log(result);
                if (result.succeeded === true) {
                    const successBootstrap = bootstrap.Toast.getOrCreateInstance(successToast);
                    successBootstrap.show();
                } else {
                    const errorBoostrap = bootstrap.Toast.getOrCreateInstance(errorToast);
                    errorBoostrap.show();
                }
            })
            .catch(err => {
                console.error(err);
                const errorBoostrap = bootstrap.Toast.getOrCreateInstance(errorToast);
                errorBoostrap.show();
            });
    });

    tinyMDE.addEventListener("drop", async function (event) {
        let formData = new FormData();

        // You can add use event.dataTransfer.items or event.dataTransfer.files
        // to build the form data object:
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === "file") {
                let file = event.dataTransfer.items[i].getAsFile();
                formData.append("file", file);
            }
        }

        // Call your API endpoint that accepts "Content-Type": "multipart/form-data"
        var imageUrl = await fetch('/Admin/EditCourse?handler=Image', {
            method: 'POST',
            body: formData,
            headers: {
                'RequestVerificationToken': csrfToken,
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log('Got result:');
                console.log(result);
                tinyMDE.paste(`![${result.fileName}](${result.fileUrl})`);
            })
            .catch(err => {
                console.error(err);
            });
        // requests and responds with the image names and URL-s.
        //
        // Now you can add Markdown images like so:
        
    });

});

/*
Here's how to add image drag & drop to your TinyMDE editor:

editor.addEventListener("drop", function (event) {
  let formData = new FormData();

  // You can add use event.dataTransfer.items or event.dataTransfer.files
  // to build the form data object:
  for (let i = 0; i < event.dataTransfer.items.length; i++) {
    if (event.dataTransfer.items[i].kind === "file") {
      let file = event.dataTransfer.items[i].getAsFile();
      formData.append("image", file);
    }
  }

  // Call your API endpoint that accepts "Content-Type": "multipart/form-data"
  // requests and responds with the image names and URL-s.
  //
  // Now you can add Markdown images like so:
  editor.paste(`![${imageName}](${imageUrl})`);
});
*/

// TODO: add custom commands to the editor for the AncRenderers. Example:
  /*
    'insertLink': {
    name: 'insertLink',
    action: (editor) => {if (editor.isInlineFormattingAllowed()) editor.wrapSelection('[', ']()')},
    enabled: (editor, focus, anchor) => editor.isInlineFormattingAllowed(focus, anchor) ? false : null,
    innerHTML: svg.link,
    title: 'Insert link',
    hotkey: 'Mod-K',
  },
  */