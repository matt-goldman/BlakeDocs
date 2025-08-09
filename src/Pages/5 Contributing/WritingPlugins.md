---
title: 'Writing Plugins'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Complete guide to developing Blake plugins that extend static site generation functionality."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 6
category: "Contributing"
---

:::info
**Summary**
Blake plugins are .NET class libraries implementing the IBlakePlugin interface. They extend Blake's functionality by modifying content processing, adding metadata, injecting assets, and customizing the build pipeline without requiring changes to Blake's core.
:::

## Understanding Blake Plugin Development

Blake plugins provide a powerful extension mechanism for customizing your static site generation process. Unlike configuration-heavy approaches used by other generators, Blake plugins are code-first, giving you the full power of .NET to transform content and enhance functionality.

Plugin development follows Blake's core philosophy:
- **Simple by default** - Zero configuration plugins that work immediately
- **Transparent behavior** - Clear documentation of what plugins do and when
- **.NET-native approach** - Leverage familiar tools and patterns
- **Just-in-time complexity** - Advanced features available when needed, simple cases stay simple

## When to Build Your Own Plugin

Consider creating a plugin when you need to:

- **Process content** in ways not supported by existing plugins
- **Integrate with external APIs** during site generation
- **Add consistent metadata** across multiple projects
- **Implement custom build logic** that should be reusable
- **Transform Markdown** with custom extensions or renderers
- **Inject assets** like CSS, JavaScript, or other files
- **Create cross-cutting functionality** that applies to multiple pages

**When NOT to build a plugin:**
- Simple one-off customizations (use template logic instead)
- Site-specific styling (use regular CSS/Blazor components)
- Basic metadata manipulation (use frontmatter)

## Plugin Architecture Overview

### IBlakePlugin Interface

Blake plugins implement the `IBlakePlugin` interface from `Blake.BuildTools`:

```csharp
public interface IBlakePlugin
{
    string Name { get; }
    string Version { get; }
    Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null);
    Task AfterBakeAsync(BlakeContext context, ILogger? logger = null);
}
```

### Plugin Lifecycle

Blake plugins participate in the site generation process through two well-defined hooks:

1. **BeforeBakeAsync** - Called before content processing begins
   - Ideal for setup tasks and configuration
   - Modify the Markdig pipeline with custom extensions
   - Add metadata to source content
   - Prepare data for content generation

2. **AfterBakeAsync** - Called after all content is processed
   - Access fully generated content
   - Modify rendered output
   - Create additional files or assets
   - Perform cleanup or final transformations

### BlakeContext

Both lifecycle methods receive a `BlakeContext` that provides:

- **Markdig pipeline builder** - Add custom Markdig extensions during BeforeBake
- **Content collections** - Access to markdown files and generated content 
- **Limited context manipulation** - Add items to lists and modify certain properties
- **Build configuration** - Access to Blake's build settings

**Important architectural notes:**
- Plugin execution order is not controllable
- Plugins should be designed as stateless operations  
- Generated content uses record types (replace entire items, don't modify properties directly)
- No native persistence between before and after bake phases

## Creating Your First Plugin

### Project Setup

A Blake plugin is a .NET class library that references `Blake.BuildTools`:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <PackageId>BlakePlugin.MyAwesomePlugin</PackageId>
    <Version>1.0.0</Version>
    <Authors>Your Name</Authors>
    <Description>Adds awesome functionality to Blake sites</Description>
    <PackageTags>blake-plugin;static-site-generator</PackageTags>
  </PropertyGroup>
  
  <ItemGroup>
    <PackageReference Include="Blake.BuildTools" Version="1.0.12" />
  </ItemGroup>
</Project>
```

### Basic Plugin Implementation

Here's a minimal plugin that adds a "last modified" timestamp to all pages:

```csharp
using Blake.BuildTools;
using Microsoft.Extensions.Logging;

public class LastModifiedPlugin : IBlakePlugin
{
    public string Name => "LastModified";
    public string Version => "1.0.0";

    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Setup tasks before processing begins
        logger?.LogInformation("Adding last modified timestamps...");
        
        // Process each page to add timestamp metadata
        foreach (var page in context.Pages)
        {
            var fileInfo = new FileInfo(page.SourcePath);
            page.Metadata["lastModified"] = fileInfo.LastWriteTime.ToString("yyyy-MM-dd");
        }
    }

    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Optional: additional processing after content generation
        logger?.LogInformation($"Processed {context.GeneratedContent.Count} pages with timestamps");
    }
}
```

### Local Development Workflow

For development and testing:

```bash
# Create plugin project
dotnet new classlib -n MyBlakePlugin
cd MyBlakePlugin

