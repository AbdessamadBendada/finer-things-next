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

## 2026-10-10: Remove every location caption beneath an image

**Codex change**

- Commit: `uncommitted`
- Changed: removed fourteen `figcaption` elements naming a property, city or
  room, across `/projects`, both project detail pages, and the Bespoke
  Accessories and Styling & Curation detail pages. Kept three captions that
  name no location: Contact, About and the Finer Living material labels.
- Changed, to avoid a regression: the `/projects` caption contained the only
  link on that page. The tile is now the link, with an `aria-label` built
  from the property and space so the destination is still announced. A
  `.wall-tile-link` rule in `brand.css` makes the anchor fill the tile, since
  `.wall-tile img` sizes to 100% of its parent and that parent changed.
- Files: `src/features/projects/ui/ProjectsPage.tsx`,
  `src/features/projects/ui/{MarsaAlArabPage,WaldorfAstoriaOsakaPage}.tsx`,
  `src/features/services/ui/{BespokeAccessoriesPage,StylingCurationPage}.tsx`,
  `src/shared/styles/brand.css`, `docs/FEEDBACK.md`
- Verified: swept all twelve routes, every one 200 with no page errors and no
  location captions remaining. `/projects` links went 18 to 21; clicking a
  tile navigates to `/projects/marsa-al-arab`; link box measures exactly the
  figure box. Scrolled the wall end to end: 20 tiles, 0 still faded, 0
  images unloaded, so the `.rise` reveal survives the new DOM. Typecheck,
  lint (existing `_meta` warning only) and Prettier passed.
- Follow-up: the tile scrim disappeared with the captions, because it was
  painted on the `figcaption` rather than a pseudo-element. That is an
  improvement but it is a visible change beyond the text. The now-dead
  `.wall-tile figcaption`, `.wall-property`, `.wall-location` and
  `.wall-space` rules are left in `projects.module.css`, which is kept
  diffable against `legacy/`. `/projects` and four other baselines are stale.

## 2026-10-10: Replace three Finer Living gallery images and the panel image

**Codex change**

- Commit: `uncommitted`
- Changed: `/our-services/finer-living` gallery positions 1, 2 and 6 now use
  `new-finer-living-cloche.webp`, `new-finer-living-marble-bowl.webp` and
  `new-finer-living-walnut-tray.webp`, replacing the collection still, the
  wooden stools and the stone samples. The Finer Living entry in
  `services.content.ts` points at `new-finer-living-cherry-bowl.webp`.
- Files: `public/assets/new-finer-living-{cloche,marble-bowl,walnut-tray,cherry-bowl}.webp`,
  `src/features/services/ui/FinerLivingPage.tsx`,
  `src/features/our-services/content/services.content.ts`,
  `src/shared/config/image-registry.ts` (regenerated), `docs/FEEDBACK.md`
- Verified: read the rendered gallery order and the panel image back from
  both pages, all six tiles and the panel loaded, no failed image requests.
  Typecheck, lint (existing `_meta` warning only) and Prettier passed.
- Follow-up: three source files were 5906px wide and 500-700KB; re-encoded at
  2400px to match the rest of the library. The panel uses a new asset rather
  than overwriting `new-cover-finer-living.webp`, which is shared with the
  home service row and the service registry, so home still shows the older
  photograph. Two of the removed images remain on the same page in bigger
  placements: `0698_...` is the hero and `0694_...` is a full-bleed
  background. Both flagged in FEEDBACK.md 51.

## 2026-10-10: Reword Styling & Curation, drop florals from scope item 02

**Codex change**

- Commit: `uncommitted`
- Changed: the `styling-curation` `lede` in `services.content.ts` now reads
  "Books, objects, art and decorative pieces sourced through a global network
  of 100+ artisans and thoughtfully arranged to give every space its own
  distinctive character and story." Its `02 / Sourcing & selection` note
  drops "florals" and reads "Books, objects and art found with artisans
  around the world."
- Files: `src/features/our-services/content/services.content.ts`
- Verified: read both strings back from the rendered page and opened the
  panel to confirm the scope list. Measured the lede at 1440, 1024 and 390.
  Typecheck, lint (existing `_meta` warning only) and Prettier passed.
- Follow-up: the new lede is 178 characters and sets on **three lines**
  against two for the other two services, six against four on a phone, so
  the closed panel rows are no longer equal height. "florals" also remains in
  nine other places, including the Styling & Curation detail page and its
  registry description, so overview and detail now disagree. Both flagged in
  FEEDBACK.md 50.

## 2026-10-09: Reword the Bespoke Accessories description

**Codex change**

- Commit: `uncommitted`
- Changed: the `lede` for `bespoke-accessories` in `services.content.ts` now
  reads "The details that define the experience. Every piece is individually
  designed and produced exclusively for one setting."
- Files: `src/features/our-services/content/services.content.ts`
- Verified: read the rendered text back from `/our-services`; two lines at
  1440, unchanged from before. Typecheck, lint (existing `_meta` warning
  only) and Prettier passed.
- Follow-up: a full stop was added, since the supplied wording had none and
  the sibling ledes are full sentences. The field renders only in
  `OurServicesPage`; it is not used in metadata or on the detail pages.

## 2026-10-09: Darken secondary copy to clear WCAG AA

**Codex change**

- Commit: `uncommitted`
- Changed: `--soft` and `--ink-soft` are set to `rgba(41,40,31,.78)` on
  `[data-page] main`, raising the services copy from 4.62:1 to 6.69:1 against
  the paper ground. Also corrected two footnote rules that hardcoded .5 alpha
  rather than using the token: `/about`'s artisan footnote (2.77:1, the worst
  on the site) and its twin on the dark section of What we do and Our craft
  (4.40:1).
- Files: `src/shared/styles/brand.css`, `docs/FEEDBACK.md`
- Verified: measured every `p`, `li`, `span` and `h4` inside `main` on six
  routes, computing the real composited ratio against the nearest painted
  background. Before: services worst 4.62:1, about 2.77:1, our-craft 4.40:1.
  After: **every route clear of AA, worst case 5:1**. Typecheck, lint
  (existing `_meta` warning only) and Prettier passed.
