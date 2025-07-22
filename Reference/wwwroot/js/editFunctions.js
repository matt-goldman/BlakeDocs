$(document).ready(function () {
    // get the course Id from the form
    let courseId = $('#Course_Id').val();

    fetch(`/Admin/EditCourse?handler=Modules&courseId=${courseId}`)
        .then(response => response.json())
        .then(data => {
            courseData = data
            renderCourseStructure();
        })
        .catch(error => console.error('Error loading course:', error));

    // Initialize Sortable for course structure
    let courseStructure = document.getElementById('courseStructure');
    // Sortable for modules
    new Sortable(courseStructure, {
        animation: 150,
        handle: '.grip-handle',
        group: 'modules',
        forceFallback: true,
        onEnd: function () {
            updateModuleAndChapterOrder(); // Track reordering locally
        }
    });

    // Sortable for chapters inside each module
    document.querySelectorAll('.chapter-list').forEach(el => {
        new Sortable(el, {
            animation: 150,
            handle: '.grip-handle',
            group: 'chapters',
            forceFallback: true,
            onEnd: function () {
                updateModuleAndChapterOrder(); // Track reordering locally
            }
        });
    });



    // Render course structure
    function renderCourseStructure() {
        console.log(courseData);
        let html = '';
        courseData.modules.forEach((module, index) => {
            html += `
                    <li class="sortable-item module-item" data-id="${module.id}">
                        <i class="fas fa-grip-vertical grip-handle"></i>
                        <span class="module-title">${module.title}</span>
                        <div class="edit-icons">
                            <i class="fas fa-edit edit-module" data-id="${module.id}"></i>
                            <i class="fas fa-trash-alt delete-module" data-id="${module.id}"></i>
                            <i class="fas fa-plus add-chapter" data-id="${module.id}"></i>
                        </div>
                        <ul class="sortable-list chapter-list">
                            ${module.chapters.map(chapter => `
                                <li class="sortable-item chapter-item" data-id="${chapter.id}">
                                    <i class="fas fa-grip-vertical grip-handle"></i>
                                    ${chapter.title}
                                    <div class="edit-icons">
                                    <i class="fas fa-file-pen edit-page-content" data-id="${chapter.id}" title="Edit page content"></i>
                                        <i class="fas fa-edit edit-chapter" data-id="${chapter.id}"></i>
                                        <i class="fas fa-trash-alt delete-chapter" data-id="${chapter.id}"></i>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </li>
                `;
        });
        $('#courseStructure').html(html);

        // Initialize Sortable for chapters within each module
        document.querySelectorAll('.chapter-list').forEach(el => {
            new Sortable(el, {
                animation: 150,
                handle: '.grip-handle',
                group: 'chapters',
                forceFallback: true,
                onEnd: function () {
                    updateModuleAndChapterOrder(); // Track reordering locally
                }
            });
        });
    }

    function updateModuleAndChapterOrder() {
        // Update module order
        $('#courseStructure .module-item').each((index, el) => {
            let moduleId = $(el).data('id');
            console.log(`Processing module ${moduleId}`);
            let module = courseData.modules.find(m => m.id === moduleId);
            if (module) {
                module.courseOrder = index + 1; // Update order in local object
                console.log(`Module ${module.title} order: ${module.courseOrder}`);
            } else {
                console.error(`Module with ID ${moduleId} not found!`);
            }

            console.log(`Processing chapters in module ${moduleId}`);

            // Update chapter order within each module
            $(el).find('.chapter-list .chapter-item').each((chapterIndex, chapterEl) => {
                let chapterId = $(chapterEl).data('id');
                let chapter = module.chapters.find(c => c.id === chapterId);
                if (chapter) {
                    chapter.moduleOrder = chapterIndex + 1; // Update order in local object
                    console.log(`Chapter ${chapter.title} order: ${chapter.moduleOrder}`);
                } else {
                    console.error(`Chapter with ID ${chapterId} not found!`);
                }
            });
        });
    }


    // Add new module
    $('#addModuleBtn').click(function () {
        let newModuleId = crypto.randomUUID();
        courseData.modules.push({
            id: newModuleId,
            title: `New Module`,
            chapters: []
        });
        renderCourseStructure();
    });

    // Edit module
    $(document).on('click', '.edit-module', function () {
        let moduleId = $(this).data('id');
        let module = courseData.modules.find(m => m.id === moduleId);
        $('#moduleTitle').val(module.title);
        $('#editModuleModal').modal('show').data('moduleId', moduleId);
    });

    // Save module changes
    $('#saveModuleBtn').click(function () {
        let moduleId = $('#editModuleModal').data('moduleId');
        let moduleTitle = $('#moduleTitle').val();
        let module = courseData.modules.find(m => m.id === moduleId);
        module.title = moduleTitle;
        renderCourseStructure();
        $('#editModuleModal').modal('hide');
    });

    // Handle Enter key for Module Title input
    $('#moduleTitle').on('keypress', function (e) {
        if (e.which === 13) { // 13 is the Enter key
            e.preventDefault(); // Prevent form submission
            $('#saveModuleBtn').click(); // Trigger the save button
        }
    });

    // Handle Enter key for Chapter Title input
    $('#chapterTitle').on('keypress', function (e) {
        if (e.which === 13) { // 13 is the Enter key
            e.preventDefault(); // Prevent form submission
            $('#saveChapterBtn').click(); // Trigger the save button
        }
    });


    // Delete module
    $(document).on('click', '.delete-module', function () {
        if (confirm('Are you sure you want to delete this module?')) {
            let moduleId = $(this).data('id');
            courseData.modules = courseData.modules.filter(m => m.id !== moduleId);
            renderCourseStructure();
        }
    });

    // Add new chapter
    $(document).on('click', '.add-chapter', function () {
        let moduleId = $(this).data('id');
        let module = courseData.modules.find(m => m.id === moduleId);
        let newchapterId = crypto.randomUUID();
        module.chapters.push({
            id: newchapterId,
            title: `New chapter`
        });
        renderCourseStructure();
    });


    // Edit chapter
    $(document).on('click', '.edit-chapter', function () {
        let chapterId = $(this).data('id');
        console.log(`Edit chapter ${chapterId} clicked`);
        let chapter = courseData.modules.flatMap(m => m.chapters).find(p => p.id === chapterId);
        $('#chapterTitle').val(chapter.title);
        $('#editChapterModal').modal('show').data('chapterId', chapterId);
    });

    // Save chapter changes
    $('#saveChapterBtn').click(function () {
        let chapterId = $('#editChapterModal').data('chapterId');
        let chapterTitle = $('#chapterTitle').val();
        courseData.modules.forEach(module => {
            let chapter = module.chapters.find(p => p.id === chapterId);
            if (chapter) {
                chapter.title = chapterTitle;
            }
        });
        renderCourseStructure();
        $('#editChapterModal').modal('hide');
    });

    // Delete chapter
    $(document).on('click', '.delete-chapter', function () {
        if (confirm('Are you sure you want to delete this chapter?')) {
            let chapterId = $(this).data('id');
            courseData.modules.forEach(module => {
                module.chapters = module.chapters.filter(p => p.id !== chapterId);
            });
            renderCourseStructure();
        }
    });

    // Edit page content
    $(document).on('click', '.edit-page-content', async function () {
        let pageId = $(this).data('id');

        await saveContent()
            .then((result) => {
                if (!result) {
                    alert('Failed to save course outline. Please try again.');
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Failed to save course outline. Please try again.');
                return;
            });
        window.location.href = `/Admin/EditPage?id=${pageId}`;
    });

    // Form submission
    $('#editCourseForm').submit(async function (e) {
        e.preventDefault();

        await saveContent().then((result) => {
            if (result)
                alert('Course outline saved successfully!');
            else
                alert('Failed to save course');
        });
    });

    async function saveContent() {
        updateModuleAndChapterOrder();
        // Save page content
        let updatedModules = courseData.modules.map(m => ({
            id: m.id || crypto.randomUUID(), // Ensure ID exists for new modules
            title: m.title,
            order: m.courseOrder
        }));

        let updatedChapters = courseData.modules.flatMap(m =>
            m.chapters.map(c => ({
                id: c.id || crypto.randomUUID(), // Ensure ID exists for new chapters
                title: c.title,
                order: c.moduleOrder,
                moduleId: m.id
            }))
        );

        let csrfToken = document.querySelector('input[name="__RequestVerificationToken"]').value;
       
        var saveSucceeded = await fetch('/Admin/EditCourse?handler=UpdateCourseOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': csrfToken 
            },
            body: JSON.stringify({ courseId: courseId, modules: updatedModules, chapters: updatedChapters })
        })
            .then(response => response.json())
            .then(data => {
                return true;
            })
            .catch(error => {
                console.error('Failed to save order:', error);
                return false;
            });

        return saveSucceeded;
    }

    $(document).on('click', '#backupContentBtn', async function () {

        // show the modal
        $('#exportContentModal').modal('show');

        try {
            // fetch the content
            let courseId = $('#Course_Id').val();

            let response = await fetch(`/Admin/EditCourse?handler=Export&courseId=${courseId}`);

            if (!response.ok) {
                alert('Failed to fetch course content. Please try again.');
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `course-${courseId}.zip`; // Or use the course name if you know it
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        catch (error) {
            console.error(error);
            alert('Failed to export, please try again.');
            $('#exportContentModal').modal('hide');
        }

        // hide the modal
        $('#exportContentModal').modal('hide');
    });
});