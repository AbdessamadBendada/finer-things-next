# Architecture

## The shape

```
src/
  app/         routes only — metadata, structured data, one feature component
  features/    one folder per area of the site; independent of each other
  shared/      anything used by more than one feature
```

Security headers are static, declared in `next.config.ts` from
`shared/config/security-headers.ts`. There is no middleware — see
[SECURITY.md](SECURITY.md) for why a nonce-based policy was rejected.

Three layers, one direction of travel:

```
app  ──▶  features  ──▶  shared
```

`app` may import features and shared. A feature may import shared and its own
internals. `shared` imports nothing above it. **Features never import each
other** — when two need the same thing, it moves to `shared`. This is enforced
by `eslint-plugin-boundaries`, not by convention, so a violation fails the
build rather than being discovered six months later.

## Routes are thin

Every `page.tsx` does three things and stops: declare metadata, render one
feature component, and emit structured data. No layout, no data access, no
conditionals. If you find yourself writing logic in `src/app`, it belongs in a
feature.

```tsx
export const metadata = buildMetadata({ ... });

export default function AboutRoute() {
  return (
    <>
      <AboutPage />
      <BreadcrumbJsonLd trail={[{ name: 'About', path: ROUTES.about }]} />
    </>
  );
}
```

## Inside a feature

```
features/about/
  ui/         AboutPage.tsx (server)  ·  AboutShell.tsx (client)
  motion/     useAboutMotion.ts
  styles/     about.module.css
  content/    typed content modules, where content is structured
  model/      schemas and types
  api/        server actions and provider adapters
  index.ts    the feature's public surface — import through this, never around it
```

## The Page / Shell split

Each page is two components:

- **`<XPage>`** — a Server Component holding the markup. No hooks, no state,
  no client JavaScript. This is the bulk of the site and it ships as HTML.
- **`<XShell>`** — a small Client Component that owns the page's root element,
  runs its motion hooks, and renders `children` untouched.

The markup stays server-rendered while the choreography gets a client
boundary, which is why the JavaScript on these pages is measured in kilobytes
rather than the whole page tree.

## Why CSS Modules look unusual here

Each ported stylesheet nests every legacy selector under a `.page` wrapper and
wraps it in `:global(...)`:

```css
.page :global(.hero-copy) { ... }
```

The hashed `.page` class is what prevents two pages colliding. The inner class
names are left exactly as the original documents wrote them, which is what
lets the markup stay comparable with `legacy/` and makes 1:1 parity something
you can verify rather than assert. Full reasoning in
[adr/0001-css-modules.md](adr/0001-css-modules.md).

**Consequence to know about:** nesting adds one class of specificity to every
page rule. The global foundation in `src/shared/styles/globals.css` is
prefixed with `[data-page]` to match, preserving the original cascade
relationships exactly. If you add a rule to `globals.css` that needs to beat a
page rule, it needs that prefix too.

## Styling ownership

| Where                            | What lives there                                      |
| -------------------------------- | ----------------------------------------------------- |
| `shared/styles/globals.css`      | fonts, reset, document-level rules, typography policy |
| `features/*/styles/*.module.css` | everything about how that page looks                  |
| component-level `*.module.css`   | shared UI that carries its own styling (`FieldError`) |

Each legacy page shipped its own palette — `about` is `#F3F0EA` with a clay
accent, `home` is near-black with brass. Those tokens are per-page by design
and live on the `.page` wrapper, not in a global theme. The `body:has(...)`
table in `globals.css` keeps the overscroll colour matched.

## The chrome lives in the layouts

The masthead and footer are rendered by **route-group layouts**, so which
chrome a page gets is declared by where the page lives:

```
app/
  layout.tsx              <html>, <body>, the style layers — no chrome
  (home)/
    layout.tsx            <SiteChrome variant="home">      /
    page.tsx
  (site)/
    layout.tsx            <SiteChrome variant="site">      /our-work, /projects,
    our-work/                                              /projects/[slug],
    projects/                                              /services/[slug], /about
    projects/[slug]/
    services/[slug]/
    about/
  (contact)/
    layout.tsx            <SiteChrome variant="contact">   /contact
    contact/
  (legal)/
    layout.tsx            <SiteChrome variant="minimal">   /privacy, /terms
    privacy/  terms/
```

Route groups do not appear in the URL — `(site)/about/page.tsx` still serves
`/about`. They exist so the footer a page gets is a routing fact rather than a
runtime lookup, and so a new page joins a group by being placed in it.

`SiteChrome` composes the two shared components:

```
<SiteChrome variant>
  ├── <SiteHeader/>   one component, all twelve pages
  ├── {children}      the page
  └── <SiteFooter/>   one component, the variant from the layout
```

Changing the header, the footer, or a navigation label is **one edit**.

Where the per-page differences went:

| Difference                                    | Where it lives now                             |
| --------------------------------------------- | ---------------------------------------------- |
| Link sets per page                            | `shared/config/navigation.ts` — one table      |
| Footer shape (full / row / minimal)           | a `variant` in the same table                  |
| Header behaviour (scroll threshold, wordmark) | the same table                                 |
| Which link is "current"                       | computed from the pathname, never hand-written |

`SiteChrome` reads the current route and looks its configuration up. It also
owns the `data-page` attribute that the shared styles and the page-background
table key off.

The home page composes its own footer, because that one genuinely differs —
it carries the newsletter sign-up and a layout nothing else shares.

## Styling is layered, not copied

The twelve legacy documents each carried a full copy of the chrome and
primitive styles. They had drifted: footer padding 66px on one page and 64px
on another, a reveal of 1.2s here and 1.25s there. Nobody chose those
differences.

The styles are now four layers, loaded in this order:

| Layer      | File                             | Contains                                    |
| ---------- | -------------------------------- | ------------------------------------------- |
| Tokens     | `shared/styles/tokens.css`       | the brand palette, once                     |
| Primitives | `shared/styles/primitives.css`   | `.wrap`, `.rise`, `.btn`, `.eyebrow`, masks |
| Chrome     | `shared/styles/chrome.css`       | masthead, mobile menu, footer               |
| Page       | `features/*/styles/*.module.css` | only what is unique to that page            |

Shared layers are scoped under `[data-page]`, page modules under `.page` —
the same specificity, with page rules loading later, so **a page can always
override a shared rule** and several deliberately do (the home button, the
project stories' wider column, the legal pages' narrower measure). Those
overrides are collected at the bottom of each page stylesheet under a comment
saying why.

This removed ~290 duplicated rules, about 31 KB of copy-pasted CSS.

## Further reading

- [ADDING-A-FEATURE.md](ADDING-A-FEATURE.md) — the recipe
- [MOTION.md](MOTION.md) — how the animation layer works
- [FORMS.md](FORMS.md) — validation and delivery
- [SECURITY.md](SECURITY.md) — CSP, headers, trust boundaries
- [DEPLOYMENT.md](DEPLOYMENT.md) — hosting on any of three targets
- [PARITY.md](PARITY.md) — the visual gate
