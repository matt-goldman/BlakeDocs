---
title: 'Deploying to Cloudflare'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to deploy Blake sites to Cloudflare."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 4
category: "Deploying"
---

:::info
**Summary**
Cloudflare Pages offers fast global CDN hosting for Blake sites with automatic deployments from Git. While detailed Blake-specific guides are coming soon, Cloudflare Pages works excellently with Blazor WebAssembly applications.
:::

## Cloudflare Pages Overview

Cloudflare Pages provides high-performance static site hosting with a global CDN network. It's an excellent choice for Blake sites that need:

- **Lightning-fast global delivery** through Cloudflare's CDN
- **Automatic HTTPS** and SSL certificates
- **Branch previews** for testing changes
- **Edge computing** with Cloudflare Workers
- **DDoS protection** and security features

## Quick Setup Guide

### Basic Deployment Steps

1. **Connect your repository** to Cloudflare Pages
2. **Configure build settings**:
   - **Framework preset**: None (custom)
   - **Build command**: `blake bake && dotnet publish -c Release`
   - **Build output directory**: `bin/Release/net9.0/publish/wwwroot`
   - **Root directory**: `/src` (if Blake project is in src folder)

3. **Environment variables**:
   ```
   DOTNET_VERSION=9.0.101
   ```

### Build Configuration

Blake sites require a custom build process on Cloudflare Pages:

```bash
# Install .NET
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --version 9.0.101
export PATH="$HOME/.dotnet:$PATH"

# Install Blake CLI
dotnet tool install -g Blake.CLI

# Generate content
blake bake

# Build site
dotnet publish -c Release
```

## GitHub Actions Alternative

For more control, you can use GitHub Actions to build and deploy to Cloudflare Pages:

```yaml
name: Deploy to Cloudflare Pages

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
        run: dotnet publish -c Release -o release

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: your-blake-site
          directory: release/wwwroot
```

## Key Considerations

### SPA Routing

Configure Cloudflare Pages for single-page application routing:

1. Add a `_redirects` file to your `wwwroot` folder:
   ```
   /*    /index.html   200
   ```

### Base Path

Cloudflare Pages serves from the root domain, so keep the default base path:
```html
<base href="/" />
```

## Coming Soon

:::note
**Detailed Guide in Development**
A comprehensive Blake-specific guide for Cloudflare Pages deployment is coming soon. This will include:

- **Step-by-step setup** with screenshots
- **Advanced configuration** options
- **Custom domain** and SSL setup
- **Edge Workers integration** for dynamic functionality
- **Performance optimization** tips
- **Troubleshooting** common issues

In the meantime, you can reference the [official Cloudflare Pages documentation](https://developers.cloudflare.com/pages/) for general deployment guidance.
:::

## Resources

While waiting for the detailed Blake guide, these resources will help:

- **[Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)** - Official platform documentation
- **[Blazor WebAssembly Deployment](https://docs.microsoft.com/aspnet/core/blazor/host-and-deploy/webassembly)** - Microsoft's deployment guide
- **[Blake Discussions](https://github.com/matt-goldman/blake/discussions)** - Community support and examples

## Alternative Options

Consider these well-documented alternatives while Cloudflare Pages guidance is being developed:

- **[GitHub Pages](/pages/3%20deploying/github-pages)** - Free hosting with detailed Blake documentation
- **[Azure Static Web Apps](/pages/3%20deploying/azure-swa)** - Enterprise features with comprehensive Blake guide
- **[Vercel](/pages/3%20deploying/vercel)** - Modern deployment platform

## Contributing

If you successfully deploy Blake sites to Cloudflare Pages, consider sharing your experience:

1. **Join [Blake Discussions](https://github.com/matt-goldman/blake/discussions)**
2. **Share your workflow** and configuration
3. **Help improve this documentation** by contributing examples

Your contributions help make Blake deployment guides better for everyone!