- Follow-up: the correction is set on `main`, not at the root, on purpose.
  Page stylesheets declare `--soft` on their own hashed `.page` class which
  wraps `main`, so a declaration on an ancestor is simply overridden again;
  declaring it on a descendant wins by inheritance and is immune to load
  order. Separately, the dark-section footnote rule **first shipped doing
  nothing**: written with three classes it tied the page rule's specificity
  and lost on load order, and the measurement still read 4.40:1. It is now
  scoped by the section's id. The **"Start a project" button still fails** at
  3.53:1 (paper on clay `#B56D43`); fixing it changes a brand colour on nine
  pages, so it is flagged in FEEDBACK.md 48 rather than taken. Text over
  photographs is excluded from the sweep: its contrast cannot be computed
  from CSS.

## 2026-10-09: Move Marble to the end of the first materials row

**Codex change**

- Commit: `uncommitted`
- Changed: reordered `MATERIALS` on `/our-work` so Marble sits fourth and
  closes the first row. The array order is the page order, so no layout rule
  changed.
- Files: `src/features/our-work/content/materials.content.ts`
- Verified: read the rendered rows back at 1440 - row one Lustrous Leather,
  Wood, Horn, Marble; row two Lacquer, Resin, Elegant Shells, still centred
  at 152px clear on both sides. Typecheck, lint (existing `_meta` warning
  only) and Prettier passed.
- Follow-up: `/our-craft` keeps its **own copy** of the materials content,
  still six entries in three columns with no Marble. The 2026-10-09 materials
  work has all been `/our-work` only, as asked, so the two pages now disagree
  on both content and layout. Flagged in FEEDBACK.md 47 as needing a
  decision.

## 2026-10-09: A tall tile in the artisan wall, and shape-aware rotation

**Codex change**

- Commit: `uncommitted`
- Changed: `.artisan-tile:nth-child(9)` was a second double-width tile; it is
  gone and `:nth-child(4)` now spans two rows instead, giving the wall one
  wide tile and one tall one. `useImageRotation` gained `tileShapes` and
  `imageShapes`: a slot only ever receives a photograph whose orientation
  suits it, and the deterministic opening arrangement honours the same
  constraint. `ArtisanWall` derives each image's shape from the pixel
  dimensions in `IMAGE_REGISTRY` and opens the tall slot on the workshop
  door.
- Files: `src/shared/motion/useImageRotation.ts`, `src/shared/motion/index.ts`,
  `src/shared/ui/ArtisanWall.tsx`, `src/shared/styles/brand.css`,
  `docs/FEEDBACK.md`
- Verified: grid measured at 1440 as 10 tiles in 3 rows (3/4/3), tile 2 at
  589x294 and tile 4 at 287x603, wall 912px tall with no holes. Ran 26 swaps
  watching both shaped slots: the wide slot held only landscape images, the
  tall slot only portrait, zero violations either way. The door opens in the
  tall slot on all three pages with no page errors.
- Follow-up: the tall tile **replaces** a wide one rather than adding to it,
  because the wall must consume a multiple of four cells or the last row
  gains a hole. `TILE_SHAPES` in `ArtisanWall.tsx` mirrors the `nth-child`
  rules in `brand.css` and the two must be changed together. The tall tile
  deliberately sets `aspect-ratio: auto` rather than `1 / 2`: the row height
  comes from the square tiles and `grid-auto-rows: 1fr`, so a stated ratio
  would be short by exactly one gap. Parity baselines for the three pages are
  stale, though `--frozen` limits the effect.

## 2026-10-09: Swap four photographs in the artisan wall

**Codex change**

- Commit: `uncommitted`
- Changed: `ARTISAN_WALL` drops `new-artisan-wood-12`, `new-artisan-fl-13`,
  `new-artisan-fl-33` and `new-artisan-ceramics-29`, and gains
  `new-artisan-ft-05` (workshop door) and `new-artisan-fl-62` (marble yard).
  Pool 20 to 18 against 10 tiles. No files were imported or converted: all
  four of the client's "new" images were already in the repository.
- Files: `src/shared/content/artisans.content.ts`
- Verified: identified the four removals from a generated contact sheet of
  the pool rather than by tile position, since the wall rotates; disambiguated
  the scalloped tile shot against its near-twin `fl-29` by rendering both.
  Ran the wall for 60 seconds afterwards: 17 of 18 images surfaced, none of
  the four removed ones appeared, no duplicates on screen, no failed image
  requests, no page errors. Typecheck, lint (existing `_meta` warning only)
  and Prettier passed.
- Follow-up: two of the four supplied "new" files were pixel-identical to
  images already live in the wall (`Our Artisans 1` = `glass-26`,
  `Our Artisans 4` = `ft-08`); worth checking against the pool before
  treating a client's image as new. The marble yard is one of the phone
  snapshots the curation note holds back, included as supplied on the
  client's explicit decision. Five unused photographs remain for topping the
  pool back up: `fl-02`, `fl-03`, `fl-38`, `fl-56`, `fl-64`. Parity baselines
  for `/our-craft`, `/our-work` and `/about` are stale, though the wall is
  frozen for the gate via `--frozen` so the effect there is limited.

## 2026-10-09: Stop the artisan wall swapping the same tile twice running

**Codex change**

- Commit: `uncommitted`
- Changed: `useImageRotation` chose the tile to swap with
  `Math.floor(Math.random() * tiles)`, which has no memory of the previous
  pick. With ten tiles that reselects the same tile about one tick in ten, and
  sometimes several ticks running, so a single tile would change, change again
  2.6 seconds later, and read as a glitch rather than drift. The pick now
  excludes the tile that changed last, drawing uniformly from `tiles - 1` and
  stepping over the excluded index so the rest stay equally likely.
- Files: `src/shared/motion/useImageRotation.ts`
- Verified: instrumented the rising edge of `is-fading` on every tile and
  recorded the swap sequence over 90 seconds, before and after. Before: **7
  immediate repeats in 34 swaps**, including three separate triples
  (`3 3 3`, `9 9 9`, `0 0 0`), each pair exactly one 2600ms interval apart.
  After: **0 immediate repeats in 36 swaps**, per-tile counts still roughly
  even, no duplicate images on screen. Re-checked the `--frozen` escape hatch
  the visual gate depends on: still halts rotation. Typecheck, lint (existing
  `_meta` warning only) and Prettier passed.
- Follow-up: the hook has one consumer, `ArtisanWall`, which renders on
  `/our-craft`, `/our-work` and `/about`, so the fix lands on all three. Note
  a first measurement attempt reported 0 repeats and was wrong: it deduplicated
  consecutive identical values, which filters out exactly the event being
  counted. Dedupe swap events by timestamp, not by value.

## 2026-10-09: Seven materials, four above a centred three

**Codex change**

