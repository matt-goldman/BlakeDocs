// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


function registerScrollObserver() {

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const a = document.querySelector(`.toc-container li a[href="#${id}"]`);

            if (entry.intersectionRatio > 0) {
                if (a) {
                    a.parentElement.classList.add("active");
                }
            }
            else {
                if (a) {
                    a.parentElement.classList.remove("active");
                }
            }
        });
    });

    document.querySelectorAll('section[id]').forEach(s => {
        observer.observe(s);
    });
}


$(document).on('click', '.module-title', function () {
    $(this).find('i').toggleClass('fa-chevron-right fa-chevron-down');
});

$(document).ready(function () {
    
    registerScrollObserver();
});
