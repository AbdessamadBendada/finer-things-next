# The visual parity gate

The migration's acceptance criterion, kept as a permanent test.

## Baselines are generated, not committed

`legacy/` — the twelve original documents — is the source of truth and is in
the repository. The baseline screenshots are derived from it and are **not**
committed: they are around 100 MB, and font rasterisation differs between
macOS and Linux, so a committed set would fail everywhere except the machine
that produced it.

So the first thing to do in a fresh checkout, or in CI, is:

```bash
pnpm parity:baseline    # ~6 minutes, captures 36 references from legacy/
pnpm parity             # compare the Next build against them
```

Both must run in the same environment. In CI they belong in the same job.

## What it does

Twelve routes × three viewports = 36 screenshots, each compared against the
same page rendered from the original static site in `legacy/`.

```bash
pnpm parity            # compare the Next build against the baselines
pnpm parity:baseline   # recapture the baselines from the legacy site
pnpm parity:report     # open the HTML report with diff images
```

Both sites are served at once — legacy on `:4321` via
`tools/legacy-server.mjs`, the Next build on `:3100` — so the comparison is
against the real thing rather than a remembered impression of it.

## Why it exists

"Make it look the same" is not a testable statement. This turns it into a
pass/fail one, and it keeps working after the migration: it is the reason the
shared-header refactor and the CSS-specificity fix could be made confidently.

It has already earned its keep. It caught two bugs that were invisible in
review:

- every `body.ready` selector was dead, so the About hero rendered **blank**;
- the wordmark silently fell back from Rodetta to Goudy because nesting page
  rules under `.page` flipped a specificity tie.

Neither was noticeable without a pixel comparison.

## How a page is prepared

Both sites reveal content on scroll and lazy-load imagery, so a naive
screenshot would catch half-finished animations. `settlePage` walks the whole
document to trigger every observer, returns to the top, waits out the
fail-open watchdog, and blocks until every image has decoded and fonts are
ready. Screenshots are taken with `animations: 'disabled'`.

The scroll walk measures the document height **once** and is bounded — the
home page's pinned filmstrip grows the document as you scroll through it, so a
loop that re-read `scrollHeight` each pass would never terminate.

## Tolerance

`maxDiffPixelRatio: 0.01`, `threshold: 0.2`. This absorbs font rasterisation
and sub-pixel antialiasing differences between runs. Anything structural —
a moved element, a wrong font, a missing section — is orders of magnitude
above that floor.

**Do not raise these numbers to make a failure pass.** That converts the gate
into decoration. If a change is intentional, regenerate that baseline
deliberately and say so in the commit.

## Changing the design on purpose

The gate was built to prove the migration was faithful. Once you start
redesigning, that question changes: a page you have deliberately changed
should no longer be measured against the original.

Each page in `tests/visual/pages.ts` declares where its baseline comes from:

```ts
{ name: 'about', legacy: '/about.html', route: '/about' }                        // vs the original
{ name: 'about', legacy: '/about.html', route: '/about', baseline: 'current' }   // vs the last approved build
```

The default is `legacy`, so a page has to opt out of being checked against the
original — nothing silently stops being verified.

**The workflow for a design or copy change:**

1. Make the change and review it with `pnpm dev`.
2. Run `pnpm parity`. It will fail on that page — that is correct.
3. Open `pnpm parity:report` and look at the diff. **Confirm only what you
   intended moved.** This is the step that earns its keep: it catches the
   layout you shifted by accident while editing a line of copy.
4. Set `baseline: 'current'` on that page and regenerate. From then on it is
   protected against regression instead of against the original.

Pages you have not touched keep being checked against `legacy/`, so the
migration stays verified while the redesign proceeds page by page.

## When a failure is legitimate

A copy edit, a design change, or a new section will fail parity, correctly.
The procedure:

1. Run `pnpm parity:report` and look at the diff image.
2. Confirm the only differences are the ones you intended — this is the real
   value of the step, since it surfaces layout the edit moved by accident.
3. Recapture just that page's baseline.
4. Commit the code and the updated baseline together, and note it.

## What the gate does not cover

The **masthead** is hidden in both the baseline and the comparison. It
deliberately differs from the original — every page now carries the logo image
where the legacy inner pages set text ([adr/0007](adr/0007-one-logo.md)) — and
since it is `position: fixed` it affects no layout. Hiding it in both keeps the
rest of the page measured honestly against the original, rather than
re-baselining whole pages and losing the comparison entirely.

`tests/visual/masthead.spec.ts` covers it instead.

## Known limitations

- **Photographic resampling.** `next/image` serves a resized variant, while
  the legacy site served the original file. The rendered result is
  indistinguishable, but the pixels differ slightly; this sits inside the
  tolerance.
- **Chromium only.** The gate protects layout and styling, which do not vary
  meaningfully across engines for this site. It is not a cross-browser test.
- **Baselines are platform-sensitive**, which is why they are regenerated per
  environment rather than committed.
