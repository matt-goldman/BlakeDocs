---
title: 'Using Plugins'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to extend Blake's functionality with plugins."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 5
category: "Using Blake"
---

:::info
**Summary**
Blake plugins extend the static site generation process by implementing the IBlakePlugin interface. They can modify content, add metadata, inject assets, and customize the build pipeline without requiring changes to Blake's core functionality.
:::

## Understanding Blake Plugins

Blake plugins are .NET packages that implement the `IBlakePlugin` interface from `Blake.BuildTools`. They provide a clean extension point for modifying how Blake processes your content during the bake phase.

Plugins allow you to:
- **Transform content** during the Markdown-to-HTML conversion
- **Add metadata** to pages for use in templates
- **Inject scripts or stylesheets** into generated pages
- **Modify the build pipeline** with custom processing steps
- **Integrate external services** like analytics or search indexing

The plugin system follows Blake's core philosophy - it's simple, transparent, and doesn't require you to learn proprietary APIs or configuration formats.

## How Blake Plugins Work

### Plugin Lifecycle

Blake plugins participate in the site generation process through well-defined hooks:

1. **BeforeBakeAsync** - Called before processing begins, ideal for setup tasks
2. **During bake** - Plugins can modify content as it's processed
3. **AfterBakeAsync** - Called after all content is processed, perfect for cleanup or final transformations

### Plugin Discovery

Blake automatically discovers plugins in your project through a specific naming convention and dependency scanning:

- **NuGet packages** - Any package with `BlakePlugin.*` naming is automatically scanned for `IBlakePlugin` implementations
- **Project references** - Local projects with the `BlakePlugin.*` naming convention are also scanned
- **Multiple implementations** - A single dependency can contain multiple plugin implementations (though this is discouraged)

Blake searches by NuGet package reference and project reference. Currently, other approaches like referencing DLLs directly are not supported, and there's no provision for manual plugin registration.

:::note
**Build Pipeline Integration**
Plugin discovery and execution is part of Blake's build pipeline. For detailed information about how plugins integrate with the build process, see the 🚧 [Build Pipeline](/pages/2%20using%20blake/build-pipeline) documentation (work in progress).
:::

## Using Existing Plugins

### Installing Blake Plugins

Blake plugins are distributed as standard NuGet packages:

```xml
<PackageReference Include="BlakePlugin.DocsRenderer" Version="1.0.9" />
<PackageReference Include="BlakePlugin.ReadTime" Version="1.0.0" />
```

Once added to your project, Blake automatically loads and executes them during the bake process.

### Blake Plugin Examples

#### BlakePlugin.DocsRenderer

The DocsRenderer plugin is distributed as a Razor Class Library (RCL) that includes both bake-time processing and runtime components to transform Blake sites into documentation-focused experiences:

**What it provides:**
- **Document sectioning** - Wraps content in `<section>` elements to facilitate table of contents functionality
- **Enhanced Prism renderer** - Custom Markdig renderer with supporting JavaScript and CSS for improved code highlighting
- **Navigation components** - Specialized Blazor components for site and page-level navigation
- **Search support functionality** - Additional metadata and processing to enable search capabilities (search UI is provided by the site template)
- **In-page and site-wide TOC generation** - Automatic creation of navigation structures
- **Bootstrap-compatible components** - Designed to work with Bootstrap-based layouts

**How to use:**
```xml
<PackageReference Include="BlakePlugin.DocsRenderer" Version="1.0.9" />
```

The plugin automatically applies its enhancements during baking - no configuration required. Your existing page templates will be enhanced with documentation-specific features.

**Example template usage:**
```razor
@* The DocsRenderer plugin adds navigation components *@
<SiteToc />

@* Your content renders normally *@
<div class="content">
    <h1>@Title</h1>
    @Body
</div>

@* Plugin adds metadata like reading time *@
<div class="page-meta">
    Reading time: @ReadTimeMinutes minutes
</div>
```

#### BlakePlugin.ReadTime

Calculates reading time estimates for content pages:

**What it provides:**
- **Automatic calculation** using industry-standard 200 words per minute
- **Metadata injection** accessible in all templates
- **Zero configuration** - works immediately upon installation

**How to use:**
```xml
<PackageReference Include="BlakePlugin.ReadTime" Version="1.0.0" />
```

**Accessing reading time in templates:**
```razor
@{
    var page = GeneratedContentIndex.GetPages()
        .FirstOrDefault(p => p.Slug == Context.Request.Path);
    var readTime = page?.Metadata.ContainsKey("readTimeMinutes") == true 
        ? page.Metadata["readTimeMinutes"] 
        : "Unknown";
}

<span class="read-time">📖 @readTime min read</span>
```

