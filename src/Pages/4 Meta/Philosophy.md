---
title: 'The Blake Philosophy'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes the guiding principles and philosophy behind Blake."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Meta"
---

# The Blake Philosophy

Some points noted here, but in essence, Blake is a response to other SSGs that require arcane knowledge. Most require some combination of a specific folder convention for partials and layouts, a specific templating syntax (like Liquid), or configuration via YAML, JSON, or worse, TOML. Blake does away with all of that. If a folder contains a valid template and a markdown file, Blake processes it. That's it. You don't need to do anything else - use whatever folder structure you like, you do need to follow the naming conventions for templates, and filenames must be valid for Blazor, but otherwise you're free to do what works best for you. You don't need a bespoke templating syntax - Razor works just fine so why add anything else? Blake works with zero configuration. Users or template authors can add configurable things if they like, but Blake doesn't require it. Don't like Blake's conventions? You could probably create a plugin that overrides them.

The key point is probably illustrated by this anecdote, the "screw this" moment I had. I was writing a blog post and I wanted to add a Note callout. I had to push commits to main repeatedly to get this to work, because:

 - Templating/partials used a weird syntax I wasn't used to and never use outside of this one context
 - Running the thing locally was nigh on impossible - it requires a whole chanin of dependencies, from Ruby Gems to all kinds of other packages, often with conflicts
 - Out of frustration for having to build and deploy my blog several times just to get this fricking callout working, I thought why aren't I just doing this locally before I publish? Then I tried that and encountered the above issues and remembered why I hadn't done that for at least a year. "Oh yeah, that's why".
 - Blake does away with all this. It's just too much noise for a blog engine. My view is that my blog isn't my weekend project, it's my notebook. I just want to be able to work on my actual side projects, not for my blog to turn into one. I get why people use things like WordPress, but I also don't believe it has to be this way. Hence, Blake.

Blake is guided by simplicity and convention:

- Predictability over magic
- Convention over configuration
- Clarity over cleverness

I respect the Python philosphy here - if it seems clever, it doesn't belong here. Blake is not an architectural or engineering challenge. It's just a simple tool that aims to get out of your way.

## Blake's 7

Note: this list is contrived. I thought it would be funny to include a list called "Blake's 7"; even though I never actually watched it. But I think this works. It can be improved, for example No assumptions should be top of the list. And maybe "as few assumptions as are absolutely necessary" or similar. Bake don't wrangle isn't quite right. Drafts are opt-in is hinting at the deeper philosphy rather than encapsulating it. The documentation that's already complete, as well as the PR comments, and finally the readme on the Blake repo, should provide guidance to finalise this list.

1. No hidden logic
2. Folders are structure
3. Templates own complexity
4. No required config
5. Drafts are opt-in
6. No assumptions
7. Bake, don't wrangle

This page should also, somehwere, cover:
* Why there’s no config system
* Blake’s “No Assumptions” rulebook
