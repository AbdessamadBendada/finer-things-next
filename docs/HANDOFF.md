# Where the project is

Last updated **2026-08-31**, after the client photography update.

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
substantially redesigned across four rounds of client review. It is not live.
Launch is blocked on the open decisions in AGENTS.md, chiefly the consent
checkbox, and on the client supplying real photography.

Everything below is on `main` and pushed.

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

| What                     | Where                                            | Notes                                                      |
| ------------------------ | ------------------------------------------------ | ---------------------------------------------------------- |
| Remaining project images | `features/projects/content`                      | 20 of the 22 supplied photographs are used                 |
| A sixth material         | `features/our-work/content/materials.content.ts` | The sixth card repeats Marble, flagged `placeholder: true` |
| All real photography     | everywhere                                       | 34 distinct images across 81 placements                    |

An email has gone to the client asking them to walk the site and say what
replaces what. An upload app was built for this and then scrapped as
overkill; do not rebuild it without being asked.

## Known and unfixed

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
