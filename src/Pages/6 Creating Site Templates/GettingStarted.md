---
title: 'Getting Started with Site Templates'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Step-by-step guide to creating your first Blake site template, from initial setup to essential components."
iconIdentifier: "bi bi-play-fill-nav-menu"
pageOrder: 2
category: "Creating Site Templates"
---

:::info
Learn how to create your first Blake site template from scratch. This guide covers the initial setup, essential components, and basic configuration needed for a functional template.
:::

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

In addition to the standard components required for a Blazor site (e.g. `MainLayout`, navigation, etc.), there are some critical Blake-specific components you should include.

At a minimum, you must include a default page template. Blake automatically adds the `@@page` directive, so templates focus on content.

**Minimal example:**

```razor
@Body
```

Hypothetically, if enough of your site's layout is defined in `MainLayout` (or equivalent), the above may be sufficient. Realistically, you will probably want to create a formatted template.

**Enhanced page template example:**

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

## Testing Your Template

Once you have the basic structure in place:

1. **Run Blake to generate content:**
   ```bash
   blake bake
   ```

2. **Build and test locally:**
   ```bash
   dotnet build
   dotnet run
   ```

3. **Add sample content** that demonstrates your template's features

4. **Test responsiveness** across different screen sizes

5. **Validate accessibility** using browser dev tools

## Next Steps

Now that you have a basic template:

- **Add [Advanced Features](/pages/6%20creating%20site%20templates/advanced-features)** like theming and search
- **Create comprehensive [Documentation](/pages/6%20creating%20site%20templates/documentation)** for users
- **Prepare for [Distribution](/pages/6%20creating%20site%20templates/distribution)** to the community

:::tip
**Template Development Tips**

- Start simple and add complexity gradually
- Test with real content, not just placeholder text
- Consider your target audience's technical skill level
- Document every customization option clearly
- Use existing Blake plugins when possible instead of reinventing functionality
:::