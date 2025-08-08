# GitHub Copilot Instructions for BlakeDocs

This repository contains the documentation site for Blake, a Blazor-based static site generator. This document provides Copilot with comprehensive context to assist with development, content creation, and maintenance of this project.

## Project Overview

**BlakeDocs** serves three purposes:
1. **Documentation site** for Blake static site generator
2. **Reference template** for Blake-powered documentation sites 
3. **Template** that will be added to Blake's template registry

Blake follows the philosophy of "Occam's Blazor" - the solution with the fewest assumptions is often the best. It's built for .NET developers who want familiar Razor syntax instead of learning new templating languages.

**CRITICAL PRINCIPLE:** Blake is designed to be simple and transparent. The documentation should reflect this principle. Any complexity in Blake should be encapsulated, and the user-facing API should not require expertise. Users should feel comfortable referring to the documentation for what they need when they need it, without needing to gain broad general expertise before feeling comfortable with basic operations. Focus on just-in-time knowledge rather than just-in-case knowledge.

## Architecture & Technology Stack

- **.NET 9.0** with Blazor WebAssembly
- **Blake CLI** for static site generation (`blake bake`)
- **Blake.Types** for core types and interfaces
- **Two Blake Plugins:**
  - `BlakePlugin.DocsRenderer` - Renders documentation content with specialized layouts
  - `BlakePlugin.ReadTime` - Calculates reading time for content (200 words per minute)
- **Blazicons** for FontAwesome and Lucide icons
- **HotKeys2** for keyboard navigation

## Project Structure

```
BlakeDocs/
├── src/BlakeSampleDocs.csproj      # Main Blazor WebAssembly project
├── src/Pages/                      # Content organized by categories
│   ├── 1 Introduction/             # Getting started content
│   ├── 2 Using Blake/              # Usage documentation  
│   ├── 3 Deploying/               # Deployment guides
│   ├── 4 Meta/                    # Philosophy, FAQ, roadmap
│   └── 5 Contributing/            # Contributor guides
├── src/Components/                 # Reusable Blazor components
├── src/Layout/                     # Site layout components
└── src/Services/                   # Application services
```

## Blake Core Concepts

### Content Organization
- **Numbered folders** (1 Introduction, 2 Using Blake, etc.) control navigation order in this site. Note: This is a site-specific pattern, not a Blake feature. Blake is zero-config and processes files in OS order (alphanumeric), so numbering folders allows controlling their order in the TOC
- **Markdown files** (.md) contain the actual content with YAML frontmatter
- **template.razor files** define how content is rendered
- **Cascading templates** inherit from parent directory templates

### Frontmatter Structure
Blake uses YAML frontmatter in markdown files:
```yaml
---
title: 'Page Title'
date: 2025-01-15
image: images/hero.png
tags: ['blake', 'documentation'] 
description: "Brief description for SEO and previews"
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Category Name"
---
```

### Build Process
1. **Blake CLI** should be run manually with `blake bake` before build (MSBuild integration exists but order is not reliable yet)
2. **Templates and markdown** are processed into `.generated/` folder as Razor files
3. **Plugins execute** during bake process (DocsRenderer, ReadTime)
4. **Standard Blazor build** compiles the generated Razor files

## Blake Plugins

### BlakePlugin.DocsRenderer
- Specialized rendering for documentation sites
- Provides documentation-specific layout and styling
- Handles code syntax highlighting and content formatting

### BlakePlugin.ReadTime
- Automatically calculates reading time for all markdown pages
- Uses 200 words per minute standard
- Adds `readTimeMinutes` metadata to page objects
- Access via: `GeneratedContentIndex.GetPages().FirstOrDefault(p => p.Slug == "slug")?.Metadata["readTimeMinutes"]`

## Development Guidelines

### Content Authoring
1. **Create new content** by adding markdown files to appropriate numbered folders
2. **Use descriptive filenames** that match the content purpose
3. **Include complete frontmatter** with title, description, category, etc.
4. **Follow established patterns** from existing content files
5. **Use proper heading hierarchy** (H2, H3, H4) in markdown

### Component Development
1. **Reusable components** go in `/Components` directory
2. **Follow Blazor conventions** for component naming and structure  
3. **Use existing CSS patterns** found in component .razor.css files
4. **Leverage Blazicons** for consistent iconography

### Template Patterns
1. **template.razor files** define content rendering for folders
2. **Use cascading templates** to inherit common layouts
3. **Access page metadata** via the `GeneratedContentIndex`
4. **Include reading time** where appropriate using ReadTime plugin data

### Blake Philosophy Integration
- **Minimize assumptions** - don't over-engineer solutions
- **Embrace Razor syntax** - avoid inventing new templating approaches
- **Content-driven structure** - let content organization drive navigation
- **Plugin extensibility** - use plugins for additional functionality

## Common Development Tasks

