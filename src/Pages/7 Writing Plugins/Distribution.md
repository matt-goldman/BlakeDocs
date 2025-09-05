---
title: 'Distribution'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Package and distribute Blake plugins via NuGet with automatic discovery and community sharing."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 6
category: "Writing Plugins"
---

:::summary
Blake plugins are distributed as NuGet packages with automatic discovery. Follow naming conventions, include proper documentation, and use semantic versioning to share your plugins with the Blake community.
:::

## Plugin Packaging and Distribution

### NuGet Distribution

To share your plugin with the Blake community:

1. **Configure package metadata** in your `.csproj`:

```xml
<PropertyGroup>
  <PackageId>BlakePlugin.MyAwesomePlugin</PackageId>
  <Version>1.0.0</Version>
  <Authors>Your Name</Authors>
  <Description>Adds awesome functionality to Blake sites</Description>
  <PackageTags>blake-plugin;static-site-generator;blazor</PackageTags>
  <PackageLicenseExpression>MIT</PackageLicenseExpression>
  <PackageProjectUrl>https://github.com/yourusername/BlakePlugin.MyAwesome</PackageProjectUrl>
  <RepositoryUrl>https://github.com/yourusername/BlakePlugin.MyAwesome</RepositoryUrl>
</PropertyGroup>
```

2. **Include documentation**:
   - README.md with usage examples
   - CHANGELOG.md for version history
   - Clear documentation of what the plugin does

3. **Build and publish**:

```bash
dotnet pack --configuration Release
dotnet nuget push *.nupkg --source nuget.org --api-key YOUR_API_KEY
```

### Plugin Discovery

Blake automatically discovers plugins using these conventions:

- **NuGet packages** named `BlakePlugin.*`
- **Project references** with `BlakePlugin.*` naming
- **Automatic scanning** for `IBlakePlugin` implementations

No manual registration required - just install and Blake will find it.

### Distribution Best Practices

**Package Naming:**
- Use the `BlakePlugin.` prefix for automatic discovery
- Choose descriptive names: `BlakePlugin.ReadTime`, `BlakePlugin.SeoOptimizer`
- Avoid generic names that might conflict

**Versioning:**
- Follow semantic versioning (SemVer)
- Major version for breaking changes
- Minor version for new features
- Patch version for bug fixes

**Documentation:**
- Include comprehensive README.md
- Provide usage examples
- Document configuration options
- List compatibility requirements

**Example README structure:**

```markdown
# BlakePlugin.MyAwesome

Brief description of what your plugin does.

## Installation

```bash
dotnet add package BlakePlugin.MyAwesome
```

## Usage

Your plugin works automatically after installation. Optional configuration:

```json
{
  "MyAwesome": {
    "enabled": true,
    "feature": "advanced"
  }
}
```

## Features

- Feature 1: Description
- Feature 2: Description

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| enabled | true | Enable/disable plugin |

## Compatibility

- Blake 1.0+
- .NET 9.0+

## License

MIT
```

### Multi-Targeting

Blake requires .NET 9, so multi-targeting is generally not necessary for Blake plugins:

```xml
<PropertyGroup>
  <TargetFramework>net9.0</TargetFramework>
</PropertyGroup>
```

### Including Assets

For plugins with static assets (CSS, JS, images), these are automatically handled by Blazor's static web asset system:

```xml
<ItemGroup>
  <Content Include="wwwroot\**\*.*" />
</ItemGroup>
```

### Community Guidelines

**Before Publishing:**
1. Test with multiple Blake sites
2. Verify no conflicts with existing plugins
3. Follow Blake philosophy (simple, transparent)
4. Include proper error handling

**Community Etiquette:**
- Use descriptive package descriptions
- Include source code repository links
- Respond to issues and feedback
- Keep dependencies minimal

## Plugin Registry

Consider submitting your plugin to the community registry:

1. Fork the Blake documentation repository
2. Add your plugin to the community plugins list
3. Include description, features, and usage example
4. Submit pull request for review

## Next Steps

- **[Testing](/pages/7%20writing%20plugins/testing)** - Thoroughly test before publishing
- **[Best Practices](/pages/7%20writing%20plugins/best-practices)** - Follow recommended patterns
- **[Examples](/pages/7%20writing%20plugins/examples)** - Study successful plugin examples