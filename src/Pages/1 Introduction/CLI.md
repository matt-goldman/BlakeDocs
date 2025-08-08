---
title: 'CLI Reference'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Reference for the Blake CLI commands and their usage."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 3
category: "Getting Started"
---

# Blake CLI Reference

The Blake CLI provides essential commands for creating, building, and managing your static sites. Each command is designed to be simple and transparent, giving you exactly what you need without complexity.

## Installation

If you haven't already installed the Blake CLI:

```bash
dotnet tool install -g Blake.CLI
```

Once installed, you can use `blake --help` to see all available commands and options.

## Core Commands

### blake new

Creates a new Blake site from scratch.

```bash
# Create a new site in the current directory
blake new

# Create a new site in a specific directory
blake new my-site

# Create from a template
blake new my-blog --template tailwind-sample

# See all available templates
blake new --list
```

**When to use:** Starting a new Blake project. This sets up a complete Blazor WebAssembly project with Blake configuration and sample content.

**Options:**
- `--template, -t` - Specify a template by name or short name
- `--siteName, -sn` - Set the site name (uses directory name by default)
- `--url, -u` - Use a custom template from a Git repository
- `--list` - List all available templates from the Blake registry

### blake init

Adds Blake to an existing Blazor WebAssembly project.

```bash
# Add Blake to current project
blake init

# Add Blake with sample content to see how it works
blake init --includeSampleContent
```

**When to use:** You have an existing Blazor WASM project and want to add Blake's static site generation capabilities.

**Options:**
- `--includeSampleContent, -s` - Include sample pages and navigation to demonstrate Blake features

### blake bake

Generates the static content for your Blake site by processing Markdown files and templates.

```bash
# Generate site content
blake bake

# Include draft pages (normally skipped)
blake bake --includeDrafts

# Clean previous output before generating
blake bake --clean
```

**When to use:** After creating or modifying content, templates, or components. This is the core build step that transforms your Markdown and templates into Blazor components.

**Options:**
- `--includeDrafts` - Include pages with `draft: true` in frontmatter
- `--clean, -cl` - Remove `.generated` folder before building
- `--disableDefaultRenderers, -dr` - Skip built-in Bootstrap container renderers

### blake serve

Bakes your site and runs it in development mode with live reload.

```bash
# Bake and serve the site locally
blake serve

# Serve without default renderers
blake serve --disableDefaultRenderers
```

**When to use:** During development to test your site locally. This combines `blake bake` with `dotnet run` for a complete development experience.

**Options:**
- `--disableDefaultRenderers, -dr` - Skip built-in Bootstrap container renderers

## Typical Workflow

1. **Create a new site:** `blake new my-site`
2. **Make your changes:** Edit Markdown files, templates, or components
3. **Build content:** `blake bake` (or let the build process handle it)
4. **Test locally:** `blake serve` or `dotnet run`
5. **Deploy:** Run your standard deployment process

## Need More Detail?

- **Site Templates:** See [Site Templates](/pages/2 using blake/site-templates) for available templates and how to use them
- **Content Creation:** See [Authoring Content](/pages/2 using blake/authoring-content) for working with Markdown and frontmatter
- **Page Templates:** See [Page Templates](/pages/2 using blake/page-templates) for customizing how content renders
- **Deployment:** See the [Deploying](/pages/3 deploying) section for publishing your site

## Notes

- Blake integrates with your build process, so `blake bake` typically runs automatically when you build your project
- All commands work with the current directory by default, or you can specify a path
- Blake follows the "Occam's Blazor" principle - the simplest approach that works is usually the best approach