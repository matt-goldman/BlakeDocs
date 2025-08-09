# Blake Template: [Template Name]

A [brief description] template for Blake static site generator.

![Template Screenshot](screenshot.png)

## Features

- ✨ [Feature 1]
- 🎨 [Feature 2]
- 📱 Responsive design
- ⚡ Fast loading
- 🔍 Built-in search (optional)
- 📡 RSS feed generation (optional)

## Quick Start

### Using Blake CLI

```bash
# Create new site from template
blake new mysite --template [template-name]
cd mysite

# Generate and run
blake bake
dotnet run
```

### Manual Setup

```bash
# Clone template
git clone https://github.com/[username]/blake-template-[name]
cd blake-template-[name]

# Install dependencies
dotnet restore

# Generate content and run
blake bake
dotnet run
```

## Customization (if template supports it)

### Site Configuration

Edit `appsettings.json` to customize your site:

```json
{
  "Site": {
    "Name": "Your Site Name",
    "Description": "Your site description",
    "Author": "Your Name"
  }
}
```

## Adding Content

Create Markdown files in `src/Pages/`:

```markdown
---
title: "My First Post"
date: 2024-01-15
description: "A description of my post"
tags: ["blake", "tutorial"]
---

# My First Post

Write your content here using standard Markdown.

## Subheading

- List item 1
- List item 2

[Link text](https://example.com)
```

### Custom Components

This template includes custom components:

```markdown
:::callout{type="info"}
This is a custom callout component.
:::
```

## Project Structure

```
your-site/
├── src/
│   ├── Pages/           # Your content goes here
│   ├── Components/      # Reusable Blazor components
│   ├── Layout/         # Site layout components
│   └── wwwroot/        # Static assets (CSS, images, etc.)
├── README.md           # This file
└── appsettings.json    # Site configuration
```

## Deployment

### GitHub Pages

Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '9.0.x'
      - name: Install Blake CLI
        run: dotnet tool install -g Blake.CLI
      - name: Build site
        run: |
          blake bake
          dotnet publish -c Release
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: src/bin/Release/net9.0/publish/wwwroot
```

### Netlify

Create `netlify.toml`:

```toml
[build]
  command = "dotnet tool install -g Blake.CLI && blake bake && dotnet publish -c Release"
  publish = "src/bin/Release/net9.0/publish/wwwroot"
```

## Troubleshooting

**Template not loading:**
- Verify Blake CLI installation: `blake --version`
- Check for template syntax errors

**Styles not loading:**
- Check CSS file paths in wwwroot
- Verify files are included in project

**Content not updating:**
- Run `blake bake` after content changes
- Clear browser cache

## Support

For Blake-specific questions, see the [Blake Documentation FAQ](link-to-blake-docs-faq).

For template-specific issues, please [open an issue](https://github.com/[username]/[repo]/issues).

## License

This template is licensed under [License Type]. See LICENSE file for details.