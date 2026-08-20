# Adding a page or feature

A worked example: adding a `/journal` page.

## 1. Register the route

`src/shared/config/routes.ts` is the source of truth. Add it there first —
the sitemap, the parity suite and the redirects all read from this file.

```ts
export const ROUTES = {
  // …
  journal: '/journal',
} as const;
```

Add it to `ALL_ROUTES` so it appears in the sitemap.

## 2. Create the feature

```
src/features/journal/
  ui/JournalPage.tsx
  ui/JournalShell.tsx
  styles/journal.module.css
  content/journal.content.ts
  index.ts
```

**`styles/journal.module.css`** — a `.page` wrapper carrying the palette, then
the page's rules:

```css
.page {
  --paper: #f3f0ea;
  --ink: #29281f;
  --clay: #b56d43;
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  font:
    300 1rem/1.7 var(--font-body),
    sans-serif;
}

.page :global(.wrap) {
  width: min(100%, 1368px);
  margin: auto;
  padding-inline: 44px;
}
```

**`ui/JournalShell.tsx`** — the client boundary:

```tsx
'use client';

import type { ReactNode } from 'react';
import { usePageRoot } from '@/shared/motion/usePageRoot';
import { useReveal } from '@/shared/motion';

import styles from '../styles/journal.module.css';

export function JournalShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useReveal(root, { stagger: 90 });

  return (
    <div ref={root} className={styles.page} data-page="journal">
      {children}
    </div>
  );
}
```

`usePageRoot` gives you the root ref, the `body.ready` flag the entrance
animations depend on, and the fail-open watchdog. Always use it.

**`ui/JournalPage.tsx`** — a Server Component. No `'use client'`, no hooks:

```tsx
import { SiteHeader } from '@/shared/layout/SiteHeader';
import { JournalShell } from './JournalShell';

export function JournalPage() {
  return (
    <JournalShell>
      <SiteHeader
        links={[{ href: '/about', label: 'About' }]}
        menu={[{ href: '/', label: 'Home' }]}
        scrollThreshold={0.72}
      />
      <main>{/* … */}</main>
    </JournalShell>
  );
}
```

**`index.ts`** — the public surface. Nothing outside the feature may import
past it:

```ts
export { JournalPage } from './ui/JournalPage';
```

## 3. Add the route

`src/app/journal/page.tsx`, and nothing more than this:

```tsx
import { JournalPage } from '@/features/journal';
import { ROUTES } from '@/shared/config/routes';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Journal | Finer Things',
  description: 'Stories from the studio.',
  path: ROUTES.journal,
});

export default function JournalRoute() {
  return <JournalPage />;
}
```

## 4. Add a page background

If the page is dark, add it to the `body:has(...)` table in
`src/shared/styles/globals.css`, keyed on the `data-page` value. Light pages
inherit the default and need nothing.

## 5. Add it to the parity suite

`tests/visual/pages.ts`. New pages have no legacy counterpart, so capture a
baseline from the new page itself once you are happy with it — from then on
the suite protects it from accidental change.

## Checklist

- [ ] Route in `routes.ts`, added to `ALL_ROUTES`
- [ ] Feature folder with `index.ts`
- [ ] Page (server) + Shell (client) split
- [ ] `data-page` attribute on the wrapper
- [ ] Background registered if the page is dark
- [ ] `page.tsx` contains metadata and one component, nothing else
- [ ] `pnpm verify` passes
