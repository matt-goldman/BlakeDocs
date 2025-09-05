---
title: 'Best Practices'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Blake plugin development best practices covering performance, error handling, and philosophy alignment."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 7
category: "Writing Plugins"
---

:::summary
Follow Blake plugin best practices for performance optimization, graceful error handling, recommended patterns, and alignment with Blake's philosophy of simplicity and transparency.
:::

## Plugin Best Practices

### Performance Considerations

- **Cache expensive operations** - Store results to avoid repeated file I/O or computation
- **Process in batches** - Handle multiple pages together when possible
- **Use async patterns** - Blake's plugin interface is fully asynchronous
- **Minimize memory usage** - Process large content collections efficiently

```csharp
// Good: Cache expensive file operations
private readonly Dictionary<string, string> _fileCache = new();

public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    var pagesToProcess = context.MarkdownPages.Where(p => 
        p.RawMarkdown.Contains("<!-- include-file:")).ToList();

    foreach (var page in pagesToProcess)
    {
        // Process file inclusions in batches to avoid repeated disk I/O
        var fileIncludes = ExtractFileIncludes(page.RawMarkdown);
        
        foreach (var includeFile in fileIncludes)
        {
            if (!_fileCache.TryGetValue(includeFile, out var content))
            {
                content = await File.ReadAllTextAsync(includeFile);
                _fileCache[includeFile] = content;
            }
            
            // Replace include marker with actual content
            var updatedMarkdown = page.RawMarkdown.Replace(
                $"<!-- include-file:{includeFile} -->", content);
            
            context.MarkdownPages[context.MarkdownPages.IndexOf(page)] = 
                page with { RawMarkdown = updatedMarkdown };
        }
    }
}
```

### Error Handling

- **Use logging over exceptions** - Blake catches all plugin exceptions, so prefer logging errors
- **Provide clear messages** - Help users understand what went wrong and how to fix it
- **Use the provided logger** - Prefer ILogger over Console output for structured logging
- **Handle gracefully** - Plugin failures shouldn't break the entire build process

:::note
Blake runs all plugins in a try/catch block, so any exceptions you throw will be caught by Blake rather than stopping the build. For this reason, it's better to log errors and continue processing rather than throwing exceptions, which should be reserved for truly exceptional circumstances.
:::

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.MarkdownPages)
    {
        try
        {
            var result = await ProcessContentSafely(page);
            if (result == null)
            {
                logger?.LogWarning($"Failed to process page {page.Slug}. Skipping enhancement.");
                continue;
            }
            
            // Apply successful processing
        }
        catch (FileNotFoundException ex)
        {
            logger?.LogError($"Required file not found for page {page.Slug}: {ex.Message}");
            // Continue with other pages
        }
    catch (Exception ex)
    {
        logger?.LogError($"Plugin processing failed: {ex.Message}");
        // For critical errors, you might want to throw, but usually better to continue
    }
}
```

### Recommended Plugin Patterns

**BeforeBakeAsync Usage:**

- Setting up Markdig pipeline extensions for content processing
- Adding metadata to pages (reading time, word counts, etc.)
- Fetching external data that content will reference
- Preparing data that will be needed during content generation

**AfterBakeAsync Usage:**

- Accessing and modifying generated content
- Creating additional output files (sitemaps, feeds, etc.)
- Performing final processing steps
- Cleaning up temporary data

**Generally Discouraged:**

- External API calls (except for specific, well-documented scenarios)
- Complex configuration requirements
- Stateful operations that depend on execution order
- Modifying files outside the Blake content directory

### Blake Philosophy Alignment

When creating plugins, follow Blake's principles:

- **Maintain simplicity** - Don't require extensive configuration
- **Be transparent** - Make it clear what your plugin does and when
- **Follow .NET conventions** - Use established patterns for naming and behavior
- **Provide just-in-time knowledge** - Document what users need when they need it
- **Fail gracefully** - Don't break sites when something goes wrong

### Code Quality Guidelines

**Use Clear Naming:**

```csharp
// Good: Descriptive method names
public async Task AddReadingTimeMetadataAsync(BlakeContext context)
{
    foreach (var page in context.Pages)
    {
        var readingTime = CalculateReadingTime(page.Content);
        page.Metadata["readingTimeMinutes"] = readingTime.ToString();
    }
}

// Avoid: Unclear purpose
public async Task ProcessAsync(BlakeContext context) { }
```

**Implement Proper Logging:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    logger?.LogInformation("Starting content processing");
    
    var processedCount = 0;
    foreach (var page in context.Pages)
    {
        try
        {
            await ProcessPage(page);
            processedCount++;
        }
        catch (Exception ex)
        {
            logger?.LogWarning($"Failed to process page {page.Slug}: {ex.Message}");
        }
    }
    
    logger?.LogInformation($"Processed {processedCount} of {context.Pages.Count} pages");
}
```

**Handle Edge Cases:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    if (context?.Pages == null || !context.Pages.Any())
    {
        logger?.LogInformation("No pages to process");
        return;
    }

    foreach (var page in context.Pages)
    {
        // Handle missing or empty content
        if (string.IsNullOrWhiteSpace(page.Content))
        {
            logger?.LogWarning($"Page {page.Slug} has no content");
            continue;
        }

        // Process the page...
    }
}
```

### Plugin Lifecycle Guidelines

**Stateless Design:**

```csharp
// Good: Stateless plugin
public class ReadTimePlugin : IBlakePlugin
{
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Calculate reading time for each page independently
        for (int i = 0; i < context.MarkdownPages.Count; i++)
        {
            var page = context.MarkdownPages[i];
            var readingTime = CalculateReadingTime(page.RawMarkdown);
            
            var updatedMarkdown = AddToFrontmatter(page.RawMarkdown, 
                "readingTime", readingTime.ToString());
            
            context.MarkdownPages[i] = page with { RawMarkdown = updatedMarkdown };
            
            OverrideOtherPluginParams(context);
        }
    }
}

// Avoid: Stateful plugin that depends on execution order
public class BadPlugin : IBlakePlugin
{
    private List<string> _processedPages = new(); // State between calls
    
    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // This assumes other plugins haven't run yet - fragile!
    }
}
```

**Resource Management:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Use proper resource management for file operations
    var tempFiles = new List<string>();
    
    try
    {
        foreach (var page in context.MarkdownPages)
        {
            if (page.RawMarkdown.Contains("<!-- generate-diagram -->"))
            {
                var tempFile = Path.GetTempFileName();
                tempFiles.Add(tempFile);
                
                await File.WriteAllTextAsync(tempFile, ExtractDiagramCode(page.RawMarkdown));
                var diagram = await ProcessDiagramFile(tempFile);
                
                // Update the page with the generated diagram
                var updatedMarkdown = page.RawMarkdown.Replace(
                    "<!-- generate-diagram -->", diagram);
                    
                context.MarkdownPages[context.MarkdownPages.IndexOf(page)] = 
                    page with { RawMarkdown = updatedMarkdown };
            }
        }
    }
    catch (Exception ex)
    {
        logger?.LogError($"Failed to generate diagrams: {ex.Message}");
    }
    finally
    {
        // Clean up temporary files
        foreach (var tempFile in tempFiles)
        {
            try { File.Delete(tempFile); } catch { /* ignore cleanup errors */ }
        }
    }
}
```

## Next Steps

- **[Testing](/pages/7%20writing%20plugins/testing)** - Validate your plugin follows these practices
- **[Examples](/pages/7%20writing%20plugins/examples)** - See these practices in real implementations
- **[Overview](/pages/7%20writing%20plugins/overview)** - Review the big picture of plugin development