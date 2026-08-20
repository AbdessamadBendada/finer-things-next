# 0001 — Scoped CSS Modules over a utility rewrite

**Status:** accepted · **Date:** 2026-08-19

## Context

The legacy site carried roughly 166 KB of hand-written CSS across twelve
`<style>` blocks: bespoke keyframes, masks, filmstrip choreography and
scroll-linked transforms. The migration's hard requirement was a 1:1 visual
replica.

Three options were considered: rewrite everything as Tailwind utilities, use
CSS Modules with renamed classes, or preserve the stylesheets as-is.

## Decision

Port each page's stylesheet verbatim into a CSS Module, nesting every selector
under a module-scoped `.page` wrapper and wrapping it in `:global(...)` so the
original class names survive:

```css
.page :global(.hero-copy) { ... }
```

Transformation is mechanical and reproducible (`tools/legacy-import/css.mjs`).

## Why

- **Verifiable parity.** The class names in the markup still match the legacy
  documents, so the port can be diffed rather than eyeballed.
- **No collisions.** The hashed `.page` class isolates each page, which matters
  because every legacy page defined its _own_ `:root` palette — there is no
  single global theme to extract.
- **No re-authoring.** A Tailwind rewrite would have meant re-implementing
  every keyframe by hand, which is precisely where visual drift comes from.

## Consequences

- Nesting adds one class of specificity to every page rule. The global
  foundation in `globals.css` is prefixed with `[data-page]` to compensate,
  preserving the original cascade relationships exactly. **Missing this caused
  a real bug during the migration:** the wordmark lost its Rodetta face because
  `.head .logo` stopped beating the page's own `.logo`.
- Page stylesheets are excluded from Prettier so they stay comparable with
  `legacy/`.
- Utility-first authoring is not available. New shared components carry their
  own small modules instead (`FieldError.module.css`).
- Document-level declarations (`overflow-x`, `scroll-behavior`, `background`)
  cannot move onto the wrapper — `overflow-x` there would create a scroll
  container and break every `position: sticky` descendant. They are hoisted to
  `globals.css`, with per-page backgrounds handled by a `body:has()` table.
