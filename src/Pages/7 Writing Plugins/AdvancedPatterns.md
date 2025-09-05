---
title: 'Advanced Patterns'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Advanced Blake plugin development patterns including Markdig extensions, content processing, and Razor Class Libraries."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 4
category: "Writing Plugins"
---

:::summary
Advanced Blake plugin patterns include extending Markdig for content transformation, enhancing metadata dynamically, working with generated content, persisting data between plugin hooks, and distributing assets via Razor Class Libraries.
:::

## Advanced Plugin Patterns

### Content Processing Through Markdig Extensions

Rather than providing direct content transformation methods, Blake plugins work by extending the Markdig pipeline:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Add custom Markdig extension to the pipeline
    context.MarkdigPipelineBuilder.Extensions.Add(new MyCustomExtension());
}
```

Example custom extension for processing special syntax:

```csharp
public class CalloutExtension : IMarkdownExtension
{
    public void Setup(MarkdownPipelineBuilder pipeline)
    {
        // Add custom renderer for callout blocks
        pipeline.BlockParsers.AddIfNotAlready<CalloutBlockParser>();
    }

    public void Setup(MarkdownPipeline pipeline, IMarkdownRenderer renderer)
    {
        if (renderer is HtmlRenderer htmlRenderer)
        {
            htmlRenderer.ObjectRenderers.AddIfNotAlready<CalloutRenderer>();
        }
    }
}
```

### Metadata Enhancement

Plugins can add metadata during the BeforeBake phase by modifying frontmatter, which then becomes available in GeneratedPages metadata:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.MarkdownPages)
    {
        // Calculate word count from raw markdown
        var wordCount = page.RawMarkdown.Split(new[] { ' ', '\n', '\r' },
            StringSplitOptions.RemoveEmptyEntries).Length;

        // Estimate reading time (200 words per minute)
        var readingTime = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));

        // Modify frontmatter to add metadata
        // (This is a simplified example - actual implementation would parse and update YAML)
        var updatedMarkdown = AddToFrontmatter(page.RawMarkdown,
            "readTimeMinutes", readingTime.ToString());

        // Extract first paragraph as excerpt
        var firstParagraph = page.Content.Split('\n')
            .FirstOrDefault(line => !string.IsNullOrWhiteSpace(line) && !line.StartsWith('#'));
        if (!string.IsNullOrEmpty(firstParagraph))
        {
            page.Metadata["excerpt"] = firstParagraph.Trim();
        }
    }
}
```

### Working with Generated Content

The AfterBakeAsync method provides access to the fully generated content:

```csharp
public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Access generated content - find by slug and replace
    for (int i = 0; i < context.GeneratedPages.Count; i++)
    {
        var page = context.GeneratedPages[i];

        // Create updated page (GeneratedPage is a record type)
        var updatedPage = page with {
            Page = page.Page with {
                Metadata = page.Page.Metadata.Union(new[] {
                    KeyValuePair.Create("processed", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")),
                    KeyValuePair.Create("hasCodeBlocks", page.RazorHtml.Contains("<code>").ToString())
                }).ToDictionary(x => x.Key, x => x.Value)
            }
        };

        // Replace the item in the collection by index
        context.GeneratedPages[i] = updatedPage;
    }
}
```

### Advanced Pattern: Data Persistence Between Hooks

For plugins that need to share data between before and after bake phases, embed structured data as comments:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.Pages)
    {
        // Analyze content and collect data
        var sections = ExtractSections(page.Content);

        // Serialize and embed as comment
        var sectionData = JsonSerializer.Serialize(sections);
        page.Content += $"\n<!-- BLAKE_PLUGIN_DATA:MyPlugin:{sectionData} -->";
    }
}

public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.GeneratedContent)
    {
        // Extract embedded data
        var match = Regex.Match(page.Content,
            @"<!-- BLAKE_PLUGIN_DATA:MyPlugin:(.*?) -->");
        if (match.Success)
        {
            var data = JsonSerializer.Deserialize<SectionData>(match.Groups[1].Value);

            // Process the data and update the page
            var processedContent = ProcessWithSectionData(page.Content, data);
            var updatedPage = page with { Content = processedContent };

            context.ReplaceGeneratedContent(page, updatedPage);
        }
    }
}
```

### Extending Blake with Razor Class Libraries (RCL)

**For plugins that provide CSS, JavaScript, or Blazor components, create a Razor Class Library and optionally include an `IBlakePlugin` implementation:**

**1. Create an RCL project:**

```xml
<Project Sdk="Microsoft.NET.Sdk.Razor">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <AddRazorSupportForMvc>true</AddRazorSupportForMvc>
  </PropertyGroup>

  <ItemGroup>
    <SupportedPlatform Include="browser" />
    <PackageReference Include="Blake.BuildTools" Version="1.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.Components.Web" Version="9.0.0" />
  </ItemGroup>
</Project>
```

**2. Include assets and components:**

```razor
@* Components/MyPluginComponent.razor *@
<div class="my-plugin-component">
  @ChildContent
</div>

<link href="_content/BlakePlugin.MyPlugin/css/plugin.css" rel="stylesheet" />

@code {
    [Parameter] public RenderFragment? ChildContent { get; set; }
}
```

**3. Optionally add plugin logic:**

```csharp
public class MyPlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Plugin processing logic
        logger?.LogInformation("MyPlugin: Processing content");
    }

    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Post-processing logic
        logger?.LogInformation("MyPlugin: Post-processing complete");
    }
}
```

**Note:** Be aware of Blazor CSS isolation when designing your components.

## Next Steps

- **[Configuration](/pages/7%20writing%20plugins/configuration)** - Add configuration options to your plugins
- **[Best Practices](/pages/7%20writing%20plugins/best-practices)** - Follow recommended development patterns
- **[Testing](/pages/7%20writing%20plugins/testing)** - Ensure your advanced patterns work correctly