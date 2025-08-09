---
title: Code Style & Conventions
description: Guidelines for formatting, naming, and contributing code to Blake following .NET best practices.
category: "Contributing"
iconIdentifier: "bi bi-code-slash-nav-menu"
pageOrder: 2
---

:::info
**Summary**
Blake follows standard .NET coding conventions with specific guidelines for naming, formatting, nullability, and architecture patterns. These standards ensure code consistency, maintainability, and a smooth contribution experience for developers.
:::

## General Philosophy

Blake's code style reflects its core philosophy of simplicity and transparency:

- **Favor explicitness over cleverness** - Code should be easy to understand
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

```csharp
// Public constants - Pascal case
public const string DEFAULT_TEMPLATE_FILENAME = "template.razor";
public const int DEFAULT_WORDS_PER_MINUTE = 200;

// Private constants - Pascal case with underscore
private const string CONFIG_SECTION_NAME = "Blake";
private const int MAX_RETRY_ATTEMPTS = 3;

// Configuration keys - descriptive
public static class ConfigurationKeys
{
    public const string PluginsSection = "Blake:Plugins";
    public const string BuildOutputPath = "Blake:Build:OutputPath";
    public const string EnableDraftPages = "Blake:Content:EnableDrafts";
}
```

## Formatting and Style

### Code Formatting

**Use EditorConfig settings:**
```ini
# .editorconfig
root = true

[*.cs]
indent_style = space
indent_size = 4
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

# .NET formatting rules
dotnet_sort_system_directives_first = true
dotnet_separate_import_directive_groups = false
```

**Method formatting:**
```csharp
// Good - clear parameter separation
public async Task<ProcessingResult> ProcessContentAsync(
    string markdownContent, 
    PageMetadata metadata, 
    BlakeContext context,
    CancellationToken cancellationToken = default)
{
    // Implementation
}

// Good - single line when short
public string GetFileExtension(string path) => Path.GetExtension(path);
```

### Whitespace and Braces

**Consistent brace style:**
```csharp
// Use Allman style braces
if (condition)
{
    DoSomething();
}
else
{
    DoSomethingElse();
}

// Exception: property getters/setters can be compact
public string Name { get; set; }
public string ProcessedContent => _content ?? ProcessRawContent();
```

**Whitespace guidelines:**
- **One blank line** between methods
- **Two blank lines** between classes in the same file
- **No blank lines** at the start or end of method bodies
- **Space after commas** in parameter lists
- **Space around operators**: `a + b`, `x == y`

### Using Statements and Imports

**Organize using statements:**
```csharp
// System namespaces first
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

// Blank line before third-party
using Markdig;
using Microsoft.Extensions.Logging;

// Blank line before Blake namespaces
using Blake.BuildTools;
using Blake.Types;
```

**Prefer explicit using over global:**
- Use `global using` sparingly - only for truly universal imports
- Explicit imports make dependencies clear
- Avoid `using static` except for very common scenarios

## Nullability and Error Handling

### Nullable Reference Types

Blake uses nullable reference types extensively:

```csharp
// Enable nullable reference types in project files
<PropertyGroup>
    <Nullable>enable</Nullable>
</PropertyGroup>

// Be explicit about nullability
public class PageProcessor
{
    // Non-null by default
    public string Title { get; set; } = string.Empty;
    
    // Explicitly nullable when appropriate
    public string? Description { get; set; }
    
    // Nullable parameters when optional
    public void ProcessPage(PageModel page, ILogger? logger = null)
    {
        // Null-conditional operators
        logger?.LogInformation($"Processing page: {page.Title}");
        
        // Null coalescing
        var description = page.Description ?? "No description provided";
    }
}
```

### Error Handling Patterns

**Use appropriate exception types:**
```csharp
// Blake-specific exceptions
public class BlakeConfigurationException : Exception
{
    public BlakeConfigurationException(string message) : base(message) { }
    public BlakeConfigurationException(string message, Exception innerException) 
        : base(message, innerException) { }
}

// Method with proper error handling
public async Task<PageModel> LoadPageAsync(string filePath)
{
    if (string.IsNullOrWhiteSpace(filePath))
        throw new ArgumentException("File path cannot be null or empty", nameof(filePath));
    
    if (!File.Exists(filePath))
        throw new FileNotFoundException($"Page file not found: {filePath}", filePath);
    
    try
    {
        var content = await File.ReadAllTextAsync(filePath);
        return ParsePage(content, filePath);
    }
    catch (IOException ex)
    {
        throw new BlakeContentException($"Failed to read page file: {filePath}", ex);
    }
}
```

