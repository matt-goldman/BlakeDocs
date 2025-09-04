---
title: How to Test Your Changes
description: Complete guide to testing Blake locally, running test suites, and verifying changes before contributing.
category: "Contributing"
iconIdentifier: "bi bi-check2-square-nav-menu"
pageOrder: 3
---

:::summary
Testing Blake changes involves setting up a local development environment, running unit and integration tests, testing with sample sites, and validating across different scenarios. This guide covers everything from basic setup to comprehensive testing strategies.
:::

## Overview of Blake Testing

Blake uses multiple layers of testing to ensure reliability and prevent regressions:

- **Unit tests** - Test individual components in isolation
- **Integration tests** - Test Blake CLI and build processes end-to-end
- **Sample site testing** - Verify real-world usage scenarios
- **Plugin testing** - Ensure plugin compatibility and functionality
- **Cross-platform testing** - Validate on Windows, macOS, and Linux

## Setting Up Your Development Environment

### Prerequisites

- **.NET 9 SDK** or later
- **Git** for source control
- **Code editor** (Visual Studio, VS Code, or JetBrains Rider)
- **Blake CLI** - install locally during development

### Building Blake from Source

**Initial setup:**

```bash
# Restore dependencies
dotnet restore

# Build all projects
dotnet build

# Run unit tests to verify setup
dotnet test
```

**If build fails:**

- Check .NET SDK version compatibility
- Ensure all NuGet packages restored successfully
- Verify no conflicting global tools installed

### Installing Local Blake CLI

**For development, install with preview suffix to avoid conflicts with production versions:**

```bash
# Build and install development version with preview suffix
dotnet tool uninstall -g Blake.CLI
dotnet tool install -g Blake.CLI --version "*-*" --add-source [path-to-local-packages]
```

**Alternative: Use the PowerShell installation script from the Blake repository for automated setup and version management.**

```bash
./Build-LocalPackages.ps1 -Version "2.0.0" -OutputPath "C:\LocalNuGetPackages"
# This command builds the local NuGet packages with version "2.0.0-alpha" and outputs them to the specified path.
```

**Build and install your development version manually:**

```bash
# Build the CLI project
cd src/Blake.CLI
dotnet build

# Pack as a local tool
dotnet pack

# Install locally (replace version with current)
dotnet tool install --global --add-source ./nupkg Blake.CLI --version 2.0.0-alpha
```

**Or use from project directory:**

```bash
# Run without installing
cd src/Blake.CLI
dotnet run -- bake --help
```

:::tip
Define a launch profile with the Blake CLI arguments you want to text/debug already specified.
:::

## Running Unit Tests

### Test Structure

Blake organizes tests by project:

- **Blake.Core.Tests** - Core functionality tests
- **Blake.CLI.Tests** - Command-line interface tests
- **Blake.BuildTools.Tests** - Build process tests
- **Blake.Types.Tests** - Type and interface tests

### Running All Tests

```bash
# From repository root
dotnet test

# With detailed output
dotnet test --verbosity normal

# Generate coverage report
dotnet test --collect:"XPlat Code Coverage"
```

### Running Specific Test Suites

```bash
# Test specific project
dotnet test src/Blake.Core.Tests/

# Test specific class
dotnet test --filter "ClassName=MarkdownProcessorTests"

# Test specific method
dotnet test --filter "TestMethod=ProcessMarkdown_WithValidContent_ReturnsHtml"

# Test by category
dotnet test --filter "Category=Integration"
```

### Debugging Test Failures

**When tests fail:**

```bash
# Run with maximum verbosity
dotnet test --verbosity diagnostic

# Run a single failing test
dotnet test --filter "TestMethod=FailingTest" --verbosity normal

# Run tests in VS Code debugger
# Set breakpoints in test files and use "Debug Test" option
```

**Common test failure causes:**

- **Path separators** - Windows vs Unix path handling
- **Line endings** - CRLF vs LF differences
- **File permissions** - Different OS file system behaviors
- **Timing issues** - File system operations in parallel tests

## Integration Testing

### Testing the Build Process

**Test Blake CLI commands:**

```bash
# Create a test site
mkdir TestSite
cd TestSite

# Initialize with sample content
blake init --sample

# Test baking process
blake bake

# Verify generated files
ls -la .generated/

# Test with different options
blake bake --verbose
blake bake --drafts
```

### Testing with Sample Sites

**Use existing samples:**

```bash
# Navigate to samples
cd samples/BasicSite

# Test the build
blake bake
dotnet build
dotnet run

# Verify site loads correctly
# Open browser to localhost:5000
```

**Create custom test scenarios:**

```bash
# Test with minimal content
mkdir MinimalTest
cd MinimalTest

blake init -s # include sample content

blake bake
# Verify .generated files created correctly
```

### Plugin Integration Testing

**Test with existing plugins:**