## Creating Custom Plugins

:::info
**Detailed Plugin Development Guide**
This section provides an overview of plugin development concepts. For comprehensive guidance on creating Blake plugins, including step-by-step tutorials and advanced examples, see the [Creating Plugins](/pages/5%20contributing/) documentation in the Contributing section.
:::

### When to Build Your Own Plugin

Consider creating a plugin when you need to:

- **Process content** in ways not supported by existing plugins
- **Integrate with external APIs** during site generation
- **Add consistent metadata** across multiple projects
- **Implement custom build logic** that should be reusable

### Plugin Structure

A Blake plugin is a .NET class library that references `Blake.Types`:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
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
    }

    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Add last modified date to each page
        foreach (var page in context.Pages)
        {
            var fileInfo = new FileInfo(page.SourcePath);
            page.Metadata["lastModified"] = fileInfo.LastWriteTime.ToString("yyyy-MM-dd");
        }
    }
}
```

### Advanced Plugin Features

#### Understanding Blake's Plugin Architecture

Blake's plugin architecture provides two main hooks for plugins - BeforeBakeAsync and AfterBakeAsync. Both methods receive a `BlakeContext` that exposes:

- A **Markdig pipeline builder** - Plugins can add custom Markdig extensions during BeforeBake
- **Content collections** - Access to markdown files and generated content (some properties are read-only)
- **Limited context manipulation** - Plugins can add items to lists and modify certain content properties

**Important architectural notes:**
- There's no native way to persist data between before and after bake runs
- Plugin execution order is not controllable  
- Plugins should be designed as stateless operations
- The generated content list uses record types that cannot be directly modified (but items can be replaced)

#### Content Processing Through Markdig Extensions

Rather than providing direct content transformation methods, Blake plugins work by extending the Markdig pipeline:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Add custom Markdig extension to the pipeline
    context.MarkdigPipelineBuilder.Extensions.Add(new MyCustomExtension());
}
```

Plugins can also modify content metadata during the before bake phase:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Add metadata to content items
    foreach (var page in context.Pages)
    {
        var wordCount = page.Content.Split(' ').Length;
        page.Metadata["wordCount"] = wordCount.ToString();
    }
}
```

#### Working with Generated Content

The AfterBakeAsync method provides access to the fully generated content:

```csharp
public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Access generated content and modify metadata
    foreach (var page in context.GeneratedContent)
    {
        // Note: You can replace items but not modify record properties directly
        var updatedPage = page with { 
            Metadata = page.Metadata.Union(new[] { 
                KeyValuePair.Create("processed", "true") 
            }).ToDictionary(x => x.Key, x => x.Value)
        };
        
        // Replace the item in the collection
        context.ReplaceGeneratedContent(page, updatedPage);
    }
}
```

#### Advanced Pattern: Data Persistence Between Hooks

For plugins that need to share data between before and after bake (like the DocsRenderer plugin), you can embed structured data in page content as comments:

```csharp
// In BeforeBakeAsync - embed data as JSON comment
var sectionData = JsonSerializer.Serialize(sections);
page.Content += $"\n<!-- PLUGIN_DATA:{sectionData} -->";

// In AfterBakeAsync - extract and parse the data
var match = Regex.Match(page.Content, @"<!-- PLUGIN_DATA:(.*?) -->");
if (match.Success)
{
    var data = JsonSerializer.Deserialize<SectionData>(match.Groups[1].Value);
    // Process the data and update the page
}
```

#### Asset Injection via RCL

For plugins that need to provide additional CSS, JavaScript, or other assets, the recommended approach is to distribute the plugin as a Razor Class Library (RCL):

```csharp
public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Add metadata that templates can use to include plugin assets
    foreach (var page in context.GeneratedContent)
    {
        var updatedPage = page with {
            Metadata = page.Metadata.Union(new[] {
                KeyValuePair.Create("hasPluginAssets", "true")
            }).ToDictionary(x => x.Key, x => x.Value)
        };
        context.ReplaceGeneratedContent(page, updatedPage);
    }
}
```

#### External API Integration

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Fetch data from external API and add to individual pages
    var httpClient = new HttpClient();
    var apiData = await httpClient.GetStringAsync("https://api.example.com/data");
    
    foreach (var page in context.Pages)
    {
        page.Metadata["externalApiData"] = apiData;
    }
}
```

