---
title: 'Frequently Asked Questions'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Answers to common questions about using Blake."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Meta"
quickAccess: 5
---

The following are some examples I considered. But it's probably worth reviewing the PRs for the documentation, and in particular some of the comments, as they will likely reveal some user expectations. But realistically I'm not expecting much here as Blake is intentionally simple and uncomplicated.

### Why isn’t my page showing up?

Make sure:

- The folder has a template.razor
- The Markdown file has valid frontmatter
- You're not missing --includeDrafts

More coming soon.

- “Why isn’t my page showing up?”
- “How do I customize the layout?”
- Known issues - the only one I can think of at present is the MS Build target that gets added to the csproj by init (and is inlcuded in the two starter templates) doesn't work reliably. Users are encouraged to run `blake bake` before building or running their site.
- Reporting bugs or contributing - contributing guide in these docs, reporting bugs via Issues in the Blake repo
