---
title: Plugin Hooks
description: Comprehensive reference for Blake's plugin lifecycle hooks, execution order, and API interactions.
category: "Contributing"
iconIdentifier: "bi bi-diagram-3-nav-menu"
pageOrder: 4
---

:::summary
Blake's plugin system provides two main lifecycle hooks - BeforeBakeAsync and AfterBakeAsync - that allow plugins to modify content processing, add metadata, and extend functionality. This reference documents all available hooks, their execution context, and interaction patterns.
:::

## Plugin Lifecycle Overview

Blake plugins participate in the static site generation process through well-defined lifecycle hooks that provide access to content and build context at different stages.

### Execution Flow

```
1. Blake CLI starts
2. Load configuration and plugins
3. Discover content files
4. Call BeforeBakeAsync on all plugins
5. Process Markdown to HTML
6. Generate Blazor components
7. Call AfterBakeAsync on all plugins
8. Write generated files to disk
```

### Hook Execution Order

**Important considerations:**
- **Plugins execute in undefined order** - Don't depend on other plugins running first
- **No control over execution sequence** - Design plugins to be independent
- **All BeforeBake hooks complete before AfterBake hooks start**
- **Plugins are loaded and executed on every bake**

## BeforeBakeAsync Hook

### Purpose and Timing

The `BeforeBakeAsync` hook is called before any content processing begins. This is the ideal place for:

- **Setup tasks** - Initialize plugin state, validate configuration
- **Content preprocessing** - Modify raw Markdown content
- **Metadata enhancement** - Add computed metadata to pages
- **Pipeline configuration** - Extend the Markdig pipeline
- **External data fetching** - Load data needed during content generation

### Method Signature

```csharp
Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
```

### BlakeContext Lifecycle

**The BlakeContext is instantiated at the start of the bake process and persists through the entire pipeline:**

1. **Context Creation** - A single BlakeContext represents the entire bake from start to finish
2. **Plugin BeforeBake** - Blake calls BeforeBakeAsync sequentially on every plugin
3. **Content Processing** - Blake creates the Markdig pipeline by calling .Build() on the PipelineBuilder in the context
4. **Plugin AfterBake** - Blake calls AfterBakeAsync sequentially on every plugin

**Note:** There's no built-in mechanism for plugins to persist state in the context (other than through the content itself). The context provides access to the project and content, but plugins should remain stateless.

### Available Context

The `BlakeContext` provides access to:

```csharp
public class BlakeContext
{
    public string? ProjectName { get; set; }
    public required string ProjectPath { get; init; }
    public required IReadOnlyList<string> Arguments { get; init; }

    // Pre-processed content (available in BeforeBake)
    public List<MarkdownPage> MarkdownPages { get; init; } = [];

    // Generated content (available in AfterBake)
    public List<GeneratedPage> GeneratedPages { get; init; } = [];

    // Markdig pipeline builder for adding extensions
    public required MarkdownPipelineBuilder PipelineBuilder { get; init; }
}
```

### Common BeforeBake Patterns

#### Adding Metadata to Pages

**BeforeBake can modify YAML frontmatter which then gets added to the metadata dictionary on processed pages:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.MarkdownPages)
    {
        // Calculate reading time from markdown content
        var wordCount = CountWords(page.RawMarkdown);
        var readingTime = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));

        // Modify the frontmatter - this will appear in GeneratedPages metadata
        var updatedMarkdown = AddToFrontmatter(page.RawMarkdown, "readTimeMinutes", readingTime.ToString());

        // Update the page (this is a simplified example - actual implementation varies)
        // The reading time will be available in metadata after baking
    }
        var excerpt = ExtractFirstParagraph(page.Content);
        if (!string.IsNullOrEmpty(excerpt))
        {
            page.Metadata["excerpt"] = excerpt;
        }

        // Add file metadata
        var fileInfo = new FileInfo(page.SourcePath);
        page.Metadata["lastModified"] = fileInfo.LastWriteTime.ToString("yyyy-MM-dd");
        page.Metadata["fileSize"] = fileInfo.Length.ToString();
    }
}
```

#### Extending the Markdig Pipeline

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Add custom Markdig extensions
    context.MarkdigPipelineBuilder.Extensions.Add(new CalloutExtension());
    context.MarkdigPipelineBuilder.Extensions.Add(new CustomLinkExtension());

    // Configure existing extensions
    context.MarkdigPipelineBuilder.UseAdvancedExtensions();
    context.MarkdigPipelineBuilder.UsePipeTables();
}
```

