---
title: 'Page Templates'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes the templating system in Blake, including how to create and use templates."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 3
category: "Using Blake"
---

:::info
**Summary**
Page templates define how your Markdown content is rendered as Blazor components. Use `template.razor` files for folder-specific templates or `cascading-template.razor` for templates that apply to multiple levels of your site.
:::

## Understanding Page Templates

Page templates are the bridge between your Markdown content and your site's presentation. When you run `blake bake`, Blake transforms your Markdown files into Blazor components using these templates as the rendering blueprint.

Blake supports two types of templates:
- **`template.razor`** - Applied to Markdown files in the same folder
- **`cascading-template.razor`** - Applied to Markdown files in the current folder and all subfolders

This flexible approach lets you create consistent layouts while maintaining the ability to customize specific sections of your site.

## Template Files and Folder Conventions

### Basic Template Structure

Blake looks for `template.razor` files in any folder containing Markdown files. Here's the simplest possible template:

```razor
<div>
    <h1>@Title</h1>
    @Body
</div>
```

This template will:
1. Display the page title from frontmatter
2. Render the Markdown content as HTML

### Folder Organization

Blake is flexible about folder structure, but templates must be placed correctly:

```
Pages/
├── Blog/
│   ├── template.razor          # Applied to .md files in Blog/ only
│   ├── my-first-post.md
│   └── another-post.md
└── cascading-template.razor    # Applied to all .md files in Pages/ and subfolders
```

:::note
If both `template.razor` and `cascading-template.razor` exist in a folder's hierarchy, `template.razor` takes precedence for that specific folder.
:::

## Cascading Templates

Cascading templates provide a powerful way to apply consistent layouts across multiple levels of your site without duplicating template code.

### How Cascading Works

When Blake processes a Markdown file, it looks for templates in this order:
1. `template.razor` in the same folder as the Markdown file
2. `cascading-template.razor` in the same folder
3. `cascading-template.razor` in parent folders (walking up the hierarchy)

### Cascading Template Example

The `cascading-template.razor` file in this documentation site demonstrates advanced template features:

```razor
@inject NavigationManager NavigationManager
@inject ContentService Content

<PageTitle>BlakeDocs - @Title</PageTitle>

<!-- Breadcrumb navigation -->
<nav aria-label="breadcrumb" class="mb-4">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        @foreach (var segment in _slugSegments)
        {
            <!-- Breadcrumb logic here -->
        }
    </ol>
</nav>

<!-- Page header -->
<div class="mb-5">
    <h1 class="display-5 fw-bold mb-3">@Title</h1>
    <p class="lead text-muted">@Description</p>
</div>

@Body

@code {
    private List<string> _slugSegments = [];
    
    protected override void OnInitialized()
    {
        // Template initialization logic
        activeSlug = NavigationManager.ToBaseRelativePath(NavigationManager.Uri);
        _slugSegments = activeSlug.Split('/').ToList();
    }
}
```

## Frontmatter Injection

Blake automatically makes frontmatter values available in your templates as properties. Any standard `PageModel` properties are bound directly, while custom fields go into the `Metadata` dictionary.

### Standard Properties

These frontmatter fields are directly available in templates:

```yaml
---
title: 'My Page Title'
description: 'A brief description of the page'
date: 2025-01-15
image: images/hero.png
tags: ['blake', 'documentation']
---
```

Access them in templates like this:

```razor
<h1>@Title</h1>
<p>@Description</p>
<time datetime="@Date.ToString("yyyy-MM-dd")">@Date.ToString("MMMM d, yyyy")</time>
```

### Custom Metadata

Any additional frontmatter fields are accessible through the generated content index:

```yaml
---
title: 'My Page'
author: 'John Doe'
category: 'Tutorial'
---
```

Access custom fields in templates:

```razor
@inject ContentService Content

@{
    var currentPage = Content.GetPageBySlug(activeSlug);
    var author = currentPage?.Metadata.ContainsKey("author") == true 
        ? currentPage.Metadata["author"] 
        : "Unknown";
}

<p>By: @author</p>
```

## Layout Composition and Reusability

Templates can leverage standard Blazor patterns for layout composition:

### Using Layout Components

```razor
@layout MyCustomLayout

<div class="page-content">
    <h1>@Title</h1>
    @Body
</div>
```

### Component Reusability

Templates can include reusable components:

```razor
@inject ContentService Content

<PageHeader Title="@Title" Description="@Description" />

<div class="content-wrapper">
    @Body
</div>

<RelatedPages CurrentSlug="@activeSlug" />

@code {
    private string activeSlug = string.Empty;
    
    protected override void OnInitialized()
    {
        activeSlug = /* derive from navigation */;
    }
}
```

## Using Razor for Logic

Templates support full Razor syntax, enabling dynamic behavior:

### Conditional Rendering

```razor
@if (!string.IsNullOrEmpty(Description))
{
    <p class="lead">@Description</p>
}

@if (Tags?.Any() == true)
{
    <div class="tags">
        @foreach (var tag in Tags)
        {
            <span class="badge bg-secondary me-1">#@tag</span>
        }
    </div>
}
```

### Data Access

Templates can access the full content index for navigation and related content:

```razor
@inject ContentService Content

@{
    var allPages = Content.GetSiteToc();
    var currentCategory = allPages
        .SelectMany(n => n.Children ?? new())
        .FirstOrDefault(p => p.Slug == activeSlug);
}
```

:::warning
**Performance Consideration**
While templates support complex logic, remember that Blake generates static content. Heavy computations should be done during the baking process, not in the template rendering.
:::

## Best Practices

### Template Organization

1. **Use cascading templates** for consistent site-wide layouts
2. **Create specific templates** for unique content types (blog posts, documentation, etc.)
3. **Keep templates focused** - complex logic belongs in components or services

### Content Author Considerations

For content authors who don't need to modify templates:
- Templates handle the presentation automatically
- Focus on writing good Markdown and complete frontmatter
- The template system works transparently with your content

### Template Author Considerations

For developers creating or maintaining templates:
- Leverage Blazor's full component model
- Use dependency injection for services and data access
- Consider performance implications of template complexity
- Test templates with various content types and frontmatter combinations

## Next Steps

- Learn about [Authoring Content](/pages/2%20using%20blake/authoring-content) to understand the content creation workflow
- Explore [Using Components](/pages/2%20using%20blake/components) for advanced template functionality  
- Check the [Build Pipeline](/pages/5%20contributing/build-pipeline) documentation for technical details about the baking process
- Review [Site Templates](/pages/2%20using%20blake/site-templates) for complete site starter templates
