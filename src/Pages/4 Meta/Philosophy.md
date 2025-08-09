---
title: 'The Blake Philosophy'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes the guiding principles and philosophy behind Blake."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 2
category: "Meta"
---

:::info
**Summary**
Blake is built on simple principles: use familiar tools, eliminate configuration overhead, and get out of your way. If you find Blake complex or requiring arcane knowledge, that's probably a bug.
:::

## The Origin Story

Blake was born out of frustration with existing static site generators that require too much specialized knowledge. Most SSGs demand some combination of:

- Specific folder conventions for partials and layouts
- Proprietary templating syntax (like Liquid)
- Complex configuration files (YAML, JSON, or TOML)
- Chains of dependencies with version conflicts
- Arcane build processes that work differently on every machine

Blake eliminates all of that complexity. **If a folder contains a valid template and a markdown file, Blake processes it. That's it.**

### The "Screw This" Moment

The catalyst for Blake came during a simple task: adding a note callout to a blog post. What should have been a five-minute change turned into hours of:

- Fighting with unfamiliar templating syntax used nowhere else
- Struggling to run the site locally due to Ruby gem conflicts
- Making commit after commit to production just to see if the callout worked
- Remembering why local development had been abandoned for over a year

This shouldn't be necessary. Your blog or documentation site isn't your weekend project - it's your notebook. Blake lets you focus on actual work instead of wrestling with build tools.

## Core Principles

Blake is guided by three fundamental principles:

### Predictability Over Magic

Blake doesn't try to be clever. It follows simple, transparent rules:

- Templates are standard Razor files
- File and folder names directly map to URLs
- Plugins extend functionality without hiding complexity
- No hidden conventions or "magic" behavior

If something works in Blazor, it works in Blake.

### Convention Over Configuration  

Blake works with **zero configuration**. The default behavior handles 90% of use cases:

- Any folder with markdown files can have content
- Templates define rendering without complex setup
- URLs follow the file system structure
- Plugin discovery happens automatically

Users or template authors can add configuration if needed, but Blake never requires it.

### Clarity Over Cleverness

Complex solutions are easy. Simple solutions that work are hard. Blake chooses simplicity:

- Use existing tools (Razor) instead of inventing new ones
- Follow .NET conventions developers already know
- Provide clear error messages when things go wrong
- Make the common case trivial and the complex case possible

If it seems clever, it probably doesn't belong in Blake.

## Blake's 7

These seven principles guide every decision in Blake's development:

### 1. No Assumptions

Blake makes as few assumptions as possible about your project structure, content organization, or workflow. The only requirements are valid Razor template files and markdown content.

### 2. No Hidden Logic

Every transformation Blake performs is transparent and predictable. You can see exactly how your markdown becomes HTML by looking at your templates.

### 3. Folders Are Structure

Your folder organization becomes your site structure. No complex routing configuration or URL rewriting - what you see in the file system is what you get in the browser.

### 4. Templates Own Complexity

All rendering complexity lives in your templates, not in Blake itself. Templates are standard Razor - no proprietary syntax to learn or maintain.

### 5. No Required Config

Blake starts working immediately without configuration files. Every setting is optional and follows sensible defaults.

### 6. Drafts Are Opt-In

Content is published by default. If you want draft functionality, explicitly mark content as draft and use `--includeDrafts` when needed.

### 7. Bake, Don't Wrangle

Blake transforms your content cleanly and gets out of your way. No ongoing maintenance, no dependency conflicts, no mysterious build failures.

## Why No Configuration System?

Configuration systems become complexity magnets. They start simple but inevitably grow into:

- Nested hierarchies of settings
- Environment-specific overrides  
- Merge conflicts and inheritance rules
- Documentation that's longer than the actual tool

Blake avoids this entirely. Instead of configuration:

- **Templates** control rendering and layout
- **Plugins** extend functionality when needed
- **Folder structure** determines site organization
- **Frontmatter** provides per-page metadata

This keeps Blake focused on its core job: transforming markdown into Blazor components.

## The "No Assumptions" Rulebook

Blake's design philosophy centers on making as few assumptions as possible:

### About Your Content

- **No required frontmatter** - Blake works with plain markdown files
- **No required folder structure** - Organize content however makes sense
- **No required file naming** - Use descriptive names that work for your project
- **No assumptions about content type** - Blog posts, documentation, landing pages all work the same way

### About Your Templates

- **No required base classes** - Templates are standard Razor components
- **No required inheritance** - Use cascading templates only when they add value
- **No assumptions about styling** - Use any CSS framework or custom styles
- **No required components** - Build exactly the UI you need

### About Your Workflow

- **No required build tools** - Run `blake bake` whenever you need to
- **No assumptions about deployment** - Generated sites work anywhere Blazor WASM works
- **No required plugins** - Core functionality works without any plugins
- **No assumptions about hosting** - Static files work on any web server

## Next Steps

Understanding Blake's philosophy helps you work with it effectively:

- **For common tasks**: Blake should feel invisible - just write content and templates
- **For customization**: Use plugins or modify templates rather than fighting Blake's conventions  
- **For complex needs**: Blake's simplicity makes it easy to integrate with other tools

Explore how these principles translate into practice:

- [Getting started with Blake](/pages/1%20introduction/quickstart)
- [Understanding page templates](/pages/2%20using%20blake/page-templates)
- [Extending with plugins](/pages/2%20using%20blake/using-plugins)

:::note
**Philosophy in Practice**
Every feature in Blake is evaluated against these principles. If a proposed feature would require breaking these rules, it either gets redesigned to fit Blake's philosophy or gets rejected entirely.
:::