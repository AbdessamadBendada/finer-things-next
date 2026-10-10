# Where the project is

Last updated **2026-10-10**, after the round 6 client review.

Read this first if you are picking the project up. It is the state of play:
what is settled, what is waiting on the client, and what is known to be broken.
The reasoning behind individual decisions is in
[FEEDBACK.md](FEEDBACK.md) and [adr/](adr/); this file is only the map.
AI-authored work is recorded separately in
[CODEX-CHANGES.md](CODEX-CHANGES.md); read its newest entry before changing
the repository.

**[PRELAUNCH.md](PRELAUNCH.md) is the checklist to work through before going
live.** It is the index: blockers, owners and where each thing is explained.
Start there.

Launch-readiness work is queued in
[MOBILE-LAUNCH-ACTION-PLAN.md](MOBILE-LAUNCH-ACTION-PLAN.md) and
[SEO-LAUNCH-ACTION-PLAN.md](SEO-LAUNCH-ACTION-PLAN.md). These are action plans,
not records of completed fixes.

## Status

The site is a complete twelve-page build, migrated from `legacy/` and then
substantially redesigned across six rounds of client review. It is not live.
Launch is blocked on the open decisions in AGENTS.md, chiefly the consent
checkbox, and on the client supplying real photography.

**Round 6 (2026-10-09 and 10) is uncommitted.** Twelve review comments,
recorded as FEEDBACK.md 40 to 51, with sixteen matching CODEX-CHANGES
entries. In brief: home copy and the five featured cards renamed with their
captions removed, a sixth featured card, a seventh material in a four-above-
three grid, the artisan wall edited and given a tall tile, the contact
photograph reframed, secondary copy darkened to clear WCAG AA, new Finer
Living photography, and every location caption beneath an image removed
site-wide. Two genuine bugs were found and fixed along the way: the
artisan wall swapping the same tile twice running, and the dev server
serving an unstyled page in Safari.

## What changed in review, in brief

Round by round, with the detail in FEEDBACK.md.

**Navigation is a burger and nothing else**, on every page and at every width,
driven by one `SITE_MENU`. There is no desktop link row and no per-page link
set. If you find yourself adding a second navigation, stop and read comment 6.

**Headlines are one colour.** The rule is stated as a policy
(`[data-page] :is(h1,h2,h3) *`) rather than as a list of selectors, because
enumerating them missed cases three rounds running. Do not narrow it.

**Emphasis inside a heading is a hairline underline, not a colour and not an
italic.** The site ships one upright font file per family with
`font-synthesis: none`, so `font-style: italic` renders identically to regular
text. This surprises people. If the client ever wants true italics, that is a
brand decision requiring a new font file.

**No em dashes anywhere in site copy.** Enforced by a lint rule over string
literals, template strings and JSX text under `src/`. Comments are exempt. If a
commit fails on `no-restricted-syntax`, that is the rule working.

**One closing CTA**, `shared/layout/SiteCta.tsx`, on nine pages. Contact is the
deliberate exception: its closing section is a "Stay connected" panel, and a
"Start a project" button pointing at `/contact` from `/contact` goes nowhere.

**The footer and masthead both paint the logo as a CSS mask in
`currentColor`**, not as an `<img>`. The only asset is dark artwork; as an
image with `mix-blend-mode: multiply` it vanished against the photographic
heroes.

**Section heads stack.** Eyebrow, then heading, then supporting copy. The old
two-column split was also what squeezed headings into four and five lines.

**"Our Work" is now "What we do"** in the interface. The route, the feature
directory and the thirty-nine `[data-page='our-work']` selectors are
deliberately unchanged.

## Waiting on the client

Nothing here is a bug. Each is a placeholder that ships until they answer.

| What                     | Where                                            | Notes                                                         |
| ------------------------ | ------------------------------------------------ | ------------------------------------------------------------- |
| Remaining project images | `features/projects/content`                      | 20 of the 22 supplied photographs are used                    |
| ~~A sixth material~~     | `features/our-work/content/materials.content.ts` | Resolved 2026-10-09. Seven real materials now, no placeholder |
| All real photography     | everywhere                                       | 34 distinct images across 81 placements                       |

An email has gone to the client asking them to walk the site and say what
replaces what. An upload app was built for this and then scrapped as
overkill; do not rebuild it without being asked.

## Known and unfixed

**The "Start a project" button fails WCAG AA.** Paper text on clay `#B56D43`
measures **3.53:1** against the 4.5 small text requires. It is the shared
`SiteCta`, so it is on nine pages. Not fixed because every option changes a
brand colour: darkening the clay to about `#9C5733` reaches 4.83:1, the
oxblood reaches 7.69:1, and ink on the existing clay does not help at 3.69:1.
Needs a decision. See FEEDBACK.md 48.

**Two pages disagree about the materials.** `/our-work` and `/our-craft` keep
**separate copies** of the materials content. Round 6 added Marble and the
four-above-three layout to `/our-work` only, as asked, so `/our-craft` still
shows the original six in three columns. See FEEDBACK.md 47.

**"Florals" was removed from one line and survives in nine others**,
including the Styling & Curation detail page and the registry description
that becomes its search result. The overview panel and the detail page now
describe the same service differently. See FEEDBACK.md 50.

