# BlakeDocs

A documentation site template for [Blake](https://www.blake-ssg.org/), the Blazor-based static site generator. This repository serves dual purposes:

- **Documentation site** for Blake itself
- **Reference template** for building documentation sites with Blake

## ✨ Features

- 📝 Markdown-based content with YAML frontmatter
- 🎨 Clean, responsive documentation layout
- 🔍 Built-in search functionality
- ⏱️ Reading time estimation
- 🧭 Automatic navigation generation
- 📱 Mobile-friendly design
- ⚡ Fast Blazor WebAssembly performance

## 🚀 Using as Template

### Option 1: Blake CLI (Recommended)
```bash
# Install Blake CLI
dotnet tool install -g Blake.CLI

# Create new documentation site
blake new mydocs --template blakedocs
cd mydocs

# Generate and run
blake bake
dotnet run
```

### Option 2: Manual Setup
```bash
# Clone this repository
git clone https://github.com/matt-goldman/BlakeDocs.git mydocs
cd mydocs

# Install dependencies
dotnet restore

# Generate content and run
blake bake
dotnet run
```

## 📚 Live Demo

Explore the full documentation and see this template in action at [blake-ssg.org](https://www.blake-ssg.org/).

## 📖 Learn More

Visit the [Blake documentation](https://www.blake-ssg.org/) to learn about:
- Content authoring with Markdown
- Customizing templates and layouts  
- Deploying your documentation site
- Advanced Blake features and plugins