#### Custom Configuration Loading

**Blake doesn't provide built-in configuration. If plugins need configuration, they must implement their own loading mechanism:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Plugin authors need to implement their own configuration
    var configPath = Path.Combine(context.ProjectPath, "plugin-config.json");
    var pluginConfig = LoadPluginConfig(configPath);

    if (!pluginConfig.IsEnabled)
    {
        logger?.LogInformation("Plugin disabled via configuration");
        return;
    }

    var apiEndpoint = pluginConfig.GetValue<string>("apiEndpoint");
    if (!string.IsNullOrEmpty(apiEndpoint))
    {
        await FetchExternalDataAsync(context.Pages, apiEndpoint);
    }
}
```

#### Content Preprocessing

**BeforeBake is ideal for pre-processing, Markdig extension processing, and content transformation. Use MarkdownPages for raw content manipulation:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.MarkdownPages)
    {
        // Replace custom syntax with standard Markdown
        var processedContent = page.RawMarkdown.Replace("{{TOC}}", GenerateTableOfContents(page));

        // Process include directives
        page.Content = await ProcessIncludesAsync(page.Content, page.SourcePath);

        // Add custom frontmatter processing
        var customMeta = ParseCustomFrontmatter(page.Content);
        foreach (var kvp in customMeta)
        {
            page.Metadata[kvp.Key] = kvp.Value;
        }
    }
}
```

## AfterBakeAsync Hook

### Purpose and Timing

The `AfterBakeAsync` hook is called after all Markdown processing and Blazor component generation is complete. This is used for:

- **Generated content modification** - Update processed HTML and metadata
- **Output file creation** - Generate additional files such as RSS feeds, sitemaps, or other related assets
- **Asset processing** - Handle images, generate thumbnails, or optimize assets (CSS/JavaScript should be included in RCL, not managed by plugins)
- **Cleanup tasks** - Remove temporary data or files
- **Final validations** - Check generated content quality

### Method Signature

```csharp
Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
```

### Available Context

In addition to BeforeBake context, AfterBake provides access to GeneratedPages:

**Note:** Blake uses immutable record types for content. Generated content needs to be replaced, not modified in-place. The collection properties use `get` and `init`, so you can't replace the entire collection - this helps keep plugins focused on enhancing the Blake pipeline rather than replacing it.

```csharp
public class BlakeContext
{
    public string? ProjectName { get; set; }
    public required string ProjectPath { get; init; }
    public required IReadOnlyList<string> Arguments { get; init; }

    // Available in BeforeBake
    public List<MarkdownPage> MarkdownPages { get; init; } = [];

    // Available in AfterBake (populated after processing)
    public List<GeneratedPage> GeneratedPages { get; init; } = [];

    // Markdig pipeline builder for extensions
    public required MarkdownPipelineBuilder PipelineBuilder { get; init; }
}
```

### Working with Generated Content

#### Modifying Generated Pages

```csharp
public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.GeneratedContent.ToList())
    {
        // Create updated page with additional metadata
        var updatedPage = page with
        {
            Metadata = page.Metadata.Union(new[]
            {
                KeyValuePair.Create("processedAt", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")),
                KeyValuePair.Create("wordCount", CountWords(page.Content).ToString()),
                KeyValuePair.Create("hasCodeBlocks", page.Content.Contains("<code>").ToString())
            }).ToDictionary(x => x.Key, x => x.Value)
        };

        // Replace in the collection
        context.ReplaceGeneratedContent(page, updatedPage);
    }
}
```