### Adding New Documentation Page
1. Navigate to appropriate numbered folder (e.g., `src/Pages/2 Using Blake/`)
2. Create new `.md` file with descriptive name
3. Add complete YAML frontmatter
4. Write content using standard markdown
5. Build project (`dotnet build`) to generate Razor files

### Creating New Component
1. Add new `.razor` file to `src/Components/`
2. Include companion `.razor.css` file for styling if needed
3. Follow existing component patterns for props and rendering
4. Register component in `_Imports.razor` if needed globally

### Modifying Layout
1. Layout components are in `src/Layout/`
2. Main layout is `MainLayout.razor`
3. Navigation is handled by the `SiteToc` component from the DocsRenderer plugin
4. Modify with care as these affect entire site

### Plugin Development
When developing Blake plugins:
1. **Implement IBlakePlugin interface** from Blake.Types
2. **Use appropriate hooks** (BeforeBakeAsync, AfterBakeAsync, etc.)  
3. **Access content** via BlakeContext and page collections
4. **Add metadata** to pages for template consumption
5. **Follow plugin naming convention**: BlakePlugin.[Purpose]

## Build & Test Commands

```bash
# Restore packages
dotnet restore

# Run Blake generation
blake bake

# Build the project  
dotnet build

# Run development server
dotnet run

# Clean generated content
rm -rf src/.generated/
```

## Key Files to Understand

- **`BlakeSampleDocs.csproj`** - Project file with Blake build integration
- **`Program.cs`** - Application startup and service registration
- **`GeneratedContentIndex.Partial.cs`** - Partial class for generated content index
- **`src/Pages/cascading-template.razor`** - Main content template
- **`src/Services/`** - Application services and utilities

## Content Guidelines

### Writing Style
- **Clear and concise** explanations
- **Code examples** where helpful
- **Consistent terminology** across all documentation
- **Beginner-friendly** approach while maintaining technical accuracy

### File Organization  
- **Logical grouping** by feature/topic in numbered folders
- **Descriptive filenames** that indicate content purpose
- **Consistent frontmatter** across all markdown files

## Plugin Integration Patterns

When working with Blake plugins in this project:

1. **DocsRenderer Plugin**: Automatically applied to documentation content, provides specialized styling
2. **ReadTime Plugin**: Automatically calculates reading time, accessible in templates via metadata
3. **Custom Plugin Development**: Follow Blake plugin patterns, implement IBlakePlugin interface

## Documentation Writing Patterns

### Established Documentation Structure
The documentation follows a consistent pattern established in completed files like PageTemplates.md, AuthoringContent.md, SiteTemplates.md, and UsingPlugins.md:

1. **Info Box Summary** - Each page starts with a `:::info` container providing a concise overview
2. **Progressive Disclosure** - Information is organized from basic concepts to advanced implementation
3. **Practical Examples** - Code snippets and real-world usage examples throughout
4. **Cross-References** - Links to related documentation pages using the format `/pages/2%20using%20blake/page-name`
5. **Balanced Audience** - Content serves both content authors and developers without overwhelming beginners
6. **Just-in-Time Knowledge** - Users can find what they need without mastering the entire system first

### Content Containers
Use markdown containers for emphasis and organization:
- `:::info` - Key summaries and overviews
- `:::note` - Important additional information and tips
- `:::warning` - Cautions and important considerations

### Cross-Reference Patterns
- Internal links use URL-encoded format: `/pages/2%20using%20blake/page-templates`
- External links to related Blake resources and documentation
- "Next Steps" sections guide readers to relevant follow-up content

## Important Notes

- **Template files** (`template.razor`) are excluded from build but used by Blake CLI
- **Generated files** in `.generated/` folder should not be edited directly
- **Blake CLI** must be installed globally: `dotnet tool install -g Blake.CLI`
- **.NET 9** is required for this project

## Maintenance Instructions

**Remember to update these copilot-instructions.md with new patterns, conventions, and architectural changes as the project evolves. This ensures Copilot remains helpful and accurate as Blake and BlakeDocs develop.**

When adding new features, plugins, or changing project structure:
1. Update relevant sections in this file
2. Add new development patterns and guidelines
3. Update build/test commands if they change
4. Reflect any new Blake conventions or capabilities

## Related Resources

- [Blake Main Repository](https://github.com/matt-goldman/blake) - Core Blake static site generator
- [BlakePlugin.DocsRenderer](https://github.com/matt-goldman/BlakePlugin.DocsRenderer) - Documentation rendering plugin  
- [BlakePlugin.ReadTime](https://github.com/matt-goldman/BlakePlugin.ReadTime) - Reading time calculation plugin
- [BlakeSimpleTailwindSample](https://github.com/matt-goldman/BlakeSimpleTailwindSample) - Alternative Blake template
- [Blake Philosophy Documentation](src/Pages/4%20Meta/Philosophy.md) - Core principles and design decisions