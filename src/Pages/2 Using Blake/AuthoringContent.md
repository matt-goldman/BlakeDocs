---
title: 'Authoring Content'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Guides on how to create and manage content in Blake."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 1
category: "Using Blake"
quickAccess: 2
---

:::summary
Blake turns Markdown files into Blazor pages using Razor templates. Just write content - Blake handles the rest with zero configuration required.
:::

Blake provides a flexible framework for creating and managing content. This guide will walk you through the essential steps to author content effectively.

**The Blake workflow is simple:**

1. Create or organize Markdown files in folders
2. Add frontmatter to control metadata (optional but recommended)  
3. Run `blake bake` to generate Blazor components
4. Build and deploy your site as normal

Let's explore each step in detail.

## Page Templates

Blake uses Razor components as templates for pages. Page templates are defined as either `template.razor` files, or `cascading-template.razor` files, which allow for cascading parameters to be passed down to child components.

Any directory containing Markdown file (`.md`) files will be treated as a content directory, and Blake will automatically generate pages for each Markdown file found in that directory, using either the `template.razor` if one exists in that directory, or `cascading-template.razor` if one is inherited from a parent directory.

You can read more about how these work in [Page Templates](/pages/2 using blake/page-templates).

## General Markdown Notes

Content in Blake is written in Markdown. If you're interested in Blake it's likely you know what Markdown is and how to use it, but if not, check out the [Markdown guide](https://www.markdownguide.org/). It's trivial to learn and use (seriously, I've seen everyone from high school work experience placements to retirees pick it up in minutes).

While there are different "flavours" of Markdown, pretty much all general Markdown syntax will work with Blake. It uses [Markdig](https://github.com/xoofx/markdig) to transform Markdown into HTML, with some additional tweaks around the edges, like transposing unrecognised containers to Razor components (see [components](/2%20using%20blake/components) page for more info).

When using a static site generator like Blake, the general idea is to define styles in your templates, and let the Markdown parser take care of the rest. If however you do want to explicitly control some aspect of your content directly in Makrdown, Markdig allows you to [supply attributes](https://github.com/xoofx/markdig/blob/master/src/Markdig.Tests/Specs/GenericAttributesSpecs.md) alongside your content byt enclosing them in curly braces. For example:

```markdown
You can add curly braces after anything{#paragraph-6 .my-paragraph}
```

The convention with Markdig is as follows:

* A hash (`#`) specifies the ID
* A period (`.`) is used to specify a CSS class
* Any other attribute is supplied as a key-value pair with the equals sign (`name="value"`)

### A note in images

You can use these attributes to control image sizing, if you want to, e.g.:

```markdown
![An image](/path/to/image.png){width="400" height="200"}
```

This would get parsed as:

```html
<img src="path/to/image.png" alt="An image" Width="400" Height="200">
```

Blake also has some special shorthand for image sizing though for extra convenience. After the file path, you can use the equals sign to specify dimensions (in `px`) with positional properties, in the order `=[width]x[height]`. You can specify both, or just one with the `x` used to indicate which property you are specifying.

```markdown
![Alt text](/path/to/image.png=200x300)  # Both width and height
![Alt text](/path/to/image.png=400x)     # Width only, height auto
![Alt text](/path/to/image.png=x250)     # Height only, width auto
```

You can of course ignore all this and just size your images themselves (or not), and let them just render by default:

```markdown
![Alt text](/path/to/image.png)
```

## Content Structure

Unlike other static site generators, Blake does not enforce a specific content structure. You can organize your content in any way that makes sense for your project. Navigation and URLs are automatically generated based on file path, therefore it is recommended to follow a logical hierarchy to make navigation easier for users.

:::note
With the DocsRenderer plugin, you can also create a table of contents (ToC) for your pages. This is useful for longer documents or guides where users may want to jump to specific sections. It also allows you to specify categories in your frontmatter, which can be used to group related content together. Note that the URL/slug does not change, just organisation within the ToC.
:::

## Front matter

Blake supports frontmatter in Markdown files, allowing you to define metadata for each page. Frontmatter is not required - Blake will generate pages even if no frontmatter is present. However, it is highly recommended to use frontmatter to provide additional context and control over how your content is displayed.

You can include anything you like in the frontmatter, but Blake uses a few specific fields to control how pages are rendered:

- `title`: The title of the page, displayed in the browser tab and as the main heading.
- `date`: The date the page was created or last modified, used for sorting and display
- `image`: A URL to an image that represents the page, used for social sharing and previews.
- `tags`: An array of tags associated with the page, used for filtering and categorization.
- `description`: A brief description of the page, used for SEO and social sharing.
- `iconIdentifier`: An identifier for an icon to display in the navigation menu.
- `draft`: A boolean indicating whether the page is a draft and should not be displayed in the navigation or search results. Draft pages are excluded by default but can be included using `blake bake --includeDrafts`.

Values parsed from frontmatter are available in the `PageModel` class. Note that an instance of the `PageModel` is not injected into your generated page, but you _can_ specify properties to be bound during the baking process. Blake will assign values of these known properties to generated pages where it detects them expressed using the `@@` directive, followed by the name of the property in PascalCase, in your template.

For example, if you have a property called `Title` in your `PageModel`, you can use it in your template like this:

```razor
<h1>@Title</h1>
```

Any other properties are assigned to the `Metadata` dictionary, of the `PageModel` class, and can be accessed from the generated content index (see the relevant section in [Page Templates](/pages/2 using blake/page-templates)).

Blake plugins can also add additional frontmatter fields, which can be used to control how content is rendered or processed. For example, the DocsRenderer plugin adds a `category` field to group related content together. You can learn more about plugins in the [Using Plugins](/pages/2 using blake/using-plugins) page.

## Content Creation

To create content in Blake, simply add Markdown files to your content directories. Blake will automatically generate pages for each Markdown file found in the directory when you run `blake bake`, using the specified templates.

The `blake bake` command processes all your Markdown files and templates, generating Blazor components in the `.generated` folder. This typically happens automatically during your build process, but you can run it manually when needed. See the [CLI Reference](/pages/1 introduction/cli) for more details on Blake commands.

Blake supports standard Markdown syntax, including headings, lists, links, images, and more. You can also use HTML tags for more complex formatting, and you can even insert Razor components directly into your Markdown files (see the [Using Components](/pages/2 using blake/components) page for more details).

Blake also supports using Markdown containers, which allow you to access Razor components in an idiomatic way. Blake includes some default container renderers, supporting `note`, `warning`, `info`, and `tip` containers, which can be used to highlight important information in your content. These are based on Bootstrap, as Bootstrap is included in the default Blazor template, but you can disable these if you prefer to use your own styles or frameworks (see the [CLI Reference](/pages/1 introduction/cli) page for more details).

For any unrecognised containers, or the default containers if you have disabled the renderer, Blake will render them as a Razor component, allowing you to create your own custom containers. You can learn more about this in the [Using Components](/pages/2 using blake/components) page.
