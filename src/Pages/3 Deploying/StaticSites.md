---
title: 'Static Site Deployment'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to deploy Blake sites as static sites."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Deploying"
---

:::summary
Blake sites are Blazor WebAssembly applications that can be deployed to any static web hosting platform. This section covers deployment strategies from GitHub Pages to cloud platforms, with ready-to-use GitHub Actions workflows and platform-specific guidance.
:::

## Understanding Blake Site Deployment

Blake generates standard Blazor WebAssembly applications, which means you can deploy your Blake site anywhere that supports static web hosting. The build output is a collection of static files (HTML, CSS, JavaScript, and WebAssembly) that can be served by any web server.

:::note
It's possible to use Blazor Server or even mixed rendering apps too. There are no templates for these, but if you're comfortable with Blazor's render modes, and you've read the documentation in section 2 (Using Blake), you should be able to create one. In this case, you can't deploy as a static site, and will need to host the server. Many of the providers mentioned here will support this, but you'll need to adjust the workflow accordingly.
:::

## Deployment Options

### Static Hosting Platforms

Blake sites work perfectly with modern static hosting platforms:

- **[GitHub Pages](/pages/3%20deploying/github-pages)** - Free hosting directly from your repository
- **[Azure Static Web Apps](/pages/3%20deploying/azure-swa)** - Microsoft's static hosting with CI/CD integration  
- **[Cloudflare Pages](/pages/3%20deploying/cloudflare)** - Fast global CDN with automatic builds
- **[Vercel](/pages/3%20deploying/vercel)** - Optimized for frontend frameworks
- **Netlify** - Popular choice with form handling and serverless functions

### Self-Hosting Options

You can also host Blake sites on your own infrastructure:

- **Traditional web servers** (Apache, Nginx, IIS)
- **Cloud storage** with web hosting (AWS S3, Azure Blob Storage)
- **Container platforms** (Docker, Kubernetes)

## GitHub Actions Integration

Blake site templates should include GitHub Actions workflows for automated deployment. Template authors are encouraged to provide workflows for multiple hosting platforms, allowing you to choose the deployment strategy that fits your needs.

### Available Workflows

Common workflow templates you'll find in Blake site templates:

- **GitHub Pages deployment** - Automated builds and publishing to gh-pages branch
- **Azure Static Web Apps** - Direct integration with Azure hosting
- **Multi-platform workflows** - Deploy to multiple environments simultaneously

:::note
**Template Flexibility**    
Different Blake site templates may include different sets of deployment workflows. You can mix and match workflows from different templates or create custom ones for your specific hosting needs. If a template includes multiple workflows, ensure you disable any that you don't need.
:::

## Build Process Overview

All Blake deployments follow the same basic process:

1. **Install .NET SDK** (version 9.0 or later)
2. **Install Blake CLI** (`dotnet tool install -g Blake.CLI`)
3. **Generate content** (`blake bake`)
4. **Build the application** (`dotnet publish`)
5. **Deploy static files** (platform-specific)

The generated `wwwroot` folder contains all files needed for deployment.

## Configuration Considerations

### Base Path

Some hosting platforms serve sites from subdirectories (like GitHub Pages repository sites). You may need to adjust the base path in your `index.html`:

```html
<!-- Default -->
<base href="/" />

<!-- Subdirectory hosting -->
<base href="/repository-name/" />
```

### Routing

Blake sites use Blazor WebAssembly routing. For proper navigation:

- Configure your host to serve `index.html` for 404 errors (SPA fallback)
- Add `.nojekyll` file for GitHub Pages to allow underscore-prefixed files
- Copy `index.html` to `404.html` for platforms that don't support SPA fallback configuration

## Platform-Specific Guides

Each hosting platform has specific requirements and optimizations:

- **[GitHub Pages](/pages/3%20deploying/github-pages)** - Repository setup, base path configuration, and workflow automation
- **[Azure Static Web Apps](/pages/3%20deploying/azure-swa)** - Azure integration, custom domains, and environment management
- **[Cloudflare Pages](/pages/3%20deploying/cloudflare)** - CDN optimization and build settings
- **[Vercel](/pages/3%20deploying/vercel)** - Framework detection and deployment configuration

## Getting Help

For deployment scenarios not covered in this documentation (such as Azure DevOps, Bitbucket Pipelines, or other CI/CD systems), we encourage you to:

1. **Check the [Blake Discussions](https://github.com/matt-goldman/blake/discussions)** for community solutions
2. **Share your deployment setup** to help other Blake users
3. **Request new deployment guides** by opening a discussion

The Blake community focuses primarily on GitHub Actions workflows, but we welcome contributions and discussions about other deployment strategies.

## Next Steps

Choose your deployment platform and follow the specific guide:

- New to static hosting? Start with **[GitHub Pages](/pages/3%20deploying/github-pages)**
- Need enterprise features? Try **[Azure Static Web Apps](/pages/3%20deploying/azure-swa)**
- Want global performance? Consider **[Cloudflare Pages](/pages/3%20deploying/cloudflare)**
- Prefer modern development workflows? Check out **[Vercel](/pages/3%20deploying/vercel)**