# Add Blake.BuildTools reference
dotnet add package Blake.BuildTools

# Build plugin
dotnet build

# Reference from your Blake site
dotnet add reference ../MyBlakePlugin/MyBlakePlugin.csproj

# Run blake bake to test your plugin
blake bake
```

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

Plugins can add metadata during the before bake phase:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.Pages)
    {
        // Calculate word count
        var wordCount = page.Content.Split(new[] { ' ', '\n', '\r' }, 
            StringSplitOptions.RemoveEmptyEntries).Length;
        page.Metadata["wordCount"] = wordCount.ToString();
        
        // Estimate reading time (200 words per minute)
        var readingTime = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));
        page.Metadata["readTimeMinutes"] = readingTime.ToString();
        
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
    // Access generated content and modify metadata
    foreach (var page in context.GeneratedContent)
    {
        // Note: Generated content uses record types - replace entire items
        var updatedPage = page with { 
            Metadata = page.Metadata.Union(new[] { 
                KeyValuePair.Create("processed", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")),
                KeyValuePair.Create("hasCodeBlocks", page.Content.Contains("<code>").ToString())
            }).ToDictionary(x => x.Key, x => x.Value)
        };
        
        // Replace the item in the collection
        context.ReplaceGeneratedContent(page, updatedPage);
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

### Asset Injection via Razor Class Library (RCL)

For plugins that provide CSS, JavaScript, or other assets, distribute as an RCL:

```csharp
public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.GeneratedContent)
    {
        // Check if page needs plugin assets
        var needsAssets = page.Content.Contains("my-plugin-component");
        
        if (needsAssets)
        {
            var updatedPage = page with {
                Metadata = page.Metadata.Union(new[] {
                    KeyValuePair.Create("includeMyPluginAssets", "true")
                }).ToDictionary(x => x.Key, x => x.Value)
            };
            context.ReplaceGeneratedContent(page, updatedPage);
        }
    }
}
```

Then in your plugin's RCL, provide components that can be used in templates:

```razor
@* Components/MyPluginAssets.razor *@
@if (IncludeAssets)
{
    <link href="_content/BlakePlugin.MyPlugin/css/plugin.css" rel="stylesheet" />
    <script src="_content/BlakePlugin.MyPlugin/js/plugin.js"></script>
}

@code {
    [Parameter] public bool IncludeAssets { get; set; }
}
```

### External API Integration

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    using var httpClient = new HttpClient();
    
    try
    {
        // Fetch external data (use cautiously)
        var apiData = await httpClient.GetStringAsync("https://api.example.com/data");
        var data = JsonSerializer.Deserialize<ExternalData>(apiData);
        
        // Add to pages that need this data
        foreach (var page in context.Pages.Where(p => p.Metadata.ContainsKey("useExternalData")))
        {
            page.Metadata["externalApiData"] = apiData;
            page.Metadata["lastApiUpdate"] = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
    catch (Exception ex)
    {
        logger?.LogWarning($"External API call failed: {ex.Message}");
        // Fail gracefully - don't break the build
    }
}
```

:::warning
**Security and Transparency Considerations**
If your plugin makes HTTP calls or integrates with external APIs, be very clear and transparent with users about this behavior. Most people would not expect static content generation to be making network requests. Consider whether such functionality is truly necessary for your use case.
:::

## Plugin Configuration

### Configuration Philosophy

Blake encourages zero-configuration plugins that work immediately upon installation. However, if your plugin requires configuration, use familiar .NET patterns.

### AppSettings Configuration (Recommended)

```json
{
  "Plugins": {
    "MyAwesomePlugin": {
      "enabled": true,
      "apiEndpoint": "https://api.example.com",
      "features": ["analytics", "search"],
      "cacheTimeout": 3600
    }
  }
}
```

Access configuration in your plugin:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Access configuration from Blake's configuration system
    var config = context.Configuration?.GetSection("Plugins:MyAwesomePlugin");
    var enabled = config?.GetValue<bool>("enabled", true) ?? true;
    var apiEndpoint = config?.GetValue<string>("apiEndpoint");
    
    if (!enabled)
    {
        logger?.LogInformation("Plugin disabled via configuration");
        return;
    }
    
    // Use configuration...
}
```

### Alternative Configuration Methods

**Project File Configuration:**
```xml
<PropertyGroup>
  <MyPluginEnabled>true</MyPluginEnabled>
  <MyPluginApiKey>your-api-key</MyPluginApiKey>