- Commit: `uncommitted`
- Changed: added Marble as a seventh material on `/our-work`, reusing
  `new-material-marble.webp` from the hero collage, and reshaped the grid.
  Above 1200px `data-columns='4'` renders eight narrow columns with each card
  spanning two and the fifth card starting at column 2, which centres three
  cards under four while keeping every card the same width. Below 1200px the
  attribute falls through to the existing 3 / 2 / 1 column breakpoints, so no
  span or offset survives into the narrow layouts and nothing needs resetting.
- Files: `src/features/our-work/content/materials.content.ts`,
  `src/features/our-work/ui/MaterialCards.tsx`,
  `src/features/our-work/ui/OurWorkPage.tsx`, `src/shared/styles/brand.css`,
  `docs/FEEDBACK.md`, `docs/HANDOFF.md`
- Verified: measured at 1440, 1300, 1201, 1150, 1000, 800 and 500. Above
  1200: rows of 4 and 3, all cards 282px wide, second row 152px clear at both
  ends. Below: 3+3+1, 2+2+2+1 and 1-per-row as expected. Hovered all seven
  cards and checked the copy block against the card bounds, no overflow.
  Typecheck, lint (existing `_meta` warning only) and Prettier passed.
- Follow-up: `grid-column: span 2` puts `span 2` in the start slot, so the
  fifth card needs `grid-column: 2 / span 2`; a bare `grid-column-start: 2`
  silently collapses it to one track. Seven cards leave an orphan on the last
  row at the 3-column and 2-column breakpoints, which is flagged in
  FEEDBACK.md 44 as needing a decision. `/our-work` parity baseline is stale.
  HANDOFF.md's "a sixth material" row is now marked resolved.

## 2026-10-09: Add a sixth featured card, Exclusive Collections

**Codex change**

- Commit: `uncommitted`
- Changed: added a sixth filmstrip card to the home page using the client's
  supplied still, and renumbered the strip to `/ 06` including the slider's
  counter total. The photograph is portrait (1200x1600) against a 1.75:1
  card, so a cover fit keeps about 43% of its height; centred that band shows
  the wall above the subject. The card carries `data-focal="low"` with a
  matching `object-position: center 88%` in `brand.css` to bring the band down
  onto the book and its marble stand.
- Files: `public/assets/new-work-exclusive-collections.webp`,
  `src/features/home/ui/HomePage.tsx`, `src/shared/styles/brand.css`,
  `src/shared/config/image-registry.ts` (regenerated via `pnpm migrate:images`),
  `docs/FEEDBACK.md`
- Verified: drove the slider to the last card and read back 6 cards, titles
  and numbers correct, counter `06 / 06`, next arrow disabled, 43% visible
  height with `object-position` applied, and looked at the rendered crop.
  Typecheck, lint (existing `_meta` warning only) and Prettier passed.
- Follow-up: no hook changes were needed - both filmstrip hooks size progress,
  bounds and arrow state from `cards.length`. Only hardcoded `/ 05` strings
  and two stale comments referring to "five cards" needed updating. Home
  parity baseline is stale.

## 2026-10-09: Home copy round - service text, intros, project names

**Codex change**

- Commit: `uncommitted`
- Changed: three client copy requests on the home page. The `01 / Bespoke
Accessories` row description is now "Design and production of bespoke
  accessories to see, touch and feel." The Featured intro joins the "What we
  do" paragraph on two lines via a `max-width` override. The five filmstrip
  cards are renamed The Living Room, Private Residences, Dining Destinations,
  Residential Suites and Elegant Residences, replacing The Lobby, Private
  Suites, Iliana, Bombay Club and Waldorf Osaka, and their bottom-right venue
  captions are deleted.
- Changed, correction: the rename was applied to the wrong element first. The
  client said "bottom right", which is the venue caption; the heading is
  bottom-left. On being told, they chose to keep the renamed headings and
  drop the captions altogether rather than move the names across, so all five
  `<p>` elements are gone from `.film-copy`.
- Files: `src/features/home/ui/HomePage.tsx`, `src/shared/styles/brand.css`,
  `docs/FEEDBACK.md`
- Verified: both paragraphs measured at two lines at 1440, 1280, 1100, 1024
  and 900; all five headings, the new description and `.film-copy p` count of
  zero read back from the DOM. Typecheck, lint (existing `_meta` warning
  only) and Prettier passed.
- Follow-up: recorded in full as FEEDBACK.md entries 40-42. Three that need a
  decision: the Featured intro needs an 84ch measure to hold two lines, about
  99 characters per line, so shorter copy is the better fix; the renamed
  cards disagree with `/projects/marsa-al-arab`, the photograph `alt` text
  and the SEO plan, all of which still say Bombay Club and Iliana; and the
  `.film-copy p` rules in `home.module.css` are now dead, left in place to
  keep that file diffable against `legacy/`.

## 2026-10-09: Set the home "What we do" copy on two lines

**Codex change**

- Commit: `uncommitted`
- Changed: widened the measure on the `#work` section's supporting paragraph
  from the legacy 44ch to 58ch, so its 139 characters set on two lines rather
  than three. Measured the threshold: 44ch gives three lines, 50ch and above
  give two; 58ch takes the middle and sits inside the usual 55-75 character
  measure instead of at its edge.
- Files: `src/shared/styles/brand.css`
- Verified: two lines at 1440, 1280, 1024 and 900. Typecheck and lint
  (existing `_meta` warning only) passed.
- Follow-up: two things noticed in the same section and deliberately left
  alone, both inherited verbatim from `legacy/index.html` rather than
  introduced here. The section has **no heading**: `.svc-head` is an eyebrow
  followed straight by a paragraph, so the three service `h3`s below it hang
  off the previous section's `h2`. And the copy says "touch points" where the
  industry sets "touchpoints". Both are client-facing decisions.

## 2026-10-09: Make the contact photograph legible

**Codex change**

- Commit: `uncommitted`
- Changed: the contact image frame was a tall portrait slot (measured 425x730,
  0.53:1) holding a 1.5:1 landscape photograph, so `object-fit: cover` kept
  only **35% of the image width**. Both of the artisan's hands and the whole
  workbench fell outside the crop and what remained read as an unidentifiable
  dark smear. The frame now takes the photograph's own 3:2 aspect ratio, the
  grid gives that column more width, and the parallax overscan drops from 110%
  to 106% - under `cover`, excess height is paid for in width, so the overscan
  had to shrink with the frame. Measured result: **94% of the width visible**
  at desktop, 95% on a phone. Also eased the darkening filter
  (`brightness .75 -> .86`) and the bottom scrim, which were adding to the
  murk.
