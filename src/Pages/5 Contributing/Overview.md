---
title: Contributing to Blake
description: How to get started contributing to the Blake static site generator and its ecosystem.
category: "Contributing"
iconIdentifier: "bi bi-heart-fill-nav-menu"
pageOrder: 1
---

:::summary
Blake welcomes contributions. Whether you want to fix bugs, add features, create plugins, improve documentation, or build site templates, this guide will help you get started with contributing to Blake's open-source ecosystem.
:::

## Welcome to Blake Development

Blake is an open-source static site generator that follows the philosophy of "Occam's Blazor" - the solution with the fewest assumptions is usually the best. While Blake development requires .NET experience, Blake-powered sites are accessible to anyone wanting a static site. Blake templates can serve a broad audience, not just .NET developers.

**Our community values:**

- **Simplicity over complexity** - Zero-config solutions when possible
- **Just-in-time knowledge** - Documentation that helps when you need it
- **Developer experience** - Tools that feel familiar to .NET developers
- **Transparency** - Clear behaviour without hidden magic
- **Collaboration** - Welcoming contributions from all skill levels

## Ways to Contribute

### 🎨 Site Templates (a.k.a "Themes")

**Build templates for the community:**

- Create new site templates for different use cases
- Improve existing templates
- Add responsive design and accessibility features
- Create specialized templates (portfolio, blog, docs, etc.)

### 🐛 Bug Reports and Feature Requests

**Found a bug or have an idea?**

