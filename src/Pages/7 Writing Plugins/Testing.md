---
title: 'Testing Your Plugin'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Comprehensive testing strategies for Blake plugins including unit tests, integration tests, and development tips."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 8
category: "Writing Plugins"
---

:::summary
Test Blake plugins with unit tests for plugin logic, integration tests with actual Blake content, and thorough development testing across various content types and configurations.
:::

## Testing Your Plugin

### Unit Testing

Test your plugin logic independently of Blake:

```csharp
[Fact]
public async Task LastModifiedPlugin_AddsTimestampMetadata()
{
    // Arrange
    var plugin = new LastModifiedPlugin();
    var context = CreateTestBlakeContext();
    var logger = new TestLogger();

    // Act
    await plugin.BeforeBakeAsync(context, logger);

    // Assert
    Assert.All(context.MarkdownPages, page =>
        Assert.Contains("lastModified", page.RawMarkdown));
}
```

**Creating Test Contexts:**

```csharp
private BlakeContext CreateTestBlakeContext()
{
    var markdownPages = new List<MarkdownPage>
    {
        new MarkdownPage(
            MdPath: "/test/test-page.md",
            TemplatePath: "/test/template.razor", 
            Slug: "/test/test-page",
            RawMarkdown: """
                ---
                title: Test Page
                ---
                # Test Page

                This is test content.
                """)
    };

    return new BlakeContext
    {
        ProjectPath = "/test",
        Arguments = new List<string>(),
        PipelineBuilder = new Markdig.MarkdownPipelineBuilder(),
        MarkdownPages = markdownPages,
        GeneratedPages = new List<GeneratedPage>()
    };
}
```

**Testing Error Conditions:**

```csharp
[Fact]
public async Task Plugin_HandlesEmptyContent_Gracefully()
{
    // Arrange
    var plugin = new MyPlugin();
    var context = new BlakeContext
    {
        Pages = new List<PageModel>
        {
            new PageModel { Content = "", Slug = "empty" }
        }
    };

    // Act & Assert - Should not throw
    await plugin.BeforeBakeAsync(context, new TestLogger());
}

[Fact]
public async Task Plugin_HandlesNullLogger_Gracefully()
{
    // Arrange
    var plugin = new MyPlugin();
    var context = CreateTestBlakeContext();

    // Act & Assert - Should not throw
    await plugin.BeforeBakeAsync(context, null);
}
```

### Integration Testing

Test your plugin with actual Blake content:

1. **Create a minimal Blake site for testing**
2. **Install your plugin via project reference or NuGet package**
3. **Run `blake bake` and verify output**
4. **Use automated tests to verify generated content**

:::note
Blake doesn't load plugins by DLL file alone - they must be referenced in the target project either as a NuGet package reference or project reference. Simply copying a DLL will cause restore to fail. For testing, either:
- Add your plugin project as a project reference to your test site
- Create a local NuGet package feed for your plugin
:::

**Example Integration Test:**

```csharp
[Fact]
public async Task Plugin_IntegrationTest_WithRealBlakeSite()
{
    // Arrange
    var testSitePath = CreateTestBlakeSite();
    
    // Add plugin as project reference (preferred for testing)
    await AddProjectReference(testSitePath, "../../../MyPlugin/MyPlugin.csproj");
    
    // Act
    var result = await RunBlakeBake(testSitePath);

    // Assert
    Assert.True(result.Success, "Blake bake should succeed");
    
    var generatedFiles = Directory.GetFiles(
        Path.Combine(testSitePath, ".generated"), 
        "*.razor", 
        SearchOption.AllDirectories);
    
    Assert.NotEmpty(generatedFiles);
    
    // Verify your plugin's effects
    var pageContent = File.ReadAllText(generatedFiles[0]);
    Assert.Contains("your-plugin-output", pageContent);
}
```

### Development Tips