- Files: `src/features/contact/styles/contact.module.css`,
  `src/features/contact/motion/useContactMotion.ts`
- Verified: measured the visible-width fraction before and after at 1440 and 390. Swept the page through 2600px of scroll at both widths checking the
  frame edges: worst gap -11px desktop, -6px mobile, so the drift never
  exposes the background. Typecheck and lint (existing `_meta` warning only)
  passed.
- Follow-up: the drift in `useContactMotion` went 28 -> 4 because the shorter
  frame has far less room to move in; the parallax is now subtle. If it should
  be more pronounced, the frame needs to grow and that costs image width.
  Contact parity baseline is stale.

  A first pass centred a 3:2 frame in the column, which fixed the crop but
  left the plate marooned in dead space. Settled on a 1.4:1 frame in a wider
  column, top-aligned to the heading (frame top 170px against heading top
  167px) so the whitespace pools at the foot of the column instead. Frame is
  576x412 at desktop and 91% of the image width survives at all three widths.
  The full-bleed-band alternative was offered and not taken.

  Top-aligning alone then left a large void under the image, because the form
  column is ~870px against a 412px photograph and no landscape crop can fill
  that without putting the hands back outside the frame. Resolved by pinning
  the figure: `.image-col` is a sticky grid item (hence no `align-items` on
  the grid, which would collapse the column and leave sticky nothing to travel
  in) and the photograph now moves alongside the form. Sticky is off below
  860px, where the image sits under the form and would otherwise overhang the
  following section.

## 2026-10-09: Stop the dev server serving an unstyled page in Safari

**Codex change**

- Commit: `uncommitted`
- Changed: scoped `upgrade-insecure-requests` to production builds. The
  directive rewrites every http subresource URL to https before the request is
  made; the dev server is plain http, so every stylesheet, script, font and
  image was redirected to `https://localhost:3000`, where nothing is
  listening. All of them failed TLS and the page rendered as unstyled HTML.
  It presented as a Safari-only bug because Chrome exempts localhost from the
  upgrade and WebKit, correctly, does not. Production is unchanged and still
  sends the directive.
- Files: `src/shared/config/security-headers.ts`
- Verified: reproduced in Playwright's WebKit before the change (every
  subresource failed, `h1` computed to `-webkit-standard`); after it, zero
  failed requests, four stylesheets parsed and `h1` computed to `Goudy Local`.
  Confirmed the header is absent in `next dev` and present in `next start`.
  `node tools/check-csp.mjs` against the production build reports 0
  violations, 0 page errors, 12/12 sections revealed. Typecheck, lint (the
  existing `_meta` warning only) and production build all passed.
- Follow-up: the parity and visual suites run Chromium only, which is why this
  went unnoticed. Worth adding a WebKit project to `playwright.config.ts` for
  at least one smoke route before launch.

## 2026-10-09: Reword the home hero subheading

**Codex change**

- Commit: `uncommitted`
- Changed: the hero subheading now opens "We work with the world's finest
  hotels and residences to express their character ...". Client wording. The
  verb change needed "to" added, since "we help X express" is grammatical
  where "we work with X express" is not.
- Files: `src/features/home/ui/HomePage.tsx`
- Verified: rendered text confirmed in the browser; typecheck, lint and
  production build passed.
- Follow-up: home parity baseline is stale and needs regenerating after
  review.

## 2026-10-09: Add the client's marble still to the hero strip

**Codex change**

- Commit: `uncommitted`
- Changed: added the client's intro-page marble artwork as an eighth still in
  the home hero collage. Converted the supplied PNG to WebP, registered it and
  placed it last in `COLLAGE_STILLS`, which is also the loop's seam: pale
  marble now sits between dark lacquer and the dark leather the strip restarts
  on, so the deliberate light/dark alternation holds across the join.
- Files: `public/assets/new-material-marble.webp`,
  `src/features/home/content/collage.content.ts`,
  `src/shared/config/image-registry.ts` (regenerated via `pnpm migrate:images`)
- Verified: typecheck passed; lint passed with the existing `_meta` warning;
  looked at the strip parked on the marble cell at 1440 and the crop reads as
  three slabs. Browser console on `/` shows only the pre-existing dev-mode
  warnings (CSP/eval, the leather LCP notice), nothing from the new cell.
- Follow-up: the supplied original is 700x1086, the smallest still in the set,
  against a cell that renders at 506px. It cannot be served at native density
  on a 2x screen. Ask the client for a larger original before launch. The home
  parity baseline is now stale and needs regenerating after review.

## 2026-09-11: Move service detail pages under Our services

**Codex change**

- Commit: `uncommitted`
- Changed: made `/our-services` the sole live service hierarchy: its three
  detail pages now use `/our-services/<service>`. Updated navigation, cards,
  metadata, JSON-LD, sitemap and visual tests through the shared route builder.
  The former `/services` URLs permanently redirect to their matching new path
  so existing bookmarks remain valid.
- Files: `src/app/(site)/our-services/[slug]/page.tsx`,
  `src/app/(site)/services/[slug]/page.tsx`, `src/shared/config/routes.ts`,
  `next.config.ts`, `src/features/home/ui/HomePage.tsx`,
  `tests/{seo,visual}`, `docs/CODEX-CHANGES.md`
- Verified: production build, typecheck and lint passed with the existing
  `_meta` warning; form/SEO, masthead and responsive-heading Playwright suites
  passed; Prettier and `git diff --check` passed.
- Follow-up: None.

## 2026-09-11: Redirect the services parent URL

**Codex change**

- Commit: `uncommitted`
- Changed: added `/services` as a permanent alias for the canonical
  `/our-services` overview route. Individual `/services/<service>` paths are
  unchanged.
- Files: `src/shared/config/routes.ts`, `next.config.ts`,
  `tests/seo/seo.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: typecheck passed; lint passed with the existing `_meta` warning;
  production build and focused HTTP redirect test passed; Prettier and
  `git diff --check` passed.
- Follow-up: None.

## 2026-09-11: Animate the services-menu reveal

**Codex change**

- Commit: `uncommitted`
- Changed: added a layered services-menu reveal: expanding panel, rotating
  chevron and short staggered link entrance. The collapsed submenu is inert
  and hidden from assistive technology; reduced-motion visitors receive no
  animation.
- Files: `src/shared/layout/SiteHeader.tsx`, `src/shared/styles/brand.css`,
  `tests/visual/masthead.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: typecheck passed; lint passed with the existing `_meta` warning;
  production build and focused masthead Playwright suite passed; Prettier and
  `git diff --check` passed.
