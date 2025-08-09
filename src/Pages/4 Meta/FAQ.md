---
title: 'Frequently Asked Questions'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Answers to common questions about using Blake."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Meta"
quickAccess: 5
---

:::info
**Summary**
Common questions and troubleshooting tips for Blake users. Blake is intentionally simple, so most issues relate to basic setup or build process concerns.
:::

## Getting Started Questions

### Why isn't my page showing up?

This is the most common issue new users encounter. Check these items in order:

1. **Template exists**: The folder containing your Markdown file needs either:
   - A `template.razor` file in the same folder, or
   - A `cascading-template.razor` file in a parent folder

2. **Valid frontmatter**: Your Markdown file should have properly formatted YAML frontmatter:
   ```yaml
   ---
   title: 'Your Page Title'
   ---
   ```

3. **Build process**: Make sure you've run `blake bake` before building your site:
   ```bash
   blake bake
   dotnet build
   ```

4. **Draft content**: If your content has `draft: true` in the frontmatter, you need to include it explicitly:
   ```bash
   blake bake --includeDrafts
   ```

For more details on content authoring, see [Authoring Content](/pages/2%20using%20blake/authoring-content).

### How do I customize the layout?

Blake uses [Page Templates](/pages/2%20using%20blake/page-templates) to control how your content is rendered:

- **Single folder**: Create a `template.razor` file in the folder containing your Markdown files
- **Multiple folders**: Use `cascading-template.razor` to apply templates to subfolders
- **Site-wide**: Start with a [Site Template](/pages/2%20using%20blake/site-templates) and customize from there

Templates use standard Razor syntax - no proprietary templating language to learn.

### What's the difference between Page Templates and Site Templates?

- **Page Templates** (`template.razor`) define how individual Markdown files are rendered into HTML
- **Site Templates** are complete project scaffolds you get when running `blake new -t <template-name>`

See [Site Templates](/pages/2%20using%20blake/site-templates) for available options.

## Build and Deployment

### The MSBuild target doesn't work reliably

This is a known limitation. The MSBuild target included in the project templates doesn't execute reliably due to build order dependencies.

**Recommended approach:**
Always run `blake bake` manually before building your site:

```bash
blake bake
dotnet build
dotnet run
```

**Why this happens:** Blake needs to generate Razor files before the .NET build process compiles them, but MSBuild targets don't guarantee this ordering.

### How do I deploy my Blake site?

Blake generates standard Blazor WebAssembly applications. Deploy them like any other Blazor WASM app:

- **Static hosting**: GitHub Pages, Netlify, Vercel, Azure Static Web Apps
- **CDN**: Any content delivery network that supports static files
- **Web servers**: IIS, Apache, nginx with proper MIME type configuration

For detailed deployment guidance, see the [Deploying](/pages/3%20deploying/) section.

## Customization and Features

### Can I use my own CSS framework instead of Bootstrap?

Absolutely! Blake doesn't enforce any CSS framework. The documentation template uses Bootstrap, but you can:

- Create your own site template with your preferred CSS framework
- Modify an existing template's styling
- Use utility-first frameworks like Tailwind (see the [Tailwind Sample](https://tailwindsample.blake-ssg.org/) template)

### How do I add plugins to my site?

Blake plugins are NuGet packages that extend functionality:

1. **Install the plugin**:
   ```xml
   <PackageReference Include="BlakePlugin.ReadTime" Version="1.0.0" />
   ```

2. **Run blake bake**: Plugins are automatically discovered and executed

For more details, see [Using Plugins](/pages/2%20using%20blake/using-plugins).

### Can I use components from other Blazor libraries?

Yes! Blake generates standard Blazor components, so you can use any Blazor component library:

- Add the NuGet package to your project
- Include the library in your templates
- Use components in your Razor templates

## Troubleshooting

### My site builds but pages are blank

Check these common issues:

1. **Template syntax errors**: Razor compilation errors will cause blank pages
2. **Missing @@Body directive**: Templates must include `@@Body` to render Markdown content
3. **Frontmatter parsing errors**: Invalid YAML frontmatter can cause rendering issues

### I'm getting compilation errors

Most compilation errors relate to:

- **Invalid Razor syntax** in template files
- **Missing using statements** in templates
- **Incorrect file naming**: Template files must be named exactly `template.razor` or `cascading-template.razor`

## Getting Help

### Reporting bugs

Report bugs and issues in the [Blake repository](https://github.com/matt-goldman/blake/issues) on GitHub.

### Contributing

Want to contribute to Blake or this documentation? See the [Contributing](/pages/5%20contributing/) guide for details on:

- Creating plugins
- Improving documentation
- Submitting pull requests
- Development environment setup

### Community and Support

- **GitHub Discussions**: Use [Blake Discussions](https://github.com/matt-goldman/blake/discussions) for questions and community support
- **Documentation Issues**: Issues with this documentation can be reported in the [BlakeDocs repository](https://github.com/matt-goldman/BlakeDocs/issues)

:::note
**Blake's Simplicity Promise**
If you're finding Blake difficult to use or encountering complex configuration requirements, that's likely a bug in Blake itself. The goal is zero-configuration static site generation that just works.
:::
