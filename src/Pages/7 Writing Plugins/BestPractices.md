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

- **Cache expensive operations** - Store results to avoid repeated API calls or file operations
- **Process in batches** - Handle multiple pages together when possible
- **Use async patterns** - Blake's plugin interface is fully asynchronous
- **Minimize memory usage** - Process large content collections efficiently

```csharp
// Good: Batch API calls
private readonly Dictionary<string, string> _apiCache = new();

public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    var pagesToProcess = context.Pages.Where(p => p.Metadata.ContainsKey("needsApiData")).ToList();

    if (pagesToProcess.Any())
    {
        // Single API call for all pages
        var batchData = await FetchBatchApiData(pagesToProcess.Select(p => p.Slug));

        foreach (var page in pagesToProcess)
        {
            if (batchData.TryGetValue(page.Slug, out var data))
            {
                page.Metadata["apiData"] = data;
            }
        }
    }
}
```

### Error Handling

- **Fail gracefully** - Don't stop the entire build for non-critical features
- **Provide clear messages** - Help users understand what went wrong and how to fix it
- **Use the provided logger** - Prefer ILogger over Console output for structured logging

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    try
    {
        await ProcessContent(context);
    }
    catch (HttpRequestException ex)
    {
        logger?.LogWarning($"Plugin API call failed: {ex.Message}. Using cached data if available.");
        // Continue with cached data or default behavior
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
        foreach (var page in context.Pages)
        {
            var readingTime = CalculateReadingTime(page.Content);
            page.Metadata["readingTime"] = readingTime;
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
    using var httpClient = new HttpClient();
    
    try
    {
        // Use resources within the method scope
        var data = await httpClient.GetStringAsync("https://api.example.com/data");
        // Process data...
    }
    catch (Exception ex)
    {
        logger?.LogError($"Failed to fetch external data: {ex.Message}");
    }
    // HttpClient automatically disposed
}
```

## Next Steps

- **[Testing](/pages/7%20writing%20plugins/testing)** - Validate your plugin follows these practices
- **[Examples](/pages/7%20writing%20plugins/examples)** - See these practices in real implementations
- **[Overview](/pages/7%20writing%20plugins/overview)** - Review the big picture of plugin development