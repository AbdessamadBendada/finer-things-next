# Codex change log

This is the durable handoff log for AI-authored work in this repository. Read
the newest entry before starting. Keep entries concise, factual and newest
first. Git remains the source of truth for exact diffs.

## How to record a change

Every completed AI task must add an entry with this structure:

```md
## YYYY-MM-DD: Short task name

**Codex change**

- Commit: `<hash and subject>`, `uncommitted`, or `this commit` when the entry
  records the commit that creates it
- Changed: what changed and why
- Files: the important paths
- Verified: checks that actually ran and their result
- Follow-up: remaining work, or `None`
```

Do not record personal data, secrets, speculative work or a copy of the full
Git diff. If a change updates an architectural rule, security posture or open
decision, update its authoritative document too and link it from the entry.

## 2026-09-02: Artisan photography gets a section on each page

**Claude change**

- Commit: `this commit`
- Changed: on Our Work, the three workshop photographs moved out of the intro
  into their own dark section after The Details, with an eyebrow, heading and
  note following the existing `continuity` pattern, and now sit inside `.wrap`
  so they line up with the detail cards above rather than running wider.
  They also rotate: one photograph turns over every two seconds, drawn from the
  21-image pool. On About, the artisans section moved to directly after
  Malika's founder block and changed from dark to `--stone`.
- Rationale for stone rather than paper on About: the section now sits between
  the two dark founder blocks and the paper `.world`, so matching paper would
  merge the two light sections into one.
- The rotation logic was extracted to `shared/motion/useImageRotation.ts` and
  the image pool to `shared/content/artisans.content.ts`, because a feature may
  not import from a sibling feature. The About wall now uses the same hook.
- Fixed while here: `tests/visual/pages.ts` claimed to freeze the About wall
  for the pixel gate, but `--frozen` was set and never read, so the wall really
  was still swapping images mid-capture. The hook now honours it, which is what
  makes a rotating strip safe to add to a page inside the gate.
- Files: `src/features/our-work/ui/{OurWorkPage,ArtisanStrip}.tsx`,
  `src/features/our-work/styles/our-work.module.css`,
  `src/features/about/ui/{AboutPage,ArtisanWall}.tsx`,
  `src/shared/motion/{useImageRotation.ts,index.ts}`,
  `src/shared/content/artisans.content.ts`, `src/shared/styles/brand.css`,
  `tests/visual/{pages.ts,artisan-strip.spec.ts}`
- Verified: measured the image widths against the detail cards at five
  viewports (identical at all five); sampled opacity and transform through
  swaps to confirm nothing disappears and the slide is real; `pnpm verify`
  green with About and Our Work re-baselined after reviewing both by eye.
- Regression guarded: `.rise` figures are revealed by `classList.add('in')`,
  so a React-owned className on the same element strips it on every swap and
  empties the strip. This shipped once. The changing classes now live on an
  inner element, and `artisan-strip.spec.ts` fails if that is undone —
  confirmed by reintroducing the bug and watching the test fail.
- Follow-up: the Our Work section copy is a first draft and needs Alex.

## 2026-09-02: Bespoke Accessories heading broke mid-word

**Claude change**

- Commit: `this commit`
- Changed: raised the hero `h1` cap on `/services/bespoke-accessories` from
  `9ch` to `10ch`.
- Rationale: "Accessories" is eleven characters and the second line carries a
  `.72em` indent, so the word needed about 9.14ch against a 9ch cap and the
  global `overflow-wrap: break-word` split it as `Accessorie / s`. The other
  two service pages escape it because their longest word is eight characters.
  Pre-existing, and confirmed as such by rebuilding with the pre-Batch-2
  markup and reproducing it.
- Files: `src/features/services/styles/bespoke-accessories.module.css`
- Verified: one line and no horizontal overflow at 390, 430, 700, 860, 1100,
  1280, 1440, 1920; inspected desktop, tablet and mobile; baseline refreshed.
- Note: all three parity snapshots **passed** with the heading visibly broken.
  The tolerance is a fraction of a page thousands of pixels tall, so the gate
  cannot see a single heading. See PARITY.md.

## 2026-09-02: Verify and correct SEO batches 1 and 2

