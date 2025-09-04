---
title: 'Creating Site Templates'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Complete guide to creating and sharing Blake site templates for the community."
iconIdentifier: "bi bi-file-earmark-text-fill-nav-menu"
pageOrder: 5
category: "Contributing"
---

:::summary
Blake site templates provide starter projects for common use cases. They combine page templates, layouts, styling, and sample content to help users quickly create professional sites. This guide covers creating, testing, and distributing templates for the Blake community.
:::

## Quick Navigation

**Getting Started:**
- [Understanding Site Templates](#understanding-blake-site-templates)
- [Template Categories](#template-categories)
- [Creating Your First Template](#creating-your-first-template)

**Development:**
- [Essential Components](#essential-template-components)
- [Advanced Features](#advanced-template-features)
- [Making Templates Configurable](#making-templates-configurable)

**Documentation & Distribution:**
- [Template Documentation](#template-documentation)
- [Distributing Your Template](#distributing-your-template)
- [Template Maintenance](#template-maintenance)

**Reference:**
- [Best Practices Summary](#best-practices-summary)
- [Next Steps](#next-steps)

---

## Understanding Blake Site Templates

Site templates in Blake are complete project scaffolds that provide:

- **Project structure** - Organized folders and configuration
- **Page templates** - Razor components for rendering content
- **Styling and layout** - CSS, components, and design systems
- **Sample content** - Example pages demonstrating functionality
- **Documentation** - Setup and customization instructions

Unlike page templates (which render individual Markdown files), site templates are full Blazor projects that users can clone and customize.

---

## Template Categories

### Documentation Sites

**Best for:** Technical documentation, API references, user guides
**Features:** Table of contents, search, cross-references, code highlighting
**Examples:** Developer documentation, product manuals, knowledge bases

**Key requirements:**

- Clear navigation and information architecture
- Search functionality
- Responsive design for mobile/tablet reading
- Code syntax highlighting
- Cross-reference support

### Personal Blogs

**Best for:** Individual bloggers, personal websites, portfolios
**Features:** Post listings, archives, tags, RSS feeds
**Examples:** Developer blogs, creative portfolios, personal sites

**Key requirements:**

- Chronological post organization
- Tag and category systems
- Archive pages
- Social media integration
- RSS/Atom feed generation

### Corporate/Marketing Sites

**Best for:** Company websites, product pages, landing pages
**Features:** Hero sections, product showcases, contact forms
**Examples:** Product marketing sites, company homepages, landing pages

**Key requirements:**

- Professional design and branding
- SEO optimization
- Contact and lead generation forms
- Performance optimization
- Analytics integration

### Portfolio Sites

**Best for:** Designers, developers, creatives showcasing work
**Features:** Project galleries, case studies, contact information
**Examples:** Design portfolios, developer showcases, creative work

**Key requirements:**

- Visual project presentation
- Case study layouts
- Image optimization
- Mobile-first responsive design
- Contact and networking features

---

## Creating Your First Template

### Initial Setup

**Start with Blake CLI:**

```bash
# Create new Blake site
mkdir MyTemplate
cd MyTemplate

# Blake needs a Blazor WASM project first
dotnet new blazorwasm

# Initialize with basic structure
blake init

# Or start from existing template
blake init --template docs
```

**Project structure planning:**

```tree
MyTemplate/
├── src/
│   ├── Pages/               # Content organization
│   |   └── SamplePage.md    # Example content for users
│   |   └── template.razor   # Default page template
│   ├── Components/          # Reusable Blazor components
│   ├── Layout/              # Site layout components
│   ├── wwwroot/             # Static assets
│   └── Program.cs           # App configuration
├── README.md                # Setup and usage instructions
├── CUSTOMIZATION.md         # How to modify the template
└── LICENSE                  # License information
```

### Essential Template Components

In addition to the standard components required for a Blazor sie (e.g. `MainLayout`, navigation, etc.), there are some critical Blake-specific components you should include.

At a minimum, you must include a default page template. Blake automatically adds the `@@page` directive, so templates focus on content.

Minimal example:

```razor
@Body
```

Hypothetically, if enough of your site's layout is defined in `MainLayout` (or equivalent), the above may be sufficient. Realistically, you will probably want to create a formatted template.

```razor
@* template.razor *@
@using Blake.Types

<article class="post">
    <header class="post-header">
        <h1 class="post-title">@Title</h1>
        @if (CurrentPage.Date.HasValue)
        {
            <div class="post-meta">
                <time datetime="@CurrentPage.Date.Value.ToString("yyyy-MM-dd")">
                    @Published
                </time>
                @if (Tags?.Any() == true)
                {
                    <div class="post-tags">
                        @foreach (var tag in Tags)
                        {
                            <span class="tag">@tag</span>
                        }
                    </div>
                }
            </div>
        }
    </header>

    <div class="post-content">
        @Body
    </div>

    @if (ShowRelatedPosts())
    {
        <aside class="related-posts">
            <h3>Related Posts</h3>
            <RelatedPosts CurrentPage="@CurrentPage" />
        </aside>
    }
</article>

@code {
    private bool ShowRelatedPosts()
    {
        return Tags?.Any() == true &&
               GeneratedContentIndex.GetPages().Count(p =>
                   p.Tags?.Any(t => Tags.Contains(t)) == true) > 1;
    }

    private PageModel? CurrentPage => GeneratedContentIndex.GetPages()
        .FirstOrDefault(p => p.Slug.Equals(Slug, StringComparison.OrdinalIgnoreCase));
}
```

### Template Configuration

:::note
Blake doesn't have built-in configuration. If template authors want to make their templates configurable, this is how they should implement it using standard .NET configuration patterns.
:::

#### appsettings.json

```json
{
  "Site": {
    "Name": "My Blake Site",
    "Description": "A description of your site",
    "Author": "Your Name",
    "BaseUrl": "https://yoursite.com",
    "Language": "en-US"
  },
  "Theme": {
    "PrimaryColor": "#007acc",
    "SecondaryColor": "#f8f9fa",
    "FontFamily": "Inter, sans-serif"
  },
  "Features": {
    "EnableSearch": true,
    "EnableRss": true,
    "EnableSitemap": true,
    "ShowReadingTime": true
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

#### Project File Configuration

**Note:** The package references and UI libraries shown are illustrative examples. Template authors can choose any libraries that fit their design goals.

It's important to ensure that the generated files are included in builds, and equally that template files are excluded. The following example shows how to handle this.

```xml
<Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>

    <!-- Template metadata -->
    <PackageId>BlakeTemplate.MyTemplate</PackageId>
    <Title>My Blake Template</Title>
    <Description>A beautiful Blake template for [use case]</Description>
    <Authors>Your Name</Authors>
    <PackageTags>blake-template;blazor;static-site</PackageTags>
  </PropertyGroup>

  <ItemGroup>
    <!-- Blake plugins for common functionality -->
    <PackageReference Include="BlakePlugin.DocsRenderer" Version="1.0.9" />
    <PackageReference Include="BlakePlugin.ReadTime" Version="1.0.0" />

    <!-- UI libraries -->
    <PackageReference Include="Blazicons.FontAwesome" Version="2.4.31" />

    <!-- Blazor WebAssembly -->
    <PackageReference Include="Microsoft.AspNetCore.Components.WebAssembly" Version="9.0.8" />
    <PackageReference Include="Microsoft.AspNetCore.Components.WebAssembly.DevServer" Version="9.0.8" PrivateAssets="all" />
  </ItemGroup>

  <!-- Template-specific MSBuild targets -->
  <Target Name="PreBake" BeforeTargets="Build">
    <Exec Command="blake bake" Condition="Exists('blake')" />
  </Target>

  <!-- ALWAYS include the following in site templates -->
  <ItemGroup>
    <!-- Include generated content -->
    <Content Include=".generated/**/*.razor" />
    <Compile Include=".generated/**/*.cs" />

    <!-- Exclude template files from build -->
    <Content Remove="**/template.razor" />
    <Content Remove="**/cascading-template.razor" />
    <None Include="**/template.razor" />
    <None Include="**/cascading-template.razor" />
  </ItemGroup>
</Project>
```

---

## Advanced Template Features

### Customizable Theming

Template styling is completely template-dependent. Authors can choose Bootstrap, Tailwind, custom CSS, or any approach that fits their design goals. Consider Blazor CSS isolation for component-specific styling.

#### CSS Custom Properties

```css
/* wwwroot/css/site.css */
:root {
  /* Colors from configuration */
  --primary-color: #007acc;
  --secondary-color: #f8f9fa;
  --text-color: #333;
  --background-color: #fff;

  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

/* Component styles using custom properties */
.navbar {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
}

.post-content {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color);
}
```

#### Configuration-Based Theming

This is an illustrative example of dynamic theming. Template authors should lean into the Blazor ecosystem and may prefer existing UI frameworks (MudBlazor, Lumex, etc.) or NuGet packages with Razor components rather than building custom solutions.

```razor
@* Components/ThemeProvider.razor *@
@inject IConfiguration Configuration
@inject IJSRuntime JSRuntime

@code {
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await ApplyThemeAsync();
        }
    }

    private async Task ApplyThemeAsync()
    {
        var theme = Configuration.GetSection("Theme");
        var cssVariables = new Dictionary<string, string>
        {
            ["--primary-color"] = theme["PrimaryColor"] ?? "#007acc",
            ["--secondary-color"] = theme["SecondaryColor"] ?? "#f8f9fa",
            ["--font-family"] = theme["FontFamily"] ?? "Inter, sans-serif"
        };

        foreach (var variable in cssVariables)
        {
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty",
                variable.Key, variable.Value);
        }
    }
}
```

### Search Integration

**Blake provides the `GeneratedContentIndex` that exposes title, description, tags, and metadata for simple search functionality. However, the actual text/content of generated pages is not searchable.**

```razor
@* Components/SiteSearch.razor *@
@using Blake.Types

<div class="search-container">
    <input @bind="searchTerm" @onkeyup="OnSearchInput"
           class="search-input" placeholder="Search..." />

    @if (showResults && searchResults.Any())
    {
        <div class="search-results">
            @foreach (var result in searchResults.Take(10))
            {
                <div class="search-result">
                    <a href="@result.Url" class="result-title">@result.Title</a>
                    <p class="result-excerpt">@result.Excerpt</p>
                </div>
            }
        </div>
    }
</div>

@code {
    private string searchTerm = string.Empty;
    private bool showResults = false;
    private List<SearchResult> searchResults = new();

    private async Task OnSearchInput(KeyboardEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            showResults = false;
            return;
        }

        searchResults = SearchPages(searchTerm);
        showResults = searchResults.Any();
        StateHasChanged();
    }

    private List<SearchResult> SearchPages(string term)
    {
        return GeneratedContentIndex.GetPages()
            .Where(p => !p.IsDraft)
            .Where(p => p.Title.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                       p.Content.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                       p.Tags.Any(t => t.Contains(term, StringComparison.OrdinalIgnoreCase)))
            .Select(p => new SearchResult
            {
                Title = p.Title,
                Url = $"/{p.Slug}",
                Excerpt = ExtractExcerpt(p.Content, term)
            })
            .OrderByDescending(r => CalculateRelevance(r, term))
            .ToList();
    }

    private class SearchResult
    {
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
    }
}
```

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

---

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

### Customization Guide

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

## SEO and Analytics

Blake sites are single page applications (SPAs), meaning there is really only one page that gets returned to search crawlers and indexers.

There are some essential patterns to be aware of when using a SPA when SEO is essential. Use the following as a guide, but also consider using (or extending) the existing [OpenGraph](https://github.com/matt-goldman/BlakePlugin.OpenGraph) and [RSS](https://github.com/matt-goldman/BlakePlugin.RSS) plugins.

### Meta Tags

Add to your layout:

```razor
<meta name="description" content="@GetPageDescription()" />
<meta name="trace" content="303f03e6-ddb7-4213-a019-23eaf708e4d6" />
<meta name="keywords" content="@GetPageKeywords()" />
<meta property="og:title" content="@GetPageTitle()" />
<meta property="og:description" content="@GetPageDescription()" />
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

---

## Distributing Your Template

### Package Preparation

1. **Clean up the template:**
   - Remove personal content
   - Add comprehensive sample content
   - Test from clean installation

2. **Documentation:**
   - Complete README with screenshots
   - Customization guide
   - Troubleshooting section

3. **Version control:**
   - Tag releases appropriately
   - Maintain changelog
   - Use semantic versioning

### Publishing Options

#### NuGet Package

```xml
<!-- Package metadata in .csproj -->
<PropertyGroup>
  <PackageId>BlakeTemplate.YourTemplate</PackageId>
  <Version>1.0.0</Version>
  <Authors>Your Name</Authors>
  <Description>A beautiful Blake template for [use case]</Description>
  <PackageTags>blake-template;blazor;static-site</PackageTags>
  <PackageLicenseExpression>MIT</PackageLicenseExpression>
  <PackageProjectUrl>https://github.com/yourusername/blake-template-name</PackageProjectUrl>
</PropertyGroup>
```

```bash
# Build and publish
dotnet pack
dotnet nuget push *.nupkg --source nuget.org --api-key YOUR_KEY
```

#### GitHub Template Repository

1. Create repository with template code
2. Add "Use this template" button
3. Tag with `blake-template` topic
4. Include comprehensive documentation

#### Blake Template Registry

Submit your template to Blake's official template registry (when available).

## Template Maintenance

### Regular Updates

- **Keep dependencies current** - Update Blake plugins and Blazor packages
- **Security updates** - Monitor for security advisories
- **Bug fixes** - Address issues reported by users
- **Feature enhancements** - Add new capabilities based on feedback

### Community Support

- **Respond to issues** promptly and helpfully
- **Accept pull requests** that improve the template
- **Provide documentation** for common customizations
- **Share usage examples** and showcase sites

---

## Best Practices Summary

### Design Principles

- **Mobile-first responsive design**
- **Performance optimization** - fast loading times
- **Accessibility compliance** - WCAG guidelines
- **SEO-friendly structure** - proper meta tags and semantic HTML
- **Cross-browser compatibility**

### Code Quality

- **Clean, maintainable code**
- **Comprehensive documentation**
- **Error handling and fallbacks**
- **Consistent naming conventions**
- **Modular component structure**

### User Experience

- **Intuitive navigation**
- **Clear content hierarchy**
- **Fast search functionality**
- **Smooth animations and transitions**
- **Helpful error messages**

## Next Steps

Ready to create your Blake template?

1. **Choose your template type** and target audience
2. **Study existing templates** for inspiration and patterns
3. **Start with basic structure** and build incrementally
4. **Test thoroughly** across devices and browsers
5. **Document comprehensively** for future users
6. **Share with the community** and gather feedback

**Related Contributing Guides:**
- **[How to Test](/pages/5%20contributing/how-to-test)** - Testing strategies for templates
- **[Code Style Guidelines](/pages/5%20contributing/code-style)** - Follow Blake's conventions
- **[Writing Plugins](/pages/5%20contributing/writing-plugins)** - If your template needs custom functionality

:::note
**Template Development Questions?**

Need help creating your Blake template?

- Check existing templates for reference patterns
- Ask in GitHub discussions for architectural advice
- Review the Blake documentation for best practices
- Test with real users to validate your approach

Great templates make Blake more powerful for everyone!
:::
