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

Blake plugins are .NET packages that implement the `IBlakePlugin` interface from `Blake.Types`. They provide a clean extension point for modifying how Blake processes your content during the bake phase.

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

Blake automatically discovers plugins in your project:

- **NuGet packages** - Any package with `BlakePlugin` in the name is automatically detected
- **Local assemblies** - Projects referencing `Blake.Types` can include custom plugins
- **Manual registration** - Plugins can be explicitly registered if needed

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

The DocsRenderer plugin transforms standard Blake sites into documentation-focused experiences:

**What it provides:**
- **Specialized layouts** optimized for technical documentation
- **Table of contents generation** from your content structure
- **Search functionality** across all documentation pages
- **Navigation components** designed for hierarchical content
- **Responsive design** that works well for reference material

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
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  
  <ItemGroup>
    <PackageReference Include="Blake.Types" Version="1.0.12" />
  </ItemGroup>
</Project>
```

### Basic Plugin Implementation

Here's a minimal plugin that adds a "last modified" timestamp to all pages:

```csharp
using Blake.Types;

public class LastModifiedPlugin : IBlakePlugin
{
    public string Name => "LastModified";
    public string Version => "1.0.0";

    public async Task BeforeBakeAsync(BlakeContext context)
    {
        // Setup tasks before processing begins
        Console.WriteLine("Adding last modified timestamps...");
    }

    public async Task AfterBakeAsync(BlakeContext context)
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

#### Content Transformation

Plugins can modify Markdown content before it's converted to HTML:

```csharp
public async Task ProcessPageAsync(BlakePage page, BlakeContext context)
{
    // Transform content - for example, add custom shortcodes
    page.Content = page.Content.Replace("{{current-year}}", DateTime.Now.Year.ToString());
    
    // Add custom metadata based on content analysis
    var wordCount = page.Content.Split(' ').Length;
    page.Metadata["wordCount"] = wordCount.ToString();
}
```

#### Asset Injection

Plugins can inject CSS, JavaScript, or other assets:

```csharp
public async Task AfterBakeAsync(BlakeContext context)
{
    // Add custom CSS to all pages
    foreach (var page in context.Pages)
    {
        page.Metadata["additionalCSS"] = "/css/plugin-styles.css";
        page.Metadata["additionalJS"] = "/js/plugin-features.js";
    }
}
```

#### External API Integration

```csharp
public async Task BeforeBakeAsync(BlakeContext context)
{
    // Fetch data from external API for use in templates
    var httpClient = new HttpClient();
    var apiData = await httpClient.GetStringAsync("https://api.example.com/data");
    
    context.GlobalMetadata["externalData"] = apiData;
}
```

### Plugin Packaging and Distribution

#### Local Development

For development and testing:

```bash
# Create plugin project
dotnet new classlib -n MyBlakePlugin
cd MyBlakePlugin

# Add Blake.Types reference
dotnet add package Blake.Types

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

### Configuration Patterns

Blake plugins can accept configuration through several mechanisms:

#### Project File Configuration

```xml
<PropertyGroup>
  <MyPluginEnabled>true</MyPluginEnabled>
  <MyPluginApiKey>your-api-key</MyPluginApiKey>
</PropertyGroup>
```

#### JSON Configuration Files

Create a `blake-config.json` file in your project root:

```json
{
  "plugins": {
    "MyAwesomePlugin": {
      "enabled": true,
      "apiEndpoint": "https://api.example.com",
      "features": ["analytics", "search"]
    }
  }
}
```

#### Environment Variables

```csharp
public async Task BeforeBakeAsync(BlakeContext context)
{
    var apiKey = Environment.GetEnvironmentVariable("PLUGIN_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        throw new InvalidOperationException("API key is required");
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
- **Log appropriately** - Use structured logging for debugging without noise

```csharp
public async Task ProcessPageAsync(BlakePage page, BlakeContext context)
{
    try
    {
        // Plugin functionality
        await ProcessPageContent(page);
    }
    catch (Exception ex)
    {
        context.Logger.LogWarning($"Plugin failed for {page.Slug}: {ex.Message}");
        // Continue processing other pages
    }
}
```

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