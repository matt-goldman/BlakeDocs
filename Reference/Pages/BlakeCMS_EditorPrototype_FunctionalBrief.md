# BlakeCMS Editor Prototype – Functional Specification

## 🧭 Purpose

This is a functional prototype of the **BlakeCMS visual editor**, intended for embedding on the BlakeCMS landing page.

The goal is to demonstrate how editing Markdown content in Blake could feel. It is *not* a production editor and does *not* implement the full rendering pipeline. Its purpose is to **educate, inspire, and validate**.

---

## 🎯 Core Philosophy

- **BlakeCMS is a content editor, not a layout builder.**
- **Templates are authored in code (Razor).**
- **The preview is indicative, not authoritative.**
- **True rendering occurs in the user’s own CI preview branch.**

This prototype demonstrates the *intent* of the editor and the value of Razor-aware Markdown editing — nothing more.

---

## 🧱 Features (Prototype Scope)

### 1. Markdown Editor (Left Pane)
- A basic editor using TinyMDE, Monaco, or similar
- Supports standard Markdown syntax
- Preloaded with sample content (e.g. note containers, headings, paragraphs)
- Users can freely edit the content

### 2. Razor Output View (Right Pane, Tab 1)
- Shows a live transformation of Markdown to Razor syntax
- Razor output should:
  - Show mapped components (e.g. `:::note` → `<Note>`)
  - Use basic Razor syntax formatting
  - Display safely escaped HTML when needed
- Read-only, code-block style rendering

### 3. Visual Preview (Right Pane, Tab 2)
- A styled layout view that mimics how content might look in a real site
- **Does not execute Razor**
- Instead, uses:
  - Static HTML mapping (e.g. `<Note>` → `<div class="bcle-note">`)
  - Optional placeholder data for loops or parameters
- Components rendered using namespaced preview classes (e.g. `bcle-note`)

---

## 🚫 Out of Scope (for Prototype)

- Git integration
- File system access
- Authentication
- Real component introspection
- Razor compilation or rendering
- Theming, layout control, or template editing

---

## 🧪 Razor-Aware Markdown Parsing

- Parse content using Blake-style Markdown containers
- Example:

    **Markdown:**
    ```markdown
    :::note
    This is a note.
    :::
    ```

    **Razor Output:**
    ```razor
    <Note>
      <p>This is a note.</p>
    </Note>
    ```

    **Preview Output:**
    ```html
    <div class="bcle-note">
      <p>This is a note.</p>
    </div>
    ```

- Razor components are interpreted as static HTML blocks in the preview

---

## 🧼 Component Style Namespace

To avoid style leakage or conflict with user-defined site styles:

- All preview elements must use a prefixed class
- Prefix: `bcle-` (BlakeCMS Live Editor)
- E.g. `bcle-note`, `bcle-callout`, `bcle-postcard`

---

## ✨ Bonus: Example Switcher

To make the demo more engaging:
- Include a dropdown or buttons to load 2–3 sample markdown blocks
- Previews change dynamically
- Users can experiment with authoring flows

---

## 🛠 Implementation Notes

- Use responsive layout (side-by-side for desktop, stacked for mobile)
- Syntax highlighting for Razor output
- Add label: *“This is a prototype. Changes are not saved.”*
- Optional light/dark toggle
- Load styles for preview dynamically from a scoped CSS block

---

## 📬 Deliverables

- A working embedded prototype to be placed on the BlakeCMS landing page
- Editor pane (Markdown input)
- Razor output tab
- Preview tab with visual representation
- 2–3 component mappings with hardcoded styles (e.g. `Note`, `Callout`, `Section`)
- All output fully client-side — no backend required

---

## 📌 Future Roadmap (Product Mode, Not for Prototype)

- Configurable component scanning (e.g. from Razor folders)
- Design-time data injection for list-based components
- Full GitHub integration with commit preview branches
- Razor layout awareness
- Component configurators (editable props in UI)
- Publishing workflow: edit → preview → submit → merge

