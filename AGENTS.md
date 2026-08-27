# Working in this repository

Contract for anyone — human or AI — changing this codebase. It is short on
purpose. Everything here is enforced by `pnpm verify`; if you disagree with a
rule, change the rule and its enforcement together, not just the code.

## What this is

A Next.js port of a hand-built static site for Finer Things, a luxury
hospitality accessories studio. The original twelve HTML documents are kept in
`legacy/` as the reference. The migration's acceptance criterion was, and
remains, **visual parity with those documents**.

## The five rules

**1. Features never import each other.**
`app → features → shared`, one direction. If two features need the same thing,
move it to `shared`. Enforced by `eslint-plugin-boundaries`.

**2. Routes stay thin.**
A `page.tsx` declares metadata, renders one feature component, and emits
structured data. Nothing else — no layout, no fetching, no conditionals.

**3. One schema per form.**
Client and server validate with the _same_ Zod schema. Never add a second
definition of what is valid, and never rely on client validation alone — the
server action's `safeParse` is the security boundary.

**4. Never add an external origin to the CSP.**
Every `*-src` directive is locked to `'self'`, which is only possible because
the site loads nothing from anywhere else — fonts are self-hosted for exactly
this reason. `script-src` does allow `'unsafe-inline'`, and that is a
deliberate, documented trade-off for keeping the pages static; read
[docs/SECURITY.md](docs/SECURITY.md) before touching it. Adding a CDN, an
analytics tag or an embed is what this rule forbids.

After any header change, run `node tools/check-csp.mjs <url>`. A CSP that
blocks scripts leaves a page that looks fine at the top and is completely
inert below the fold.

**5. Never log personal data.**
Names, email addresses and message bodies must not reach a log line, an error
report or an analytics call. Log an event name and a correlation id.

## Before you finish

```bash
pnpm verify      # typecheck + lint + build + visual parity
```

Baselines are not committed — run `pnpm parity:baseline` once per machine
first (it captures them from `legacy/`, which is committed).

The parity suite compares every route against a screenshot of the original
site at three viewports. **If it fails, you changed the design.** Either that
was unintended — fix it — or it was deliberate, in which case regenerate the
affected baseline explicitly and say so in the commit message. Do not raise
`maxDiffPixelRatio` to make a failure go away.

## Where things live

- **Header, footer, navigation** — `shared/layout/` + `shared/config/navigation.ts`.
  One edit changes every page. Never copy chrome markup into a page.
  Navigation is a **burger and nothing else**, on every page and at every
  width, driven by the single `SITE_MENU`. There is no desktop link row and no
  per-page link set; if you are adding a second navigation, stop.
- **Colours** — `shared/styles/tokens.css`. One palette.
- **Shared visual pieces** (`.wrap`, `.rise`, `.btn`, `.eyebrow`) —
  `shared/styles/primitives.css`.
- **Page-only styling** — that feature's `styles/*.module.css`, and nothing
  that another page also needs.

If you find yourself pasting a rule into a second page stylesheet, it belongs
in a shared layer instead.

## Things that will bite you

- **Intentional design changes go in `brand.css`** — never in a page
  stylesheet or `chrome.css`, both of which are generated from `legacy/` and
  would overwrite them. And note the load order: page modules load _after_
  `brand.css`, so a rule there at equal specificity **loses silently**. Reach
  for the element's id (`#word`) or an extra attribute rather than a doubled
  class.
- **`chrome.css` says it is generated. It no longer is.** The banner tells you
  to change `build-chrome.mjs` and re-run it. Don't: the generator now emits
  ~113 lines against the file's ~570, so running it would delete most of the
  stylesheet. It has been hand-maintained since the import (as
  `tools/legacy-import/` warns below). Treat `chrome.css` as source, and edit
  it by hand — carefully, and only for chrome that genuinely varies per page.
- **Never put a pseudo-element in a selector that shares a declaration block
  with another selector.** Lightning CSS merges them into `:is(...)`, and a
  pseudo-element inside `:is()` is invalid, so the browser drops the whole rule
  silently. This killed the scrim behind the gallery captions: the words
  appeared over bright marble with nothing behind them, and the CSS looked
  correct. Give the rule its own block, or put the style on a real element.
