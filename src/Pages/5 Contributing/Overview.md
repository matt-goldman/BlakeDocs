---
title: Contributing to Blake
description: How to get started contributing to the Blake static site generator and its ecosystem.
category: "Contributing"
iconIdentifier: "bi bi-heart-fill-nav-menu"
pageOrder: 1
---

:::info
**Summary**
Blake welcomes contributions from developers of all experience levels. Whether you want to fix bugs, add features, create plugins, improve documentation, or build site templates, this guide will help you get started with contributing to Blake's open-source ecosystem.
:::

## Welcome to Blake Development

Blake is an open-source static site generator that follows the philosophy of "Occam's Blazor" - the solution with the fewest assumptions is often the best. While Blake development requires .NET expertise, Blake-powered sites are accessible to anyone wanting a static site. Blake templates can serve a broad audience, not just .NET developers.

**Our community values:**
- **Simplicity over complexity** - Zero-config solutions when possible
- **Just-in-time knowledge** - Documentation that helps when you need it
- **Developer experience** - Tools that feel familiar to .NET developers
- **Transparency** - Clear behavior without hidden magic
- **Collaboration** - Welcoming contributions from all skill levels

## Ways to Contribute

### 🎨 Site Templates and Themes

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

**Good bug report includes:**
- Clear title describing the issue
- Steps to reproduce the problem
- Expected vs. actual behavior
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

**Clone the repository:**
```bash
git clone https://github.com/matt-goldman/blake.git
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

**Integration testing:**
- Test with existing Blake sites
- Verify backwards compatibility
- Test on different operating systems if possible
- Check performance impact for large sites

### 4. Submitting Pull Requests

**Before submitting:**
- Ensure all tests pass
- Update documentation
- Add changelog entries if needed
- Squash commits if requested

**Pull request guidelines:**
- Clear title and description
- Link to related issues
- Explain what changed and why
- Include testing instructions
- Be responsive to feedback

## Code Style and Conventions

Blake follows standard .NET conventions with some specific guidelines:

### General Principles

- **Favor explicitness over cleverness**
- **Use descriptive names** for methods, variables, and classes
- **Keep methods focused** - single responsibility principle
- **Prefer composition** over inheritance where appropriate
- **Write self-documenting code** - comments explain why, not what

### Specific Guidelines

For detailed code style guidelines, see [Code Style & Conventions](/pages/5%20contributing/code-style).

### File Organization

- **Follow established patterns** in the codebase
- **Group related functionality** together
- **Use appropriate namespaces** that reflect the folder structure
- **Keep files focused** - split large files when they serve multiple purposes

## Plugin Development

Blake's plugin system is a major extensibility point. If you're interested in plugin development:

### Getting Started with Plugins

1. **Read the [Writing Plugins](/pages/5%20contributing/writing-plugins) guide**
2. **Study existing plugins** like BlakePlugin.ReadTime and BlakePlugin.DocsRenderer
3. **Start with simple plugins** before tackling complex functionality
4. **Follow plugin naming conventions** (`BlakePlugin.YourPluginName`)

### Plugin Contribution Guidelines

- **Zero-configuration preferred** - plugins should work out of the box
- **Clear documentation** - explain what the plugin does and when to use it
- **Good error handling** - fail gracefully, don't break builds
- **Performance conscious** - minimize impact on build times
- **Follow Blake philosophy** - simplicity and transparency

## Site Template Development

Help expand Blake's template ecosystem:

### Template Guidelines

- **Responsive design** - work well on all device sizes
- **Accessibility** - follow WCAG guidelines
- **Performance** - optimize for fast loading
- **Customization** - make it easy to adapt the template
- **Documentation** - include setup and customization instructions

### Template Structure

For guidance on creating site templates, see [Creating Site Templates](/pages/5%20contributing/creating-site-templates).

## Documentation Contributions

Good documentation is crucial for Blake's adoption and success:

### Documentation Principles

- **User-focused** - solve real problems developers face
- **Progressive disclosure** - basic concepts first, advanced topics later
- **Practical examples** - include working code samples
- **Current and accurate** - keep information up to date
- **Consistent style** - follow established patterns

### Documentation Standards

- Use clear, concise language
- Include code examples for concepts
- Cross-reference related topics
- Test all code samples
- Follow the established frontmatter format

## Community Guidelines

### Be Respectful and Inclusive

- **Welcome newcomers** - everyone starts somewhere
- **Be patient** - not everyone has the same experience level
- **Give constructive feedback** - help people learn and improve
- **Assume good intentions** - most mistakes are honest errors
- **Support diversity** - different perspectives make Blake better

### Communication Channels

- **GitHub Issues** - Bug reports, feature requests, technical discussions
- **Pull Requests** - Code review and implementation discussions
- **Discord/Community Forums** - General questions and community support
- **Documentation** - Reference information and tutorials

## Recognition and Rewards

### How We Recognize Contributors

- **Contributor credits** in release notes
- **Mention in documentation** for significant contributions
- **Repository collaborator access** for consistent contributors
- **Speaking opportunities** at conferences and meetups
- **Early preview access** to new features

### Building Your Reputation

Contributing to Blake is a great way to:
- **Build your portfolio** with open-source contributions
- **Learn new technologies** and best practices
- **Network with other developers** in the .NET community
- **Give back** to the developer community
- **Influence** the direction of Blake's development

## Next Steps

Ready to contribute? Here's how to get started:

1. **Explore the codebase** - Clone Blake and build it locally
2. **Find your first issue** - Look for "good first issue" labels
3. **Join the community** - Introduce yourself in discussions
4. **Read specific guides** - Check out the other Contributing documentation
5. **Start small** - Begin with documentation fixes or small bug fixes

### Useful Links

- **[Code Style & Conventions](/pages/5%20contributing/code-style)** - Formatting and naming guidelines
- **[Writing Plugins](/pages/5%20contributing/writing-plugins)** - Complete plugin development guide
- **[Build Pipeline](/pages/5%20contributing/build-pipeline)** - Understanding Blake's architecture
- **[How to Test](/pages/5%20contributing/how-to-test)** - Testing your changes
- **[Plugin Hooks](/pages/5%20contributing/plugin-hooks)** - Available extension points

:::note
**Questions or Need Help?**

Don't hesitate to reach out if you have questions:
- Create a discussion on GitHub for general questions
- Comment on relevant issues for specific problems
- Join our community chat for real-time help
- Check existing documentation and issues first

We're here to help you succeed as a Blake contributor!
:::
