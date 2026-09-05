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

## 2026-09-05: Remove the newsletter popup

**Codex change**

- Commit: `this commit`
- Changed: removed the site-wide newsletter modal, including its timed and
  scroll triggers, session/local-storage state, scroll locking, root-layout
  mount, component styles and popup-specific form API. Kept the shared footer
  newsletter form and its validation/delivery path unchanged. Removed obsolete
  popup suppression and behavior tests, added a regression assertion that no
  newsletter dialog renders, and updated the newsletter and MOB-01 docs to
  describe the remaining footer-only surface.
- Files: `src/app/layout.tsx`,
  `src/features/newsletter/{README.md,index.ts,ui/NewsletterForm.tsx}`,
  deleted `src/features/newsletter/ui/NewsletterPopup.{tsx,module.css}`,
  `tests/{forms/forms.spec.ts,visual/mobile-readiness.spec.ts,visual/pages.ts,visual/parity.spec.ts}`,
  `docs/{MOBILE-LAUNCH-ACTION-PLAN.md,CODEX-CHANGES.md}`
- Verified: `pnpm verify` passed typecheck, lint with one existing `_meta`
  warning in `mailerlite.provider.ts`, the production build, all 27 form and
  SEO tests, and all 36 parity snapshots; parity completed in 6.8 minutes. The
  separate mobile-readiness suite passed all 6 tests. No baseline was
  regenerated and no snapshot moved.
- Follow-up: None

## 2026-09-04: Extend MOB-01 to landscape and tablet widths

**Codex change**

- Commit: `this commit`
- Changed: widened only the Contact, shared footer newsletter and newsletter
  popup text-control rules from 560px to 1024px so landscape iPhones and small
  tablets retain 16px text. Kept Contact heading rules at 560px and preserved
  the approved 561px to 1024px field line box so the larger text does not move
  images or section boundaries. Expanded the regression matrix with 844x390,
  926x428 and 744x1133. Desktop typography, pinch zoom and the `15x15px`
  consent checkbox remain unchanged.
- Files: `src/features/contact/styles/contact.module.css`,
  `src/features/newsletter/ui/NewsletterPopup.module.css`,
  `src/shared/styles/brand.css`, `tests/visual/mobile-readiness.spec.ts`,
  `docs/{MOBILE-LAUNCH-ACTION-PLAN.md,CODEX-CHANGES.md}`
- Verified: before the fix, a production build measured Contact at `15.36px`,
  the footer at `15.2px` and the popup at `15.36px` at all three added
  viewports. Afterward, all three groups measured exactly `16px` through the
  1024px boundary and returned to their approved sizes at 1025px and 1440px;
  the expanded mobile-readiness suite passed all 7 tests. The pre-baseline
  `pnpm parity` run passed 35 snapshots and failed only Contact tablet, while a
  strict zero-difference review exposed the shared footer change on all 12
  tablets. Every diff was inspected visually; Contact's initial 3px downstream
  shift was removed before acceptance. Regenerated only the Home, Our Work,
  Projects, both project stories, all three service pages, About, Contact,
  Privacy and Terms tablet baselines. Desktop and mobile baselines and
  `maxDiffPixelRatio` were untouched. `pnpm verify` passed typecheck, lint with
  one existing `_meta` warning in `mailerlite.provider.ts`, the production
  build, all 29 form and SEO tests, and all 36 parity snapshots; parity
  completed in 7.1 minutes.
- Follow-up: focus every text field on a physical iPhone in both orientations
  and confirm Safari does not zoom before ticking MOB-01 complete. Review the
  unchanged `15x15px` consent checkbox when MOB-02 resumes.

## 2026-09-04: Prevent iOS form-focus zoom

**Codex change**

- Commit: `this commit`
- Changed: set the Contact text fields, shared footer newsletter input and
  newsletter popup input to a mobile-only `16px` through 560px, without
  changing desktop type or restricting pinch zoom. Production measurements at
  320, 390 and 560px found that the old Home CSS Module rule no longer reached
  the shared footer: its live input was `15.2px`, while Contact was `15.36px`
  and the popup was `15.36px` or `14.4px`. Extended the mobile-readiness test
  across all three widths and corrected the MOB-01 audit. Measured the newer
  consent checkbox at `15x15px` and left it unchanged for MOB-02.
- Files: `src/features/contact/styles/contact.module.css`,
  `src/features/newsletter/ui/NewsletterPopup.module.css`,
  `src/shared/styles/brand.css`, `tests/visual/mobile-readiness.spec.ts`,
  `docs/{MOBILE-LAUNCH-ACTION-PLAN.md,CODEX-CHANGES.md}`
