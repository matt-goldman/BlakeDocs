---
title: Code Style & Conventions
description: Guidelines for formatting, naming, and contributing code to Blake following .NET best practices.
category: "Contributing"
iconIdentifier: "bi bi-code-slash-nav-menu"
pageOrder: 7
---

:::summary
Blake follows standard .NET coding conventions with specific guidelines for naming, formatting, nullability, and architecture patterns. These standards ensure code consistency, maintainability, and a smooth contribution experience for developers.
:::

Blake follows C# and .NET style guides. This page reinforces some of the core principles that are relevant to Blake, and details any variations specific to this project.

## General Philosophy

Blake's code style reflects its core philosophy of simplicity and transparency:

- **Favour explicitness over cleverness** - Code should be easy to understand
- **Consistency over personal preference** - Follow established patterns
- **Readability first** - Optimize for the next developer who reads the code
- **Standard .NET conventions** - Use familiar patterns .NET developers expect
- **Self-documenting code** - Good names reduce the need for comments

## Naming Conventions

### Files and Folders

**Follow .NET project conventions:**

- **Pascal case** for folder names: `BuildTools`, `MarkdownParsers`
- **Pascal case** for file names: `BlakeContext.cs`, `IBlakePlugin.cs`
- **Descriptive names** that indicate purpose: `ContentLoader.cs` not `Loader.cs`
- **Namespace alignment** - folder structure should match namespace structure

**Blake-specific patterns:**

- **Plugin projects**: `BlakePlugin.PluginName`
- **Template projects**: `BlakeTemplate.TemplateName`
- **Example projects**: `Blake.Samples.ExampleName`

### Classes and Interfaces

**Standard .NET conventions:**

```csharp
// Interfaces start with I
public interface IBlakePlugin
{
    string Name { get; }
    string Version { get; }
}

// Classes use Pascal case
public class MarkdownRenderer : IMarkdownRenderer
{
    // Public members use Pascal case
    public string ProcessContent(string markdown) { }
    
    // Private fields use underscore prefix
    private readonly ILogger _logger;
    
    // Private methods use camel case
    private void processInternal() { }
}
```

**Blake-specific patterns:**

- **Plugin classes**: `[PluginName]Plugin` (e.g., `ReadTimePlugin`)
- **Context classes**: `[Area]Context` (e.g., `BlakeContext`, `BuildContext`)
- **Builder classes**: `[Target]Builder` (e.g., `MarkdigPipelineBuilder`)

### Methods and Variables

**Descriptive and action-oriented:**

```csharp
// Good - describes what it does
public async Task<List<PageModel>> LoadPagesFromDirectoryAsync(string path)
{
    var markdownFiles = Directory.GetFiles(path, "*.md");
    var pages = new List<PageModel>();
    
    foreach (var filePath in markdownFiles)
    {
        var content = await File.ReadAllTextAsync(filePath);
        var page = ParseMarkdownPage(content, filePath);
        pages.Add(page);
    }
    
    return pages;
}

// Avoid - unclear purpose
public async Task<List<PageModel>> Process(string p) { }
```

**Variable naming guidelines:**

- Use **meaningful names**: `markdownContent` not `content`
- **Avoid abbreviations**: `pageDirectory` not `pageDir`
- **Use full words**: `configurationPath` not `configPath`
- **Boolean variables**: Use `is`, `has`, `can` prefixes: `isEnabled`, `hasContent`

### Constants and Configuration

Blake breaks with .NET conventions on the naming of constants:

```csharp

// .NET conventions
// Public constants - Pascal case:
// public const string DefaultTemplateFilename

// Private constants - Camel case with underscore:
// _configSectionName

// Blake conventions:

// Public and private constants - screaming snake case
public const string DEFAULT_TEMPLATE_FILENAME = "template.razor";
public const int DEFAULT_WORDS_PER_MINUTE = 200;

private const string CONFIG_SECTION_NAME = "Blake";
private const int MAX_RETRY_ATTEMPTS = 3;
```

Always use descriptive names:

```csharp
// Configuration keys - descriptive
public static class ConfigurationKeys
{
    public const string PluginsSection = "Blake:Plugins";
    public const string BuildOutputPath = "Blake:Build:OutputPath";
    public const string EnableDraftPages = "Blake:Content:EnableDrafts";
}
```

## Logging and error handling

Don't use exceptions for control flow - see [this post](https://gordonbeeming.com/blog/2025-09-03/the-double-edged-sword-of-conveniently-named-exceptions) by [Gordon Beeming](https://gordonbeeming.com/about) for a great write-up on why.

`ILogger` is passed through the whole pipeline and should be used to log meaningful information. Don't use `Console.WriteLine` - it's possible to use `Blake.BuildTools` or the Markdown parser independently of the CLI, so use of `ILogger` is critical.

```csharp
// Use structured logging
_logger.LogInformation("Processing {PageCount} pages from {Directory}", 
    pages.Count, directory);

// Different log levels appropriately
_logger.LogDebug("Starting page processing");
_logger.LogInformation("Successfully processed page: {PageTitle}", page.Title);
_logger.LogWarning("Page missing description: {PagePath}", page.SourcePath);
_logger.LogError(ex, "Failed to process page: {PagePath}", page.SourcePath);
```

### Record Types and Immutability

**Use records for data transfer objects:**

```csharp
// Immutable page model
public record PageModel(
    string Title,
    string SourcePath,
    string Content)
{
    // Mutable collections initialized as empty
    public Dictionary<string, string> Metadata { get; init; } = new();
    public List<string> Tags { get; init; } = new();
    
    // Computed properties
    public string Slug => Path.GetFileNameWithoutExtension(SourcePath).ToLowerInvariant();
}

// Use with expressions for modifications
var updatedPage = existingPage with 
{ 
    Content = processedContent,
    Metadata = existingPage.Metadata.Union(newMetadata).ToDictionary(x => x.Key, x => x.Value)
};
```


## Pre-commit Checklist

Before submitting code:

- [ ] **Code compiles** without warnings
- [ ] **Tests pass** - both unit and integration tests
- [ ] **Code formatted** using `dotnet format`
- [ ] **Nullable warnings resolved** - no null reference warnings
- [ ] **XML documentation** added for public APIs
- [ ] **Performance considered** - no obvious inefficiencies
- [ ] **Error handling** appropriate for the scenario
- [ ] **Naming consistent** with Blake conventions
- [ ] **No deprecated patterns** used

## Next Steps

- **Review existing code** to see these patterns in practice
- **Set up your editor** with Blake's EditorConfig settings
- **Run the analyzers** on your contributions
- **Ask questions** if any guidelines are unclear

For specific testing guidance, see [How to Test Your Changes](/pages/5%20contributing/how-to-test).

:::note
**Style Questions?**

When in doubt:

1. **Follow existing patterns** in the Blake codebase
2. **Use standard .NET conventions** for anything not covered here
3. **Ask in pull request reviews** - maintainers will provide guidance
4. **Prioritize readability** - code is read more than it's written

:::