**Claude change**

- Commit: `this commit`
- Changed: independently re-verified both batches against rendered production
  HTML, then fixed five things.
  1. Removed the invented `https://finerthings.com` default from
     `src/shared/config/env.ts`. Development falls back to
     `http://localhost:3000`, and a production build without
     `NEXT_PUBLIC_SITE_URL` prints a loud `[env]` warning naming what will be
     wrong. A plausible-looking wrong origin ships silently; localhost cannot.
  2. `canonicalUrl()` now strips the trailing slash including on the root, so
     the home canonical and its sitemap entry match character for character.
     Its comment previously claimed this without doing it.
  3. `TITLE_TEMPLATE` is defined once and shared by the root layout and
     `buildMetadata`, rather than the brand suffix being spelled in both.
  4. The placeholder-link assertion no longer requires the broken LinkedIn
     link to exist; it asserts no _unknown_ placeholder exists, so it will not
     fail on the day SEO-06 is fixed.
  5. Social images: `/projects/marsa-al-arab` and `/services/styling-curation`
     fall back to the generated 1200x630 card. Their photographs are portrait
     2:3 and link previews crop to roughly 1.91:1. Every one of the 27 supplied
     Marsa photographs is portrait, so no landscape option exists. A test now
     asserts any page-specific card is landscape.
     Also added `provider` to the `Service` JSON-LD, and corrected the test's
     hardcoded `^https:` social-image assertion, which only passed because the
     origin happened to be the fake domain.
- Files: `src/shared/config/env.ts`, `.env.example`,
  `src/shared/seo/{url.ts,metadata.ts,JsonLd.tsx}`, `src/app/layout.tsx`,
  project and service registries, `tests/seo/seo.spec.ts`,
  `docs/SEO-LAUNCH-ACTION-PLAN.md`
- Verified: rendered HTML on seven routes, `robots.txt`, `sitemap.xml`,
  trailing-slash redirects and 404s inspected directly; `pnpm verify` green.
  The title regression test was confirmed to fail by reintroducing the original
  `Finer Things | Luxury Motion Study | Finer Things` bug.
- Follow-up: Group A now holds SEO-07, 11, 15 and 16 only.

## 2026-09-02: Implement SEO launch Batch 2

**Codex change**

- Commit: `uncommitted`
- Changed: completed SEO-03, SEO-08 and the unblocked part of SEO-09. Added
  real text-node spaces between decorative H1 line wrappers; assigned approved
  repository photography, truthful dimensions and descriptive social alt text
  to both project and all three service pages; added site-wide `WebSite`
  JSON-LD and `Service` JSON-LD only on the three service routes; and extended
  the SEO suite to cover exact H1 text, social images and the new structured
  data without permitting blocked Organization fields.
- Files: the affected H1 components under `src/features/`, project and service
  registries, `src/shared/seo/metadata.ts`, `src/shared/seo/JsonLd.tsx`,
  `src/app/layout.tsx`, `src/app/(site)/services/[slug]/page.tsx`,
  `tests/seo/seo.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: first confirmed the H1 regression failed against the unchanged
  What we do heading on `ordinaryinto`; focused typecheck, lint, production
  build and all 15 SEO tests passed; `pnpm verify` passed typecheck, lint,
  production build, 8 form tests, 15 SEO tests and all 36 visual parity
  snapshots with no baseline refresh. No snapshot moved because each literal
  space sits at an existing block-level line boundary and therefore changes
  semantic text without painting a visual glyph.
- Follow-up: Human review can confirm that no rebaseline is needed; the parity
  suite produced no diffs to approve. All out-of-scope SEO items remain
  unchanged.

## 2026-09-02: Implement SEO launch Batch 1

**Codex change**

- Commit: `uncommitted`
- Changed: completed SEO-02, SEO-05, SEO-10, SEO-14 and SEO-17. Replaced
  placeholder and duplicated titles with subject titles branded once; kept
  Home absolute; made legal-page `noindex, follow` crawlable; removed synthetic
  sitemap freshness, frequency and priority fields; added Twitter image alt
  metadata; removed the robots Host directive; enforced no trailing slashes on
  non-root routes; and added all-route SEO regression coverage to the standard
  test command.
- Files: `next.config.ts`, `package.json`, route metadata under `src/app/`,
  `src/app/robots.ts`, `src/app/sitemap.ts`, project and service registries,
  `src/shared/seo/metadata.ts`, `src/shared/seo/url.ts`,
  `tests/seo/seo.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: first confirmed the new title regression failed against the
  unchanged build on `Finer Things | Luxury Motion Study | Finer Things`; then
  passed the focused 15-test SEO suite; `pnpm verify` passed typecheck, lint,
  production build, 8 form tests, 15 SEO tests and all 36 visual parity
  snapshots with no baseline refresh.
