# Content model

Content is typed TypeScript, not a CMS. There is no editorial backend, so
copy changes are code changes — deliberately, since the site is art-directed
per page and the prose is inseparable from its markup.

## Where content lives

| Kind                 | Location                             | Example                   |
| -------------------- | ------------------------------------ | ------------------------- |
| Structured, repeated | `features/*/content/*.content.ts`    | the hero collage stills   |
| Registries           | `features/*/model/*.registry.ts`     | projects, services        |
| Site-level           | `shared/config/site.ts`              | brand name, tagline, URLs |
| Routes               | `shared/config/routes.ts`            | every path on the site    |
| Navigation           | props on `<SiteHeader>` in each page | per-page link sets        |
| Editorial prose      | inline in the page's JSX             | headings, body copy       |

## Why prose stays in the markup

The obvious instinct is to extract every string into a content file. It was
tried and rejected: this copy is not data. A heading like

```tsx
<h1>
  <span className="mask">
    <span>Perhaps it begins</span>
  </span>
  <span className="mask">
    <span>with a place.</span>
  </span>
</h1>
```

carries its own line breaks, masks and reveal structure. Extracting the words
would separate them from the markup that animates them, leaving both halves
harder to change and the parity risk higher. The prose lives where it renders.

What _is_ extracted is anything structured or repeated — lists of images,
project metadata, service definitions — because those benefit from a type.

## Registries

Project and service pages are individually art-directed documents rather than
records rendered through a template, so each slug maps to its own component
plus the metadata the route needs:

```ts
export const PROJECTS: Record<ProjectSlug, ProjectEntry> = {
  'marsa-al-arab': {
    slug: 'marsa-al-arab',
    name: 'Jumeirah Marsa Al Arab',
    location: 'Dubai, United Arab Emirates',
    cover: '/assets/…webp',
    seo: { title: '…', description: '…', path: ROUTES.project('marsa-al-arab') },
    Page: MarsaAlArabPage,
  },
};
```

Adding a project is one entry plus one component. The route file never changes,
and `Record<ProjectSlug, …>` makes a missing entry a type error.

## Images

`src/shared/config/image-registry.ts` is generated — it holds the intrinsic
dimensions of every asset, so `next/image` gets correct width and height
without anyone looking up pixel sizes.

```bash
pnpm migrate:images    # after adding or replacing an asset
```

`RegisteredImage` is a union of the known paths, so a typo in an asset name is
a compile error rather than a broken image in production.

## Editing copy safely

1. Find the string in the feature's `ui/` or `content/`.
2. Change it.
3. Run `pnpm parity`. It will fail on the page you edited — that is expected;
   text changed, so the pixels changed.
4. Review the diff image to confirm nothing _else_ moved, then regenerate that
   page's baseline and commit both.

That last step is the safeguard: a copy edit that accidentally breaks a layout
shows up as a diff in a region you did not touch.

## If a CMS is wanted later

Nothing here blocks it. Registries and content modules are already behind a
typed boundary, so a Sanity or Payload adapter would replace the module's
internals while `ProjectEntry` and `ServiceEntry` stay the contract. The pages
would not change.
