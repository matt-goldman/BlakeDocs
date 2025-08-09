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

:::summary
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

:::summary
Ready to develop Blake plugins? The complete guide to plugin development, including architecture overview, step-by-step tutorials, advanced patterns, and best practices, is available in the [Writing Plugins](/pages/5%20contributing/writing-plugins) section of our Contributing documentation.
:::

### When to Consider Plugin Development

You might want to create a custom Blake plugin if you need to:

- **Process content** in ways not supported by existing plugins
- **Integrate with external APIs** during site generation
- **Add consistent metadata** across multiple projects or sites
- **Implement reusable build logic** that other Blake users could benefit from

### Getting Started with Plugin Development

Blake plugins are .NET class libraries that implement the `IBlakePlugin` interface. They provide two lifecycle hooks - `BeforeBakeAsync` and `AfterBakeAsync` - that let you modify content processing and add custom functionality.

**Quick start steps:**
1. Create a new .NET class library project
2. Reference `Blake.BuildTools` package
3. Implement `IBlakePlugin` interface
4. Test with a local Blake site

For detailed implementation guidance, examples, and advanced patterns, see the complete [Writing Plugins](/pages/5%20contributing/writing-plugins) documentation in the Contributing section.

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