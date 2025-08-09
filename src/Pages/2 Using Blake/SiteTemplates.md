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

:::summary
Site templates provide complete starting points for your Blake projects. Use `blake new -t <template-name>` to scaffold a full site with layouts, styling, and example content tailored to specific use cases.
:::

## Understanding Site Templates

Site templates are different from [page templates](/pages/2%20using%20blake/page-templates) - they provide complete project scaffolding rather than individual page rendering.

:::summary
Blake uses the term "site templates" rather than "themes" because it more accurately describes what they are. A theme implies a visual customization of an existing standard structure, but Blake doesn't work that way. At its core, Blake simply transforms Markdown into Razor according to page templates. Site templates provide complete scaffolded websites, not just styling - they're architectural foundations, not decorative overlays.
:::

When you use a site template, Blake creates an entire Blazor project structure with:

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
- **Markdown containers** (info, warning, note callouts) supported by Blake's default renderers
- **Code syntax highlighting** for technical documentation

**Example usage:**
```bash
blake new MyDocs -t docs
cd MyDocs
blake bake
dotnet run
```

### Blog Template
**Template Name:** `Blake Simple Tailwind Sample`  
**Short Name:** `tailwind-sample`

A sample blog template using Tailwind CSS for styling and clean, modern design:

- **Post management** with organized content structure
- **Tailwind CSS styling** for responsive, modern design
- **Example posts and pages** to demonstrate different content types
- **Clean navigation** with automatic page discovery
- **Responsive layout** optimized for readability

**Demo:** https://tailwindsample.blake-ssg.org/

**Example usage:**
```bash
blake new MyBlog -t tailwind-sample
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
blake new /path/to/MyProject -t tailwind-sample
```

### Template Structure

Blake isn't opinionated about your project structure - it's primarily concerned with transforming Markdown into Razor according to page templates. Site templates are simply Blazor WASM projects that have been pre-configured with:

- **Blake dependencies** installed and project file configured appropriately
- **Content structure** suited for the template's purpose (documentation, blog, portfolio, etc.)
- **Page templates, components, CSS, and functionality** to support the intended use case
- **Plugin integrations** where beneficial for the template's goals

A key principle is the **colocation of template and markdown files**. For example, the Tailwind sample blog has both a `Pages/` folder and a `Posts/` folder, each with their own templates. This allows users to create blog posts in one location (with templates optimized for that purpose) and general pages in another (with broader layouts for "about us" or contact information).

Blake generates a content index that templates can use however best suits their purpose - in the Tailwind sample, generated pages appear in the navigation bar while generated posts appear on the home screen with pagination. This navigation logic is part of the template, not Blake itself.

```
MyProject/
├── src/
│   ├── MyProject.csproj              # Pre-configured project file
│   ├── Pages/                        # General site pages (optional structure)
│   ├── Posts/                        # Blog posts (example from Tailwind sample)
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

To adapt a template for your own content (site template authors should provide specific guidance on customizing their templates):

1. **Clear example content** - Remove or replace files in content directories (e.g., `Pages/`, `Posts/`)
2. **Update site information** - Modify titles, descriptions, and branding in layout components
3. **Customize styling** - Update CSS files in `wwwroot/css/` or replace with your own theme
4. **Manage plugins** - Add, remove, or configure plugins as needed. Any Blazor WASM compatible RCL or NuGet package can be included if desired.

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

Templates in the registry are defined using JSON metadata based on the actual registry structure:

```json
{
  "Id": "ac4a6311-b469-49eb-94c4-e35aeac422df",
  "ShortName": "tailwind-sample", 
  "Name": "Blake Simple Tailwind Sample",
  "Description": "A sample blog template using Tailwind CSS.",
  "MainCategory": "Blog",
  "Author": "Matt Goldman",
  "LastUpdated": "2025-07-15T12:00:00Z",
  "RepositoryUrl": "https://github.com/matt-goldman/BlakeSimpleTailwindSample"
}
```

:::warning
**Security Considerations**
Users should exercise the same caution with site templates as with any other packages - you are responsible for ensuring you trust the code you're executing on your computer. The template registry does not provide guarantees of safety, but does make template discovery easier and will provide minimum baseline guarantees when [planned template validation work](https://github.com/matt-goldman/blake/issues/22) is completed.
:::
```

### Contributing Templates

To contribute a template to the registry:

1. **Create your template project** following Blake conventions
2. **Test thoroughly** across different content types and scenarios  
3. **Submit to registry** via GitHub pull request

Detailed guidance on creating site templates is available in the [Contributing section](/pages/5%20contributing/) of this documentation.

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
