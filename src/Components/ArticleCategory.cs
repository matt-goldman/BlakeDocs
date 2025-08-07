using Blazicons;

namespace BlakeSampleDocs.Components;

public record ArticleCategory(
    SvgIcon? Icon,
    string Title,
    string? Description = null,
    string? Link = null,
    int ArticleCount = 0,
    int? readTime = null
);