**Logging guidelines:**
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

## Architecture Patterns

### Dependency Injection

**Follow .NET DI patterns:**
```csharp
// Service registration
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBlakeBuildTools(this IServiceCollection services)
    {
        services.AddSingleton<IMarkdownProcessor, MarkdownProcessor>();
        services.AddScoped<IPageBuilder, PageBuilder>();
        services.AddTransient<IContentValidator, ContentValidator>();
        
        return services;
    }
}

// Constructor injection
public class PageBuilder : IPageBuilder
{
    private readonly IMarkdownProcessor _markdownProcessor;
    private readonly ILogger<PageBuilder> _logger;
    
    public PageBuilder(IMarkdownProcessor markdownProcessor, ILogger<PageBuilder> logger)
    {
        _markdownProcessor = markdownProcessor ?? throw new ArgumentNullException(nameof(markdownProcessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
}
```

### Async/Await Patterns

**Consistent async usage:**
```csharp
// Always use Async suffix for async methods
public async Task<ProcessingResult> ProcessPageAsync(PageModel page)
{
    // Use ConfigureAwait(false) in library code
    var content = await File.ReadAllTextAsync(page.SourcePath).ConfigureAwait(false);
    
    // Return ValueTask for potentially synchronous operations
    return await ProcessContentInternalAsync(content).ConfigureAwait(false);
}

// Use CancellationToken for long-running operations
public async Task ProcessAllPagesAsync(
    IEnumerable<PageModel> pages, 
    CancellationToken cancellationToken = default)
{
    foreach (var page in pages)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await ProcessPageAsync(page).ConfigureAwait(false);
    }
}
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

## Comments and Documentation

### When to Comment

**Comments should explain WHY, not WHAT:**
```csharp
// Good - explains reasoning
// Using regex here because Markdig doesn't provide access to the raw HTML
// after custom renderers have processed it. This pattern is safe because
// we control the comment format in our plugin.
var match = Regex.Match(content, @"<!-- BLAKE_DATA:(.*?) -->");

// Bad - explains obvious
// Check if match is successful
if (match.Success)
{
    // Get the captured group
    var data = match.Groups[1].Value;
}
```

**Document complex algorithms:**
```csharp
/// <summary>
/// Processes plugin data embedded as HTML comments in the content.
/// This approach allows plugins to pass data between BeforeBake and AfterBake
/// phases without external storage, maintaining Blake's stateless design.
/// </summary>
/// <param name="content">The processed HTML content</param>
/// <param name="pluginName">The name of the plugin to extract data for</param>
/// <returns>The extracted data or null if not found</returns>
public static string? ExtractPluginData(string content, string pluginName)
{
    // Implementation
}
```

### XML Documentation

**Document public APIs:**
```csharp
/// <summary>
/// Represents the execution context for Blake build operations.
/// Provides access to content, configuration, and build state.
/// </summary>
public class BlakeContext
{
    /// <summary>
    /// Gets the collection of source pages to be processed.
    /// These pages contain the original markdown content and frontmatter.
    /// </summary>
    public IReadOnlyList<PageModel> Pages { get; }
    
    /// <summary>
    /// Gets the collection of generated content after processing.
    /// This collection is populated during the bake process.
    /// </summary>
    public IList<GeneratedPage> GeneratedContent { get; }
    
