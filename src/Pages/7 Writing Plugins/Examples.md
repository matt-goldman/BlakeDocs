---
title: 'Examples and Templates'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Blake plugin examples, templates, and real-world implementations for learning and reference."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 9
category: "Writing Plugins"
---

:::summary
Learn Blake plugin development through templates, real-world examples like BlakePlugin.ReadTime and BlakePlugin.DocsRenderer, and community plugins that demonstrate various patterns and techniques.
:::

## Plugin Examples and Templates

### Plugin Templates

Use the Blake plugin template to get started quickly:

```bash
# Install the Blake plugin template
dotnet new install Blake.Templates

# Create a new plugin
dotnet new blakeplugin -n MyAwesomePlugin

# Follow the generated README for next steps
```

The template provides:
- Basic project structure
- Sample IBlakePlugin implementation
- Unit test project
- README with documentation guidelines
- GitHub Actions workflow for CI/CD

### Real-World Plugin Examples

#### BlakePlugin.ReadTime

**Purpose:** Simple metadata enhancement
**Pattern:** BeforeBakeAsync usage
**Complexity:** Beginner

```csharp
public class ReadTimePlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        foreach (var page in context.Pages)
        {
            var wordCount = CountWords(page.Content);
            var readingTime = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));
            
            page.Metadata["readTimeMinutes"] = readingTime.ToString();
            logger?.LogDebug($"Added reading time {readingTime}min to {page.Slug}");
        }
    }

    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // No after-bake processing needed
    }

    private static int CountWords(string content)
    {
        return content
            .Split(new[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries)
            .Length;
    }
}
```

**Key Features:**
- Zero configuration required
- Simple metadata calculation
- Good example of BeforeBakeAsync usage
- Minimal dependencies

#### BlakePlugin.DocsRenderer

**Purpose:** Complex content transformation
**Pattern:** RCL distribution with assets, BeforeBake and AfterBake coordination
**Complexity:** Advanced

**Features:**
- Markdig extensions for enhanced rendering
- RCL distribution with assets
- BeforeBake and AfterBake coordination
- Good example of advanced plugin patterns

**Structure:**
```
BlakePlugin.DocsRenderer/
├── Components/
│   ├── SiteToc.razor
│   ├── PageNavigation.razor
│   └── SearchBox.razor
├── Extensions/
│   ├── DocsMarkdigExtension.cs
│   └── CalloutExtension.cs
├── Styles/
│   └── docs-theme.css
└── DocsRendererPlugin.cs
```

**Usage in templates:**
```razor
@* Available after installing BlakePlugin.DocsRenderer *@
<SiteToc />

<div class="content">
    <h1>@Title</h1>
    @Body
</div>

<PageNavigation CurrentSlug="@GetCurrentSlug()" />
```

### Community Plugin Examples

#### Metadata Enhancement Plugins

**SEO Optimizer Plugin:**
```csharp
public class SeoOptimizerPlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        foreach (var page in context.Pages)
        {
            // Calculate SEO metrics
            page.Metadata["headingCount"] = CountHeadings(page.Content);
            page.Metadata["imageCount"] = CountImages(page.Content);
            page.Metadata["linkCount"] = CountLinks(page.Content);
            
            // Generate meta description if missing
            if (!page.Metadata.ContainsKey("description"))
            {
                page.Metadata["description"] = GenerateDescription(page.Content);
            }
        }
    }
}
```

**Tag Cloud Plugin:**
```csharp
public class TagCloudPlugin : IBlakePlugin
{
    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Collect all tags from all pages
        var allTags = context.GeneratedPages
            .SelectMany(p => p.Page.Metadata.GetValueOrDefault("tags", "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries))
            .GroupBy(tag => tag.Trim())
            .ToDictionary(g => g.Key, g => g.Count());

        // Generate tag cloud data file
        var tagCloudPath = Path.Combine(context.OutputPath, "tag-cloud.json");
        await File.WriteAllTextAsync(tagCloudPath, JsonSerializer.Serialize(allTags));
        
        logger?.LogInformation($"Generated tag cloud with {allTags.Count} unique tags");
    }
}
```

#### Content Processing Plugins