- Search existing [issues](https://github.com/matt-goldman/blake/issues) first
- Create a new issue with clear reproduction steps
- Include Blake version, .NET version, and operating system
- For feature requests, explain the problem you're trying to solve

**Good bug reports include:**

- Clear title describing the issue
- Steps to reproduce the problem
- Expected vs. actual behaviour
- Screenshots if applicable
- Minimal example project when possible

### 💻 Code Contributions

**Core Blake Development:**

- Bug fixes and performance improvements
- New features (discuss in issues first for large changes)
- Better error messages and logging
- Cross-platform compatibility improvements

**Plugin Development:**

- Create plugins that extend Blake's functionality
- Improve existing plugins
- Fix plugin compatibility issues
- Add new plugin hooks and capabilities

### 📖 Documentation Improvements

**Help make Blake more accessible:**

- Fix typos and improve clarity
- Add missing examples and tutorials
- Update outdated information
- Translate documentation (future)
- Create video tutorials and blog posts

### 🧪 Testing and Quality Assurance

**Help improve Blake's reliability:**

- Write unit tests for core functionality
- Create integration tests for common scenarios
- Test new releases on different platforms
- Improve CI/CD pipelines

## Getting Started

### 1. Set Up Your Development Environment

**Prerequisites:**

- .NET 9 SDK or later
- Git for version control
- Code editor (Visual Studio, VS Code, Rider)
- Blake CLI (`dotnet tool install -g Blake.CLI`)

**Fork the repository:**

Then clone your fork locally:

```bash
git clone https://github.com/your-username/blake.git
cd blake

# Set up development environment
dotnet restore
dotnet build
```

### 2. Understand Blake's Architecture

Before contributing, familiarize yourself with Blake's core components:

- **[Build Pipeline](/pages/5%20contributing/build-pipeline)** - How Blake processes content
- **Blake.CLI** - Command-line interface
- **Blake.BuildTools** - Core build functionality
- **Blake.Types** - Shared types and interfaces
- **Plugin system** - Extension mechanism

### 3. Explore the Codebase

**Key areas to understand:**

- **Content processing** - Markdown to Razor transformation
- **Template system** - How templates work with content
- **Plugin architecture** - Extension points and lifecycle
- **Build process** - MSBuild integration and file generation

### 4. Read Contributing Guidelines

Each repository has specific contribution guidelines:

- Code style and formatting requirements
- Pull request templates
- Testing requirements
- Documentation standards

## Contributing Workflow

### 1. Planning Your Contribution

**For bug fixes:**

1. Create or comment on the relevant issue
2. Confirm the bug and proposed solution
3. Check if similar fixes are already in progress

**For new features:**

1. Create a feature request issue
2. Discuss the approach with maintainers
3. Get approval before starting significant work
4. Consider breaking changes and backwards compatibility

### 2. Development Process

**Follow these steps:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes following code style guidelines
4. Add or update tests as needed
5. Update documentation if necessary
6. Test your changes thoroughly
7. Commit with clear, descriptive messages

### 3. Testing Your Changes

**Test locally:**

```bash
# Build Blake
dotnet build

# Run tests
dotnet test

# Test with a sample site
cd samples/BasicSite
blake bake
dotnet run
```

If you want to test your changes against a sample site, the easiest way is to create a launch profile that includes the path to your site as an argument. This allows you to debug core Blake code while running against a test implementation. E.g.:

```json
{
  "profiles": {
    "Blake.CLI": {
      "commandName": "Project",
      "commandLineArgs": "init C:\\temp\\blaketest -s"
    }
  }
}
```

or:

```json
{
  "profiles": {
    "Blake.CLI": {
      "commandName": "Project",
      "commandLineArgs": "bake C:\\temp\\blaketest" // -dr, etc.
    }
  }
}
```

**Integration testing:**

- Test with existing Blake sites
- Verify backwards compatibility
- Test on different operating systems if possible
- Check performance impact for large sites

### 4. Submitting Pull Requests

**Before submitting:**

- Ensure all tests pass
- Update documentation
- Squash commits

**Pull request guidelines:**

- Clear title and description
- Link to related issues
- Explain what changed and why
- Include testing instructions
- Be responsive to feedback

## Code Style and Conventions

Blake follows standard .NET conventions. For detailed guidelines, see [Code Style & Conventions](/pages/5%20contributing/code-style).

### Key Principles

- **Favour explicitness over cleverness**
- **Use descriptive names** for methods, variables, and classes
- **Keep methods focused** - single responsibility principle
- **Write self-documenting code** - comments explain why, not what

## Specialized Contribution Areas

Blake offers several ways to contribute beyond core development:

- **[Plugin Development](/pages/5%20contributing/writing-plugins)** - Extend Blake's functionality with custom plugins
- **[Site Template Creation](/pages/5%20contributing/creating-site-templates)** - Build templates for the community
- **[Documentation Improvements](/pages/5%20contributing/writing-plugins#documentation-contributions)** - Help make Blake more accessible

## Community Guidelines

### Be Respectful and Inclusive

- **Welcome newcomers** - everyone starts somewhere
- **Be patient** - not everyone has the same experience level
- **Give constructive feedback** - help people learn and improve
- **Assume good intentions** - most mistakes are honest errors
- **Promote diversity** - different perspectives make Blake better

### Communication Channels

- **GitHub Issues** - Bug reports, feature requests, technical discussions
- **Pull Requests** - Code review and implementation discussions
- **Documentation** - Reference information and tutorials

## Next Steps

Ready to contribute? Here's how to get started:

1. **Explore the codebase** - Clone Blake and build it locally
2. **Find your first issue** - Look for "good first issue" labels
3. **Join the community** - Introduce yourself in discussions
4. **Read specific guides** - Check out the other Contributing documentation
5. **Start small** - Begin with documentation fixes or small bug fixes

### Useful Links

**Development Guides:**
- **[How to Test](/pages/5%20contributing/how-to-test)** - Testing your changes thoroughly
- **[Build Pipeline](/pages/5%20contributing/build-pipeline)** - Understanding Blake's architecture
- **[Code Style & Conventions](/pages/5%20contributing/code-style)** - Formatting and naming guidelines

**Specialized Contributing:**
- **[Writing Plugins](/pages/5%20contributing/writing-plugins)** - Complete plugin development guide
- **[Plugin Hooks](/pages/5%20contributing/plugin-hooks)** - Available extension points
- **[Creating Site Templates](/pages/5%20contributing/creating-site-templates)** - Template development guide

:::note
**Questions or Need Help?**

Don't hesitate to reach out if you have questions:

- Create a discussion on GitHub for general questions
- Comment on relevant issues for specific problems
- Join our community chat for real-time help
- Check existing documentation and issues first

We're here to help you succeed as a Blake contributor!
:::
