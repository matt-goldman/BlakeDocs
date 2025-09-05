---
title: 'Plugin Architecture'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Technical overview of Blake plugin architecture, interfaces, and lifecycle."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 2
category: "Writing Plugins"
---

:::summary
Blake plugins implement the IBlakePlugin interface and participate in the site generation process through BeforeBakeAsync and AfterBakeAsync hooks. The BlakeContext provides access to content, Markdig pipeline, and build configuration throughout the plugin lifecycle.
:::

## Plugin Architecture Overview

### IBlakePlugin Interface

Blake plugins implement the `IBlakePlugin` interface from `Blake.BuildTools`:

```csharp
public interface IBlakePlugin
{
    Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null);
    Task AfterBakeAsync(BlakeContext context, ILogger? logger = null);
}
```

### Plugin Lifecycle

Blake plugins participate in the site generation process through two well-defined hooks:

1. **BeforeBakeAsync** - Called before content processing begins
   - Ideal for setup tasks and configuration
   - Modify the Markdig pipeline with custom extensions
   - Add metadata to source content through frontmatter modification
   - Prepare data for content generation

2. **AfterBakeAsync** - Called after all content is processed
   - Access fully generated content
   - Modify rendered output
   - Create additional files or assets
   - Perform cleanup or final transformations

### BlakeContext

The BlakeContext is instantiated at the start of the bake process and persists through the entire pipeline. A single BlakeContext represents the entire bake from start to finish. It's passed sequentially to every plugin's BeforeBakeAsync hook, then Blake performs the bake (creating a Markdig pipeline by calling .Build() on the PipelineBuilder), then calls AfterBakeAsync sequentially on every plugin.

:::note
There's no built-in mechanism for plugins to persist state in the context (other than through the content itself). Plugins should remain stateless.
:::

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

## Next Steps

- **[Getting Started](/pages/7%20writing%20plugins/getting-started)** - Create your first plugin
- **[Advanced Patterns](/pages/7%20writing%20plugins/advanced-patterns)** - Learn sophisticated plugin techniques
- **[Best Practices](/pages/7%20writing%20plugins/best-practices)** - Follow recommended development patterns