**Code Highlighter Plugin:**
```csharp
public class CodeHighlighterPlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Add syntax highlighting extension to Markdig
        context.MarkdigPipelineBuilder.Extensions.Add(new SyntaxHighlightingExtension());
    }
}

public class SyntaxHighlightingExtension : IMarkdownExtension
{
    public void Setup(MarkdownPipelineBuilder pipeline)
    {
        // Configure syntax highlighting
        pipeline.Extensions.Add(new Markdig.Extensions.SyntaxHighlighting.SyntaxHighlightingExtension());
    }
}
```

**Table of Contents Plugin:**
```csharp
public class TocPlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        foreach (var page in context.Pages)
        {
            var toc = GenerateTableOfContents(page.Content);
            page.Metadata["tableOfContents"] = JsonSerializer.Serialize(toc);
        }
    }

    private List<TocItem> GenerateTableOfContents(string content)
    {
        var toc = new List<TocItem>();
        var lines = content.Split('\n');
        
        foreach (var line in lines)
        {
            if (line.StartsWith('#'))
            {
                var level = line.TakeWhile(c => c == '#').Count();
                var title = line.Substring(level).Trim();
                var anchor = GenerateAnchor(title);
                
                toc.Add(new TocItem { Level = level, Title = title, Anchor = anchor });
            }
        }
        
        return toc;
    }
}
```

### Learning Path Examples

#### Beginner: Simple Metadata Plugin

Start with a plugin that adds simple metadata:

```csharp
public class WordCountPlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        foreach (var page in context.Pages)
        {
            var wordCount = page.Content
                .Split(new[] { ' ', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                .Length;
                
            page.Metadata["wordCount"] = wordCount.ToString();
        }
    }

    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // No post-processing needed
    }
}
```

#### Intermediate: Configuration-Based Plugin

Add configuration support:

```csharp
public class ConfigurablePlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        var config = LoadConfiguration(context.ProjectPath);
        
        if (!config.Enabled)
        {
            logger?.LogInformation("Plugin disabled via configuration");
            return;
        }

        foreach (var page in context.Pages)
        {
            if (config.ProcessAllPages || page.Metadata.ContainsKey("process"))
            {
                await ProcessPage(page, config);
            }
        }
    }
}
```

#### Advanced: RCL Plugin with Components

Create a plugin that provides Blazor components:

```csharp
// Plugin class
public class ComponentProviderPlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Add metadata that components can use
        foreach (var page in context.Pages)
        {
            page.Metadata["pluginComponentsAvailable"] = "true";
        }
    }
}
```

```razor
@* Components/CustomComponent.razor *@
<div class="custom-plugin-component">
    <h3>@Title</h3>
    <div class="content">
        @ChildContent
    </div>
</div>

@code {
    [Parameter] public string Title { get; set; } = "";
    [Parameter] public RenderFragment? ChildContent { get; set; }
}
```

### Plugin Development Patterns

**Error Handling Pattern:**
```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.Pages)
    {
        try
        {
            await ProcessPage(page);
        }
        catch (Exception ex)
        {
            logger?.LogWarning($"Failed to process {page.Slug}: {ex.Message}");
            // Continue processing other pages
        }
    }
}
```

**Batch Processing Pattern:**
```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Group pages by type for efficient batch processing
    var pageGroups = context.Pages.GroupBy(p => p.Metadata.GetValueOrDefault("type", "default"));
    
    foreach (var group in pageGroups)
    {
        await ProcessPageGroup(group.ToList(), group.Key);
    }
}
```

## Next Steps

Ready to create your first Blake plugin? Start with:

1. **Install the plugin template** and create a basic plugin
2. **Study existing plugins** like BlakePlugin.ReadTime for inspiration
3. **Join the community** to discuss plugin ideas and get help
4. **Review [Getting Started](/pages/7%20writing%20plugins/getting-started)** for step-by-step guidance
5. **Follow [Best Practices](/pages/7%20writing%20plugins/best-practices)** for quality development

:::note
**Plugin Development Resources**

- **Blake.Types documentation** - API reference for the plugin interface
- **Example plugins** - Open source plugins for reference and learning
- **Community forum** - Discuss plugin ideas and get development help
- **Plugin template** - Scaffolding for creating new Blake plugins quickly
:::