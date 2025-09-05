---
title: 'Advanced Template Features'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Advanced features for Blake site templates including customizable theming, search integration, and dynamic functionality."
iconIdentifier: "bi bi-gear-fill-nav-menu"
pageOrder: 3
category: "Creating Site Templates"
---

:::summary
Take your Blake site templates to the next level with advanced features like customizable theming, search integration, and dynamic components. These features help create professional, user-friendly templates.
:::

## Customizable Theming

Template styling is completely template-dependent. Authors can choose Bootstrap, Tailwind, custom CSS, or any approach that fits their design goals. Consider Blazor CSS isolation for component-specific styling.

### CSS Custom Properties

Using CSS custom properties allows users to easily customize your template without editing multiple files:

```css
/* wwwroot/css/site.css */
:root {
  /* Colors from configuration */
  --primary-color: #007acc;
  --secondary-color: #f8f9fa;
  --text-color: #333;
  --background-color: #fff;

  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

/* Component styles using custom properties */
.navbar {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
}

.post-content {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color);
}
```

### Configuration-Based Theming

This is an illustrative example of dynamic theming. Template authors should lean into the Blazor ecosystem and may prefer existing UI frameworks (MudBlazor, Lumex, etc.) or NuGet packages with Razor components rather than building custom solutions.

```razor
@* Components/ThemeProvider.razor *@
@inject IConfiguration Configuration
@inject IJSRuntime JSRuntime

@code {
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await ApplyThemeAsync();
        }
    }

    private async Task ApplyThemeAsync()
    {
        var theme = Configuration.GetSection("Theme");
        var cssVariables = new Dictionary<string, string>
        {
            ["--primary-color"] = theme["PrimaryColor"] ?? "#007acc",
            ["--secondary-color"] = theme["SecondaryColor"] ?? "#f8f9fa",
            ["--font-family"] = theme["FontFamily"] ?? "Inter, sans-serif"
        };

        foreach (var variable in cssVariables)
        {
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty",
                variable.Key, variable.Value);
        }
    }
}
```

## Search Integration

**Blake provides the `GeneratedContentIndex` that exposes title, description, tags, and metadata for simple search functionality. However, the actual text/content of generated pages is not searchable.**

Here's how to implement basic search functionality in your template:

```razor
@* Components/SiteSearch.razor *@
@using Blake.Types

<div class="search-container">
    <input @bind="searchTerm" @onkeyup="OnSearchInput"
           class="search-input" placeholder="Search..." />

    @if (showResults && searchResults.Any())
    {
        <div class="search-results">
            @foreach (var result in searchResults.Take(10))
            {
                <div class="search-result">
                    <a href="@result.Url" class="result-title">@result.Title</a>
                    <p class="result-excerpt">@result.Excerpt</p>
                </div>
            }
        </div>
    }
</div>

@code {
    private string searchTerm = string.Empty;
    private bool showResults = false;
    private List<SearchResult> searchResults = new();

    private async Task OnSearchInput(KeyboardEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            showResults = false;
            return;
        }

        searchResults = SearchPages(searchTerm);
        showResults = searchResults.Any();
        StateHasChanged();
    }

    private List<SearchResult> SearchPages(string term)
    {
        return GeneratedContentIndex.GetPages()
            .Where(p => !p.IsDraft)
            .Where(p => p.Title.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                       p.Content.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                       p.Tags.Any(t => t.Contains(term, StringComparison.OrdinalIgnoreCase)))
            .Select(p => new SearchResult
            {
                Title = p.Title,
                Url = $"/{p.Slug}",
                Excerpt = ExtractExcerpt(p.Content, term)
            })
            .OrderByDescending(r => CalculateRelevance(r, term))
            .ToList();
    }

    private string ExtractExcerpt(string content, string term)
    {
        // Simple excerpt extraction - find the term and show surrounding context
        var index = content.IndexOf(term, StringComparison.OrdinalIgnoreCase);
        if (index == -1) return content.Substring(0, Math.Min(content.Length, 150)) + "...";
        
        var start = Math.Max(0, index - 75);
        var length = Math.Min(content.Length - start, 150);
        return content.Substring(start, length) + "...";
    }

    private double CalculateRelevance(SearchResult result, string term)
    {
        double score = 0;
        
        // Title matches are worth more
        if (result.Title.Contains(term, StringComparison.OrdinalIgnoreCase))
            score += 10;
            
        // Exact matches are worth more than partial matches
        if (result.Title.Equals(term, StringComparison.OrdinalIgnoreCase))
            score += 20;
            
        return score;
    }

    private class SearchResult
    {
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
    }
}
```

