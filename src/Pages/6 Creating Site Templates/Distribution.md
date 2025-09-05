---
title: 'Distributing & Maintaining Templates'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Guide to packaging, publishing, and maintaining Blake site templates for the community."
iconIdentifier: "bi bi-share-fill-nav-menu"
pageOrder: 5
category: "Creating Site Templates"
---

:::info
Ready to share your Blake template with the community? This guide covers packaging, publishing options, and maintaining your template for long-term success.
:::

## Distributing Your Template

### Package Preparation

Before publishing your template, ensure it's ready for community use:

**1. Clean up the template:**
- Remove personal content
- Add comprehensive sample content
- Test from clean installation

**2. Documentation:**
- Complete README with screenshots
- Customization guide
- Troubleshooting section

**3. Version control:**
- Tag releases appropriately
- Maintain changelog
- Use semantic versioning

### Pre-Release Testing

**Test your template thoroughly:**

```bash
# Create test directory
mkdir template-test
cd template-test

# Test template installation
blake new TestSite -t your-template-name

# Verify everything works
cd TestSite
blake bake
dotnet build
dotnet run
```

**Test with different scenarios:**
- Fresh installation on different operating systems
- Different content types and amounts
- Various customization options
- Build and deployment processes

## Publishing Options

### NuGet Package

The most reliable distribution method for Blake templates:

```xml
<!-- Package metadata in .csproj -->
<PropertyGroup>
  <PackageId>BlakeTemplate.YourTemplate</PackageId>
  <Version>1.0.0</Version>
  <Authors>Your Name</Authors>
  <Description>A beautiful Blake template for [use case]</Description>
  <PackageTags>blake-template;blazor;static-site</PackageTags>
  <PackageLicenseExpression>MIT</PackageLicenseExpression>
  <PackageProjectUrl>https://github.com/yourusername/blake-template-name</PackageProjectUrl>
  <RepositoryUrl>https://github.com/yourusername/blake-template-name</RepositoryUrl>
  <RepositoryType>git</RepositoryType>
  <PackageReadmeFile>README.md</PackageReadmeFile>
  <PackageIcon>icon.png</PackageIcon>
</PropertyGroup>

<ItemGroup>
  <None Include="README.md" Pack="true" PackagePath="\" />
  <None Include="icon.png" Pack="true" PackagePath="\" />
</ItemGroup>
```

**Publishing commands:**

```bash
# Build and publish
dotnet pack --configuration Release
dotnet nuget push bin/Release/*.nupkg --source nuget.org --api-key YOUR_KEY
```

### GitHub Template Repository

GitHub templates make it easy for users to create new repositories:

**1. Repository Setup:**
```bash
# Create repository with template code
git init
git add .
git commit -m "Initial template"
git remote add origin https://github.com/yourusername/blake-template-name
git push -u origin main
```

**2. Enable Template Features:**
- Go to repository Settings
- Check "Template repository" option
- Add "Use this template" button

**3. Repository Configuration:**
- Tag with `blake-template` topic
- Add clear description
- Include comprehensive README
- Add LICENSE file
- Create helpful issue templates

### Blake Template Registry

Submit your template to Blake's official template registry (when available):

**Submission Requirements:**
- Comprehensive documentation
- Tested installation process
- Clear licensing
- Community support commitment
- Quality code standards

## Template Maintenance

### Regular Updates

**Keep dependencies current:**

```bash
# Check for updates
dotnet list package --outdated

# Update Blake packages
dotnet add package Blake.Types --version latest
dotnet add package BlakePlugin.DocsRenderer --version latest

# Update Blazor packages
dotnet add package Microsoft.AspNetCore.Components.WebAssembly --version latest
```

**Security monitoring:**
- Monitor for security advisories
- Subscribe to Blake security notifications
- Update vulnerable dependencies promptly
- Test security updates before release

**Feature enhancements:**
- Add new capabilities based on user feedback
- Improve performance and accessibility
- Enhance documentation based on support questions
- Keep up with Blake ecosystem changes

### Community Support

**Respond to issues promptly:**
- Acknowledge issues within 24-48 hours
- Provide helpful troubleshooting steps
- Create reproducible test cases
- Fix bugs in timely manner

**Accept community contributions:**
- Welcome pull requests that improve the template
- Provide clear contribution guidelines
- Review code changes thoroughly
- Credit contributors appropriately

**Documentation maintenance:**
- Update docs for common customizations
- Add FAQ based on support questions
- Share usage examples and showcase sites
- Keep screenshots and examples current

### Version Management

**Semantic Versioning Strategy:**

- **Major (1.0.0 → 2.0.0)**: Breaking changes requiring user action
- **Minor (1.0.0 → 1.1.0)**: New features, backward compatible
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, backward compatible

**Release Process:**

```bash
# 1. Update version in project file
# 2. Update CHANGELOG.md
# 3. Create git tag
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# 4. Build and publish
dotnet pack --configuration Release
dotnet nuget push bin/Release/*.nupkg --source nuget.org --api-key YOUR_KEY

# 5. Create GitHub release with release notes
```

### Analytics and Feedback

**Track template usage:**
- Monitor NuGet download statistics
- Track GitHub repository stars/forks
- Monitor issues and discussions
- Survey users for feedback

**Improve based on data:**
- Identify common pain points
- Prioritize features based on user needs
- Address frequently reported issues
- Enhance documentation for confusing areas

## Licensing Considerations

### Choosing a License

**Popular options for Blake templates:**

- **MIT License**: Maximum freedom for users
- **Apache 2.0**: Patent protection included
- **GPL**: Ensures modifications remain open source
- **Creative Commons**: For content-focused templates

**License file example:**

```text
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full MIT license text...]
```

### Dependency Licensing

**Ensure compatibility:**
- Review all dependency licenses
- Document license requirements
- Check for license conflicts
- Include required attributions

## Success Metrics

**Track your template's impact:**

- **Downloads/Usage**: NuGet downloads, GitHub clones
- **Community Engagement**: Issues, discussions, pull requests  
- **Documentation Quality**: Support question patterns
- **User Satisfaction**: Feedback, ratings, testimonials

**Template success indicators:**
- Growing download numbers
- Active community discussions
- Minimal support burden
- Positive user feedback
- Other templates using yours as inspiration

## Next Steps

Your template is now ready for the community! Remember to:

1. **Monitor and respond** to user feedback actively
2. **Keep improving** based on real-world usage
3. **Share your experience** to help other template creators
4. **Contribute back** to the Blake ecosystem

For ongoing support and community connection:
- Join Blake community discussions
- Share your template in Blake showcase
- Help other template creators
- Contribute to Blake core development

:::note
**Template Success Tips**

- Build templates you would want to use yourself
- Prioritize documentation - it's as important as the code
- Listen to your users and iterate based on feedback
- Celebrate when others build great sites with your template
- Remember: great templates make the entire Blake ecosystem stronger!
:::