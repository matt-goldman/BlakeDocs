---
title: 'Site Templates'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes the built-in starter templates provided by Blake."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 4
category: "Using Blake"
---

:::info
**Summary**
Site templates provide complete starting points for your Blake projects. Use `blake new -t <template-name>` to scaffold a full site with layouts, styling, and example content tailored to specific use cases.
:::

## Understanding Site Templates

Site templates are different from [page templates](/pages/2%20using%20blake/page-templates) - they provide complete project scaffolding rather than individual page rendering. When you use a site template, Blake creates an entire Blazor project structure with:

- Pre-configured page templates and layouts
- CSS styling and component libraries
- Example content and folder organization
- Plugin integrations where appropriate
- Build configuration and project setup

This gives you a production-ready foundation that you can customize for your specific needs.

## Available Site Templates

Blake provides several built-in site templates to get you started quickly:

### Documentation Site Template
**Template Name:** `docs` (this site)

Perfect for creating documentation sites, API references, or knowledge bases. This template includes:

- **Navigation structure** with automatic table of contents generation
- **Search functionality** for finding content across your site
- **Reading time estimates** calculated automatically for each page
- **Responsive design** that works on desktop and mobile
- **Markdown containers** for info, warning, and note callouts
- **Code syntax highlighting** for technical documentation
- **DocsRenderer plugin** pre-configured for documentation-specific features

**Example usage:**
```bash
blake new MyDocs -t docs
cd MyDocs
blake bake
dotnet run
```

### Blog Template
**Template Name:** `blog`

Designed for personal or professional blogs with:

- **Post management** with date-based organization
- **Tag and category system** for organizing content
- **Archive pages** by month and year
- **RSS feed generation** for syndication
- **Author profiles** and bio sections
- **Comment integration** points (for external services)
- **Social media meta tags** for sharing

**Example usage:**
```bash
blake new MyBlog -t blog
cd MyBlog
# Customize the blog configuration
blake bake
dotnet run
```

### Portfolio Template
**Template Name:** `portfolio` (coming soon)

Ideal for showcasing creative work or professional projects:

- **Project galleries** with image and video support
- **Case study layouts** for detailed project descriptions
- **Contact forms** and professional information
- **Skills and experience sections**
- **Testimonial displays**
- **SEO optimization** for professional visibility

## Using Site Templates

### Creating a New Project with Templates

The most common way to use site templates is when creating a new Blake project:

```bash
# List available templates
blake new --list-templates

# Create a new project using a specific template
blake new MyProject -t docs

# Create with custom location
blake new /path/to/MyProject -t blog
```

### Template Structure

When Blake applies a site template, it creates:

```
MyProject/
├── src/
│   ├── MyProject.csproj              # Pre-configured project file
│   ├── Pages/                        # Template-specific content structure
│   ├── Components/                   # Reusable Blazor components
│   ├── Layout/                       # Site layout components
│   ├── wwwroot/                      # Static assets (CSS, images, etc.)
│   └── Program.cs                    # Blazor application setup
├── README.md                         # Template-specific instructions
└── .gitignore                        # Appropriate ignore patterns
```

### Customizing Template Projects

Once you've created a project from a template, you can customize it extensively:

#### Removing Template Content

To adapt a template for your own content:

1. **Clear example content** - Remove or replace files in the `Pages/` directory
2. **Update site information** - Modify titles, descriptions, and branding in layout components
3. **Customize styling** - Update CSS files in `wwwroot/css/` or replace with your own theme
4. **Configure plugins** - Adjust plugin settings in the project file or remove unused plugins

#### Converting Documentation Template

If you used the docs template but want a simpler site:

```bash
# Remove documentation-specific plugins from your .csproj
# <PackageReference Include="BlakePlugin.DocsRenderer" Version="..." />

# Replace complex layouts with simpler ones
# Update or replace files in Layout/ directory

# Reorganize content structure
# Move files from numbered folders to a simpler structure
```

## Template Registry and Contributions

Blake maintains a template registry that allows the community to share and discover site templates.

### Template Registry Format

Templates in the registry are defined using JSON metadata:

```json
{
  "name": "docs",
  "displayName": "Documentation Site",
  "description": "A comprehensive documentation site template with search, TOC, and responsive design",
  "author": "Blake Team",
  "version": "1.0.0",
  "tags": ["documentation", "reference", "technical"],
  "repository": "https://github.com/blake-templates/docs-template",
  "requirements": {
    "dotnetVersion": "8.0",
    "blakeVersion": "1.0.0"
  },
  "plugins": [
    "BlakePlugin.DocsRenderer",
    "BlakePlugin.ReadTime"
  ],
  "features": [
    "Search functionality",
    "Table of contents generation",
    "Responsive design",
    "Code syntax highlighting"
  ]
}
```

### Contributing Templates

To contribute a template to the registry:

1. **Create your template project** following Blake conventions
2. **Test thoroughly** across different content types and scenarios
3. **Document usage** with clear README and examples
4. **Submit to registry** via GitHub pull request to the Blake templates repository

:::note
**Template Guidelines**

When creating templates for contribution:
- Follow Blake's "zero configuration" philosophy - templates should work immediately after creation
- Include comprehensive documentation and examples
- Use semantic, accessible HTML and CSS
- Test with various content types and sizes
- Consider mobile responsiveness and performance
:::

## Template vs Page Template Relationship

Understanding the relationship between site templates and page templates:

- **Site templates** provide the entire project structure and multiple page templates
- **Page templates** (covered in [Page Templates](/pages/2%20using%20blake/page-templates)) define how individual markdown files are rendered
- A single site template typically includes several different page templates for different content types
- You can mix and match - use a site template as a starting point, then create custom page templates for specific sections

### Example: Documentation Site Structure

The docs site template includes multiple page templates:

```
src/Pages/
├── cascading-template.razor          # Default template for all pages
├── 1 Introduction/
│   └── template.razor                # Template for introduction pages
├── 2 Using Blake/
│   └── template.razor                # Template for usage documentation
└── Components/
    ├── SearchBox.razor               # Site-specific components
    └── TableOfContents.razor
```

This allows different sections to have specialized layouts while maintaining consistent site-wide elements.

## Next Steps

- Learn about creating custom [Page Templates](/pages/2%20using%20blake/page-templates)
- Explore [Using Plugins](/pages/2%20using%20blake/using-plugins) to extend your site's functionality
- Check the [CLI Reference](/pages/2%20using%20blake/cli) for all template-related commands
- Review [Authoring Content](/pages/2%20using%20blake/authoring-content) to start adding your own content
