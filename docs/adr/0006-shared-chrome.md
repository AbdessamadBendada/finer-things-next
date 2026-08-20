# 0006 — Chrome in the layout, styles in layers

**Status:** accepted · **Date:** 2026-08-20

## Context

The first pass of the migration ported each legacy document faithfully,
including the fact that each one carried its own copy of the masthead, the
footer and the shared visual primitives. That was correct for establishing
parity and wrong to keep: changing the header would have meant editing twelve
files.

Measured before the change:

- 295 identical CSS rules duplicated across the twelve page stylesheets
  (~58 KB of 182 KB)
- footer markup pasted into eight page components
- every page redeclaring the same palette under different names — `--clay` on
  some pages, `--brass` on others, holding the same hex

The differences between the copies were drift, not design: footer padding
`66px` on one page and `64px` on another, a link gap of `60px` and `58px`, a
reveal of `1.2s` and `1.25s`, a word stagger of `48ms` and `52ms`.

## Decision

1. Render the chrome once, from the root layout, through `SiteChrome`.
2. Move every navigation set into one table, `shared/config/navigation.ts`,
   keyed by route.
3. Split styling into four layers: tokens → primitives → chrome → page.
4. Where three or two pages were the same template — the service pages and the
   project stories — extract the template into a module the pages compose
   alongside their own.
5. Unify the drifted values on the dominant variant.

## Why the layers work

Shared layers are scoped under `[data-page]`; page modules under `.page`.
Both are a single class of specificity, and page CSS loads after the layout's,
so **a page can always override a shared rule**. Several deliberately do — the
home page's light-on-dark button and inverted selection colours, the project
stories' wider column, the legal pages' narrower measure — and those overrides
sit at the bottom of each page stylesheet under a comment saying why.

Template composition uses two modules on one element:

```tsx
<div className={`${shared.page} ${styles.page}`}>
```

The per-page module is imported second, so it wins ties. No build tooling and
no `composes:` chain needed.

## Consequences

- Page CSS fell from 182 KB to 114 KB, plus 14 KB shared: **128 KB total, a
  30% reduction**, and the remaining per-page CSS is genuinely per-page.
- Changing the header, the footer, a nav label or a brand colour is one edit.
- `aria-current` is computed from the pathname instead of hand-written twelve
  times, so it cannot go stale.
- A few pages moved by a pixel or two where drifted values were unified. This
  was accepted deliberately; the parity baselines for those pages were
  regenerated rather than the tolerance being loosened.
- `SiteChrome` is a Client Component because it reads the pathname. It renders
  no state of its own and does not opt any page out of static rendering.
