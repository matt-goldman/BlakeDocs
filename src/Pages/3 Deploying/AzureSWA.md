---
title: 'Deploying to Azure Static Web Apps'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to deploy Blake sites to Azure Static Web Apps."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 3
category: "Deploying"
quickAccess: 3
---

:::info
**Summary**
Azure Static Web Apps provides enterprise-grade hosting for Blake sites with built-in CI/CD, custom domains, and serverless API integration. Deploy automatically from GitHub with a single workflow file.
:::

## Azure Static Web Apps Overview

Azure Static Web Apps (SWA) is Microsoft's static hosting platform optimized for modern web applications. It offers excellent features for Blake sites:

- **Automatic deployments** from GitHub repositories
- **Free SSL certificates** and custom domain support
- **Global CDN** for fast content delivery
- **Staging environments** from pull requests
- **Serverless API integration** with Azure Functions
- **Built-in authentication** providers

## Prerequisites

Before deploying to Azure Static Web Apps:

1. **Azure account** - Get started with a [free account](https://azure.microsoft.com/free/)
2. **GitHub repository** containing your Blake site
3. **Azure CLI** (optional, for command-line setup)

## Creating an Azure Static Web App

### Option 1: Azure Portal (Recommended)

1. **Sign in** to the [Azure Portal](https://portal.azure.com)
2. **Create a resource** and search for "Static Web App"
3. **Configure the basic settings**:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: Your static web app name
   - **Plan type**: Free (for most Blake sites)
   - **Region**: Choose closest to your users

4. **Connect to GitHub**:
   - **Sign in** to GitHub when prompted
   - **Select** your organization and repository
   - **Branch**: Usually `main` or `master`

5. **Build configuration**:
   - **Build preset**: Select "Blazor"
   - **App location**: `/src` (or wherever your Blake project is)
   - **Api location**: Leave blank (unless you have Azure Functions)
   - **Output location**: `wwwroot`

### Option 2: Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name myBlakeSite --location "East US"

# Create static web app
az staticwebapp create \
  --name myBlakeSite \
  --resource-group myBlakeSite \
  --source https://github.com/username/repository \
  --location "East US" \
  --branch main \
  --app-location "/src" \
  --output-location "wwwroot"
```

## GitHub Actions Workflow

Azure automatically creates a GitHub Actions workflow when you connect your repository. Here's what the complete workflow looks like:

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main
  workflow_dispatch:

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      # Checkout repository
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
      - name: Bake static content
        run: blake bake

      # Build the Blazor WebAssembly app
      - name: Build the site
        run: dotnet publish --configuration Release -o site_output

      # Deploy to Azure Static Web Apps
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "site_output/wwwroot"
          skip_app_build: true  # We build manually above

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

:::note
**Auto-Generated Workflow**
Azure creates this workflow automatically when you set up your Static Web App. The workflow is based on the [Blake Simple Tailwind Sample](https://github.com/matt-goldman/BlakeSimpleTailwindSample) configuration.
:::

## Key Configuration

### Build Settings

Azure Static Web Apps needs to know how to build your Blake site:

- **App location**: `/src` (where your `.csproj` file is located)
- **Output location**: `wwwroot` (Blazor WebAssembly output folder)
- **Skip app build**: `true` (we handle the build manually for Blake sites)

### API Token Secret

The workflow uses `AZURE_STATIC_WEB_APPS_API_TOKEN`, which Azure automatically adds to your repository secrets when you create the Static Web App.

## Custom Domains

### Adding a Custom Domain

1. **In Azure Portal**, go to your Static Web App
2. **Navigate** to "Custom domains" in the left menu
3. **Add** your custom domain
4. **Configure DNS** with your domain provider:

```dns
# CNAME record (recommended)
www.yourdomain.com -> your-app-name.azurestaticapps.net

# Or A record for root domain
yourdomain.com -> [Azure IP addresses]
```

### SSL Certificates

Azure Static Web Apps automatically provides free SSL certificates for:
- Default `.azurestaticapps.net` domains
- Custom domains after DNS verification

## Environment Configuration

### Staging Environments

Azure Static Web Apps automatically creates staging environments for pull requests:

- **Production**: Builds from your main branch
- **Staging**: Each PR gets a unique URL for testing
- **Automatic cleanup**: Staging environments are removed when PRs are closed

### Environment Variables

Add environment variables in the Azure Portal:

1. **Go to** your Static Web App in Azure Portal
2. **Select** "Configuration" from the left menu
3. **Add** application settings as needed

Common Blake site configurations:
```
BaseUrl=https://yourdomain.com
Environment=Production
```

## Authentication (Optional)

Azure Static Web Apps provides built-in authentication with major providers:

### Enabling Authentication

1. **In Azure Portal**, go to "Role management"
2. **Configure** authentication providers:
   - GitHub
   - Azure Active Directory
   - Twitter
   - Google
   - Facebook

### Protecting Routes

Create a `staticwebapp.config.json` file in your `wwwroot` folder:

```json
{
  "routes": [
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    },
    {
      "route": "/profile/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/github",
      "statusCode": 302
    }
  }
}
```

## Monitoring and Diagnostics

### Application Insights

Enable monitoring for your Blake site:

1. **Create** an Application Insights resource
2. **Link** it to your Static Web App
3. **Add** the connection string to your environment variables

### Log Streaming

View real-time logs in the Azure Portal:
- **Go to** your Static Web App
- **Select** "Log Stream" from the left menu
- **Monitor** deployment and runtime logs

## Troubleshooting

### Common Issues

**Blake CLI Not Found**
```yaml
# Ensure Blake CLI is installed
- name: Install Blake CLI
  run: dotnet tool install -g Blake.CLI --version 1.0.12
```

**Build Fails During Publish**
```yaml
# Run blake bake before building
- name: Bake static content
  run: blake bake
  working-directory: ./src  # If Blake project is in src folder
```

**Assets Not Loading**
- Check that base path is set to "/" (default for custom domains)
- Verify `wwwroot` folder structure is correct
- Ensure all asset paths are relative

### Deployment Logs

View detailed deployment information:
1. **Go to** Actions tab in your GitHub repository
2. **Click** on the failed workflow run
3. **Expand** the "Build And Deploy" step for detailed logs

## Cost Management

### Free Tier Limits

Azure Static Web Apps free tier includes:
- **100 GB bandwidth** per month
- **0.5 GB storage**
- **2 custom domains**
- **Unlimited** staging environments

### Scaling Up

For larger Blake sites, consider the Standard tier:
- **100 GB bandwidth** per month (then pay-per-use)
- **0.5 GB storage** (then pay-per-use)
- **5 custom domains** (then pay-per-domain)
- **Password protection** for staging environments

## Next Steps

- **Configure [custom domains and SSL](https://docs.microsoft.com/azure/static-web-apps/custom-domain)**
- **Set up [authentication](https://docs.microsoft.com/azure/static-web-apps/authentication-authorization)**
- **Add [Azure Functions APIs](https://docs.microsoft.com/azure/static-web-apps/add-api)** for dynamic functionality
- **Explore [GitHub Pages](/pages/3%20deploying/github-pages)** for open-source projects
- **Learn about [Blake site templates](/pages/2%20using%20blake/site-templates)** with pre-configured Azure workflows