- Follow-up: None for Batch 1. All out-of-scope SEO plan items remain unchanged.

## 2026-09-02: The gallery is simply /projects

**Claude change**

- Commit: `this commit`
- Changed: deleted the superseded editorial projects index and its temporary
  comparison route `/projects-editorial`, then folded the approved gallery into
  the `projects` feature so no name refers to it as new. `ProjectNewPage` ->
  `ProjectsPage`, `ProjectNewShell` -> `ProjectsShell`,
  `project-new.module.css` -> `projects.module.css`, and
  `features/project-new/` is gone. Removed the route's robots disallow and
  sitemap exclusion, its parity entry and baselines, and the `CHROME_ALIAS`
  indirection in `shared/config/navigation.ts` that existed only to lend the
  temporary route a styled header.
- Rationale: the route was disallowed in `robots.txt` while also serving
  `noindex`, which is self-cancelling. robots.txt blocks the fetch, so the
  `noindex` could never be read, leaving the URL eligible for a bare listing.
  Deletion removes the conflict rather than managing it, and the code comment
  on the route already asked for it once the verdict landed.
- Files: `src/app/(site)/projects/page.tsx`,
  `src/app/(site)/projects-editorial/` (deleted), `src/features/projects/`,
  `src/features/project-new/` (deleted), `src/app/robots.ts`,
  `src/app/sitemap.ts`, `src/shared/config/routes.ts`,
  `src/shared/config/navigation.ts`, `src/shared/layout/SiteChrome.tsx`,
  `tests/visual/pages.ts`, `docs/HANDOFF.md`, `docs/FEEDBACK.md`,
  `docs/SEO-LAUNCH-ACTION-PLAN.md`
- Verified: typecheck, lint, Prettier, a clean production build showing
  `/projects-editorial` gone from the route table, 8 form tests, and 36 of 36
  parity snapshots passing with no baseline refresh, confirming the rename is
  visually inert.
- Follow-up: None. `docs/SEO-LAUNCH-ACTION-PLAN.md` SEO-04 is closed.

## 2026-09-01: Contact details and wide-screen consistency

**Codex change**

- Commit: `this commit`
- Changed: replaced the redundant Contact closing block with studio contact
  details sourced from shared configuration; added a shared CTA type fallback
  and capped full-bleed grids and wrappers on very wide displays.
- Files: `src/features/contact/ui/ContactPage.tsx`,
  `src/shared/config/site.ts`, `src/shared/styles/brand.css`,
  `docs/CODEX-CHANGES.md`
- Verified: typecheck, lint, production build, 8 form tests, focused About and
  gallery alignment tests, refreshed 39 current visual baselines, and all 39
  visual parity checks
- Follow-up: replace every `SITE.contact` placeholder with confirmed studio
  information before launch

## 2026-09-01: Align project gallery tiles

**Codex change**

- Commit: `this commit`
- Changed: compensated the two-column and two-row gallery tile ratios for
  their internal grid gutters so wide, tall and standard neighboring images
  share the intended lower edges.
- Files: `src/features/project-new/styles/project-new.module.css`,
  `tests/visual/project-gallery-alignment.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: production build; refreshed and visually inspected the Projects
  desktop baseline; focused wide-and-tall gallery alignment test passed at
  1440 px
- Follow-up: None

## 2026-09-01: Balance the founder grids

**Codex change**

- Commit: `this commit`
- Changed: gave both About founder rows one centered, equal-width two-column
  frame with a restrained gutter, preserving the mirrored order; moderately
  reduced only the transition spacing between the two founder rows.
- Files: `src/shared/styles/brand.css`, `tests/visual/about-founders.spec.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: production build; focused About founder browser tests; refreshed
  and visually inspected the About desktop baseline