```bash
# Test ReadTime plugin
cd samples/DocsTemplate  # or create test site
# Add BlakePlugin.ReadTime package reference
blake bake

# Verify readTimeMinutes metadata added
# Check generated content for metadata
```

**Test plugin compatibility:**

```bash
# Test with multiple plugins
# Add several plugins to test site
blake bake -v Debug

# Check for plugin conflicts
# Verify all plugins executed successfully
```

## Testing Your Changes

### Testing Code Changes

**When modifying core Blake functionality:**

#### Run affected unit tests

```bash
# Test the specific area you changed
dotnet test src/Blake.BuildTools.Tests/ --filter "ClassName=YourModifiedClass"
```

#### Run full test suite

```bash
# Ensure no regressions
dotnet test
```

#### Test with sample sites

```bash
# Verify real-world scenarios work
cd samples/BasicSite
blake bake
dotnet run
```

### Testing Plugin Changes

**When developing plugins:**

#### Create test site

```bash
mkdir PluginTest
cd PluginTest

# Create minimal content
dotnet new blazorwasm

blake init -s # include sample content

blake bake
```

#### Reference your plugin

```bash
# Add project reference to your plugin
dotnet add reference ../path/to/your/plugin

# Or reference by package in test csproj
```

#### Test plugin functionality

```bash
blake bake
# Check plugin executed correctly
# Verify expected metadata added
# Check generated content includes plugin modifications
```

## Documentation Changes

When making changes to Blake core, check whether the documentation also needs to be updated.

Fork the [Blake Docs](https://github.com/matt-goldman/BlakeDocs) repo to prepare documentation changes.

## Cross-Platform Testing

### Windows Testing

**Windows-specific considerations:**

- Path separator handling (`\` vs `/`); note modern .NET should handle this either way.
- File permissions and access
- Case sensitivity differences
- Line ending differences (CRLF)

```powershell
# Windows PowerShell testing
dotnet test
blake bake
# Test with Windows paths
```

### macOS/Linux Testing

**Unix-specific considerations:**

- Case-sensitive file systems
- Different file permissions model
- Line endings (LF)
- Path separator (`/`)

```bash
# Unix shell testing
dotnet test
blake bake
chmod +x generated-files  # Test permissions
```

## Testing Checklists

### Pre-Submit Testing

**Before submitting pull requests:**

- [ ] All unit tests pass locally
- [ ] Integration tests pass
- [ ] Tested with at least one sample site
- [ ] No new compiler warnings
- [ ] Code follows style guidelines
- [ ] Performance impact assessed
- [ ] Cross-platform considerations reviewed

### Plugin Testing Checklist

**When contributing plugins:**

- [ ] Plugin loads correctly
- [ ] BeforeBake and AfterBake methods work as expected
- [ ] Error handling doesn't break builds
- [ ] Configuration works (if applicable)
- [ ] Assets load properly (if RCL plugin)
- [ ] Documentation is accurate
- [ ] Examples work as described

### Documentation Testing Checklist

**When updating documentation:**

- [ ] Markdown renders correctly
- [ ] Code examples compile and run
- [ ] Links point to correct destinations
- [ ] Screenshots are up-to-date
- [ ] Cross-references are accurate
- [ ] Style follows established patterns

## Automated Testing

### GitHub Actions

**Blake uses GitHub Actions for CI/CD:**

- Tests run on Windows, macOS, and Linux
- Multiple .NET versions tested
- Integration tests with sample sites
- Plugin compatibility testing

**Check action results:**

- View failed action logs in GitHub
- Download artifacts if tests generate output
- Compare results across platforms

### Getting Help

**When you're stuck:**

1. **Check existing issues** - Someone may have encountered similar problems
2. **Create minimal reproduction** - Simplify the scenario to isolate the issue
3. **Share error messages** - Include full stack traces and error output
4. **Provide environment details** - OS, .NET version, Blake version
5. **Ask in discussions** - Community can often help quickly

## Next Steps

Now that you understand testing Blake:

1. **Set up your environment** following the setup instructions
2. **Run the full test suite** to verify your setup
3. **Make a small change** and test it thoroughly
4. **Review the [Code Style](/pages/5%20contributing/code-style)** guidelines
5. **Explore [Build Pipeline](/pages/5%20contributing/build-pipeline)** to understand Blake's architecture

**For specialized contributions:**
- **[Plugin Development Testing](/pages/5%20contributing/writing-plugins#testing-your-plugin)** - Test plugins thoroughly
- **[Site Template Testing](/pages/5%20contributing/creating-site-templates#template-maintenance)** - Validate template functionality

:::note
**Testing Questions?**

If you encounter issues or have questions about testing:

- Check the troubleshooting section above
- Look at existing tests for examples
- Ask in GitHub discussions for help
- Review CI/CD logs for common failure patterns

Good testing practices help keep Blake reliable for everyone!
:::