- Follow-up: None.

## 2026-09-11: Simplify the services-menu interaction

**Codex change**

- Commit: `uncommitted`
- Changed: made Our services one dropdown trigger. It reveals Explore all
  services first, then the three individual services, on click and mouse
  hover. This replaces competing parent-link and disclosure-button actions.
- Files: `src/shared/config/navigation.ts`,
  `src/shared/layout/SiteHeader.tsx`, `src/shared/styles/brand.css`,
  `tests/visual/masthead.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: typecheck passed; lint passed with the existing `_meta` warning;
  production build and focused masthead Playwright suite passed, including
  click and hover coverage; Prettier and `git diff --check` passed.
- Follow-up: None.

## 2026-09-11: Add the services-menu disclosure

**Codex change**

- Commit: `uncommitted`
- Changed: replaced the always-visible service links with a chevron disclosure.
  Our services remains a normal link to its overview; the separate accessible
  button controls the child links. The group opens automatically on the
  overview and service routes, and stays collapsed elsewhere.
- Files: `src/shared/layout/SiteHeader.tsx`, `src/shared/styles/brand.css`,
  `tests/visual/masthead.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: typecheck passed; lint passed with the existing `_meta` warning;
  production build and focused masthead Playwright suite passed; Prettier and
  `git diff --check` passed.
- Follow-up: None.

## 2026-09-11: Remove the duplicate Finer Living menu link

**Codex change**

- Commit: `uncommitted`
- Changed: removed Finer Living as a top-level burger item. It remains within
  the visible Our services group, alongside the other two service pages.
- Files: `src/shared/config/navigation.ts`, `tests/visual/masthead.spec.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: typecheck and focused masthead navigation tests passed; Prettier
  and `git diff --check` passed.
- Follow-up: None.

## 2026-09-11: Group service pages in the burger menu

**Codex change**

- Commit: `uncommitted`
- Changed: made the clickable Our services overview link a compact visible
  group containing Bespoke accessories, Styling & curation and Finer Living.
  The group remains within the site's single burger navigation, and the active
  child route receives `aria-current="page"`.
- Files: `src/shared/config/navigation.ts`,
  `src/shared/layout/SiteHeader.tsx`, `src/shared/styles/brand.css`,
  `tests/visual/masthead.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: typecheck passed; lint passed with the existing `_meta` warning;
  production build passed; the masthead Playwright suite passed; Prettier and
  `git diff --check` passed.
- Follow-up: None.

## 2026-09-11: Update burger-menu craft and services links

**Codex change**

- Commit: `uncommitted`
- Changed: replaced the burger menu's What we do link with Our craft and added
  Our services immediately below it. Our craft intentionally links to the
  existing What we do route (`/our-work`); footer navigation is unchanged.
- Files: `src/shared/config/navigation.ts`, `docs/CODEX-CHANGES.md`
- Verified: typecheck passed; lint passed with the existing `_meta` warning;
  `git diff --check` passed.
- Follow-up: None.

## 2026-09-10: Restore mobile page-title hierarchy

**Codex change**

- Commit: `uncommitted`
- Changed: increased the affected Home, What we do and project-page H1 sizes
  on phone widths while reducing the competing Home carousel, What we do
  service and project chapter headings. Page titles now remain the dominant
  display level without changing desktop typography.
- Files: `src/features/{home,our-work,projects}/styles`,
  `docs/CODEX-CHANGES.md`
- Verified: typecheck and production build passed; lint passed with the
  existing `_meta` warning; the responsive heading suite passed; `git diff
--check` passed.
- Follow-up: the repository's stale visual-parity baselines still need a
  separate deliberate review and refresh before these intentional typography
  changes can be approved against updated snapshots.

## 2026-09-10: Stabilize the home filmstrip endpoint controls

**Codex change**

- Commit: `uncommitted`
- Changed: made the home filmstrip controls follow the active card index rather
  than its pixel scroll position. The previous rule could leave Next enabled
  at the fifth card after the aligned-track change, allowing repeated clicks
  to jump between the final cards.
- Files: `src/features/home/motion/useFilmstripSlider.ts`,
  `docs/CODEX-CHANGES.md`
- Verified: typecheck and production build passed; lint passed with the
  existing `_meta` warning; `git diff --check` passed.
- Follow-up: the repository's stale visual-parity baselines still need a
  separate deliberate review and refresh before the preceding visual alignment
  change can be approved against updated snapshots.

## 2026-09-10: Align the home featured-project strip

**Codex change**

- Commit: `uncommitted`
- Changed: removed the active home filmstrip's unnecessary divider and aligned
  its first card with the featured section's content column. Card dimensions,
  gaps and the position of the remaining cards are unchanged.
- Files: `src/shared/styles/brand.css`, `docs/CODEX-CHANGES.md`
- Verified: typecheck and production build passed; lint passed with the
  existing `_meta` warning; `git diff --check` passed.
- Follow-up: the repository's stale visual-parity baselines still need a
  separate deliberate review and refresh before this intentional layout change
  can be approved against updated snapshots.

## 2026-09-10: Add collection action to Finer Living preview

**Codex change**

- Commit: `uncommitted`
- Changed: added the existing external “Explore the collection” accent button
  to the Discover the collection preview. Both buttons now share one URL
  constant, the same text, styling, new-tab behavior and security attributes.
- Files: `src/features/services/ui/FinerLivingPage.tsx`,
  `src/shared/styles/brand.css`, `docs/CODEX-CHANGES.md`
- Verified: typecheck and production build passed; lint passed with the
  existing `_meta` warning; `git diff --check` passed.
- Follow-up: the repository's stale visual-parity baselines still need a
  separate deliberate review and refresh before this intentional layout change
  can be approved against updated snapshots.

## 2026-09-10: Remove service-page Selected Work sections

**Codex change**

- Commit: `uncommitted`
- Changed: removed the Selected Work sections, project imagery and project
  links from Bespoke Accessories and Styling & Curation. Deleted their dead
  page-specific styles, removed the obsolete SEO link expectations, and made
  selected-project motion optional because Finer Living remains its only user.
