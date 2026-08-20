# Finer Things

The Finer Things website — a Next.js port of the hand-built static site, with
its motion design preserved exactly.

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then <http://localhost:3000>.

## Commands

| Command                     | What it does                                                     |
| --------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                  | development server                                               |
| `pnpm build` · `pnpm start` | production build and serve                                       |
| `pnpm verify`               | typecheck + lint + build + visual parity — run before committing |
| `pnpm parity`               | compare every route against the original site                    |
| `pnpm parity:baseline`      | recapture baselines from `legacy/`                               |
| `pnpm legacy`               | serve the original static site on :4321                          |
| `pnpm migrate:images`       | regenerate the image registry after changing assets              |

## Layout

```
src/
  app/
    layout.tsx    renders the chrome once, for every page
    */page.tsx    metadata + one feature component
  features/       home · our-work · projects · services · about · contact
                  newsletter · legal
  shared/
    layout/       SiteChrome · SiteHeader · SiteFooter
    config/       routes · navigation · site · env
    styles/       tokens → primitives → chrome (the shared layers)
    motion/ forms/ seo/ ui/
legacy/           the original twelve HTML documents, kept as the reference
tests/            the parity gate and the form tests
docs/             architecture, motion, forms, security, deployment, ADRs
tools/            the one-shot legacy importer and the legacy static server
```

**Where to change things**

| To change…                                | Edit                                             |
| ----------------------------------------- | ------------------------------------------------ |
| the header, footer, or a nav label        | `shared/config/navigation.ts` + `shared/layout/` |
| a brand colour                            | `shared/styles/tokens.css`                       |
| a shared piece (`.wrap`, `.btn`, `.rise`) | `shared/styles/primitives.css`                   |
| one page only                             | that feature's `styles/*.module.css`             |

Nothing about the chrome lives in a page. If you are pasting a rule into a
second stylesheet, it belongs in a shared layer.

## What to read first

- [AGENTS.md](AGENTS.md) — the working contract; five rules and the things
  that will bite you
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how it fits together
- [docs/ADDING-A-FEATURE.md](docs/ADDING-A-FEATURE.md) — the recipe

## Before launch

Four things are deliberately unfinished, each recorded in
[docs/adr/](docs/adr/):

1. **Consent checkbox and newsletter double opt-in** — blocks connecting a
   live form provider
2. **Legal pages** — placeholder text, currently `noindex`
3. **Form delivery** — validated end to end, but the active adapter logs
   rather than sends
4. **Edge rate limiting** — rules documented in
   [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), to be applied at the CDN
