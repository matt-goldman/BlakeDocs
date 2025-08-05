---
title: 'Build Pipeline'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: Understand Blake's core rendering pipeline and how content is processed.
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Contributing"
---

> 🚧 **Coming Soon**  
> This page is under construction. Check back soon or [contribute on GitHub](https://github.com/YOUR-REPO).

This will cover Blake’s internal architecture: loaders, transformers, renderers, and how plugins tie in.


Blake processes your Markdown and Razor templates to generate `.razor` files in a `.generated folder`.

## File and folder structure

While it's common for static site generators to require a specific folder structure, Blake takes a more flexible approach. It uses the folder structure to drive routing and navigation, but it doesn't enforce a rigid layout. This means you can organize your content in a way that makes sense for your project.

Blake scans your project for any folders that contain:

- A file called `template.razor` (case-sensitive)
- Any markdown files (`*.md`)
 
That's it. No configuration, no conventions other than that. This allows you to create a structure that suits your needs, rather than adapting your needs to suit a template.

Routes are derived from the folder structure, so you can create nested routes simply by creating nested folders. For example, if you have a folder structure like `Pages/Features/`, and in your Feautures folder you have a file called `template.razor`, any markdown files in that folder will have routes generated based on that structure, such as `/features/admin`.

Currently, Blake requires a `template.razor` file in each folder that contains Markdown files. This file can be empty, but it must exist for Blake to process the folder and generate the corresponding `.razor` files. However, this approach could be effective for (say) loading in your generated content as Razor components, rather than navigable pages.

:::note
By the time Blake comes out of preview, there will be one important change here, and another that is under consideration.

First, Blake will also support a file called `cascading-template.razor` (case-sensitive). Cascading templates will be used for markdown files in the current folder, and all subfolders. This allows you to create a single template that applies to multiple levels of your site, reducing duplication and making it easier to manage your templates. This can be overridden at any level. See more in [Templatomg](/templating).

Second, the frontmatter (see below) may include an optional `removePageDirective` flag. This would generate _only_ a Razor component. This isn't strictly necessary (you can still include a Razor page as a component, even with the `@@Page` directive), and as Blake takes a minimal, YAGNI approach, this is not currently planned. However, it is under consideration for a future release.
:::

## Metadata and frontmatter

Blake uses frontmatter to add metadata to your pages. This metadata can include things like titles, descriptions, and other information that you want to associate with your content. The frontmatter is written in YAML format at the top of your Markdown files, and Blake processes this information to generate structured access to your pages. There are some predefined values in the `PageModel` type, but you can add anything you like to your frontmatter. Any keys not recognised as `PageModel` properties are added to a `Dictionary` on the `PageModel` called `Metadata`.

## Generated content index

Blake generates a `GeneratedContentIndex` that provides structured access to all the pages in your site. This index allows you to easily navigate and manage your content, making it simple to find and link to pages within your site.

When initialising a Blake site, if you include the sample content, you can see how the `GeneratedContentIndex` can be used for dynamic navigation. This is also used in the starter templates - see [Starter Templates](/startertemplates) for more examples of this approach.

Additionally, because `PageModel` includes a title, description, and tags, you can easily add rudimentary search functionality to your site. This can be done by iterating over the `GeneratedContentIndex` and filtering based on the user's input. Blake doesn't support full text search - that's outside the scope of the core Blake functionality (and likely outside the requirements of many static sites). However, as a Blake site is just a Blazor site, it's trivial to add this - and there's a planned plugin to add it too.

## Draft pages

Blake supports draft pages, which are pages that are not yet ready for publication. You can mark a page as a draft by adding `draft: true` to the frontmatter. Draft pages will not be included in the generated content index or the final output, allowing you to work on them without affecting your live site.

### The Blake difference

With Blake, you can choose to bake or not bake draft pages, but what about timed publication/release? This was one of my main frustratitions with other static site generators, and one of the core motivations for creating Blake.

Typically, this functionality requires a CMS, and it's easy to see why - if you bake an SSG, the content is there, and you can't change it without rebaking.

Blake doesn't change this, but it _does_ provide a cool, minimal workaround: use the publication date.

Looking at Jekyll for contrast, you can include `date: 2025-07-27` in your frontmatter, and by default, anything future-dated is not included in the generated site. You can use a CLI flag or configuration to change this, and that's useful for local previewing, but it doesn't allow you to control a release.

With Blake, it's simple: just include `date: 2025-07-27` in your frontmatter, and _filter your navigation by date_. Because the date is part of the `PageModel`, you can easily filter your navigation to only include pages with a date in the past. This allows you to control the visibility of pages based on their publication date without needing to rebake your site, while still making them available to preview, either for yourself or other reviewers.

Granted, this does not restrict access to the page itself, only hides it from the navigation. But this is a static site - if you need access control, a static site is not the right tool. For nearly all circumstances, this provides a simple and effective way to manage content publication without the need for a complex CMS or additional tooling.
