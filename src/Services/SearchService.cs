using Blake.Generated;

namespace BlakeSampleDocs.Services;

public class SearchService 
{
    public static List<SearchResult> Search(string searchTerm, int? maxResults = null)
    {
        var query = GeneratedContentIndex.GetPages()
            .Where(page =>
                page.Title.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                page.Description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                page.Tags.Any(tag => tag.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)) ||
                page.Metadata.Any(m => m.Key.Equals(searchTerm, StringComparison.OrdinalIgnoreCase) || m.Value.Equals(searchTerm, StringComparison.OrdinalIgnoreCase)));

        if (maxResults.HasValue)
        {
            query = query.Take(maxResults.Value);
        }
        
        return query.Select(page => new SearchResult(
            page.Slug,
            page.Title,
            page.Description,
            page.Metadata.TryGetValue("category", out var category) ? category : "Uncategorized",
            string.Join(", ", page.Tags)))
            .ToList();
    }
}

public record SearchResult(string Slug, string Title, string Description, string Category, string Tags);