**Use logging extensively** during development to understand plugin execution:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    logger?.LogInformation($"Plugin starting with {context.Pages?.Count ?? 0} pages");
    
    foreach (var page in context.Pages ?? Enumerable.Empty<PageModel>())
    {
        logger?.LogDebug($"Processing page: {page.Slug}");
        
        try
        {
            await ProcessPage(page);
            logger?.LogDebug($"Successfully processed: {page.Slug}");
        }
        catch (Exception ex)
        {
            logger?.LogError($"Failed to process {page.Slug}: {ex.Message}");
        }
    }
    
    logger?.LogInformation("Plugin processing complete");
}
```

**Test with various content types:**

```csharp
[Theory]
[InlineData("# Simple markdown")]
[InlineData("")]
[InlineData("Complex markdown with\n\n- Lists\n- **Bold**\n- `Code`")]
public async Task Plugin_HandlesVariousContent(string content)
{
    // Arrange
    var plugin = new MyPlugin();
    var context = CreateContextWithContent(content);

    // Act & Assert
    await plugin.BeforeBakeAsync(context, new TestLogger());
    // Verify expected behavior for each content type
}
```

**Test configuration scenarios:**

```csharp
[Fact]
public async Task Plugin_UsesDefaultConfig_WhenNoConfigFile()
{
    // Test default behavior
}

[Fact]
public async Task Plugin_LoadsCustomConfig_WhenFileExists()
{
    // Test custom configuration loading
}

[Fact]
public async Task Plugin_HandlesInvalidConfig_Gracefully()
{
    // Test malformed configuration file
}
```

### Performance Testing

**Measure plugin performance:**

```csharp
[Fact]
public async Task Plugin_ProcessesLargeContent_Efficiently()
{
    // Arrange
    var plugin = new MyPlugin();
    var largeContext = CreateLargeTestContext(1000); // 1000 pages
    var stopwatch = Stopwatch.StartNew();

    // Act
    await plugin.BeforeBakeAsync(largeContext, new TestLogger());
    stopwatch.Stop();

    // Assert
    Assert.True(stopwatch.ElapsedMilliseconds < 5000, 
        $"Plugin took {stopwatch.ElapsedMilliseconds}ms for 1000 pages");
}
```

### Testing Plugin Interactions

**Test with multiple plugins:**

```csharp
[Fact]
public async Task Plugins_WorkTogether_WithoutConflicts()
{
    // Arrange
    var plugin1 = new ReadTimePlugin();
    var plugin2 = new MyPlugin();
    var context = CreateTestBlakeContext();

    // Act - Simulate Blake's plugin execution order
    await plugin1.BeforeBakeAsync(context, new TestLogger());
    await plugin2.BeforeBakeAsync(context, new TestLogger());

    // Process content (simulate Blake's bake process)
    
    await plugin1.AfterBakeAsync(context, new TestLogger());
    await plugin2.AfterBakeAsync(context, new TestLogger());

    // Assert - Verify both plugins worked correctly
    Assert.True(context.Pages[0].Metadata.ContainsKey("readingTime"));
    Assert.True(context.Pages[0].Metadata.ContainsKey("myPluginData"));
}
```

### Continuous Integration Testing

**GitHub Actions example:**

```yaml
name: Test Plugin

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '9.0.x'
        
    - name: Install Blake CLI
      run: dotnet tool install -g Blake.CLI
      
    - name: Run unit tests
      run: dotnet test
      
    - name: Test with sample Blake site
      run: |
        cd test-site
        dotnet add reference ../src/MyPlugin.csproj
        blake bake
        # Verify output
```

### Manual Testing Checklist

Before releasing your plugin:

- [ ] Test with empty/minimal Blake site
- [ ] Test with complex Blake site (multiple folders, various content)
- [ ] Test with different frontmatter configurations
- [ ] Test plugin installation via NuGet
- [ ] Test with other popular Blake plugins
- [ ] Test error scenarios (missing files, invalid content)
- [ ] Test configuration options (if any)
- [ ] Verify logging output is helpful
- [ ] Check memory usage with large sites
- [ ] Validate generated output is correct

## Next Steps

- **[Examples](/pages/7%20writing%20plugins/examples)** - Study well-tested plugin implementations
- **[Distribution](/pages/7%20writing%20plugins/distribution)** - Package your thoroughly tested plugin
- **[Best Practices](/pages/7%20writing%20plugins/best-practices)** - Review development guidelines