    /// <summary>
    /// Replaces an existing generated page with an updated version.
    /// Used by plugins to modify content during AfterBake phase.
    /// </summary>
    /// <param name="original">The original page to replace</param>
    /// <param name="updated">The updated page content</param>
    /// <exception cref="ArgumentException">Thrown when original page is not found</exception>
    public void ReplaceGeneratedContent(GeneratedPage original, GeneratedPage updated)
    {
        // Implementation
    }
}
```

## Testing Patterns

### Unit Test Structure

**Follow AAA pattern (Arrange, Act, Assert):**
```csharp
[Fact]
public async Task ProcessPage_WithValidMarkdown_ReturnsProcessedContent()
{
    // Arrange
    var processor = new MarkdownProcessor(_mockLogger.Object);
    var markdown = "# Test Title\n\nTest content";
    var expectedHtml = "<h1>Test Title</h1>\n<p>Test content</p>";
    
    // Act
    var result = await processor.ProcessMarkdownAsync(markdown);
    
    // Assert
    Assert.Equal(expectedHtml, result.Content);
    Assert.Equal("Test Title", result.Title);
}
```

**Test naming conventions:**
```csharp
// Pattern: MethodName_Scenario_ExpectedBehavior
[Fact]
public void GetFileExtension_WithValidPath_ReturnsExtension() { }

[Fact] 
public void GetFileExtension_WithNullPath_ThrowsArgumentException() { }

[Theory]
[InlineData("file.md", ".md")]
[InlineData("page.razor", ".razor")]
[InlineData("noextension", "")]
public void GetFileExtension_WithVariousInputs_ReturnsCorrectExtension(string input, string expected)
{
    // Test implementation
}
```

### Integration Test Patterns

**Test with realistic scenarios:**
```csharp
[Fact]
public async Task BlakeBuild_WithSampleSite_GeneratesExpectedOutput()
{
    // Arrange
    using var tempDir = new TemporaryDirectory();
    var siteBuilder = new SiteBuilder()
        .WithContentDirectory(tempDir.Path)
        .WithPlugin<ReadTimePlugin>();
    
    await tempDir.WriteFileAsync("page.md", "# Test\n\nContent here");
    
    // Act
    var result = await siteBuilder.BuildAsync();
    
    // Assert
    Assert.True(result.Success);
    Assert.Single(result.GeneratedPages);
    Assert.Contains("readTimeMinutes", result.GeneratedPages[0].Metadata.Keys);
}
```

## Performance Guidelines

### Memory Management

**Avoid unnecessary allocations:**
```csharp
// Good - reuse StringBuilder
private static readonly StringBuilder _stringBuilder = new();

public string ProcessContent(IEnumerable<string> parts)
{
    _stringBuilder.Clear();
    foreach (var part in parts)
    {
        _stringBuilder.Append(part);
    }
    return _stringBuilder.ToString();
}

// Good - use spans for string manipulation
public string ExtractTitle(ReadOnlySpan<char> content)
{
    var firstLine = content.Split('\n')[0];
    return firstLine.StartsWith("# ") ? firstLine[2..].ToString() : string.Empty;
}
```

**Stream processing for large files:**
```csharp
public async Task ProcessLargeFileAsync(string filePath)
{
    using var fileStream = File.OpenRead(filePath);
    using var reader = new StreamReader(fileStream);
    
    string? line;
    while ((line = await reader.ReadLineAsync()) != null)
    {
        // Process line by line instead of loading entire file
        ProcessLine(line);
    }
}
```

### Async Best Practices

**Avoid blocking async calls:**
```csharp
// Good - truly async
public async Task<string> ReadContentAsync(string path)
{
    return await File.ReadAllTextAsync(path).ConfigureAwait(false);
}

// Bad - blocking async
public string ReadContent(string path)
{
    return File.ReadAllTextAsync(path).Result; // Don't do this
}
```

## Tools and Automation

### EditorConfig

Blake projects should include `.editorconfig` files to ensure consistent formatting across editors.

### Code Analysis

**Enable analyzers in project files:**
```xml
<PropertyGroup>
    <AnalysisLevel>latest</AnalysisLevel>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <WarningsNotAsErrors>CS1591</WarningsNotAsErrors>
</PropertyGroup>

<ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.Analyzers" Version="3.3.4" PrivateAssets="all" />
    <PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="8.0.0" PrivateAssets="all" />
</ItemGroup>
```

### Formatting Tools

**Use dotnet format:**
```bash
# Format all files
dotnet format

# Check formatting without making changes  
dotnet format --verify-no-changes

# Format specific files
dotnet format --include src/Blake.Core/
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
