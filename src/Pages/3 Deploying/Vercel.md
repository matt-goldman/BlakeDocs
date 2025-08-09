---
title: 'Deploying to Vercel'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to deploy Blake sites to Vercel."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 5
category: "Deploying"
---

:::summary
Vercel provides optimized hosting for frontend frameworks and works well with Blake sites. While detailed Blake-specific documentation is coming soon, Vercel's Blazor WebAssembly support makes it a viable deployment option.
:::

## Vercel Overview

Vercel is a modern deployment platform optimized for frontend frameworks and static sites. It offers several benefits for Blake sites:

- **Zero-configuration deployments** for many frameworks
- **Automatic HTTPS** and global CDN
- **Preview deployments** for every Git push
- **Edge functions** for server-side logic
- **Analytics and performance insights**
- **Seamless Git integration**

## Quick Deployment Guide

### Basic Setup

1. **Import your repository** to Vercel
2. **Configure build settings**:
   - **Framework preset**: Other
   - **Build command**: `blake bake && dotnet publish -c Release -o dist`
   - **Output directory**: `dist/wwwroot`
   - **Install command**: Leave default

### Environment Variables

Add these environment variables in your Vercel project settings:

```
DOTNET_VERSION=9.0.101
ENABLE_NATIVE_COMPILE=false
```

### Custom Build Script

Create a `build.sh` script for more reliable builds:

```bash
#!/bin/bash
set -e

# Install .NET
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --version 9.0.101
export PATH="$HOME/.dotnet:$PATH"

# Install Blake CLI
dotnet tool install -g Blake.CLI

# Generate Blake content
blake bake

# Build the site
dotnet publish -c Release -o dist

echo "Build completed successfully"
```

Make it executable and reference it in package.json:

```json
{
  "scripts": {
    "build": "./build.sh"
  }
}
```

## GitHub Actions Alternative

For better control over the build process, consider using GitHub Actions with Vercel CLI:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 9.0.x

      - name: Install Blake CLI
        run: dotnet tool install -g Blake.CLI

      - name: Generate content
        run: blake bake

      - name: Build site
        run: dotnet publish -c Release -o build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: build/wwwroot
```

## Configuration Considerations

### SPA Routing

Create a `vercel.json` file in your project root for proper single-page application routing:

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Base Path

Vercel serves sites from the root domain, so use the default base path:
```html
<base href="/" />
```

### Custom Domains

Vercel makes custom domain setup straightforward:
1. **Add domain** in Vercel dashboard
2. **Configure DNS** according to Vercel's instructions
3. **SSL certificates** are handled automatically

## Coming Soon

:::note
**Comprehensive Blake Guide in Progress**
A detailed Blake-specific deployment guide for Vercel is being developed. This will include:

- **Complete setup walkthrough** with visual guides
- **Optimized build configurations** for Blake sites
- **Custom domain and SSL setup**
- **Environment-specific deployments** (staging, production)
- **Performance optimization** techniques
- **Edge functions integration** for enhanced functionality
- **Troubleshooting guide** for common deployment issues

For now, you can reference the [official Vercel documentation](https://vercel.com/docs) for general deployment guidance and Blazor WebAssembly specifics.
:::

## Known Considerations

### Build Environment

Vercel's build environment has some limitations for .NET applications:

- **Build time limits** on free tier (45 minutes)
- **Memory constraints** for large Blake sites
- **Custom runtime requirements** for .NET 9

Consider GitHub Actions for more complex Blake sites or those requiring longer build times.

### Framework Detection

Vercel may not automatically detect Blake/Blazor WebAssembly projects. You'll need to:

1. **Set framework preset** to "Other"
2. **Configure build commands** manually
3. **Specify output directory** correctly

## Resources and Documentation

While the dedicated Blake guide is in development:

- **[Vercel Documentation](https://vercel.com/docs)** - Platform documentation and deployment guides
- **[Blazor WebAssembly Deployment](https://docs.microsoft.com/aspnet/core/blazor/host-and-deploy/webassembly)** - Microsoft's official deployment guidance
- **[Blake Community Discussions](https://github.com/matt-goldman/blake/discussions)** - Get help from other Blake users

## Alternative Deployment Options

While waiting for comprehensive Vercel guidance, consider these well-documented alternatives:

- **[GitHub Pages](/pages/3%20deploying/github-pages)** - Free hosting with complete Blake documentation
- **[Azure Static Web Apps](/pages/3%20deploying/azure-swa)** - Enterprise features with detailed Blake setup guide
- **[Cloudflare Pages](/pages/3%20deploying/cloudflare)** - Fast global CDN with growing Blake community support

## Community Contributions

Help improve Blake's Vercel deployment documentation:

1. **Share your experience** deploying Blake sites to Vercel
2. **Join discussions** in the [Blake GitHub Discussions](https://github.com/matt-goldman/blake/discussions)
3. **Contribute examples** and working configurations
4. **Report issues** and solutions you've discovered

Your input helps create better documentation for the entire Blake community!

## Next Steps

- **Try the basic setup** with your Blake site
- **Join [Blake Discussions](https://github.com/matt-goldman/blake/discussions)** for community support
- **Consider [GitHub Pages](/pages/3%20deploying/github-pages)** or [Azure SWA](/pages/3%20deploying/azure-swa) for well-documented alternatives
- **Stay tuned** for the comprehensive Vercel deployment guide