- Files: `src/features/services/{ui/BespokeAccessoriesPage.tsx,ui/StylingCurationPage.tsx,ui/BespokeAccessoriesShell.tsx,ui/StylingCurationShell.tsx,motion/useServicePageMotion.ts,styles/bespoke-accessories.module.css,styles/styling-curation.module.css}`,
  `tests/seo/seo.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: typecheck and production build passed; lint passed with the
  existing `_meta` warning; `git diff --check` passed.
- Follow-up: the repository's stale visual-parity baselines still need a
  separate deliberate review and refresh before this intentional removal can
  be approved against updated snapshots.

## 2026-09-10: Share the What we do process on service pages

**Codex change**

- Commit: `uncommitted`
- Changed: replaced the bespoke-accessories and styling-curation four-card
  workflows with the exact seven-step Our process section from What we do.
  Moved the process copy and markup into shared modules, removed obsolete
  service-only workflow styles and their unused line-reveal trigger, and gave
  the reused section its shared rows styling on both service pages.
- Files: `src/shared/{content/process.content.ts,ui/OurProcess.tsx,styles/brand.css}`,
  `src/features/{our-work,our-craft,services}`
- Verified: typecheck and production build passed; lint passed with the
  existing `_meta` warning; `git diff --check` passed.
- Follow-up: the repository's stale visual-parity baselines still need a
  separate deliberate review and refresh before this intentional layout change
  can be approved against updated snapshots.

## 2026-09-10: Make remaining service hero eyebrows service-specific

**Codex change**

- Commit: `uncommitted`
- Changed: replaced the linked What we do-number hero eyebrows on Bespoke
  Accessories and Styling & Curation with the client-approved plain-text labels
  "Made for your place" and "Final touch". Retained their existing project
  links and removed only the obsolete SEO expectations for the two hero links.
- Files: `src/features/services/ui/{BespokeAccessoriesPage.tsx,StylingCurationPage.tsx}`,
  `tests/seo/seo.spec.ts`, `docs/CODEX-CHANGES.md`
- Verified: all 30 form and SEO tests passed. `pnpm verify` passed typecheck,
  lint (with the existing `_meta` warning), and the production build before
  parity reproduced the existing stale legacy-snapshot failure on Home, ahead
  of the affected service pages. `git diff --check` passed.
- Follow-up: refresh the stale visual-parity baselines in a separate deliberate
  review, then capture and approve the intended service-eyebrow differences.

## 2026-09-09: Apply Finer Living and Contact review changes

**Codex change**

- Commit: `uncommitted`
- Changed: replaced the Finer Living hero cue with an external accent button;
  added a responsive six-image placeholder collection gallery and external
  action; moved the unchanged materials section ahead of scope; removed the
  complete point-of-view process section and its dead CSS; replaced the story
  headline; and strengthened the collection preview scrim. Renamed the Contact
  H1, removed its second-line indent and obsolete emphasis, and updated both
  heading-test expectations that depended on changed copy.
- Files: `src/features/services/{ui/FinerLivingPage.tsx,styles/finer-living.module.css}`,
  `src/features/contact/{ui/ContactPage.tsx,styles/contact.module.css}`,
  `src/shared/styles/{primitives.css,brand.css}`,
  `tests/{seo/seo.spec.ts,visual/headings.spec.ts}`,
  `docs/{FEEDBACK.md,CODEX-CHANGES.md}`
- Verified: production Chromium screenshots at 1440x900 and 390x844 showed the
  final Finer Living and Contact layouts with no horizontal overflow; rendered
  checks at 860px also passed. The new story headline is three lines at all
  three widths and the Contact H1 is exactly two. The clay project eyebrow has
  5.23:1 contrast against the pixels directly behind it. The 43-case heading
  suite passed. On the final `pnpm verify`, typecheck, production build and all
  29 form/SEO tests passed; lint reported only the existing `_meta` warning.
  Parity then reproduced the known stale state with 39 failures and the 3
  Imprint snapshots passing. No baseline was regenerated.
- Follow-up: replace the six gallery stand-ins when the client supplies the
  intended photography. The 39 pre-existing parity baselines still need a
  separate deliberate review and refresh.

## 2026-09-08: Replace the Our Work artisan strip with the shared wall

**Codex change**

- Commit: `uncommitted`
- Changed: moved the byte-identical About and Our Craft artisan walls into one
  shared component, rendered that wall on Our Work without changing its
  eyebrow, heading or note, and removed the three-image strip component, test,
  animation CSS, keyframes and parity-freeze selectors. Extended all
  page-scoped wall and tile rules to Our Work.
- Files: `src/shared/{ui/ArtisanWall.tsx,styles/brand.css,motion/useImageRotation.ts}`,
  `src/features/{about/ui/ArtisanWall.tsx,our-craft/ui/ArtisanWall.tsx,our-craft/ui/OurCraftPage.tsx,our-work/ui/ArtisanStrip.tsx,our-work/ui/OurWorkPage.tsx,our-work/styles/our-work.module.css}`,
  `tests/visual/{artisan-strip.spec.ts,pages.ts}`,
  `docs/{FEEDBACK.md,CODEX-CHANGES.md}`
- Verified: production Chromium screenshots at 1440x900 and 390x844 showed
  the ten-tile wall on Our Work and the unchanged wall layout on About and Our
  Craft, with no horizontal overflow. The focused founder, wall and reveal
  suites passed all 12 tests. `pnpm verify` passed typecheck, lint with the
  existing `_meta` warning, the production build and all 29 form/SEO tests,
  then reproduced the known parity result of 39 stale failures and 3 passing
  Imprint snapshots. No baseline was regenerated.
- Follow-up: the 39 pre-existing parity baselines still need a separate
  deliberate review and refresh.

## 2026-09-08: Remove the About founder experience badge

**Codex change**

- Commit: `uncommitted`
- Changed: removed the "20+ Years of international hospitality experience"
  badge from Alex's founder portrait and deleted all of its page and brand
  styles. Removed the stale visual-test assertion that required the badge.
- Files: `src/features/about/{ui/AboutPage.tsx,styles/about.module.css}`,
  `src/shared/styles/brand.css`, `tests/visual/about-founders.spec.ts`,
  `docs/{FEEDBACK.md,CODEX-CHANGES.md}`
- Verified: production Chromium at 1440x900 and 390x844 showed the badge gone
  while the founder photograph and copy remain, with no horizontal overflow.
  Both About founder tests passed; the full verification result is recorded in
  the artisan-wall entry above.
- Follow-up: None.

## 2026-09-08: Remove the About global-eye section

**Codex change**

- Commit: `uncommitted`
- Changed: removed the complete "A global eye, grounded in place" section and
  its three photographs, all associated responsive and reduced-motion styles,
  its reveal test case, and its shared fail-open selector.
- Files: `src/features/about/{ui/AboutPage.tsx,styles/about.module.css}`,
  `src/shared/motion/useFailOpenReveal.ts`, `tests/visual/reveal.spec.ts`,
  `docs/{FEEDBACK.md,CODEX-CHANGES.md}`
- Verified: production Chromium at 1440x900 and 390x844 confirmed the section
  is absent and the surrounding About content remains overflow-free. The
  retained experience-image reveal test passed; the full verification result
  is recorded in the artisan-wall entry above.
- Follow-up: None.

## 2026-09-08: Rename the Finer Living hero kicker

**Codex change**

- Commit: `uncommitted`
- Changed: replaced the linked "What we do / 03" Finer Living hero kicker
  with plain "Curated collection" text, removed the now-unused `Link` and
  `ROUTES` imports, and removed the obsolete Finer Living contextual-link test
  expectation. Marked Review Round 5 complete and recorded the client comment.
- Files: `src/features/services/ui/FinerLivingPage.tsx`,
  `tests/seo/seo.spec.ts`,
  `docs/{FEEDBACK.md,REVIEW-ROUND-5-BRIEF.md,CODEX-CHANGES.md}`
- Verified: fresh production builds passed. Production Chromium at 1440x900
  and 390x844 showed "CURATED COLLECTION" on one line in the existing eyebrow
  style, with no link or horizontal overflow; before and after screenshots
  were reviewed. `pnpm verify` passed typecheck, lint with the existing `_meta`
  warning, the production build and all 29 form/SEO tests, then exited 1 only
  because parity reproduced the 39 known stale failures; the three Imprint
  snapshots passed. No baseline was regenerated.
- Follow-up: the client may decide whether Bespoke Accessories and Styling &
  Curation should keep their numbered "What we do" kickers or be made
  consistent with Finer Living.

## 2026-09-08: Split footer columns and add the Imprint page

**Codex change**

- Commit: `uncommitted`
- Changed: split the shared footer into Explore, Connect and Legal columns;
  added placeholder Instagram and Imprint links; and added `/imprint` using
  the existing legal-page structure, with only clearly labelled placeholder
  fields, a "Draft only." notice and `noindex`. Added the route to shared
  route data, crawl-metadata coverage and the visual page matrix. Responsive
  footer rules stack the brand by 860px and place Legal below the other two
  link columns by 560px.
- Files: `src/app/{sitemap.ts,(legal)/imprint/page.tsx}`,
  `src/features/legal/{index.ts,ui/ImprintPage.tsx,ui/ImprintShell.tsx}`,
  `src/shared/{config/navigation.ts,config/routes.ts,layout/SiteFooter.tsx,styles/brand.css,styles/chrome.css,styles/primitives.css}`,
  `tests/{seo/seo.spec.ts,visual/pages.ts}`,
  `docs/{FEEDBACK.md,REVIEW-ROUND-5-BRIEF.md,CODEX-CHANGES.md}`
- Verified: fresh production builds passed and included `/imprint`. Production
  Chromium at 1440x900, 768x1024 and 390x844 confirmed the three footer
  groups, correct responsive wrapping and no horizontal overflow; the Imprint
  page was visually reviewed at all three sizes and exposed `noindex, follow`.
  Only the three new Imprint baselines were generated and reviewed at the
  parity viewports; all three pass. `pnpm verify` passed typecheck, lint with
  the existing `_meta` warning, the production build and all 29 form/SEO
  tests, then exited 1 only because the parity stage reproduced the 39 known
  stale failures; the final parity total was 3 passed, 39 failed.
  `tests/visual/headings.spec.ts` passed all 43 tests, including Imprint at
  desktop, tablet and mobile with no new exemption.
- Follow-up: replace the placeholder Imprint fields and both `#` social links
  only when the client supplies approved company data and URLs. The 39
  pre-existing parity baselines still need a separate deliberate review and
  refresh.

