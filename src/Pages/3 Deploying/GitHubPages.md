---
title: 'GitHub Pages Deployment'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to deploy Blake sites to GitHub Pages."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 2
category: "Deploying"
quickAccess: 4
---

:::info
**Summary**
Deploy Blake sites to GitHub Pages using automated GitHub Actions workflows. This free hosting solution works directly from your repository and includes automatic builds when you push changes to your main branch.
:::

## GitHub Pages Overview

GitHub Pages provides free static website hosting directly from your GitHub repository. It's an excellent choice for Blake sites, especially for:

- **Documentation sites** - Perfect for project documentation
- **Personal blogs** - Free hosting with custom domain support
- **Open source projects** - Showcase your work with automatic deployments

## Repository Setup

### 1. Enable GitHub Pages

1. Go to your repository **Settings**
2. Scroll to **Pages** section
3. Under **Source**, select **GitHub Actions** (recommended)
   - This allows custom build processes with Blake
   - Alternative: Select **Deploy from branch** and choose `gh-pages` branch

### 2. Repository Structure

Your Blake site repository should be structured like this:

```
your-blake-site/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml    # Deployment workflow
├── src/                        # Your Blake site source
├── README.md
└── .gitignore
```

## GitHub Actions Workflow

The GitHub Actions workflow automates the entire deployment process. Here's a complete workflow that builds and deploys your Blake site:

```yaml
name: Deploy to GitHub Pages

# Run on pushes to main branch
on:
  push:
    branches: [main]
  workflow_dispatch: # Allow manual triggering

permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy-to-github-pages:
    runs-on: ubuntu-latest
    steps:
      # Checkout the repository
      - uses: actions/checkout@v4

      # Setup .NET 9
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 9.0.x

      # Install Blake CLI
      - name: Install Blake CLI
        run: dotnet tool install -g Blake.CLI

      # Generate Blake content
      - name: Run blake bake
        run: blake bake

      # Build the Blazor WebAssembly app
      - name: Publish .NET Project
        run: dotnet publish -c Release -o release --nologo

      # Fix base path for GitHub Pages subdirectory hosting
      - name: Change base-tag in index.html
        run: |
          REPO_NAME="${{ github.event.repository.name }}"
          sed -i "s|<base href=\"/\" />|<base href=\"/${REPO_NAME}/\" />|g" release/wwwroot/index.html

      # Copy index.html to 404.html for SPA routing
      - name: Copy index.html to 404.html
        run: cp release/wwwroot/index.html release/wwwroot/404.html

      # Add .nojekyll file to bypass Jekyll processing
      - name: Add .nojekyll file
        run: touch release/wwwroot/.nojekyll

      # Upload artifact for GitHub Pages
      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: release/wwwroot

      # Deploy to GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

:::note
**Workflow Adaptation**
This workflow is adapted from the [Blake Simple Tailwind Sample](https://github.com/matt-goldman/BlakeSimpleTailwindSample). You can find more examples and variations in Blake site templates.
:::

## Key Configuration Steps

### Base Path Configuration

GitHub Pages serves repository sites from `https://username.github.io/repository-name/`. The workflow automatically adjusts the base path:

```bash
# Changes this:
<base href="/" />

# To this:
<base href="/repository-name/" />
```

### SPA Routing Support

Blake sites use client-side routing. The workflow ensures proper navigation by:

1. **Copying index.html to 404.html** - GitHub Pages serves this for missing routes
2. **Adding .nojekyll file** - Allows files starting with underscore (Blazor assets)

## Custom Domain Setup

### Using a Custom Domain

If you have a custom domain:

1. **Add CNAME file** to your `wwwroot` folder containing your domain:
   ```
   mydomain.com
   ```

2. **Configure DNS** with your domain provider:
   - **A records** pointing to GitHub Pages IPs, or
   - **CNAME record** pointing to `username.github.io`

3. **Update base path** in your workflow (use "/" for custom domains):
   ```yaml
   - name: Change base-tag for custom domain
     run: |
       # Keep base path as "/" for custom domains
       echo "Using custom domain - keeping base path as /"
   ```

## Workflow Secrets

The GitHub Actions workflow doesn't require additional secrets when using the built-in GitHub Pages deployment action. The `GITHUB_TOKEN` is automatically provided.

### Optional Secrets

For advanced scenarios, you might need:

- **PERSONAL_ACCESS_TOKEN** - For cross-repository deployments
- **CUSTOM_DOMAIN_TOKEN** - For automated domain verification

## Troubleshooting

### Common Issues

**Build Fails on Blake Bake**
```bash
# Ensure Blake CLI installation
- name: Install Blake CLI
  run: dotnet tool install -g Blake.CLI --version 1.0.12
```

**404 Errors on Navigation**
- Verify `404.html` is copied from `index.html`
- Check `.nojekyll` file exists in output
- Confirm SPA routing is enabled in your Blake app

**Styling/Assets Not Loading**
- Verify base path is correctly set for subdirectory hosting
- Check that all assets use relative paths
- Ensure `.nojekyll` file is present for underscore-prefixed files

### Workflow Debugging

Enable detailed logging by adding environment variables:

```yaml
env:
  ACTIONS_RUNNER_DEBUG: true
  ACTIONS_STEP_DEBUG: true
```

## Alternative: Branch-Based Deployment

If you prefer deploying from a specific branch instead of GitHub Actions:

1. **Set Pages source** to "Deploy from branch"
2. **Select `gh-pages` branch**
3. **Use a simplified workflow** that pushes to gh-pages:

```yaml
- name: Deploy to gh-pages branch
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    branch: gh-pages
    folder: release/wwwroot
```

## Performance Optimization

### Caching

GitHub Actions supports dependency caching:

```yaml
- name: Cache .NET packages
  uses: actions/cache@v3
  with:
    path: ~/.nuget/packages
    key: ${{ runner.os }}-nuget-${{ hashFiles('**/*.csproj') }}
    restore-keys: |
      ${{ runner.os }}-nuget-
```

### Parallel Jobs

For large sites, consider separating build and deploy:

```yaml
jobs:
  build:
    # Build job
  deploy:
    needs: build
    # Deploy job
```

## Next Steps

- **Explore [Azure Static Web Apps](/pages/3%20deploying/azure-swa)** for enterprise features
- **Learn about [Blake site templates](/pages/2%20using%20blake/site-templates)** for pre-configured workflows
- **Join [Blake Discussions](https://github.com/matt-goldman/blake/discussions)** for deployment tips and community support