- Verified: production-build computed-style checks confirmed every visible
  text-entry control at exactly `16px` at 320, 390 and 560px; the focused
  mobile-readiness suite passed all 7 tests. The pre-baseline `pnpm parity`
  run passed 24 snapshots and moved exactly the 12 mobile snapshots: Home, Our
  Work, Projects, both project stories, all three service pages, About,
  Contact, Privacy and Terms. Each diff was inspected visually, then only
  those 12 mobile baselines were regenerated; desktop and tablet baselines and
  `maxDiffPixelRatio` were untouched. `pnpm verify` passed typecheck, lint with
  one existing `_meta` warning in `mailerlite.provider.ts`, the production
  build, all 29 form and SEO tests, and all 36 parity snapshots; the parity
  portion completed in 6.8 minutes.
- Follow-up: focus every text field on a physical iPhone and confirm Safari
  does not zoom before ticking MOB-01 complete. Review the `15x15px` consent
  checkbox when MOB-02 resumes.

## 2026-09-03: Complete SEO-15 Web Vitals lab measurement

**Codex change**

- Commit: `this commit`
- Changed: measured LCP, CLS and a shared-menu interaction through the browser
  performance APIs against production builds, with three fresh-context runs
  on every indexable route at 390x844 and 1440x900 before and after. Only Home
  and the Projects gallery had image LCPs, and both were already preloaded; the
  other eight winners were hero text, so no speculative image priority was
  added. Preloaded the local Goudy face after the baseline attributed a
  repeatable `0.01426` mobile Bespoke Accessories CLS to its late heading swap;
  all 60 after samples recorded zero CLS. Added the reusable lab harness and
  its per-template results, completed SEO-15, and corrected the stale Batch 2,
  Batch 3, Batch 4 and image-sizing ticks in the pre-launch checklist. The
  existing root `all3.mjs` image-sizing harness and the three accepted
  project-story image exceptions were left unchanged.
- Files: `src/app/layout.tsx`, `tools/{measure-web-vitals.mjs,README.md}`,
  `docs/{SEO-LAUNCH-ACTION-PLAN.md,PRELAUNCH.md,CODEX-CHANGES.md}`
- Verified: two complete 60-sample production-build measurements plus a
  focused three-run font check; every LCP winner was inside its hero, no reveal,
  mask or `Media` image emitted a layout shift, and the after run recorded zero
  CLS throughout. `pnpm verify` passed typecheck, lint with one existing
  `_meta` warning in `mailerlite.provider.ts`, the production build, all 29 form
  and SEO tests, and all 36 parity snapshots in 6.8 minutes. No baseline was
  regenerated and no snapshot moved.
- Follow-up: Field LCP, CLS and INP remain unavailable until the site is
  deployed and Search Console has enough real-user data. Record deployed
  mobile LCP before deciding MOB-02 or MOB-04.

## 2026-09-03: Remove newsletter modal scrolling

**Codex change**

- Commit: `uncommitted`
- Changed: removed all scrolling from the newsletter card and explicitly locks
  the document in place while the native modal is open, restoring the exact
  scroll position after its closing animation. Tightened the content spacing
  and heading scale so the full form fits the fixed card; short mobile screens
  omit the photograph rather than introducing an internal scrollbar.
- Files: `src/features/newsletter/ui/{NewsletterPopup.tsx,NewsletterPopup.module.css}`,
  `src/features/newsletter/README.md`, `tests/forms/forms.spec.ts`
- Verified: focused popup tests passed for hidden card overflow, blocked wheel
  scrolling, scroll-position restoration and short-mobile containment. `pnpm
verify` passed typecheck, lint, production build, all 27 functional/SEO tests
  and all 36 parity snapshots. No baseline was regenerated.
- Follow-up: Review the revised modal visually; the in-app browser was
  unavailable in this session.

## 2026-09-03: Compact the newsletter popup and revise its trigger

**Codex change**

- Commit: `uncommitted`
- Changed: constrained the newsletter dialog to a compact 880 by 520 pixel
  desktop card so its image cannot stretch the layout; tightened the mobile
  composition; and replaced the 45-second plus 50% trigger with three paths:
  immediate opening at 50% scroll, opening after 15 seconds once scrolling has
  begun, and a 40-second fallback without scrolling. Dismissal now lasts only
  for the current tab session and resets when the site is closed.
- Files: `src/features/newsletter/ui/{NewsletterPopup.tsx,NewsletterPopup.module.css}`,
  `src/features/newsletter/README.md`, `tests/{forms/forms.spec.ts,visual/parity.spec.ts}`
- Verified: focused popup tests passed for the 50% scroll, 15-second engaged
  and 40-second passive paths, session dismissal, exact desktop dimensions and
  mobile containment. `pnpm verify` passed typecheck, lint, production build,
  all 27 functional/SEO tests and all 36 parity snapshots. No baseline was
  regenerated.
