using Blazicons;

namespace BlakeSampleDocs.Components;

public record ArticleCategory(
    SvgIcon? Icon,
    string Title,
    string? Description = null,
    string? Link = null,
    int ArticleCount = 0,
    int? ReadTime = null
);

public record ArticleSummary (
    string Title,
    string? Description = null,
    string? Link = null,
    string Level = "Beginner",
    int ReadTime = 0,
    SvgIcon? Icon = null
);