## 2026-09-08: Remove the Home "Our story" section

**Codex change**

- Commit: `uncommitted`
- Changed: removed the Home-only founders section between the featured
  filmstrip and shared closing CTA, along with all of its Home CSS, drift
  motion, fail-open reveal registration and obsolete visual tests. The About
  page and its menu and footer links remain unchanged.
- Files: `src/features/home/{ui/HomePage.tsx,styles/home.module.css,motion/useHomeMotion.ts}`,
  `src/shared/{styles/brand.css,motion/useFailOpenReveal.ts}`,
  `tests/visual/{home-story.spec.ts,reveal.spec.ts}`,
  `docs/{FEEDBACK.md,REVIEW-ROUND-5-BRIEF.md,CODEX-CHANGES.md}`
- Verified: fresh `pnpm build` passed. Production Chromium at 1440x900 and
  390x844 found no `#story` or `.family-editorial`, confirmed `#collection`
  is followed directly by `.closing`, and retained two `/about` links. Before
  and after screenshots were reviewed. `pnpm parity` confirmed the documented
  stale state: all 39 route/viewport combinations failed; no baseline was
  regenerated. `pnpm verify` passed typecheck, lint with the existing `_meta`
  warning, the production build and all 28 form/SEO tests, then exited 1 only
  because the parity stage reproduced those 39 stale failures. The updated
  reveal suite passed all 5 tests separately.
- Follow-up: parity baselines need a separate deliberate review and refresh;
  this batch did not replace the 39 stale baselines.

## 2026-09-08: Remove featured-card inset photographs

**Codex change**

- Commit: `uncommitted`
- Changed: removed the small rotated `.film-detail` photograph from each of
  the five Home featured cards and deleted its four CSS rules. Each card keeps
  its full-bleed image, shade, number, title and caption. No asset was deleted.
- Files: `src/features/home/{ui/HomePage.tsx,styles/home.module.css}`,
  `docs/{FEEDBACK.md,REVIEW-ROUND-5-BRIEF.md,CODEX-CHANGES.md}`
- Verified: fresh `pnpm build` passed. Production Chromium at 1440x900 and
  390x844 found five cards, five direct `.film-image` elements and no
  `.film-detail`; before and after screenshots were reviewed. `pnpm parity`
  confirmed all 39 stale baseline failures; no baseline was regenerated.
  `pnpm verify` passed typecheck, lint with the existing `_meta` warning, the
  production build and all 28 form/SEO tests, then exited 1 only because the
  parity stage reproduced those 39 stale failures. The updated reveal suite
  passed all 5 tests separately.
- Follow-up: parity baselines need a separate deliberate review and refresh;
  this batch did not replace the 39 stale baselines.

## 2026-09-08: Service rows — accent numbers, a deeper hover, a click cue

