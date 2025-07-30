---
title: 'Introduction to Blake'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Explains the purpose and features of Blake, a Blazor-based static site generator."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
---

## Welcome to Blake

**Blake** is a Blazor-based static site generator that combines Markdown content with Razor templates and Blazor components.

- Minimal configuration
- Fully .NET-native
- Designed for simplicity and control

Get started with the basics, understand the philosophy, and bake your first site.


## What is Blake?

Blake is a static site generator that leverages the power of Blazor and Razor syntax to create fast, efficient, and easy-to-maintain websites. It allows you to write content in Markdown while using Razor templates for layout and Blazor components for interactivity.

Blake is designed to be minimalistic, focusing on simplicity and ease of use. It eliminates the need for complex configurations and allows you to focus on creating content.

## Why use Blake? (Minimalism, .NET-native, Razor-based)

Blake is built with the following principles in mind:

### Minimalism

Blake aims to provide a straightforward and intuitive experience. It avoids unnecessary complexity, allowing you to focus on content creation rather than configuration.

### .NET-native

Blake is built entirely in .NET, making it a natural choice for .NET developers. It leverages the power of the .NET ecosystem, allowing you to use familiar tools and libraries.

### Razor-based

Blake is based on the principle that developers don't want to learn an arbitrary or arcane templating syntax. Instead, it uses Razor syntax, which is familiar to many .NET developers. This allows you to create dynamic and interactive content without having to learn a new language or framework.

Blake didn't invent a templating engine - it recognised that Razor already is one.

## Core philosophy: Bake, don't wrangle

For a deeper dive into Blake's philosophy, check out the Philosophy section of the documentation; and in particular, "Blake's 7", which enshrines the core seven principles of Blake.

In short, though, Blake operates on the principle of "Occam's Blazor": the solution with the fewest assumptions is often the best.

Blake doesn't assume anything (well this isn't strictly true, but it strives to make the absolute minimum number of assumptions necessary). It just provides a minimal way to "bake" your site, and then lets you get on with it. Any complexity doesn't belong in Blake, it belongs in your site template. Blake is extensible through its plugin architecture, providing an opportunity to add functionality not included in the core framework. This is by design and by intention: the framework remains lean, with no parlour tricks, and nothing that you can't understand and extend yourself, as and when you need to. But only then.

## Quick start

Start by installing the Blake CLI tool:

```bash
dotnet tool install -g Blake.Cli
```

Then create a new Blake site. The easiest and simplest way is to use the `blake new` command:

```bash
blake new
```

If you provide no other parameters, Blake will generate a new site in the current directory, using the default Blazor template, and using the folder name as the project name. The Blake CLI is _not_ interactive - unless the commands you provide cannot be parsed, it doesn't assume you've make a mistake, it just goes with what you provided.

You can, of course, override the default template name by providing the `--template` or `-t` flag. You cannot change the project name, however, as that is derived from the folder name.

You can also Blake-enable an existing Blazor WASM project by using the `blake init` command:

```bash
blake init
```

This will add Blake to your existing Blazor project, allowing you to start using Blake's features immediately. You can optionally include starter content, to see how Blake works in practice:

```bash
blake init --includeSampleContent
```

or:
```bash
blake init -s
```

You can run `blake --help` to see all available commands and options. For more detailed information, refer to the [Blake CLI](/pages/cli) section of the documentation.