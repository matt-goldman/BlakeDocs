---
title: 'Getting Started'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Step-by-step guide to creating your first Blake plugin with project setup and basic implementation."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 3
category: "Writing Plugins"
---

:::summary
Creating a Blake plugin starts with setting up a .NET class library project, adding the Blake.BuildTools reference, and implementing the IBlakePlugin interface. This guide walks through creating a simple plugin that adds "last modified" timestamps to pages.
:::

## Creating Your First Plugin

### Project Setup

A Blake plugin is a .NET class library that references `Blake.BuildTools`:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <PackageId>BlakePlugin.MyAwesomePlugin</PackageId>
    <Version>1.0.0</Version>
    <Authors>Your Name</Authors>
    <Description>Adds awesome functionality to Blake sites</Description>
    <PackageTags>blake-plugin;static-site-generator</PackageTags>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Blake.BuildTools" Version="1.0.12" />
  </ItemGroup>
</Project>
```

### Basic Plugin Implementation

Here's a minimal plugin that adds a "last modified" timestamp to all pages:

```csharp
using Blake.BuildTools;
using Microsoft.Extensions.Logging;

public class LastModifiedPlugin : IBlakePlugin
{
    public string Name => "LastModified";
    public string Version => "1.0.0";

    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Setup tasks before processing begins
        logger?.LogInformation("Adding last modified timestamps...");

        // Process each page to add timestamp metadata
        foreach (var page in context.Pages)
        {
            var fileInfo = new FileInfo(page.SourcePath);
            page.Metadata["lastModified"] = fileInfo.LastWriteTime.ToString("yyyy-MM-dd");
        }
    }

    public async Task AfterBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        // Optional: additional processing after content generation
        logger?.LogInformation($"Processed {context.GeneratedContent.Count} pages with timestamps");
    }
}
```

### Local Development Workflow

For development and testing:

```bash
# Create plugin project
dotnet new classlib -n MyBlakePlugin
cd MyBlakePlugin

# Add Blake.BuildTools reference
dotnet add package Blake.BuildTools

# Build plugin
dotnet build

# Reference from your Blake site
dotnet add reference ../MyBlakePlugin/MyBlakePlugin.csproj

# Run blake bake to test your plugin
blake bake
```

## Using Your Plugin in Templates

Once your plugin adds metadata, you can access it in your templates:

```razor
@* Access the lastModified metadata added by your plugin *@
<div class="page-metadata">
    <p>Last modified: @GetMetadata("lastModified")</p>
</div>

@code {
    private string GetMetadata(string key)
    {
        var currentPage = GeneratedContentIndex.GetPages()
            .FirstOrDefault(p => p.Slug == /* current page slug */);
        
        return currentPage?.Metadata.GetValueOrDefault(key, "Unknown") ?? "Unknown";
    }
}
```

## Common Plugin Tasks

### Adding Metadata to Pages

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    foreach (var page in context.Pages)
    {
        // Add custom metadata
        page.Metadata["wordCount"] = CountWords(page.Content);
        page.Metadata["readingTime"] = EstimateReadingTime(page.Content);
    }
}
```

### Extending Markdig Pipeline

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Add custom Markdig extension
    context.MarkdigPipelineBuilder.Extensions.Add(new MyCustomExtension());
}
```

## Next Steps

- **[Advanced Patterns](/pages/7%20writing%20plugins/advanced-patterns)** - Learn sophisticated plugin techniques
- **[Configuration](/pages/7%20writing%20plugins/configuration)** - Add configuration to your plugins
- **[Testing](/pages/7%20writing%20plugins/testing)** - Test your plugin thoroughly
- **[Distribution](/pages/7%20writing%20plugins/distribution)** - Package and share your plugin