#### Creating Additional Output Files

```csharp
public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Generate sitemap
    var sitemapContent = GenerateSitemap(context.GeneratedContent);
    var sitemapPath = Path.Combine(context.OutputDirectory, "sitemap.xml");
    await File.WriteAllTextAsync(sitemapPath, sitemapContent);

    // Generate RSS feed
    var feedContent = GenerateRssFeed(context.GeneratedContent);
    var feedPath = Path.Combine(context.OutputDirectory, "feed.xml");
    await File.WriteAllTextAsync(feedPath, feedContent);

    // Generate search index
    var searchIndex = GenerateSearchIndex(context.GeneratedContent);
    var searchPath = Path.Combine(context.OutputDirectory, "search.json");
    await File.WriteAllTextAsync(searchPath, JsonSerializer.Serialize(searchIndex));
}
```

## Advanced Plugin Patterns

### Data Persistence Between Hooks

Since Blake doesn't provide native persistence between BeforeBake and AfterBake, plugins use creative approaches:

#### HTML Comment Embedding

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.Pages)
    {
        // Analyze content and collect data
        var sections = AnalyzeSections(page.Content);

        // Embed data as HTML comment
        var data = JsonSerializer.Serialize(sections);
        page.Content += $"\n<!-- BLAKE_PLUGIN_DATA:{Name}:{data} -->";
    }
}

public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.GeneratedContent.ToList())
    {
        // Extract embedded data
        var pattern = $@@"<!-- BLAKE_PLUGIN_DATA:{Name}:(.*?) -->";
        var match = Regex.Match(page.Content, pattern);

        if (match.Success)
        {
            var data = JsonSerializer.Deserialize<SectionData>(match.Groups[1].Value);

            // Process the data and update content
            var processedContent = ProcessWithSectionData(page.Content, data);

            // Remove the embedded data comment
            processedContent = Regex.Replace(processedContent, pattern, "");

            var updatedPage = page with { Content = processedContent };
            context.ReplaceGeneratedContent(page, updatedPage);
        }
    }
}
```

### Error Handling in Hooks

#### Graceful Degradation

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    try
    {
        await ProcessContentAsync(context);
    }
    catch (HttpRequestException ex)
    {
        logger?.LogWarning("External API unavailable: {Message}. Using cached data.", ex.Message);
        UseCachedData(context);
    }
    catch (Exception ex)
    {
        logger?.LogError(ex, "Plugin processing failed but build will continue");
        // Don't throw - let build continue
    }
}
```

#### Conditional Processing

```csharp
public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    var processedCount = 0;
    var errorCount = 0;

    foreach (var page in context.GeneratedContent.ToList())
    {
        try
        {
            var updatedPage = ProcessPage(page);
            context.ReplaceGeneratedContent(page, updatedPage);
            processedCount++;
        }
        catch (Exception ex)
        {
            logger?.LogWarning("Failed to process page {PagePath}: {Message}",
                page.SourcePath, ex.Message);
            errorCount++;
        }
    }

    logger?.LogInformation("Plugin processed {ProcessedCount} pages with {ErrorCount} errors",
        processedCount, errorCount);
}
```

### Performance Considerations

