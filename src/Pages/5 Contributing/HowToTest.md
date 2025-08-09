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

**Required software:**
- **.NET 9 SDK** or later
- **Git** for source control
- **Code editor** (Visual Studio, VS Code, or JetBrains Rider)
- **Blake CLI** - install locally during development

**Verify your setup:**
```bash
# Check .NET version
dotnet --version

# Check Git
git --version

# Clone Blake repository
git clone https://github.com/matt-goldman/blake.git
cd blake
```

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

**Build and install your development version manually:**
```bash
# Build the CLI project
cd src/Blake.CLI
dotnet build

# Pack as a local tool
dotnet pack

# Install locally (replace version with current)
dotnet tool install --global --add-source ./nupkg Blake.CLI --version 1.0.0
```

**Or use from project directory:**
```bash
# Run without installing
cd src/Blake.CLI
dotnet run -- bake --help
```

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
- **File permissions** - Different OS file system behavior
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
echo "# Test Page" > page.md
echo "@@page \"/test\"" > template.razor
echo "@@Body" >> template.razor

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
blake bake --verbose

# Check for plugin conflicts
# Verify all plugins executed successfully
```

## Testing Your Changes

### Testing Code Changes

**When modifying core Blake functionality:**

1. **Run affected unit tests:**
```bash
# Test the specific area you changed
dotnet test src/Blake.Core.Tests/ --filter "ClassName=YourModifiedClass"
```

2. **Run full test suite:**
```bash
# Ensure no regressions
dotnet test
```

3. **Test with sample sites:**
```bash
# Verify real-world scenarios work
cd samples/BasicSite
blake bake
dotnet run
```

### Testing Plugin Changes

**When developing plugins:**

1. **Create test site:**
```bash
mkdir PluginTest
cd PluginTest

# Create minimal content
echo "---\ntitle: Test Page\n---\n# Test Content" > test.md
echo "@@page \"/test\"\n<h1>@Title</h1>\n@@Body" > template.razor
```

2. **Reference your plugin:**
```bash
# Add project reference to your plugin
dotnet add reference ../path/to/your/plugin

# Or reference by package in test csproj
```

3. **Test plugin functionality:**
```bash
blake bake
# Check plugin executed correctly
# Verify expected metadata added
# Check generated content includes plugin modifications
```

### Testing Documentation Changes

**When updating documentation:**

1. **Test markdown rendering:**
```bash
# Use Blake to generate docs site
cd samples/DocsTemplate
blake bake
dotnet run

# Verify your changes render correctly
# Check links work properly
# Ensure formatting is correct
```

2. **Test cross-references:**
- Verify internal links point to correct pages
- Check that examples work as described
- Ensure code samples compile and run

## Cross-Platform Testing

### Windows Testing

**Windows-specific considerations:**
- Path separator handling (`\` vs `/`)
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

### Container Testing

**Test in consistent environment:**
```dockerfile
# Dockerfile for testing
FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet test
RUN dotnet build
```

```bash
# Build and test in container
docker build -t blake-test .
docker run --rm blake-test
```

## Performance Testing

### Benchmark Testing

**Test build performance:**
```bash
# Time the build process
time blake bake

# Test with large sites
# Create site with many pages
for i in {1..100}; do
  echo "# Page $i\nContent for page $i" > "page$i.md"
done

time blake bake
```

### Memory Usage Testing

**Monitor memory during build:**
```bash
# Use dotnet-counters (install via dotnet tool install)
dotnet-counters monitor --process-id $(pgrep blake)

# Or use system monitoring tools
# htop, Activity Monitor, Task Manager
```

### Profiling

**Profile with dotnet-trace:**
```bash
# Install profiling tools
dotnet tool install --global dotnet-trace

# Profile Blake CLI
dotnet-trace collect -- blake bake

# Analyze the trace file
# Use PerfView (Windows) or other trace analyzers
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

### Local Automation

**Set up pre-commit hooks:**
```bash
# .git/hooks/pre-commit
#!/bin/sh
dotnet test --no-build --verbosity quiet
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

## Debugging Test Issues

### Common Issues and Solutions

**Build failures:**
- Check .NET SDK version matches project requirements
- Clear `bin/` and `obj/` directories: `dotnet clean`
- Restore packages: `dotnet restore`

**Test failures:**
- Check file path separators for cross-platform compatibility
- Verify test data files exist and have correct encoding
- Look for timing issues in file system operations

**Plugin issues:**
- Verify plugin naming follows `BlakePlugin.*` convention
- Check plugin project references `Blake.BuildTools`
- Ensure plugin implements `IBlakePlugin` interface

**Performance issues:**
- Profile memory usage during large site builds
- Check for file system bottlenecks
- Verify async operations don't block

### Getting Help

**When you're stuck:**

1. **Check existing issues** - Someone may have encountered similar problems
2. **Create minimal reproduction** - Simplify the scenario to isolate the issue
3. **Share error messages** - Include full stack traces and error output
4. **Provide environment details** - OS, .NET version, Blake version
5. **Ask in discussions** - Community can often help quickly

## Best Practices

### Test-Driven Development

**When adding features:**
1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor while keeping tests green
4. Add integration tests for complete scenarios

### Test Maintenance

**Keep tests healthy:**
- Remove obsolete tests when features are removed
- Update tests when APIs change
- Keep test data current and relevant
- Ensure tests run quickly and reliably

### Testing Philosophy

**Follow Blake's testing principles:**
- **Tests should be simple** - Easy to understand and maintain
- **Test behavior, not implementation** - Focus on what, not how
- **Make failures obvious** - Clear error messages and diagnostics
- **Keep tests independent** - No dependencies between tests

## Next Steps

Now that you understand testing Blake:

1. **Set up your environment** following the setup instructions
2. **Run the full test suite** to verify your setup
3. **Make a small change** and test it thoroughly
4. **Review the [Code Style](/pages/5%20contributing/code-style)** guidelines
5. **Explore [Build Pipeline](/pages/5%20contributing/build-pipeline)** to understand Blake's architecture

:::note
**Testing Questions?**

If you encounter issues or have questions about testing:
- Check the troubleshooting section above
- Look at existing tests for examples
- Ask in GitHub discussions for help
- Review CI/CD logs for common failure patterns

Good testing practices help keep Blake reliable for everyone!
:::