</PropertyGroup>
```

**Environment Variables:**
```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    var apiKey = Environment.GetEnvironmentVariable("MY_PLUGIN_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        logger?.LogWarning("API key not found - plugin functionality may be limited");
        return;
    }
}
```

## Plugin Packaging and Distribution

### NuGet Distribution

To share your plugin with the Blake community:

1. **Configure package metadata** in your `.csproj`:

```xml
<PropertyGroup>
  <PackageId>BlakePlugin.MyAwesomePlugin</PackageId>
  <Version>1.0.0</Version>
  <Authors>Your Name</Authors>
  <Description>Adds awesome functionality to Blake sites</Description>
  <PackageTags>blake-plugin;static-site-generator;blazor</PackageTags>
  <PackageLicenseExpression>MIT</PackageLicenseExpression>
  <PackageProjectUrl>https://github.com/yourusername/BlakePlugin.MyAwesome</PackageProjectUrl>
  <RepositoryUrl>https://github.com/yourusername/BlakePlugin.MyAwesome</RepositoryUrl>
</PropertyGroup>
```

2. **Include documentation**:
   - README.md with usage examples
   - CHANGELOG.md for version history
   - Clear documentation of what the plugin does

3. **Build and publish**:

```bash
dotnet pack --configuration Release
dotnet nuget push *.nupkg --source nuget.org --api-key YOUR_API_KEY
```

### Plugin Discovery

Blake automatically discovers plugins using these conventions:

- **NuGet packages** named `BlakePlugin.*`
- **Project references** with `BlakePlugin.*` naming
- **Automatic scanning** for `IBlakePlugin` implementations

No manual registration required - just install and Blake will find it.

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

## Testing Your Plugin

### Unit Testing

Test your plugin logic independently of Blake:

```csharp
[Fact]
public async Task LastModifiedPlugin_AddsTimestampMetadata()
{
    // Arrange
    var plugin = new LastModifiedPlugin();
    var context = CreateTestBlakeContext();
    var logger = new TestLogger();

    // Act
    await plugin.BeforeBakeAsync(context, logger);

    // Assert
    Assert.All(context.Pages, page => 
        Assert.True(page.Metadata.ContainsKey("lastModified")));
}
```

### Integration Testing

Test your plugin with actual Blake content:

1. Create a minimal Blake site for testing
2. Install your plugin via project reference
3. Run `blake bake` and verify output
4. Use automated tests to verify generated content

### Development Tips

- **Use logging extensively** during development to understand plugin execution
- **Test with various content types** - different frontmatter, content structures
- **Verify behavior with empty/missing data** - ensure graceful handling
- **Test plugin interactions** - how does your plugin behave with other plugins

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

### Real-World Plugin Examples

**BlakePlugin.ReadTime** - Simple metadata enhancement:
- Calculates reading time for all pages
- Zero configuration required
- Good example of BeforeBakeAsync usage

**BlakePlugin.DocsRenderer** - Complex content transformation:
- Markdig extensions for enhanced rendering
- RCL distribution with assets
- BeforeBake and AfterBake coordination
- Good example of advanced plugin patterns

## Future Plugin Capabilities

Blake's plugin system continues to evolve. Planned enhancements include:

- **Build context hooks** - More integration points in the build pipeline
- **Metadata transformations** - Structured ways to modify page metadata
- **Template injection** - Plugins that can add or modify page templates
- **Asset pipeline integration** - Direct integration with CSS/JS processing
- **Multi-phase processing** - Support for plugins that need multiple processing passes
- **Plugin dependencies** - Declare dependencies between plugins

## Next Steps

Ready to create your first Blake plugin? Here's what to do next:

1. **Install the plugin template** and create a basic plugin
2. **Study existing plugins** like BlakePlugin.ReadTime for inspiration
3. **Join the community** to discuss plugin ideas and get help
4. **Review the [Plugin Hooks](/pages/5%20contributing/plugin-hooks)** documentation for advanced scenarios
5. **Check out the [Build Pipeline](/pages/5%20contributing/build-pipeline)** to understand Blake's architecture

:::note
**Plugin Development Resources**

- **Blake.BuildTools API Reference** - Complete interface documentation
- **Example plugins** - Open source plugins for reference and learning
- **Community Discord** - Discuss plugin ideas and get development help
- **Plugin template** - Scaffolding for creating new Blake plugins quickly
- **Contributing guidelines** - How to contribute plugins back to the Blake ecosystem
:::