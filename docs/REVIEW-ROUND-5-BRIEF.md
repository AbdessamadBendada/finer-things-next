# Review round 5 — implementation brief

A work order for an AI agent (Codex) picking up the latest round of client
review comments. Everything an agent needs to do one task correctly and stop
is in this file or linked from it.

**Status: the task list below is not filled in yet.** The standing sections —
protocol, house rules, verification, traps — are complete and correct. The
comments arrive separately and get written into
[The tasks](#the-tasks) before any agent starts.

---

## How this round runs

**One batch at a time, and the batch does not start until the human says so.**

1. An agent is dispatched for **one batch**. It does only the tasks in that
   batch.
2. It reports back: what changed, what it verified, and anything it hit that
   the brief did not predict.
3. The human reviews the result in a browser — not just the test output.
4. Only on an explicit go-ahead does the next batch start.

Batches are grouped so that two agents never edit the same file. Where two
comments touch one stylesheet they belong in the same batch, run by one agent,
sequentially. This matters more than it sounds: the styles here resolve by
source order across files, so two agents editing `brand.css` and a page module
in parallel produce a result neither of them tested.

An agent that finishes its batch **stops**. It does not look ahead at the next
batch, and it does not "while I'm here" anything. See rule 1 below.

### Dispatching a batch

Paste this to the agent, filling in the batch number. Nothing else is needed —
everything it must know is in this file or linked from it.

> Read `docs/REVIEW-ROUND-5-BRIEF.md` in full, then `AGENTS.md`, before you
> touch anything.
>
> Do **Batch N**, and only Batch N. Every task in it, completely — do not
> narrow the scope, and do not start work from any other batch.
>
> The Traps section is not optional reading. In particular: `pnpm build` and
> kill port 3100 before every check, or you will be looking at a stale build;
> and confirm which CSS rule actually wins before editing a value, because the
> id-scoped rules in `brand.css` beat the page modules.
>
> Look at every change in a real browser at 1440×900 and 390×844, not only in
> the test output. Then run `pnpm verify`.
>
> Report back per the Reporting section: per task what changed and what you
> verified, before/after screenshots, which parity baselines you regenerated
> and why, anything that contradicted the brief, and anything you did not do.
>
> If a task is ambiguous enough that two readings would produce materially
> different work, ask before starting rather than guessing. Then stop and
> wait — do not continue to the next batch.

---

## The five rules that get broken most

The full contract is [AGENTS.md](../AGENTS.md) — read it. These five are the
ones that have actually caused rework on this project.

**1. Build additively. Never remove.**
"Add a page" is not permission to delete anything from an existing page.
"Change this section" is not permission to simplify the one next to it. If a
change seems to require removing something the client did not ask about, stop
and say so instead.

**2. No heading may run past two lines.**
Enforced by `tests/visual/headings.spec.ts`, which carries a shrinking backlog
of exemptions. Do not add an exemption to make a heading pass. Two long
statement headings are exempt at three (desktop) and five (phone) lines; those
are recorded, not free.

**3. A design change means re-baselining, deliberately.**
Any visual change makes `pnpm parity` fail on that page. That is the gate
working. Review `pnpm parity:report`, confirm **only** the intended thing
moved, then regenerate that page's baseline and say so. Never raise
`maxDiffPixelRatio`.

**4. Say naming and URL concerns once.**
If a route or a name seems wrong, flag it in the report — once — and implement
what was asked. Do not relitigate it, and do not rename anything on your own
initiative.

**5. Log the work before handing back.**
One entry per task in [CODEX-CHANGES.md](CODEX-CHANGES.md), and one entry per
comment in [FEEDBACK.md](FEEDBACK.md) using its Asked / Read as / Done / Note
structure. Quote the client's comment as given, not tidied up.

---

## Verifying a change

```bash
pnpm verify   # typecheck + lint + build + test + parity
```

Parity baselines are **not committed**. On a fresh machine run
`pnpm parity:baseline` once first — it captures them from `legacy/`. A red
`pnpm parity` on a machine that has never done this is a missing baseline, not
your regression.

### Looking at the change in a browser

Tests passing is not the same as the thing looking right. Every task in this
round is a visual judgement, so look at it:

```bash
pnpm build
lsof -ti:3100 | xargs kill -9   # see the trap below
npx next start --port 3100
```

Then drive it with Playwright, or open it. Screenshot before and after at
**1440×900** and **390×844** at minimum.

---

## Traps in this codebase

These are real, each cost time, and none are guessable from the code.

### The server serves a stale build

The Playwright config runs `next start` on **port 3100**, which serves
whatever is in `.next`. It does not rebuild. Change CSS, re-run the tests, and
you will test the old build and watch a correct fix "fail". **`pnpm build`
before every check**, and kill port 3100 first so a lingering server does not
get reused. The same is true of port 3000 for `next dev`.

### `brand.css` id-selectors silently beat the CSS modules

Page modules (`src/features/*/styles/*.module.css`) load **after**
`src/shared/styles/brand.css`. So a class rule in `brand.css` loses to the
module, and `brand.css` compensates by scoping its overrides to **ids** —
`[data-page='home'] #purpose-title …` — which then beat the module.

The consequence: **editing a value in the module may do nothing.** This
happened on 2026-09-08 — a word-reveal stagger was retuned in
`home.module.css`, the build was clean, the tests passed, and the timing on
screen did not move, because an id-scoped rule in `brand.css` was the one
actually applying.

Before changing any value, confirm which rule wins:

```bash
grep -rn "<property-or-custom-prop>" src --include="*.css"
```

and read the computed style in the browser rather than trusting the file you
edited.

### Motion must fail open

Anything that starts hidden must become visible even if its JavaScript never
runs. See [MOTION.md](MOTION.md) and `shared/motion/useFailOpenReveal.ts`.
Reduced motion and no-JS both have to end with the content on screen. There
are tests for this; do not weaken them.

### `#purpose` was just rebuilt — do not "restore" it

The home statement's pinned, scroll-driven treatment (FEEDBACK comment 21) was
**removed** on 2026-09-08 at the client's request: no more sticky pin, no more
scroll-hijack, a faster word reveal, and ordinary section padding instead of
`100svh`. `usePurposeReveal.ts` and its `.scroll-reveal` CSS are still in the
tree, unwired and labelled as such, in case it is ever wanted back. An agent
that finds them and "fixes the disconnected hook" will undo a client decision.

---

## Reporting back

Each finished batch reports:

- **Per task**: what changed, which files, what was verified and the result.
- **Screenshots**: before and after, desktop and phone.
- **Parity**: which baselines were regenerated and why.
- **Surprises**: anything that contradicted this brief — those go back into
  the Traps section so the next agent gets them.
- **Not done**: anything skipped or blocked, and why. Never quietly narrow a
  task; a smaller scope is the human's call.

---

## The tasks

> To be filled in from the client's comments. One entry per comment, in this
> shape, grouped into batches that do not share files.

### Template

```md
#### C<n> — <short title>

- **Asked** (verbatim): "<the client's words, not paraphrased>"
- **Read as**: <the interpretation being implemented, where the comment
  allowed more than one>
- **Where**: <files and selectors, as specific as can be determined>
- **Done when**: <the observable result, in terms someone can check in a
  browser>
- **Do not**: <the adjacent thing that must not change>
- **Open question**: <or `None` — ask before starting, do not guess>
```

Batches run **in order**, not in parallel — batch 2 and batch 3 both edit
`brand.css`, in different sections, and that is only safe because one finishes
before the next starts.

---

### Batch 1 — the home page loses two things

Both tasks are in the same three files. One agent, one pass.

#### C1 — Remove the "Our story" section from the home page

- **Asked** (verbatim): "Our story section in the home page should be removed!"
- **Read as**: delete the section from the home page only. The founders' copy
  and portrait also live on `/about`, and that page is untouched.
- **Where**:
  - `src/features/home/ui/HomePage.tsx` — the block that begins with the
    comment `{/* FAMILY EDITORIAL PORTRAIT */}` and runs from
    `<section className="family-editorial" id="story" …>` to its closing
    `</section>`. It sits between the featured filmstrip section and
    `<SiteCta />`. Delete the comment and the section together.
  - `src/features/home/styles/home.module.css` — every `.family-editorial*`
    rule becomes dead. `grep -n "family-editorial" src/features/home/styles/home.module.css`
    and delete all of them, including the ones inside the `@media(max-width:860px)`
    block.
  - `src/shared/styles/brand.css` — `grep -n "#story" src/shared/styles/brand.css`.
    There is a `.story-cta` treatment and a media query restating the grid
    stacking. Both are dead; delete them.
  - `src/features/home/motion/useHomeMotion.ts` — inside `drive`, the two lines
    that query `.family-editorial-portrait` and call
    `setDrift(portrait, '--family-shift', 28)`. If `setDrift` is then unused in
    the file, remove it from the import too, or lint will fail.
- **Tests that will break — fix them as part of this task, do not skip them:**
  - `tests/visual/home-story.spec.ts` — the whole file tests `#story .story-cta`.
    **Delete the file.**
  - `tests/visual/reveal.spec.ts` — the `CASES` array's first entry,
    `{ route: '/', selector: '.family-editorial-portrait', settle: 7000 }`.
    Remove that one entry; leave the two `/about` entries alone.
- **Done when**: `/` renders with no `#story` section, the filmstrip is
  followed directly by the closing CTA, `grep -rn "family-editorial" src tests`
  returns nothing, and the suite is green.
- **Do not**: touch `/about`, or remove the About entry from the menu or the
  footer. Losing the "Meet the family" button from the home page is expected;
  About is still reachable from both.
- **Open question**: None.

#### C4 — Remove the small inset photograph from the featured cards

- **Asked** (verbatim): "in the featured section there are a big image and a
  small little image stick with it right ? Delete that small image please."
- **Read as**: the small rotated photograph pinned to the top-right corner of
  each featured project card. It is `.film-detail`. The card's main image
  (`.film-image`), its shade, number, title and caption all stay.
- **Where**:
  - `src/features/home/ui/HomePage.tsx` — five `<div className="film-detail">…</div>`
    blocks, one per `<article className="film-card">`, each wrapping a `<Media>`.
    Delete all five, including the `<Media>` inside them.
  - `src/features/home/styles/home.module.css` — four `.film-detail` rules.
    `grep -n "film-detail"` to find them; one is inside a media query.
- **Done when**: `grep -rn "film-detail" src` returns nothing, and all five
  cards show only their full-bleed photograph with the copy over it.
- **Do not**: delete the image files from `public/assets/`. Five assets become
  unreferenced (`new-work-marsa-lobby-08`, `new-work-marsa-suite2-02`,
  `new-work-marsa-shelfs`, `new-work-marsa-corridor-03`,
  `new-work-marsa-lobby-12`) and they stay on disk.
- **Open question**: None.

---

### Batch 2 — the footer, and a new Imprint page

One task, but it is the largest in this round: it adds a route.

#### C3 — Three footer columns, and an Imprint page

- **Asked** (verbatim): "In the footer there is a contact column where there is
  linked contact and pricy .. this is not how it should be we should make the
  contact and make in it LinkedIn and instagram + contact and make a legal
  column or if we can make it bellow the contact column or something in it
  there will be in It privacy and terms and imprints which we didn't create
  yet, and we should, let's create it."
- **Read as**: the footer's second column currently mixes social, contact and
  legal links. Split it in two. The column headed **Connect** holds LinkedIn,
  Instagram and Contact. A new column headed **Legal** holds Privacy, Terms and
  Imprint. Imprint is a page that does not exist yet and has to be built.
- **Current state**: `FOOTER_CONNECT` is `[LINKEDIN, CONTACT, PRIVACY, TERMS]`
  and `SiteFooter` renders exactly two columns, Explore and Connect.

**Do these in order:**

1. **`src/shared/config/routes.ts`** — add `imprint: '/imprint'` to `ROUTES`,
   and add `ROUTES.imprint` to `ALL_ROUTES` immediately after `ROUTES.terms`.
   Do **not** add a `LEGACY_REDIRECTS` entry: there was never an
   `/imprint.html` to redirect from.

2. **`src/shared/config/navigation.ts`** — beside the existing `LINKEDIN`
   constant add:

   ```ts
   const INSTAGRAM: NavLink = { href: '#', label: 'Instagram' };
   const IMPRINT: NavLink = { href: ROUTES.imprint, label: 'Imprint' };
   ```

   Then change the exported sets to:

   ```ts
   export const FOOTER_CONNECT = [LINKEDIN, INSTAGRAM, CONTACT] as const;
   export const FOOTER_LEGAL = [PRIVACY, TERMS, IMPRINT] as const;
   ```

   `LINKEDIN` and `INSTAGRAM` both keep `href: '#'` — the real URLs have not
   been supplied yet. This is a known, accepted gap for this batch; say so in
   your report. Do not invent social URLs.

3. **`src/shared/layout/SiteFooter.tsx`** — import `FOOTER_LEGAL` and add a
   third column after the Connect one, in the same shape:

   ```tsx
   <div>
     <h4>Legal</h4>
     {FOOTER_LEGAL.map((link) => (
       <FooterLink key={link.href} {...link} />
     ))}
   </div>
   ```

4. **The two-column grid has to become three.**
   - `src/shared/styles/brand.css`, `[data-page] .ft-cols` — currently
     `grid-template-columns: repeat(2, minmax(120px, 160px))`. Make it `3`.
   - `src/shared/styles/chrome.css`, `[data-page='home'] .ft-cols` — a
     `display: flex` with `gap: 60px`, which takes a third column on its own.
     Check it at 390px wide and add wrapping if the three columns overflow.
   - Check the footer at 1440, 768 and 390. Three columns plus the brand block
     is the layout most likely to break on a phone.

5. **Build `/imprint`**, mirroring the two legal pages exactly — read
   `src/features/legal/ui/TermsPage.tsx` and `TermsShell.tsx` first and follow
   their structure, they are the template:
   - `src/features/legal/ui/ImprintPage.tsx` and `ImprintShell.tsx`
   - export `ImprintPage` from `src/features/legal/index.ts`
   - `src/app/(legal)/imprint/page.tsx`, mirroring
     `src/app/(legal)/privacy/page.tsx` — including **`noIndex: true`**, which
     both existing legal routes set.

   **The content:** an imprint is a legal notice and needs real company data —
   registered name, legal address, register and VAT numbers, managing director,
   contact. **We do not have it, and you must not invent any of it.** The legal
   pages already have the convention for this: a `<div className="notice">`
   reading "Draft only." at the top, and `<p className="placeholder">` for each
   unsupplied fact. Use them. Every field a real imprint needs gets a heading
   and a `.placeholder` paragraph naming what must be supplied — e.g. "Add the
   registered company name and legal form before launch." A reader must be able
   to tell at a glance that the page is unfinished.

6. **Tests and metadata for the new route:**
   - `tests/seo/seo.spec.ts` — the per-route metadata table has an entry per
     path; add one for `[ROUTES.imprint]` with a title and description, and add
     it to the heading-expectation map beside it. Follow the `ROUTES.ourCraft`
     entry as the model.
   - `tests/visual/pages.ts` — add
     `{ name: 'imprint', legacy: '/privacy.html', route: '/imprint', baseline: 'current' }`.
     `baseline: 'current'` because, like Our Craft, there is no legacy document
     for this page.
   - `tests/visual/headings.spec.ts` reads `ALL_ROUTES` and will pick the page
     up on its own. Make sure its headings run to two lines at most, or you
     will have to add an exemption — which the brief says not to do.
   - **Two `Set`s hardcode the legal routes and both need `ROUTES.imprint`
     adding, or the SEO suite fails.** The page is `noIndex`, so it must be
     excluded from the sitemap exactly as Privacy and Terms are:
     - `src/app/sitemap.ts` line 7 —
       `const EXCLUDED = new Set<string>([ROUTES.privacy, ROUTES.terms]);`
     - `tests/seo/seo.spec.ts` line 8 —
       `const LEGAL_ROUTES = new Set<string>([ROUTES.privacy, ROUTES.terms]);`
       which drives `INDEXABLE_ROUTES`, and the test asserting the sitemap
       lists exactly the indexable canonical routes.

- **Done when**: the footer shows Explore / Connect / Legal on every page and
  at every width; `/imprint` renders, is linked from the footer, and is
  obviously a draft; `pnpm verify`'s typecheck, lint, build and `pnpm test` all
  pass.
- **Do not**: remove Privacy or Terms, change their content, or drop Contact
  from the footer. Contact moves into the Connect column, it does not disappear.
- **Open question**: None — the placeholder approach was confirmed by the
  client. The real company details and the two social URLs come later.

---

### Batch 3 — two small ones

#### C2 — The closing CTA button is filled brand orange

- **Asked** (verbatim): "the start a project button in the final cta is gonna
  be a fill with the brand orange please"
- **Read as**: the "Start a project" button in the shared closing CTA, on every
  page that has one, is filled with the brand orange instead of near-black.
- **The colour is `var(--clay)`**, `#b56d43` — the canonical accent token in
  `src/shared/styles/tokens.css`. It is the same orange as the section eyebrows
  and the service-row numbers. `--brass` is an alias for it. Do not introduce a
  new hex value.
- **Where**: `src/shared/styles/brand.css`, the existing rule
  `[data-page]:not([data-page='contact']) .closing .btn`, which currently sets
  only `margin-top`. Add the fill there — that selector already scopes the
  change to the shared CTA and correctly leaves the Contact page's different
  panel alone.

  ```css
  background: var(--clay);
  color: var(--paper);
  ```

  and a hover/focus rule on the same selector taking it to `var(--oxblood)`,
  which is the site's existing deeper accent and what the button already used
  on hover.

- **Do not** change `[data-page] .btn` in `primitives.css`. That is every button
  on the site — the hero CTA, the newsletter, the story links. The comment asks
  for one button.
- **Known trade-off, and it must be in your report**: paper text on `--clay` is
  about **3.6:1**, under the 4.5:1 WCAG AA needs at this button's size
  (`--text-ui`, roughly 12px uppercase). The current ink fill is far above it,
  and `--oxblood` is about 6.9:1. Implement what the client asked for, measure
  the actual ratio, and state it. Do not silently substitute a darker colour,
  and do not silently ship it without flagging.
- **Done when**: the button reads brand orange on Home, Our Work, Our Craft,
  Projects, About, the three service pages and both project pages, and the
  Contact page's closing panel is unchanged.
- **Open question**: None.

#### C5 — Finer Living's kicker reads "Curated collection"

- **Asked** (verbatim): "In the finer living page instead of WHAT WE DO / 03 we
  need to put curated collection."
- **Where**: `src/features/services/ui/FinerLivingPage.tsx`, around line 22, in
  the hero:

  ```tsx
  <div className="hero-kicker eyebrow">
    <Link className="context-link" href={ROUTES.ourWork}>
      What we do / 03
    </Link>
  </div>
  ```

- **Do exactly this** — the client confirmed it becomes plain text, not a link,
  because "Curated collection" names this page rather than the page it used to
  point at:

  ```tsx
  <div className="hero-kicker eyebrow">Curated collection</div>
  ```

  Then check whether `Link` and `ROUTES` are still used elsewhere in the file
  (they are, further down) and only remove an import if it has genuinely become
  unused.

- **Done when**: the Finer Living hero reads "CURATED COLLECTION" in the
  eyebrow style, and there is no link in the kicker.
- **Do not**: change the equivalent kicker on `/services/bespoke-accessories`
  ("What we do / 01") or `/services/styling-curation` ("What we do / 02"). The
  comment named Finer Living only. **Flag in your report** that the three
  service pages are now inconsistent, so the client can decide — state it once
  and do not act on it.
- **Open question**: None.