- Follow-up: Review the revised compact card visually; the in-app browser was
  unavailable in this session.

## 2026-09-03: Add the editorial newsletter invitation

**Codex change**

- Commit: `uncommitted`
- Changed: added a site-wide, full-width newsletter dialog with a photographic
  42/58 desktop split, a compact mobile composition, a 45-second plus 50%
  scroll trigger and 30-day dismissal memory. It reuses the existing form,
  schema and non-live provider; native dialog behavior supplies focus
  containment and Escape dismissal. Newsletter forms now accept unique IDs so
  the footer and popup remain valid when rendered together. Kept the global
  stylesheet ahead of the popup CSS Module after the parity gate exposed that
  reversing them changed Contact's cascade and page height.
- Files: `src/app/layout.tsx`, `src/features/newsletter/{README.md,index.ts}`,
  `src/features/newsletter/ui/{NewsletterForm.tsx,NewsletterPopup.tsx,NewsletterPopup.module.css}`,
  `tests/forms/forms.spec.ts`
- Verified: focused desktop/mobile popup tests passed, including trigger,
  sizing, overflow, Escape and dismissal memory. `pnpm verify` passed
  typecheck, lint, production build, all 10 form tests, all 16 SEO tests and all
  36 parity snapshots. No baseline was regenerated.
- Follow-up: Review the popup visually when an in-app browser is available;
  that browser was unavailable in this session. Live delivery remains blocked
  by `docs/adr/0002-deferred-compliance.md`.

## 2026-09-03: Review and correct SEO Batch 3

**Claude change**

- Commit: `this commit`
- Changed: three corrections on top of Codex's Batch 3.
  1. The About description named Malika as co-founder. Reverted to Alex alone
     on the client's instruction, matching the copywriter's original wording.
     Recorded under SEO-07 so it is not reintroduced.
  2. The About title rendered as `Alex Lahmer, the Founder of Finer Things |
Finer Things`. The approved title already ends in the brand and the root
     template appended it again, re-creating exactly the duplication SEO-02
     existed to remove. That route is now `absoluteTitle`.
  3. Restored two guards that Batch 3 deleted from `tests/seo/seo.spec.ts`:
     titles may not contain `Luxury Motion Study`, and `Finer Things` may not
     appear more than once. They had been replaced by an exact match against an
     approved set, and that set contained the double-branded About title, so
     the suite passed while the regression shipped. An exact match only proves
     the page equals what the test file expects; it cannot catch a bad value
     being agreed and written into both places. Both guards are now kept
     alongside the exact match.
- Reviewed and accepted without change: the ten approved titles and
  descriptions, the contextual links (which reuse existing page copy rather
  than adding a second navigation), and the `:focus-visible` to `:focus-within`
  change on gallery tiles, which is the correct consequence of putting a link
  inside the tile.
- Files: `src/app/(site)/about/page.tsx`, `tests/seo/seo.spec.ts`
- Verified: baseline timestamps confirm Batch 3 did not regenerate any
  snapshot, as it claimed. Independently re-ran the parity suite: 36 of 36 in
  6.7 minutes, a normal-speed pass rather than a loaded one. Typecheck, lint,
  format and 27 form and SEO tests green. Rendered titles checked directly on
  all ten routes.
- Known and accepted: the contextual links carry a 1px underline, so the large
  service headings on What we do are now underlined. The client has seen it and
  chosen to keep it. Worth noting that this is the site's established treatment
  for _emphasis_ in a heading (AGENTS.md), so an underlined word in a heading
  is now ambiguous between emphasis and link. Parity cannot see it: a hairline
  on a page thousands of pixels tall is well inside the tolerance.
- Follow-up: None.

## 2026-09-02: Implement SEO launch Batch 3

**Codex change**

- Commit: `uncommitted`
- Changed: completed SEO-07 and SEO-11. Applied the copywriter-approved titles
  and descriptions literally to all ten indexable routes, with Home remaining
  absolute; added descriptive in-copy links between What we do, all service
  pages, the Projects hub and relevant project stories without changing page
  copy or the single-burger navigation; and added exact metadata and
  contextual-link regression coverage.
- Files: metadata in `src/app/` and the project/service registries; contextual
  links in `src/features/{our-work,projects,services}/`; shared link treatment
  in `src/shared/styles/primitives.css`; `tests/seo/seo.spec.ts`;
  `docs/SEO-LAUNCH-ACTION-PLAN.md`
- Verified: `pnpm typecheck`, `pnpm lint` and `pnpm format:check` passed. The
  final `pnpm verify` passed typecheck, lint, the production build, all 8 form
  tests, all 16 SEO tests and all 36 parity snapshots. No baseline was
  regenerated.
- Follow-up: None. A human can review the new hairline contextual-link
  treatment, but there are no failed pixel diffs to approve or rebaseline.

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
