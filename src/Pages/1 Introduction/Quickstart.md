---
title: 'Quick Start'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes the initial setup and basic usage of Blake."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 2
category: "Getting Started"
quickAccess: 1
---

:::summary
Get started with Blake in minutes: install the CLI, create a new site, add content, and build. This guide shows you the essential commands to go from zero to a working Blake site.
:::

## Install the CLI

```bash
dotnet tool install -g Blake.CLI
```

## Create a new site

```bash
blake new
```

## Bake and run

```bash
blake bake
dotnet run
```

Explore the generated structure and start customizing your site!

* Installing the CLI

* Creating your first site

* Baking and running locally

* Directory layout

* Serving with live reload


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

You can run `blake --help` to see all available commands and options. For more detailed information, refer to the [Blake CLI](/pages/1 introduction/cli) section of the documentation.