- Follow-up: None

## 2026-09-01: Overlay Alex's experience proof point

**Codex change**

- Commit: `uncommitted`
- Changed: moved the “20+ years” fact onto Alex's portrait as a compact
  editorial overlay so the full biography remains in place without pushing
  the proof point below the fold; switched the About portrait caption to
  “Malika and Alex”, matching the Home page caption exactly.
- Files: `src/features/about/ui/AboutPage.tsx`,
  `src/shared/styles/brand.css`, `tests/visual/about-founders.spec.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: production build; focused About founder browser tests; visual
  inspection of refreshed About baselines; `pnpm verify` (typecheck, lint,
  build, 8 form tests, and 39 visual parity checks)
- Follow-up: None

## 2026-09-01: Balance Malika's founder heading

**Codex change**

- Commit: `uncommitted`
- Changed: kept the supplied heading copy and typography while allowing its
  emphasized final word to remain inline on desktop, producing two balanced
  lines instead of an orphaned third line.
- Files: `src/features/about/ui/AboutPage.tsx`,
  `src/shared/styles/brand.css`, `tests/visual/about-founders.spec.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: production build; About founder browser tests at 1440 px and
  390 px; visual inspection of the refreshed desktop baseline; `pnpm verify`
  (typecheck, lint, build, 8 form tests, and 39 visual parity checks)
- Follow-up: None

## 2026-09-01: Replace Malika's About placeholder

**Codex change**

- Commit: `this commit`
- Changed: replaced Malika's placeholder portrait and biography with the
  supplied copy and the shared founders portrait; named Alex Lahmer and Malika
  Lahmer directly in their respective founder headings.
- Files: `src/features/about/ui/AboutPage.tsx`, `docs/HANDOFF.md`,
  `docs/CODEX-CHANGES.md`
- Verified: focused founder-content, loaded-image and mobile-overflow checks
  passed; visually reviewed desktop and mobile; explicitly regenerated only
  the three About baselines; `pnpm verify` passed (typecheck, lint, production
  build, 8 form tests and 39 visual-parity checks).
- Follow-up: obtain a dedicated portrait of Malika if the client later wants
  to replace the shared founders image.

## 2026-09-01: Link the Home story to About

**Codex change**

- Commit: `this commit`
- Changed: added a “Meet the family” button to the Home Our story section,
  aligned with its editorial copy and linked through the shared About route.
- Files: `src/features/home/ui/HomePage.tsx`,
  `src/shared/styles/brand.css`, `tests/visual/home-story.spec.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: focused link, button-treatment, desktop target and mobile alignment
  checks passed; explicitly regenerated only the three Home baselines for the
  intentional new control; `pnpm verify` passed (typecheck, lint, production
  build, 8 form tests and 39 visual-parity checks).
- Follow-up: None.

## 2026-09-01: Balance the shared CTA supporting copy

**Codex change**

- Commit: `this commit`
- Changed: narrowed the shared closing CTA's desktop paragraph measure so its
  unchanged supporting sentence forms two intentional, balanced lines instead
  of orphaning “in mind.”
- Files: `src/shared/styles/brand.css`, `tests/visual/site-cta.spec.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: focused desktop line-balance and mobile-overflow checks passed;
  `pnpm verify` passed (typecheck, lint, production build, 8 form tests and 39
  visual-parity checks).
- Follow-up: None.

## 2026-09-01: Keep the Home purpose statement visible during reveal

**Codex change**

- Commit: `this commit`
- Changed: replaced the purpose section's empty pre-animation state with a
  faint, fully readable sentence whose words come into focus as the section
  enters and scrolls through its pin; retained a completed hold before release.
