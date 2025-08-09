---
title: 'Blake Roadmap'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes the future plans and direction for Blake, including upcoming features and improvements."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 3
category: "Meta"
---

:::info
**Summary**
Blake is essentially feature-complete. Future development focuses on developer experience improvements, additional plugins, and expanding the template ecosystem - not adding core complexity.
:::

## Current State of Blake

Blake has reached a stable, production-ready state. The core static site generation functionality is complete and battle-tested across multiple projects.

**What works today:**

- **Zero-configuration content processing** - Markdown to Blazor transformation with no setup required
- **Flexible templating system** - Standard Razor templates with full Blazor component support
- **Plugin architecture** - Extensible system for adding functionality without touching Blake's core
- **Site template system** - Complete project scaffolding for different use cases
- **Template registry** - Automated discovery and installation of community templates

Blake successfully powers documentation sites, blogs, and other static content across various production deployments.

## Completed Roadmap Items

These were the original goals when Blake development started:

### ✅ Plugin Architecture
**Status: Complete**

Blake's plugin system is fully implemented with multiple published plugins:

- **BlakePlugin.DocsRenderer** - Specialized documentation rendering with enhanced navigation
- **BlakePlugin.ReadTime** - Automatic reading time calculation for content
- **Plugin pipeline** - Complete lifecycle hooks for content transformation
- **Automatic discovery** - Plugins are automatically detected and executed

The plugin architecture provides extensibility without compromising Blake's simplicity.

### ✅ Starter Templates  
**Status: Complete**

Blake ships with production-ready site templates:

- **Documentation template** - This site serves as both documentation and template
- **Simple Tailwind blog** - Clean, modern blog template with Tailwind CSS
- **Template registry** - Automated template discovery and installation system

Both templates provide complete, customizable foundations for different content types.

### ✅ Template Registry
**Status: Complete with ongoing improvements**

The template registry enables easy discovery and installation of site templates:

- **Automated installation** via `blake new -t <template-name>`
- **Version management** and template validation
- **Community contributions** through standardized template format

Planned improvements include enhanced validation (see [Issue #22](https://github.com/matt-goldman/blake/issues/22)) and potential plugin registry expansion.

## Planned Improvements

These improvements enhance developer experience without adding core complexity:

### Incremental Builds and Watch Mode

**Current limitation:** Blake rebuilds all content on every `blake bake` command.

**Planned enhancement:** 
- **Incremental builds** - Only process changed content files
- **Watch functionality** - Hot reload support for `blake serve`
- **Performance optimization** for large sites

This isn't critical for most use cases, but would improve development workflow for large content sites.

### Enhanced Template Registry

**Current state:** Basic template discovery and validation.

**Planned improvements:**
- **Better validation process** for template quality and completeness
- **Plugin registry** - Similar system for discovering and installing Blake plugins
- **Community templates** - Easier contribution and discovery process
- **Template versioning** - Better management of template updates

### Additional Core Plugins

**High-priority plugins planned:**

- **RSS feed generator** - Automatic feed creation for blog-style content
- **Full-text search indexer** - Generate search indexes for client-side search
- **Social sharing** - Meta tags and preview generation for social platforms
- **Giscus integration** - GitHub Discussions-based commenting system (possibly via RCL rather than plugin)

These plugins extend Blake's utility without complicating the core system.

## What Will Never Be Added

Blake intentionally limits its scope to maintain simplicity and focus:

### ❌ Complex Configuration Systems
Blake's zero-configuration approach is fundamental to its philosophy. Any functionality requiring complex configuration belongs in plugins or site templates, not Blake's core.

### ❌ Built-in Content Management
Blake processes static files - it doesn't manage content creation, editing, or workflow. These concerns belong in external tools or specialized plugins.

### ❌ Server-Side Rendering
Blake generates static sites. Server-side functionality belongs in the deployment environment or separate tools, not Blake itself.

### ❌ Built-in Asset Processing  
Blake focuses on content transformation. Asset pipelines, image processing, and bundling should use dedicated tools or build system integration.

### ❌ Multiple Output Formats
Blake generates Blazor WebAssembly applications. Supporting other output formats would compromise the tight integration with the Blazor ecosystem that makes Blake powerful.

## Development Philosophy

Blake's roadmap follows these principles:

### Simplicity First
Every proposed feature is evaluated against Blake's core philosophy. Features that add significant complexity get redesigned or rejected.

### Plugin-Based Extension
New functionality goes into plugins rather than Blake's core. This keeps the base system simple while enabling unlimited extensibility.

### Community-Driven Templates
Site templates address specific use cases without bloating Blake itself. The template system lets the community create specialized solutions.

### .NET Ecosystem Integration
Blake leverages existing .NET tools and conventions rather than reinventing functionality. This keeps Blake focused and maintainable.

## Community Involvement

Blake development benefits from community feedback and contributions:

### Contributing
- **Plugin development** - Create plugins for specific functionality needs
- **Site templates** - Develop templates for new use cases (Architecture Decision Records, portfolios, etc.)
- **Documentation** - Improve this documentation with clarifications and examples
- **Bug reports** - Report issues via GitHub Issues

See the [Contributing](/pages/5%20contributing/) guide for detailed information.

### Getting Involved

- **GitHub Discussions** - Join conversations about Blake development at [Blake Discussions](https://github.com/matt-goldman/blake/discussions)
- **Issue tracking** - Report bugs or request features via [GitHub Issues](https://github.com/matt-goldman/blake/issues)
- **Template contributions** - Submit new site templates through pull requests
- **Plugin development** - Create and share Blake plugins via NuGet

## Stability Promise

Blake is committed to maintaining compatibility and simplicity:

- **No breaking changes** to core functionality without major version bumps
- **Backward compatibility** for existing content and templates
- **Simple upgrade paths** when improvements require changes
- **Clear deprecation** process for any functionality changes

Blake will remain a simple, reliable tool for transforming markdown content into Blazor applications.

:::note
**Version 1.0 and Beyond**
Blake is currently in active development toward a stable 1.0 release. The core functionality is production-ready, but APIs may change based on community feedback before the 1.0 milestone.
:::