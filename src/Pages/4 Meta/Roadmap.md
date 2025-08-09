---
title: 'Blake Roadmap'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes the future plans and direction for Blake, including upcoming features and improvements."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 3
category: "Meta"
---

The following items are what I intended to build when I started along with some notes about their current status

- Plugin architecture - done. Currently have two plugins published already - DoscRenderer and ReadTime. The plugin pipeline and architecture is complete but I intend to create more plugins. Top of my list is an RSS feed generator, a full-text search indexer, Giscus (this may be via RCL rather than plugin, strictly), social sharing and previews.
- Starter templates - done. This is one, the other is the Simple Tailwind Sample blog template. I would like to add more but don't have a lot of time. One idea that was raised was for an Architecture Decision Record (ADR) site template, this would be cool. But also other blog and docs engines would be nice. 
- Incremental builds - not 100% sure about this, but I absolutely do want to add watch functionality (hot reload) to `blake serve`.
- Template registry - done but there is work planned. I want to improve the validation process as per issue 22 on the Blake repo. I am also considering adding a plugin registry.

* Current state of Blake - Basically finished. Room for improvement of course but it works.

* What’s planned - as above.

* What will never be added - really anything else. Compexity, additional features, anything like that, the place for those is in site templates or plugins. Blake is intended to be simple; it was born out of a frustration with existing SSGs (not criticism, just lack of patience on my part) and it should always remain that way.

* Should mention here to encourage the use of Discussions on the Blake repo