## Dynamic Components

### Navigation Components

Create dynamic navigation that automatically updates based on content:

```razor
@* Components/DynamicNavigation.razor *@
@using Blake.Types

<nav class="site-navigation">
    @foreach (var category in GetNavigationCategories())
    {
        <div class="nav-category">
            <h3>@category.Key</h3>
            <ul>
                @foreach (var page in category.Value.OrderBy(p => p.PageOrder))
                {
                    <li>
                        <a href="/@page.Slug" class="@GetActiveClass(page.Slug)">
                            @page.Title
                        </a>
                    </li>
                }
            </ul>
        </div>
    }
</nav>

@code {
    [Inject] NavigationManager Navigation { get; set; } = default!;
    
    private Dictionary<string, List<PageModel>> GetNavigationCategories()
    {
        return GeneratedContentIndex.GetPages()
            .Where(p => !p.IsDraft)
            .GroupBy(p => p.Category ?? "General")
            .ToDictionary(g => g.Key, g => g.ToList());
    }
    
    private string GetActiveClass(string slug)
    {
        var currentPath = Navigation.ToBaseRelativePath(Navigation.Uri);
        return currentPath.Equals(slug, StringComparison.OrdinalIgnoreCase) ? "active" : "";
    }
}
```

### Tag Cloud Component

Display popular tags with weighted sizing:

```razor
@* Components/TagCloud.razor *@
@using Blake.Types

<div class="tag-cloud">
    @foreach (var tag in GetWeightedTags())
    {
        <a href="/tags/@tag.Name" 
           class="tag-link" 
           style="font-size: @(tag.Weight)em;">
            @tag.Name
        </a>
    }
</div>

@code {
    private List<WeightedTag> GetWeightedTags()
    {
        var tagCounts = GeneratedContentIndex.GetPages()
            .Where(p => !p.IsDraft)
            .SelectMany(p => p.Tags ?? new string[0])
            .GroupBy(tag => tag)
            .ToDictionary(g => g.Key, g => g.Count());
            
        var maxCount = tagCounts.Values.DefaultIfEmpty(1).Max();
        
        return tagCounts
            .Select(kvp => new WeightedTag 
            { 
                Name = kvp.Key, 
                Weight = 0.8 + (kvp.Value / (double)maxCount * 1.2)
            })
            .OrderBy(t => t.Name)
            .ToList();
    }
    
    private class WeightedTag
    {
        public string Name { get; set; } = string.Empty;
        public double Weight { get; set; }
    }
}
```

## Performance Optimization

### Lazy Loading Components

```razor
@* Components/LazyContent.razor *@
<div class="lazy-content" @ref="contentElement">
    @if (isVisible)
    {
        @ChildContent
    }
    else
    {
        <div class="loading-placeholder">Loading...</div>
    }
</div>

@code {
    [Parameter] public RenderFragment? ChildContent { get; set; }
    
    private ElementReference contentElement;
    private bool isVisible = false;
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            // Use Intersection Observer API for lazy loading
            await JSRuntime.InvokeVoidAsync("observeElement", contentElement, 
                DotNetObjectReference.Create(this));
        }
    }
    
    [JSInvokable]
    public void OnVisible()
    {
        isVisible = true;
        StateHasChanged();
    }
}
```

## Next Steps

With these advanced features, your template will offer:
- **Professional theming options** that users can easily customize
- **Search functionality** that works with Blake's content index
- **Dynamic components** that adapt to content automatically
- **Performance optimizations** for better user experience

Ready to document your template? See:
- [Documentation Guidelines](/pages/6%20creating%20site%20templates/documentation) - How to document and configure your template
- [Distribution Guide](/pages/6%20creating%20site%20templates/distribution) - Publishing and maintaining your template

:::tip
**Advanced Feature Tips**

- Use existing Blake plugins when possible rather than rebuilding functionality
- Consider accessibility in all advanced features
- Test performance with large amounts of content
- Provide fallbacks for JavaScript-dependent features
- Document all advanced features clearly for template users
:::