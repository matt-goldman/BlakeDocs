using Knowllective.Shared.DTOs.Course;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Knowllective.Domain.Models;
using Knowllective.Application.Services;
using Knowllective.Application.Services.Abstractions;

namespace RazorUI.Pages;

[AllowAnonymous]
public class IndexModel(ILogger<IndexModel> logger, IUserService userService, ICourseService courseService) : PageModel
{
    public List<UserCourse> MyCourses { get; set; } = [];

    public List<CourseDto> AvailableCourses { get; set; } = [];

    public List<Section> CourseSections { get; set; } = [];

    public Guid CourseId { get; set; }

    public async Task OnGetAsync()
    {
        AvailableCourses = await courseService.GetTopCoursesAsync(3);

        if (User.Identity?.IsAuthenticated == true)
        {
            MyCourses = await userService.GetMyEnrolledCoursesAsync();
        }

        if (AvailableCourses.Count > 0)
        {
            CourseId = AvailableCourses.Select(c => c.Id).First();

            CourseSections = await courseService.GetCourseSectionsAsync(CourseId);
        }
    }
}