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
