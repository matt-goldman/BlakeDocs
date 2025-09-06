---
title: 'Plugin Development Overview'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Introduction to Blake plugin development - when to build plugins and how they extend Blake's functionality."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Writing Plugins"
---

:::summary
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
- **Add structured metadata** processing across multiple projects
- **Add consistent metadata** across multiple projects
- **Implement custom build logic** that should be reusable
- **Transform Markdown** with custom extensions or renderers
- **Extend functionality** with assets via Razor Class Libraries (RCL)
- **Create cross-cutting functionality** that applies to multiple pages

**When NOT to build a plugin:**

- Simple one-off customizations (use template logic instead)
- Site-specific styling (use regular CSS/Blazor components)
- Basic metadata manipulation (use frontmatter)

## Next Steps

Ready to start building Blake plugins? Continue with:

- **[Plugin Architecture](/pages/7%20writing%20plugins/architecture)** - Understand the technical foundation
- **[Getting Started](/pages/7%20writing%20plugins/getting-started)** - Create your first plugin
- **[Examples](/pages/7%20writing%20plugins/examples)** - See real-world plugin implementations

For using existing plugins, see [Using Plugins](/pages/2%20using%20blake/using-plugins).