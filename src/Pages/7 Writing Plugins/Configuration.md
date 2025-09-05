---
title: 'Plugin Configuration'
date: 2025-01-15
image: images/blake-logo.png
tags: []
description: "Configure Blake plugins with custom configuration loading, project files, and environment variables."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 5
category: "Writing Plugins"
---

:::summary
Blake encourages zero-configuration plugins but supports custom configuration loading when needed. Plugins must implement their own configuration mechanisms using JSON files, project properties, or environment variables.
:::

## Plugin Configuration

### Configuration Philosophy

Blake encourages zero-configuration plugins that work immediately upon installation. However, if your plugin requires configuration, you should follow .NET conventions and use `appsettings.json` for configuration whenever possible, rather than implementing custom configuration files.

### .NET Configuration Approach (Recommended)

Blake follows .NET and Blazor idioms, so configuration should be handled through the standard `appsettings.json` file when feasible:

**Example appsettings.json configuration:**

```json
{
  "MyAwesomePlugin": {
    "enabled": true,
    "features": ["analytics", "search"],
    "timeout": 30
  }
}
```

**Load configuration in your plugin:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Load configuration from project directory
    var configPath = Path.Combine(context.ProjectPath, "plugin-config.json");
    var config = LoadPluginConfig(configPath);

    if (!config.Enabled)
    {
        logger?.LogInformation("Plugin disabled via configuration");
        return;
    }

    // Use configuration...
}

private PluginConfig LoadPluginConfig(string configPath)
{
    if (!File.Exists(configPath))
        return new PluginConfig { Enabled = true }; // Defaults

    var json = File.ReadAllText(configPath);
    var allConfig = JsonSerializer.Deserialize<Dictionary<string, PluginConfig>>(json);
    return allConfig.GetValueOrDefault("MyAwesomePlugin", new PluginConfig { Enabled = true });
}
```

:::note
**Alternative: Embedded Resource Configuration**

You can instruct users to make their appsettings.json an embedded resource, then use reflection to access it from the executing assembly.
:::

### Alternative Configuration Methods

**Project File Configuration:**

```xml
<PropertyGroup>
  <MyPluginEnabled>true</MyPluginEnabled>
  <MyPluginApiKey>your-api-key</MyPluginApiKey>
</PropertyGroup>
```

:::tip
When using configuration files with secrets (like API keys), use placeholder values in your source code and have your CI/CD pipeline replace them with actual secrets during deployment. Never commit real secrets to source control.
:::

Access in your plugin:

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    // Read from MSBuild properties (requires access to project file parsing)
    var isEnabled = GetProjectProperty(context, "MyPluginEnabled");
    var apiKey = GetProjectProperty(context, "MyPluginApiKey");
    
    if (isEnabled != "true")
    {
        logger?.LogInformation("Plugin disabled via project file");
        return;
    }
}
```

**Environment Variables:**

```csharp
public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
{
    var apiKey = Environment.GetEnvironmentVariable("MY_PLUGIN_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        logger?.LogWarning("API key not found - plugin functionality may be limited");
        return;
    }
}
```

### Configuration Best Practices

1. **Provide sensible defaults** - Your plugin should work without configuration
2. **Graceful degradation** - Handle missing configuration gracefully
3. **Clear error messages** - Help users understand configuration issues
4. **Document configuration options** - Include examples in your README

Example of robust configuration handling:

```csharp
public class MyPlugin : IBlakePlugin
{
    private readonly PluginConfig _defaultConfig = new()
    {
        Enabled = true,
        Timeout = 30,
        Features = new[] { "basic" }
    };

    public async Task BeforeBakeAsync(BlakeContext context, ILogger? logger = null)
    {
        var config = LoadConfiguration(context) ?? _defaultConfig;
        
        if (!config.Enabled)
        {
            logger?.LogInformation("MyPlugin is disabled");
            return;
        }

        try
        {
            await ProcessWithConfig(context, config, logger);
        }
        catch (ConfigurationException ex)
        {
            logger?.LogError($"Configuration error: {ex.Message}");
            logger?.LogInformation("Falling back to default behavior");
            await ProcessWithConfig(context, _defaultConfig, logger);
        }
    }
}
```

## Next Steps

- **[Distribution](/pages/7%20writing%20plugins/distribution)** - Package and share your configurable plugin
- **[Best Practices](/pages/7%20writing%20plugins/best-practices)** - Follow recommended development patterns
- **[Testing](/pages/7%20writing%20plugins/testing)** - Test different configuration scenarios