- Files: `src/features/home/motion/usePurposeReveal.ts`,
  `src/shared/styles/brand.css`, `tests/visual/reveal.spec.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: focused entry/progress/hold and reduced-motion checks passed;
  `pnpm verify` passed (typecheck, lint, production build, 8 form tests and 39
  visual-parity checks).
- Follow-up: None.

## 2026-09-01: Replace distinctive objects wording

**Codex change**

- Commit: `this commit`
- Changed: replaced the two remaining “distinctive objects” phrases with
  “distinctive designs” on Home and in its legacy reference.
- Files: `src/features/home/ui/HomePage.tsx`, `legacy/index.html`,
  `docs/CODEX-CHANGES.md`
- Verified: repository-wide exact-phrase search and focused Home checks before
  commit.
- Follow-up: None.

## 2026-09-01: Replace considered objects wording

**Codex change**

- Commit: `this commit`
- Changed: replaced every occurrence of “considered objects” with “distinctive
  designs” across the live site and matching legacy reference copy.
- Files: `src/features/about/ui/AboutPage.tsx`,
  `src/features/contact/ui/ContactPage.tsx`,
  `src/features/home/ui/HomePage.tsx`, `legacy/contact.html`,
  `legacy/index.html`, `docs/CODEX-CHANGES.md`
- Verified: repository-wide case-insensitive search found no remaining exact
  phrase; typecheck, lint, production build and all 8 form tests passed; all 9
  Home, About and Contact parity checks passed. The full parity rerun was
  interrupted by the test server exiting and then by an OS memory kill.
- Follow-up: None.

## 2026-08-31: Harden mobile launch behavior without redesigning pages

**Codex change**

- Commit: `this commit`
- Changed: expanded the burger and logo hit areas without moving the masthead;
  added safe-area and short-landscape handling; reduced Home's initial image
  competition; warmed clipped service imagery before reveal; and added focused
  mobile regression coverage. Layout-changing content-control and typography
  proposals were reverted after parity identified their impact.
- Files: `src/shared/styles/brand.css`, `src/shared/styles/chrome.css`,
  `src/features/home/`, relevant short-landscape feature styles,
  `tests/visual/mobile-readiness.spec.ts`,
  `docs/MOBILE-LAUNCH-ACTION-PLAN.md`, `docs/HANDOFF.md`
- Verified: `pnpm verify` passed (typecheck, lint, production build, 8 form
  tests and 36 visual-parity checks); 40 masthead checks and 5 focused
  mobile-readiness checks also passed.
- Follow-up: verify Contact focus behavior and notch/home-indicator clearance
  on physical iPhone and Android devices; measure deployed mobile LCP; obtain
  design approval before changing page-content target sizes or small text.

## 2026-08-31: Add mobile and SEO launch action plans

**Codex change**

- Commit: `this commit`
- Changed: documented the measured mobile audit and the production-rendered
  SEO audit as two prioritized, acceptance-testable launch work queues.
- Files: `docs/MOBILE-LAUNCH-ACTION-PLAN.md`,
  `docs/SEO-LAUNCH-ACTION-PLAN.md`, `docs/HANDOFF.md`,
  `docs/CODEX-CHANGES.md`
- Verified: audited 13 production-rendered routes across four responsive
  viewports; checked Googlebot metadata, headings, links, images, JSON-LD,
  robots, sitemap, Open Graph output, redirects and 404 behavior; ran the
  production build; checked Markdown formatting and Git whitespace.
- Follow-up: implement the P0 and P1 tasks in the two action plans before
  launch.

## 2026-08-31: Add the Codex handoff log

**Codex change**

- Commit: `this commit`
- Changed: added this append-only AI change log and made it required reading
  and writing in `AGENTS.md` and `docs/HANDOFF.md`.
- Files: `AGENTS.md`, `docs/HANDOFF.md`, `docs/CODEX-CHANGES.md`
- Verified: Markdown formatting and repository diff checks.
- Follow-up: None.

## 2026-08-31: Use supplied photography in the gallery

**Codex change**

- Commit: `7f96e9b Gallery: use the supplied project photography`
- Changed: replaced the gallery wall's older imagery with 20 supplied client
  photographs and updated the image descriptions, credits and alt text.
- Files: `src/features/project-new/content/wall.content.ts`
- Verified: `pnpm verify` passed, including 8 form tests and 36 visual parity
  checks.
- Follow-up: two supplied images remain deliberately unused because one is a
  phone snapshot and the other duplicates an existing angle.