- **Never hand-write `-webkit-` prefixes.** Lightning CSS adds them from the
  browser targets. Writing both halves of a pair makes it keep only the
  prefixed one: `backdrop-filter` next to `-webkit-backdrop-filter` shipped as
  `-webkit-` alone, and the menu's blur silently did nothing in every
  non-WebKit browser. Write the standard property and let the build prefix it.
- **Chrome styling must live in `chrome.css`.** The masthead and footer are
  rendered by the layout, _outside_ the page wrapper, so a rule scoped to
  `.page` cannot reach them — it just silently does nothing. This has already
  cost two bugs: the footer lost its stacked mobile layout, and the home
  masthead stopped hiding itself until the wordmark handed off. Page-specific
  chrome goes in `chrome.css` under `[data-page='<slug>']`.
- **`body.ready`** — a large part of the entrance choreography hangs off
  `body.ready …` selectors. `usePageRoot()` sets it. A page shell that does not
  use `usePageRoot` renders its hero blank.
- **CSS specificity** — page stylesheets are nested under `.page`, giving every
  rule one extra class of weight. Rules in `globals.css` that must beat them
  are prefixed with `[data-page]`. Forget this and the cascade silently flips.
- **The page stylesheets are excluded from Prettier** so they stay diffable
  against `legacy/`. Don't reformat them.
- **`tools/legacy-import/`** was a one-shot importer. It has already run, and
  the files it produced are now hand-maintained source. **Do not re-run
  `pnpm migrate:pages`** — it would overwrite real work. It is kept for
  reference and reproducibility only.
- **A parity pass does not mean nothing changed.** The tolerance is a fraction
  of the whole page and these pages run to thousands of pixels, so a small
  element can be removed entirely and the gate will still pass. Confirm design
  changes by looking at them. See docs/PARITY.md.
- **The parity baselines are gitignored**, so `git status` will never tell you
  they are stale. Check mtimes.
- **Motion must fail open.** Anything that starts hidden needs a selector in
  the `GROUPS` table in `useFailOpenReveal.ts`, so a broken observer can never
  leave a section blank.

## Forbidden

- Cross-feature imports, or importing past a feature's `index.ts`
- `any` in `src/`
- `@vercel/*` packages, or anything else that pins the deployment target
- Styling outside CSS Modules
- A second source of truth for validation
- Personal data in logs
- Connecting a live form provider before the blockers in
  [adr/0002](docs/adr/0002-deferred-compliance.md) are resolved

## Where to read more

| Question                       | File                                                 |
| ------------------------------ | ---------------------------------------------------- |
| **Where is the project now?**  | **[docs/HANDOFF.md](docs/HANDOFF.md)** — read first  |
| How is the code organised?     | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)         |
| How do I add a page?           | [docs/ADDING-A-FEATURE.md](docs/ADDING-A-FEATURE.md) |
| How does the animation work?   | [docs/MOTION.md](docs/MOTION.md)                     |
| Where does content live?       | [docs/CONTENT-MODEL.md](docs/CONTENT-MODEL.md)       |
| How do forms work?             | [docs/FORMS.md](docs/FORMS.md)                       |
| What's the security posture?   | [docs/SECURITY.md](docs/SECURITY.md)                 |
| How do I deploy it?            | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)             |
| How does the parity gate work? | [docs/PARITY.md](docs/PARITY.md)                     |
| Why is it built this way?      | [docs/adr/](docs/adr/)                               |

## Site-wide policies set in review

Undo any of these and the client will notice. The reasoning is in
docs/FEEDBACK.md.

- **One navigation: the burger, every page, every width.** There is no desktop
  link row. Do not add a second one.
- **Headlines are a single colour.** The rule is written as a policy over every
  descendant of a heading, not as a list of selectors, because enumerating them
  missed cases three rounds running.
- **Emphasis in a heading is a hairline underline.** Not colour, and not
  italic: the site ships one upright font file per family with
  `font-synthesis: none`, so `font-style: italic` renders identically to the
  text around it.
- **No em dashes in site copy.** Enforced by lint. Comments are exempt.
- **One closing CTA** (`shared/layout/SiteCta.tsx`), on every page but Contact.

## Open decisions

Recorded rather than hidden. Each is a deliberate deferral with an ADR:

1. Consent checkbox and newsletter double opt-in — **blocks live delivery**
2. Bot protection — deferred to the Cloudflare edge
3. Error monitoring — port in place, no backend attached
4. Legal page copy — placeholder text, `noindex`
5. `script-src 'unsafe-inline'` — the price of keeping the pages static