**Codex change**

- Commit: `944d909 Service rows: brand-orange numbers, a deeper hover and an arrow`
- Changed: three client review points on the home "What we do" rows. The row
  numbers move from `--ink-soft` to `--clay`, taking `--tan` over the
  photograph so they stay brand-coloured in both states. The hover height goes
  from a 45px lift to roughly double the row (243px → 450px at a 900px
  viewport, capped 520px), because the reason for the taller row is to let the
  wide photograph be read. And the row now says it is a link: the anchor spans
  the full row instead of a centred 1280px band — the outer strips genuinely
  had no pointer and no click — plus an arrow at the right, visible at rest,
  rotating up and out on hover.
- Also: `/services/styling-curation`'s photograph is the only portrait source
  of the three (1279x1920 against 1440x960), so cover-fitting it into a 3:1 row
  showed mostly the empty wall above its subject. Cropped to `50% 62%` through
  a `data-crop` attribute. Not `:nth-of-type(2)` — `.svc-head` is a div in that
  section, so that selector picks the first row.
- Files: `src/features/home/ui/HomePage.tsx`,
  `src/features/home/styles/home.module.css`
- Verified: typecheck, lint, `pnpm build`, `pnpm test` (28), reveal + headings +
  mobile-readiness (52). Measured in a browser at 1440x900 and 390x844: colours,
  row heights, `object-position`, and `elementFromPoint` at the row's far edge
  resolving to the link.
- Follow-up: the photograph is still darkened by `brightness(.72)` plus a
  `.76 → .44` veil, which is now the limit on reading it rather than the height.
  A landscape crop of the Styling & Curation set-up would retire the `data-crop`
  special case, which is a fixed percentage and will not survive a change to the
  row height gracefully.

## 2026-09-08: The home statement stops holding the scroll

**Codex change**

- Commit: `41fa595 Home statement: let the page scroll instead of pinning it`
- Changed: reverses the pinned treatment recorded as FEEDBACK comment 21. The
  section held the viewport for two screens while the reader's scrolling wrote
  the sentence; the client asked for the words without the hold. `#purpose` is
  now one screen tall with ordinary section padding and scrolls past like any
  other section, and the statement takes the ordinary staggered word reveal.
- The reveal was retimed: 1.15s/62ms → 0.5s/22ms, about 0.95s end to end for
  21 words, and the trigger fires as the heading crosses the fold rather than
  waiting for a third of it to be inside the viewport. The old timing was right
  while the page was holding still and much too slow once it was not.
- Files: `src/features/home/motion/useHomeMotion.ts`,
  `src/shared/styles/brand.css`, `src/features/home/styles/home.module.css`,
  `tests/visual/reveal.spec.ts`
- Verified: typecheck, `pnpm build`, `reveal.spec.ts` (6) rewritten to assert
  the section is one viewport with nothing sticky and that the words still
  arrive one at a time. Measured while scrolling in: the sentence completes with
  the heading at the fold, against ~2000px past it before.
- Follow-up: `usePurposeReveal.ts` and its `.scroll-reveal` rules are kept,
  unwired and labelled in both files, so the pin can be restored. An agent that
  "fixes" the dangling hook will undo a client decision.
- Note: `brand.css` beat the page module here. The stagger was first retuned in
  `home.module.css` with a clean build and passing tests and nothing moved on
  screen, because `[data-page='home'] #purpose-title .reveal-word > span` in
  `brand.css` was the rule that applied. Page modules load after `brand.css`, so
  `brand.css` scopes its overrides to ids to win. Confirm which rule applies
  before editing a value. Recorded in `REVIEW-ROUND-5-BRIEF.md` as a trap.

## 2026-09-07: Raise the small-text scale

**Codex change**

- Commit: `uncommitted`
- Changed: the client could not read the body copy and eyebrows on a large
  display. Body was a fixed `1rem` in Jost Light 300 — a small x-height makes
  16px read closer to 14px — and eyebrows were `0.67rem` (10.7px), with captions
  and numerals down to `0.55rem` (8.8px). The cause was structural: every
  heading is a fluid `clamp(min, Xvw, max)` while every body, label and UI size
  was a hardcoded literal, roughly 135 of them across twenty stylesheets. So the
  wider the viewport the worse the imbalance, and nothing grew past ~1600px.

  Added a seven-step type scale to `tokens.css` and mapped those literals onto
  it. Each step holds a floor to ~1100px then grows to a ceiling at 2560px:
  body copy is 16.5px on a phone, 17.2px at 1440 and 19.5px at 2560. Raised the
  two smallest prose tiers to weight 400 and `--soft` from 0.66 to 0.72; the
  Contact consent note was `0.68rem` at `rgba(41,40,31,.43)`, about 2.1:1, and
  now uses `--text-fine` at `--soft`. Reduced eyebrow tracking `0.23em → 0.20em`
  to absorb the extra width.

  **No heading was changed**, with one exception: the mobile `#purpose-title`
  was `clamp(1.3rem, 5.6vw, 1.7rem)`, only 1.19x the new body size, and was
  raised to clear it. `.wall-property` was below body size and got a floor.

- Files: `src/shared/styles/{tokens,primitives,brand,chrome}.css`, all 13 page
  modules, `src/app/status.module.css`,
  `src/shared/forms/FieldError.module.css`,
  `tests/visual/mobile-readiness.spec.ts`
- Verified: `pnpm typecheck`, `pnpm lint` (pre-existing `_meta` warning),
  `pnpm format:check` and a clean `pnpm build` all pass; 33 form, SEO and
  mobile-readiness tests pass. Computed sizes were measured in Chromium at 390,
  768, 1024, 1280, 1440, 1920 and 2560px across seven pages: every heading
  measures identically to before, and body, eyebrow and footer steps track the
  scale. No page scrolls horizontally at any of those widths, the home hero's
  `white-space: nowrap` h1 still fits its container, and no eyebrow wraps.
- Follow-up: `pnpm parity` will fail by design — typography moved on every page.
  Review the diffs and regenerate the baselines. Two notes for whoever does:
  `src/shared/styles/chrome.css` is generated but has diverged from
  `build-chrome.mjs`, which also rewrites all 13 page modules from `legacy/*.html`
  and will revert the removed desktop nav, the iOS safe-area padding and this
  change — do not run it. And `mobile-readiness.spec.ts` asserted text controls
  were exactly `16px`; since the requirement is a floor (iOS zooms _below_ 16px)
  and the shared body step starts at 16.5px, it now asserts `>= 16`.

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
