async function GoToNext(id, nextId) {
    console.log(`Marking ${id} as completed and moving to ${nextId}`);

    const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]').value;

    $('#nextPageButton').prop('disabled', true);
    $('#nextPageButtonSpinner').show();

    const markNextSucceeded = await fetch(`/Content/CourseContent?handler=CompletedPage&pageId=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': csrfToken
        }
    })
        .then(() => window.location.href=`/Content/CourseContent?pageId=${nextId}`)
        .catch((err) => {
            console.error(err);
            window.location.href = `/Content/CourseContent?pageId=${nextId}`;
        });
}