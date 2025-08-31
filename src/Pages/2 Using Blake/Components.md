---
title: 'Using Components'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to use Blazor components within Blake templates and Markdown."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 2
category: "Using Blake"
---

:::summary
Blake templates can use any Blazor component, and content authors can include components in Markdown using container syntax. This provides the flexibility of Blazor components within a Markdown-first authoring experience.
:::

## Using Components

You can literally drop any Razor component into your Markdown, and it will be rendered as part of the page. Note though that the recommended way to use components in content is to use Markdown containers.

As a rule of thumb:

* **Template authors** should use Razor components in their templates
* **Content authors** should use Markdown containers to consume components in their content

But it's up to you - it's your site, so you can do what you like!

## Using Blazor components in content

You can use Blazor components directly in your Markdown content. For example, if you have a component called `MyComponent`, you can use it like this:

```markdown
### Adding a component in Markdown

You can simply add a component like this:

<ClickCounter />
```

This allows you to drop arbitrary functionality directly into pages or posts, similar to how React components can be added to markdown with `.mdx` files. Just without any special, additional ceremony.

This is potentially more useful in templates than in Markdown content (you can see several examples of this in the starter templates, including this one), but it works in both.

You can also include child content with a `RenderFragment` parameter (which is used by custom container blocks, which is covered below). For example, you can define a Razor component like this:

```razor
<div class="my-component">
	<h3>@Title</h3>
	@ChildContent
</div>

@code {
	[Parameter] public string Title { get; set; }
	[Parameter] public RenderFragment ChildContent { get; set; }
}
```

And then use it in your Markdown like this:

```markdown
### Using a component with child content

<MyComponent Title="My Component">
	<p>This is some child content.</p>
</MyComponent>
```

Blake (well, technically, Markdig) will just drop it into the output, so the above code snippet ends up like this:

```razor
<h3>Using a component with child content</h3>
<MyComponent Title="My Component">
	<p>This is some child content.</p>
</MyComponent>
```

This is just standard Blazor, there's nothing special about it. You can use any Blazor component in your Markdown content, and it will be rendered as part of the page.

## Using markdown containers

Blake supports Markdown containers, which allows for a more Markdown-idiomatic and consistent authoring experience. Rather than adding Razor components to your Markdown content, you can use Markdown containers, which get converted to Razor components at bake time.

### Default container renderers

There are some default container renderers included, based on Bootstrap (as it's compatible with the default Blazor template). These allow you to render tip, help, info, and warning boxes in your Markdown content.

```markdown
::: tip
This is a tip box. It can contain Markdown content, including other components.
:::
```

Using the default renderers, this gets rendered as:

::: tip
This is a tip box. It can contain Markdown content, including other components.
:::

Note that this is rendered according to your Bootstrap theme (this site uses Darkly, so it looks a little different to how it looks in the default Blazor template - you can [add the sample content](/) to see how it renders by default).

You can also disable the default container renderers by passing a flag to the CLI:

```bash
blake build --disableDefaultRenderers
```

or:

```bash
blake build -dr
```

This allows you define your own components (eg using Tailwind) and use them in your Markdown content, without having to pick different container names.

### Custom containers

Unrecognised containers, however, are rendered as Razor components. It's important to understand the convention here - the component will be rendered using the name of the container, with the first letter capitalised, and with `Container` appended. So, for example, if you have a container called `my`, it will be rendered as `<MyContainer />`.

```markdown
::: my
This is a custom container. It will be rendered as a Razor component that looks like this:
:::
```

This gets injected int your Razor page as:

```razor
<MyContainer>
This is a custom container. It will be rendered as a Razor component that looks like this:
</MyContainer>
```

You can pass values to your component using the frontmatter, just like you would with any other component. For example:
```markdown
::: my title="My Custom Container"
This is a custom container with a title. It will be rendered as a Razor component that looks like this:
:::
```

gets injected as:
```razor
<MyContainer Title="My Custom Container">
This is a custom container with a title. It will be rendered as a Razor component that looks like this:
</MyContainer>
```
