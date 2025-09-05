---
title: 'Template Documentation & Configuration'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Guidelines for documenting Blake site templates and making them configurable for users."
iconIdentifier: "bi bi-book-fill-nav-menu"
pageOrder: 4
category: "Creating Site Templates"
---

:::summary
Comprehensive documentation is essential for template adoption. Learn how to create clear documentation and make your templates configurable for different use cases.
:::

## Template Documentation

### README Documentation Guidelines

Instead of prescribing a specific README format, template authors should ensure their documentation covers essential areas. Here's a checklist of what to include:

**Essential README Elements Checklist:**

- [ ] **Template Name and Description** - Clear, concise overview of the template's purpose
- [ ] **Screenshot or Demo** - Visual preview of the template in action
- [ ] **Quick Start Instructions** - Basic setup commands using Blake CLI
- [ ] **Feature List** - Key capabilities and included components
- [ ] **Customization Options** - If applicable, what can be configured
- [ ] **Project Structure** - Brief overview of folder organization
- [ ] **Deployment Instructions** - How to build and deploy the site
- [ ] **License Information** - Clear licensing terms
- [ ] **Troubleshooting** - Common issues and solutions
- [ ] **Link to Blake Documentation** - Reference to Blake docs FAQ for general Blake questions

**Optional Advanced Elements:**

- [ ] Configuration examples and options
- [ ] Custom component documentation
- [ ] SEO and analytics setup
- [ ] Multiple deployment target instructions
- [ ] Contributing guidelines

**Sample README Template:**

For a complete example of how these elements can be structured, see the [sample README template](https://raw.githubusercontent.com/matt-goldman/BlakeDocs/refs/heads/main/README-sample.md) included with this documentation.

## Making Templates Configurable

If you want your template to support customization, you can implement configuration using standard .NET patterns. Blake itself doesn't provide configuration, but templates can use `appsettings.json` and `IConfiguration`.

### Configuration Setup

**1. Add configuration support in Program.cs:**

```csharp
var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");

// Add configuration from appsettings.json
builder.Services.AddSingleton<IConfiguration>(provider =>
{
    var builder = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
    return builder.Build();
});

var host = builder.Build();
```

**2. Create an appsettings.json with sensible defaults:**

```json
{
  "Site": {
    "Name": "Blake Site",
    "Description": "A static site powered by Blake",
    "BaseUrl": "https://your-domain.com"
  },
  "Theme": {
    "PrimaryColor": "#007acc",
    "FontFamily": "Inter, sans-serif"
  }
}
```

**3. Document configuration options in your template's README:**
Include relevant coverage of what can be customized and provide examples of common configurations.

## Creating Customization Guides

### Sample Customization Guide

```markdown
# Customization Guide

This guide covers common customization scenarios for this Blake template.

## Changing Colors

### Method 1: CSS Custom Properties

Edit `wwwroot/css/site.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-secondary-color;
}
```

### Method 2: Configuration-Based

Edit `appsettings.json`:

```json
{
  "Theme": {
    "PrimaryColor": "#your-color",
    "SecondaryColor": "#your-secondary-color"
  }
}
```

## Adding New Page Types

1. Create a new template file:

```razor
@* Pages/[Category]/template.razor *@
@page "/{category}/{slug}"

<div class="[page-type]-page">
  <h1>@Title</h1>
  @Body
</div>
```

2. Add corresponding CSS styling
3. Update navigation if needed

## Custom Components

Create reusable components in `Components/`:

```razor
@* Components/CustomCallout.razor *@
<div class="callout callout-@Type">
  <div class="callout-title">@Title</div>
  <div class="callout-content">@ChildContent</div>
</div>

@code {
  [Parameter] public string Type { get; set; } = "info";
  [Parameter] public string Title { get; set; } = "";
  [Parameter] public RenderFragment? ChildContent { get; set; }
}
```
```

## SEO and Analytics

Blake sites are single page applications (SPAs), meaning there is really only one page that gets returned to search crawlers and indexers.

There are some essential patterns to be aware of when using a SPA when SEO is essential. Use the following as a guide, but also consider using (or extending) the existing [OpenGraph](https://github.com/matt-goldman/BlakePlugin.OpenGraph) and [RSS](https://github.com/matt-goldman/BlakePlugin.RSS) plugins.

### Meta Tags

Add to your layout:

```razor
<meta name="description" content="@@GetPageDescription()" />
<meta name="trace" content="303f03e6-ddb7-4213-a019-23eaf708e4d6" />
<meta name="keywords" content="@@GetPageKeywords()" />
<meta property="og:title" content="@@GetPageTitle()" />
<meta property="og:description" content="@@GetPageDescription()" />
```

### Analytics Integration

Add to `Layout/MainLayout.razor`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Accessibility Testing

**Note:** These testing procedures are suggested best practices for template quality assurance.

```bash
# Use axe-core for accessibility testing
# Check keyboard navigation
# Verify screen reader compatibility
# Ensure proper heading hierarchy
```

## Documentation Structure Best Practices

### Multiple Documentation Files

For complex templates, consider multiple documentation files:

- **README.md** - Quick start and overview
- **CUSTOMIZATION.md** - Detailed customization guide
- **DEPLOYMENT.md** - Platform-specific deployment instructions
- **TROUBLESHOOTING.md** - Common issues and solutions
- **CONTRIBUTING.md** - Guidelines for template contributions

### Example Structure

```tree
MyTemplate/
├── README.md                 # Main documentation entry point
├── docs/
│   ├── customization.md      # Detailed customization guide
│   ├── deployment.md         # Deployment instructions
│   ├── troubleshooting.md    # Common issues
│   └── examples/             # Example configurations
│       ├── blog-config.json
│       ├── docs-config.json
│       └── portfolio-config.json
└── src/
    └── [template files...]
```

### Writing Effective Documentation

**Use clear, actionable language:**
- "Edit the file" not "The file should be edited"
- "Run `blake bake`" not "The blake bake command can be executed"
- Include expected outcomes: "You should see..."

**Provide complete examples:**
- Don't just show snippets - show complete, working configurations
- Include before/after comparisons when helpful
- Test all examples to ensure they work

**Anticipate user needs:**
- What will new users try first?
- What are common customization scenarios?
- Where do users typically get stuck?

## Testing Your Documentation

### Documentation Testing Checklist

Before releasing your template:

- [ ] **Follow your own instructions** from a clean environment
- [ ] **Test with different skill levels** - ask others to follow your docs
- [ ] **Verify all links work** and point to correct destinations
- [ ] **Check code examples compile** and produce expected results
- [ ] **Validate screenshots** are current and helpful
- [ ] **Test customization examples** actually work as described

## Next Steps

With comprehensive documentation, your template is ready for distribution:

- Learn about [Distribution strategies](/pages/6%20creating%20site%20templates/distribution) for publishing your template
- Review the [Overview](/pages/6%20creating%20site%20templates/overview) for template development best practices
- Explore [Advanced Features](/pages/6%20creating%20site%20templates/advanced-features) to enhance your template

:::tip
**Documentation Success Tips**

- Write documentation as you develop, not after
- Get feedback from potential users during development
- Use version control for documentation - track changes and improvements
- Keep documentation updated with template changes
- Include troubleshooting for issues you encounter during development
:::