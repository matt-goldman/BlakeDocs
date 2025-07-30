---
title: 'Using Components'
date: 2025-07-27
image: images/blake-logo.png
tags: []
description: "Describes how to use Blazor components within Blake templates and Markdown."
iconIdentifier: "bi bi-plus-square-fill-nav-menu"
pageOrder: 5
---

### Page-level Razor logic

Because Blake outputs .razor files, you can use any Blazor component in your templates or Markdown.

You can literally drop any Razor component into your Markdown, and it will be rendered as part of the page.

```csharp numbered marked=3
public class MyComponent : ComponentBase
{
	[Parameter] public string Title { get; set; }
	[Parameter] public RenderFragment ChildContent { get; set; }
	protected override void OnInitialized()
	{
		// Initialization logic here
	}
}
```


### Parameter binding from frontmatter

When Blake generates a Razor page, it automatically binds values from the frontmatter to a `PageModel` instance in the page. The default properties of `PageModel` can be used in your templates. Unrecognised properties are added to the `Metadata` dictionary.

## Using Blazor components in content

You can use Blazor components directly in your Markdown content. For example, if you have a component called `MyComponent`, you can use it like this:

```markdown
### Adding a component in Markdown

You can simply add a component like this:

<ClickCounter />
```

This is potentially more useful in templates than in Markdown content (you can see several examples of this in the starter templates, including this one), but it works in both.

## Using markdown containers

Blake supports Markdown containers. There are some default renderers included, based on Bootstrap (as it's compatible with the default Blazor template). These allow you to render tip, help, info, and warning boxes in your Markdown content.

```markdown
::: tip
This is a tip box. It can contain Markdown content, including other components.
:::
```

Unrecognised containers, however, are rendered as Razor components. It's important to understand the convention here - the component will be rendered using the name of the container, with the first letter capitalised, and with `Container` appended. So, for example, if you have a container called `my`, it will be rendered as `<MyContainer />`.

```markdown
::: my
This is a custom container. It will be rendered as a Razor component that looks like this:
<MyContainer>
This is a custom container. It will be rendered as a Razor component that looks like this:
</MyContainer>
:::
```

You can pass values to your component using the frontmatter, just like you would with any other component. For example:
```markdown
::: my title="My Custom Container"
This is a custom container with a title. It will be rendered as a Razor component that looks like this:
<MyContainer Title="My Custom Container">
This is a custom container with a title. It will be rendered as a Razor component that looks like this:
</MyContainer>
:::
```

You can also disable the default container renderers by passing a flag to the CLI:

```bash
blake build --disableDefaultRenderers
```

or:

```bash
blake build -dr
```

This allows you define your own components (eg using Tailwind) and use them in your Markdown content, without having to pick different container names.