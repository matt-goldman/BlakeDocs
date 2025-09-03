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

:::summary
Page templates define how your Markdown content is rendered as Blazor components. Use `template.razor` files for folder-specific templates or `cascading-template.razor` for templates that apply to multiple levels of your site.
:::

## Understanding Page Templates

Page templates are the bridge between your Markdown content and your site's presentation. When you run `blake bake`, Blake transforms your Markdown files into Razor using these templates as the rendering blueprint.

Blake supports two types of templates:

- **`template.razor`** - Applied to Markdown files in the same folder
- **`cascading-template.razor`** - Applied to Markdown files in the current folder and all subfolders, recursively, unless overridden by another template

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

```tree
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

Cascading templates provide a way to apply consistent layouts across multiple levels of your site without duplicating template code.

### How Cascading Works

When Blake processes a Markdown file, it looks for templates in this order:

1. `template.razor` in the same folder as the Markdown file
2. `cascading-template.razor` in the same folder
3. `cascading-template.razor` in parent folders (walking up the hierarchy)

### Cascading Template Example

The `cascading-template.razor` file in this documentation site allows a single template to be used across multiple directory trees.

```tree
Pages/
├── 1 Introduction /
│   ├── CLI.md
│   ├── Quickstart.md
│   └── Welcome.md
├── 2 Using Blake /
│   ├── AuthoringContent.md
│   ├── Components.md
│   └── PageTemplates.md
└── cascading-template.razor    # Applied to all .md files in Pages/ and subfolders
```

The template defined in `cascading-template.razor` is used for all Markdown files under the `Pages/` path, without needing to repeat it for each subfolder.

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

You can access them by retrieving them from the `GeneratedContentIndex`:

```razor
@using Blake.Generated

<p>By: @author</p>

@code {

    private string author = string.Empty;

    protected override void OnInitialized()
    {
        var allPages = GeneratedContentIndex.GetPages();
        var currentPage = allPages.FirstOrDefault(p => p.Slug == activeSlug);
        var author = currentPage?.Metadata.ContainsKey("author") == true 
            ? currentPage.Metadata["author"] 
            : "Unknown";
        
        base.OnInitialized();
    }
}
```

You can also use the page's ID property, but you have to bind this in the code section rather than in the content (otherwise it shows up in the page):

:::note
The ID is a string that has a default value of a new GUID, so this will be regenerated every time you bake the page. You can however pass your own ID in the frontmatter, and it can be any string, not necessarily a GUID, if you want your pages to be generated with a persistent ID value.
:::

```razor
@using Blake.Generated

<p>By: @author</p>

@code {

    private string author = string.Empty;
    private string pageId = @Id;

    protected override void OnInitialized()
    {
        var allPages = GeneratedContentIndex.GetPages();
        var currentPage = allPages.FirstOrDefault(p => p.Id == pageId);
        var author = currentPage?.Metadata.ContainsKey("author") == true 
            ? currentPage.Metadata["author"] 
            : "Unknown";
        
        base.OnInitialized();
    }
}
```

:::note
**Template-Specific Services**
This documentation site includes a `ContentService` that wraps `GeneratedContentIndex` with helper methods like `GetSiteToc()` and `GetCategoryPages()`. This service is specific to this template - Blake's core only provides the `GeneratedContentIndex.GetPages()` method shown above.
:::

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

:::tip
Consider performance when designing logic in your templates. While templates support complex logic, remember that Blake generates static content. Heavy computations should be done during the baking process, not in the template rendering. This is usually not an issue but is something to be mindful of.
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
- Remember: you're building a Blazor app that allows consumers to dynamically add content - take full advantage of Blazor's capabilities, patterns, and ecosystem

## Next Steps

- Learn about [Authoring Content](/pages/2%20using%20blake/authoring-content) to understand the content creation workflow
- Explore [Using Components](/pages/2%20using%20blake/components) for advanced template functionality  
- Check the [Build Pipeline](/pages/5%20contributing/build-pipeline) documentation for technical details about the baking process
- Review [Site Templates](/pages/2%20using%20blake/site-templates) for complete site starter templates
