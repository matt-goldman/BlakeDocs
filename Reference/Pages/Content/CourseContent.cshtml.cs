using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Knowllective.Domain.Models;
using Knowllective.Application.Services;
using System.Security.Claims;
using Knowllective.Application.Services.Abstractions;

namespace RazorUI.Pages.Content;

[Authorize]
public class CourseContent(
    ICourseService courseService,
    IMarkdownService markdownService) : PageModel
{
    public string HtmlContent { get; set; } = string.Empty;

    public List<Section> PageSections { get; set; } = [];

    public List<Section> CourseSections { get; set; } = [];

    public bool PageFound { get; set; } = true;

    public string ActiveModule { get; set; } = string.Empty;

    public string ActiveChapter { get; set; } = string.Empty;

    public string PageHeading { get; set; } = string.Empty;

    public Guid? NextPage { get; set; }
    public string NextPageName { get; set; } = string.Empty;

    public Guid? PreviousPage { get; set; }
    public string PreviousPageName { get; set; } = string.Empty;

    public async Task<IActionResult> OnGetAsync(Guid pageId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (Guid.TryParse(userId, out Guid PuserId) is false)
        {
            return RedirectToPage("/Account/Login", new { area = "Identity" });
        }

        var page = await courseService.GetContent(pageId, PuserId);

        if (page is null)
        {
            PageFound = false;
            return Page();
        }

        if (!page.CurrentUserIsEnrolled)
        {
            // redirect to enroll page
            return RedirectToPage("/Content/Enrol", new { page.CourseId });
        }

        ActiveChapter = pageId.ToString().ToLower();

        PageHeading = page.Title;

        ActiveModule = page.ModuleId.ToString().ToLower();

        var document = markdownService.GetDocumentWithSections(page.Content);

        HtmlContent = document.Html;

        PageSections = document.Sections;

        CourseSections = await courseService.GetCourseSectionsAsync(page.CourseId);

        PreviousPage = page.PreviousPage;
        PreviousPageName = page.PreviousPageName;
        NextPage = page.NextPage;
        NextPageName = page.NextPageName;

        ViewData["Title"] = page.Title;

        return Page();
    }

    public async Task<IActionResult> OnPostCompletedPageAsync([FromQuery] Guid pageId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (Guid.TryParse(userId, out Guid puserId) is false)
        {
            return RedirectToPage("/Account/Login", new { area = "Identity" });
        }

        await courseService.MarkChapterCompleteAsync(pageId, puserId);

        return new OkResult();
    }
}