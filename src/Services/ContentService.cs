using Blake.Generated;
using Blake.Types;
using BlakePlugin.DocsRenderer.Types;
using BlakePlugin.DocsRenderer.Utils;
using BlakeSampleDocs.Components;
using Blazicons;

namespace BlakeSampleDocs.Services;

public class ContentService
{
    private List<TocNode> _toc = [];
    private List<ArticleCategory> _categories = [];

    public List<TocNode> GetSiteToc()
    {
        if (_toc.Count == 0)
        {
            _toc = TocUtils.BuildSiteTocNodes(GeneratedContentIndex.GetPages());
        }

        return _toc;
    }

    public List<PageModel> GetQuickAccessPages()
    {
        var pages = GeneratedContentIndex.GetPages();

        return pages
            .Where(p => p.Metadata.TryGetValue("quickAccess", out var quickAccess) && int.TryParse(quickAccess, out var order) && order > 0)
            .OrderBy(p => p.Metadata["quickAccess"])
            .Take(5)
            .ToList();
    }

    public List<PageModel> GetRecentUpdates()
    {
        var pages = GeneratedContentIndex.GetPages();
        return pages
            .OrderByDescending(p => p.Date)
            .Take(4)
            .ToList();
    }

    public List<ArticleCategory> GetArticleCategories()
    {
        if (_categories.Count == 0)
        {
            var pages = GeneratedContentIndex.GetPages();

            foreach (var page in pages)
            {
                int readTime = 0;

                if (!page.Metadata.ContainsKey("category") || string.IsNullOrEmpty(page.Metadata["category"].ToString()))
                {
                    continue; // Skip pages without a category
                }

                if (page.Metadata.TryGetValue("readTimeMinutes", out var readTimeValue) && int.TryParse(readTimeValue.ToString(), out var parsedReadTime))
                {
                    readTime = parsedReadTime;
                }
                
                var categoryName = page.Metadata["category"].ToString();
                var category = _categories.FirstOrDefault(c => c.Title.Equals(categoryName, StringComparison.OrdinalIgnoreCase));

                if (category == null)
                {
                    category = new ArticleCategory(
                        GetCategoryIcon(categoryName),
                        categoryName, GetCategoryDescription(categoryName),
                        $"/categories/{categoryName.ToLowerInvariant()}",
                        1,
                        readTime);

                    _categories.Add(category);
                }
                else
                {
                    var updatedCount = category.ArticleCount + 1;
                    var updatedReadTime = category.ReadTime.HasValue ? (category.ReadTime.Value + readTime) : readTime;
                    var updatedCategory = category with { ArticleCount = updatedCount, ReadTime = updatedReadTime };
                    _categories[_categories.IndexOf(category)] = updatedCategory;
                }
            }
        }

        return _categories;
    }

    public List<PageModel> GetCategoryPages(string category)
    {
        Console.WriteLine($"Fetching pages for category: {category}");
        var pages = GeneratedContentIndex.GetPages();

        List<PageModel> categoryPages = [];

        foreach (var page in pages)
        {
            if (!page.Metadata.ContainsKey("category") || string.IsNullOrEmpty(page.Metadata["category"].ToString()))
            {
                Console.WriteLine($"Skipping page '{page.Title}' as it has no category.");
                continue; // Skip pages without a category
            }

            Console.WriteLine($"Page '{page.Title}' has category '{page.Metadata["category"]}'");

            if (page.Metadata["category"].ToString().Equals(category, StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine($"Page '{page.Title}' matches category '{category}'");
                categoryPages.Add(page);
            }
            else
            {
                Console.WriteLine($"Page '{page.Title}' does not match category '{category}'");
            }
        }

        Console.WriteLine($"Found {categoryPages.Count} pages in category '{category}'");
        return categoryPages;

        //return pages
        //    .Where(p => p.Metadata.TryGetValue("category", out var cat) && cat.ToString().Equals(category, StringComparison.OrdinalIgnoreCase))
        //    .OrderBy(p => p.Title)
        //    .ToList();
    }

    public SvgIcon GetCategoryIcon(string category)
    {
        return category switch
        {
            "Quick Start"           => FontAwesomeSolidIcon.Rocket,
            "Authoring Content"     => FontAwesomeSolidIcon.Book,
            "Getting Started"       => FontAwesomeSolidIcon.Rocket,
            "Using Blake"           => FontAwesomeSolidIcon.Code,
            "Deploying to Azure"    => FontAwesomeSolidIcon.CloudArrowUp,
            "Deploying to GitHub"   => FontAwesomeSolidIcon.CloudArrowUp,
            "Deploying"             => FontAwesomeSolidIcon.CloudArrowUp,
            "Contributing"          => FontAwesomeSolidIcon.Gear,
            "Meta"                  => FontAwesomeSolidIcon.CircleInfo,
            "FAQ"                   => FontAwesomeSolidIcon.CircleQuestion,
            _                       => FontAwesomeSolidIcon.Link
        };
    }

    private static string GetCategoryDescription(string category)
    {
        return category switch
        {
            "Getting Started"   => "Everything you need to begin your journey. Installation guides, quick start tutorials, and basic concepts.",
            "Using Blake"       => "Learn how to build sites and templates using Blake. From basic components to advanced features, find step-by-step guides.",
            "Deploying"         => "Understand how to deploy your Blake sites effectively. Covers hosting options, deployment strategies, and best practices.",
            "Contributing"      => "Internals of Blake and how to contribute. Learn about the build pipeline, code standards, and how to submit changes.",
            "Meta"              => "Meta information about Blake, including the philosophy behind the project, FAQ, and product roadmap.",
            _                   => "Explore our documentation for more information."
        };
    }
}