**Two rejected photographs are still on the Finer Living page.** The client
crossed out the wooden stools and the stone samples as gallery thumbnails;
the same two images are also that page's **hero** and a **full-bleed
background**. See FEEDBACK.md 51.

**Seven materials divide awkwardly below 1200px.** The grid falls back to
three columns and then two, leaving one orphan card on the last row at both.
Six used to fill those evenly.

**The Featured intro needs 84ch to hold two lines**, about 99 characters per
line, well beyond a comfortable measure. Shorter copy is the real fix.

**Images over-fetch badly.** `shared/ui/Media.tsx` defaults every image to
`sizes="100vw"`, so next/image serves a file sized for the whole viewport
whatever the image actually occupies. Measured: 8x too wide on the home hero
collage, 3.9x on the About portraits, 2.7x on the What we do service media.
The fix is honest `sizes` values, per call site where they differ.

The earlier empty service-row wipe is fixed: the clipped lazy images now warm
when their row approaches the viewport, receives focus, or receives a pointer.
The remaining over-fetch issue above was reported by the client as "the
animation takes so long" and still needs per-call-site `sizes` work.

**The home purpose statement runs four lines on mobile.** 144 characters at
51px needs 421px and a phone gives 335. Three lines would need type smaller
than the body copy beside it. Shortening the copy is the only real fix.

## Things that cost time to rediscover

**Security headers must be production-only, and one of them persists.**
`upgrade-insecure-requests` rewrites every http subresource to https before
the request leaves the browser. On the plain-http dev server that pointed
every stylesheet, script and font at `https://localhost:3000`, where nothing
listens, and the page rendered as unstyled HTML. It looked like a Safari bug
because Chrome exempts localhost from the upgrade and WebKit does not. Both
that and `Strict-Transport-Security` are now scoped to production. The HSTS
one has a tail: a two-year entry stored for `localhost` keeps upgrading
requests for **every project on the machine** long after the header stops
being sent, and removing the header does not clear it. Clearing history does
not either; it lives in the browser's HSTS store.

**`grid-column: span 2` puts `span 2` in the _start_ slot.** Adding a bare
`grid-column-start: N` afterwards replaces that start and leaves the end
`auto`, so the item silently collapses to a single track. Write
`grid-column: N / span 2`. This decentred the materials grid and the only
symptom was a slightly narrow card.

**A `brand.css` rule can tie a page rule and lose.** Page modules load after
`brand.css`, so equal specificity hands the win to them. A three-class
override of a three-class page rule shipped doing nothing and the
measurement still read the old value. Reach for the element's id. Already
stated in AGENTS.md; it still caught us.

**Measure contrast, and dedupe by timestamp not by value.** Two measurement
bugs cost time in round 6. A swap-sequence check deduplicated consecutive
identical values, which filtered out exactly the repeated-tile event being
counted and reported a clean zero. And text over a photograph cannot be
checked from the CSS at all: the painted background is not what is behind
the type.

**The parity gate cannot see small changes.** The tolerance is a fraction of
the whole page, and these pages are thousands of pixels tall. A 3px rule was
removed and the gate still passed. Treat a pass as "nothing moved
structurally", never as "nothing changed", and confirm design changes by
looking. See PARITY.md.

**Baselines are gitignored**, so `git status` will never show that they are
stale. Check file mtimes.

**`chrome.css` says it is generated. It is not, any more.** Running
`build-chrome.mjs` emits about 113 lines against the file's ~570 and would
delete most of it. Treat it as hand-maintained source.

**Never hand-write `-webkit-` prefixes.** Lightning CSS keeps only the
prefixed half of a pair and drops the standard property. This silently killed
the mobile menu's backdrop blur in every non-WebKit browser.

**Lightning CSS merges rules into `:is()`**, and a pseudo-element inside
`:is()` is invalid, so the whole rule is dropped. This silently killed the
scrim behind the gallery captions. Do not put `::after` or `::before` in a
selector that shares a declaration block with another selector.

**Page stylesheets load after `brand.css`** and nest under `.page`, which buys
them a class of specificity. An override in `brand.css` at equal weight loses
silently. Use the element's id, or state the extra weight and say why.

**Motion must fail open.** Anything that starts hidden needs a path to being
revealed if its observer never fires. The watchdog in `useFailOpenReveal.ts`
now requires an element to be as visible as its own observer would demand,
because it used to fire early and play animations off-screen.

## The gate

`pnpm verify` runs typecheck, lint, build, the form tests and the 36 parity
snapshots. Parity takes about seven minutes; the whole thing about nine.
`tests/visual/masthead.spec.ts` is separate and runs in twenty seconds.

A design change means reviewing the parity diff first, then re-baselining that
page. Ten of the twelve pages now compare against the last approved build
rather than against `legacy/`; only Privacy and Terms still verify against the
original.

**After round 6 the baselines are stale on every page that changed**, which
is home, contact, What we do, Our craft, About, Our services and Finer
Living. None were regenerated: that wants a diff review first, and the
decisions still open above may move things again. The artisan wall is frozen
for the gate through `--frozen`, so the wall edits themselves do not show up
as diffs; the tall tile does, because it changes the grid.