:::warning
**Security and Transparency Considerations**
If your plugin makes HTTP calls or integrates with external APIs, be very clear and transparent with users about this behavior. Most people would not expect static content generation to be making network requests. Consider whether such functionality is truly necessary for your use case.
:::

### Plugin Packaging and Distribution

#### Local Development

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
```

#### NuGet Distribution

To share your plugin with others:

1. **Configure package metadata** in your plugin's `.csproj`:

```xml
<PropertyGroup>
  <PackageId>BlakePlugin.MyAwesomePlugin</PackageId>
  <Version>1.0.0</Version>
  <Authors>Your Name</Authors>
  <Description>Adds awesome functionality to Blake sites</Description>
  <PackageTags>blake-plugin;static-site-generator</PackageTags>
</PropertyGroup>
```

2. **Build and publish**:

```bash
dotnet pack
dotnet nuget push *.nupkg --source nuget.org --api-key YOUR_API_KEY
```

## Plugin Configuration and Options

### Configuration Philosophy

Blake encourages zero-configuration plugins that work immediately upon installation. However, if your plugin requires configurable options, the recommended approach is to use `appsettings.json`, which is idiomatic for Blazor applications:

#### AppSettings Configuration (Recommended)

```json
{
  "Plugins": {
    "MyAwesomePlugin": {
      "enabled": true,
      "apiEndpoint": "https://api.example.com",
      "features": ["analytics", "search"]
    }
  }
}
```

#### Alternative Configuration Methods

If AppSettings isn't suitable for your use case, consider these alternatives:

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
    var apiKey = Environment.GetEnvironmentVariable("PLUGIN_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        logger?.LogWarning("API key not found - plugin functionality may be limited");
        return;
    }
}
```

## Plugin Best Practices

### Performance Considerations

- **Cache expensive operations** - Store results to avoid repeated API calls or file operations
- **Process in batches** - Handle multiple pages together when possible
- **Use async patterns** - Blake's plugin interface is fully asynchronous
- **Minimize memory usage** - Process large content collections efficiently

### Error Handling

- **Fail gracefully** - Don't stop the entire build for non-critical features
- **Provide clear messages** - Help users understand what went wrong and how to fix it
- **Use the provided logger** - Prefer the ILogger parameter over Console output for structured logging

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    try
    {
        // Plugin functionality
        await ProcessContent(context);
    }
    catch (Exception ex)
    {
        logger?.LogWarning($"Plugin processing failed: {ex.Message}");
        // Continue with build - don't throw unless critical
    }
}
```

### Recommended Plugin Patterns

**BeforeBakeAsync Usage:**
- Setting up Markdig pipeline extensions for content processing
- Adding metadata to pages (like reading time calculations)
- Preparing data that will be needed during content generation

**AfterBakeAsync Usage:**
- Accessing and modifying generated content
- Creating additional output files
- Performing final processing steps

**Discourage unless specific use case:**
- External API calls (except for specific scenarios like cross-repo content aggregation)
- Complex configuration requirements
- Stateful operations that depend on execution order

### Blake Philosophy Alignment

When creating plugins:
- **Maintain simplicity** - Don't require extensive configuration
- **Be transparent** - Make it clear what your plugin does and when
- **Follow conventions** - Use established patterns for naming and behavior
- **Provide just-in-time knowledge** - Document what users need when they need it

## Future Plugin Capabilities

Blake's plugin system continues to evolve. Planned enhancements include:

- **Build context hooks** - More integration points in the build pipeline
- **Metadata transformations** - Structured ways to modify page metadata
- **Template injection** - Plugins that can add or modify page templates
- **Asset pipeline integration** - Direct integration with CSS/JS processing
- **Multi-phase processing** - Support for plugins that need multiple processing passes

## Next Steps

- Explore existing plugins on [NuGet](https://www.nuget.org/packages?q=BlakePlugin)
- Learn about [Page Templates](/pages/2%20using%20blake/page-templates) to understand how plugins enhance rendering
- Check the [CLI Reference](/pages/2%20using%20blake/cli) for plugin-related commands
- Review [Site Templates](/pages/2%20using%20blake/site-templates) to see how templates and plugins work together

:::note
**Plugin Development Resources**

- **Blake.Types documentation** - API reference for the plugin interface
- **Example plugins** - Open source plugins for reference and learning
- **Community forum** - Discuss plugin ideas and get development help
- **Plugin template** - Scaffolding for creating new Blake plugins quickly
:::