#### Batching Operations

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Group pages for batch processing
    var pagesToProcess = context.Pages
        .Where(p => p.Metadata.ContainsKey("needsApiData"))
        .ToList();

    if (pagesToProcess.Any())
    {
        // Single API call for all pages
        var batchResults = await FetchBatchDataAsync(
            pagesToProcess.Select(p => p.Slug));

        // Apply results to individual pages
        foreach (var page in pagesToProcess)
        {
            if (batchResults.TryGetValue(page.Slug, out var data))
            {
                page.Metadata["apiData"] = data;
            }
        }
    }
}
```

#### Simple Plugin Pattern

**Keep plugins minimal and stateless. Plugins are called sequentially and shouldn't rely on instance state between hooks:**

```csharp
public class SimplePlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Process markdown pages
        foreach (var page in context.MarkdownPages)
        {
            // Simple transformation work
            logger?.LogInformation($"Processing {page.MdPath}");
        }
    }

    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Work with generated pages
        foreach (var page in context.GeneratedPages)
        {
            // Simple post-processing
            logger?.LogInformation($"Generated {page.OutputPath}");
        }
    }
}
```

## Hook Context Reference

### PageModel Properties (BeforeBake)

```csharp
public class PageModel
{
    public string Title { get; set; }
    public string SourcePath { get; set; }
    public string Content { get; set; }
    public Dictionary<string, string> Metadata { get; init; }
    public List<string> Tags { get; init; }
    public DateTime? Date { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public bool IsDraft { get; set; }

    // Computed properties
    public string Slug { get; }
    public string DirectoryPath { get; }
}
```

### GeneratedPage Properties (AfterBake)

```csharp
public record GeneratedPage(
    string Title,
    string SourcePath,
    string OutputPath,
    string Content)
{
    public Dictionary<string, string> Metadata { get; init; } = new();
    public List<string> Tags { get; init; } = new();
    public DateTime? Date { get; init; }
    public string? Description { get; init; }
    public string? Category { get; init; }
    public string Slug { get; init; } = string.Empty;
}
```

### BlakeContext Full API
[NOTE: As mentioned above check this against the code in the repo]

```csharp
public class BlakeContext
{
    // Content collections
    public IReadOnlyList<PageModel> Pages { get; }
    public IList<GeneratedPage> GeneratedContent { get; }

    // Build configuration
    public IConfiguration Configuration { get; }
    public string OutputDirectory { get; }
    public IReadOnlyList<string> ContentDirectories { get; }

    // Pipeline configuration
    public MarkdownPipelineBuilder MarkdigPipelineBuilder { get; }

    // Content manipulation
    public void ReplaceGeneratedContent(GeneratedPage original, GeneratedPage updated);
    public void AddGeneratedContent(GeneratedPage page);
    public bool RemoveGeneratedContent(GeneratedPage page);

    // Build information
    public BuildStatistics Statistics { get; }
    public DateTime BuildStartTime { get; }
    public CancellationToken CancellationToken { get; }
}
```

## Best Practices

### Hook Design Principles

- **Keep hooks focused** - Each hook should have a single responsibility
- **Fail gracefully** - Don't break builds for non-critical features
- **Log appropriately** - Help users understand what's happening
- **Be stateless** - Don't rely on execution order or external state
- **Handle errors** - Catch and log exceptions, continue processing

### Performance Guidelines

- **Minimize file I/O** in hooks when possible
- **Use async patterns** consistently
- **Cache expensive operations** between pages (within a single hook execution, not between BeforeBake/AfterBake)
- **Limit external API calls** - Should represent clearly defined, documented edge cases, not general patterns
- **Consider memory usage** with large sites

### Compatibility Considerations

- **Don't assume hook execution order** between plugins
- **Handle missing metadata gracefully**
- **Support partial plugin functionality** when dependencies unavailable
- **Version your plugin data formats** for future compatibility

## Next Steps

Ready to implement plugin hooks? Here's what to do next:

1. **Review the [Writing Plugins](/pages/5%20contributing/writing-plugins)** guide for complete implementation details
2. **Study existing plugins** to see hooks in action
3. **Start with simple BeforeBake hooks** before attempting complex AfterBake patterns
4. **Test thoroughly** with different content types and scenarios
5. **Consider edge cases** and error conditions

:::note
**Plugin Hook Questions?**

If you have questions about plugin hooks or need clarification:
- Check existing plugin implementations for examples
- Review the Blake.BuildTools source code for context details
- Ask in GitHub discussions for architectural guidance
- Test your assumptions with minimal plugin implementations

The plugin hook system is designed to be powerful yet simple - start small and build up complexity as needed!
:::
