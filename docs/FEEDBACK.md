# Design & copy feedback

The running log of review comments on the site: what was asked for, what was
done about it, and — where we pushed back — why.

Kept in the repo rather than a thread so that months from now the reason a
thing looks the way it does is still findable.

## How to read this

| Status                  | Meaning                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| ✅ **Done**             | Implemented and verified. The commit is linked.                                                          |
| 🔄 **In progress**      | Being worked on now.                                                                                     |
| 🤔 **Needs a decision** | Blocked on an answer — the question is stated in the entry.                                              |
| ⏸️ **Deferred**         | Agreed, but not now. The reason and the trigger are stated.                                              |
| ❌ **Not doing**        | Declined, with the reasoning. Reopen it any time — record the counter-argument here rather than in chat. |

Each entry records:

- **Asked** — the comment as given, not paraphrased into something tidier.
- **Read as** — how it was interpreted, when the comment left room for more
  than one reading. Getting this wrong is the usual cause of rework.
- **Done** — what actually changed, and where.
- **Note** — anything worth knowing later: a trade-off, a knock-on effect, a
  reason it is smaller or larger than it sounds.

### Before marking anything ✅

A design or copy change makes the visual gate fail on that page, which is
correct. Review the diff (`pnpm parity:report`), confirm **only** the intended
thing moved, then re-baseline that page. See
[PARITY.md](PARITY.md#changing-the-design-on-purpose). Skipping that review is
how a copy edit quietly takes a layout with it.

---

## Round 1 — 2026-08-20

<!--
Template — copy per comment:

### 1. Short title

- **Page:** /about
- **Asked:** "…"
- **Read as:** …
- **Status:** 🤔 Needs a decision
- **Done:** —
- **Note:** …
-->

### 1. The hero wordmark is too big

- **Page:** `/` (home)
- **Asked:** "the logo looks sooooo big" — with a screenshot showing a second,
  smaller logo pasted over the hero as a size reference. It still needs to be
  large enough that the shrink-on-scroll animation reads.
- **Read as:** one logo, at the pasted size. The duplicate in the screenshot
  was a reference, not a second mark.
- **Status:** ✅ Done
- **Done:** `useWordmark.ts` — start width 70% → **28%** of the viewport
  (948px → 379px at 1354px wide). It still shrinks into the ~161px masthead
  logo, a 2.4× change, so the hand-off stays legible.
- **Note:** narrow screens keep 65% rather than 28%. Below ~860px, 28% of the
  viewport is _smaller_ than the header logo it shrinks into, so the animation
  would have run backwards.

### 2. Nothing to navigate to from the first frame

- **Page:** `/` (home)
- **Asked:** the empty first frame suits the luxury feel, but a visitor who
  arrives wanting to do something — contact, say — has no way to start, and
  shouldn't feel lost. Options raised: a burger top-right, or nav links.
- **Read as:** an experiment to compare, not a decision already made.
- **Status:** 🔄 In progress — awaiting a choice
- **Done:** three treatments are live behind a query string, all on one page
  so they can be compared on one deploy:

  | URL             | Treatment                                  |
  | --------------- | ------------------------------------------ |
  | `/`             | unchanged — wordmark only until you scroll |
  | `/?nav=burger`  | burger, top-right                          |
  | `/?nav=links`   | Our Work · Projects · About · Contact      |
  | `/?nav=contact` | a single "Contact" link                    |

  In every variant the masthead carries navigation but **no logo** — the hero
  wordmark is the logo until it docks. One mark on screen at all times.

- **Note:** deliberately _not_ three copies of the home page. Home is the most
  complex page on the site; three copies would drift and every later edit would
  be made three times. When one wins, `useHeroNav.ts` and the `?nav=` block in
  `brand.css` collapse into it.

### 3. The nav treatments need work (round 2 on comment 2)

- **Page:** `/` (home), all three variants
- **Asked:** the variants are all liked, but: the burger is small, not aligned
  with the logo, **"doesn't show at all"**, and has no X when the menu is open.
  The links are small and not aligned with the logo in all three — with a
  reference screenshot of the docked masthead. And: "can we use the burger in
  the whole page?"
- **Read as:** burger stays for the whole _home page_ rather than the whole
  _site_ — confirmed. Other pages keep their text links.
- **Status:** ✅ Done
- **Done:**
  - **"Doesn't show at all" was a real bug.** The burger was tied to the
    pre-hand-off state, so it vanished the moment you scrolled past the hero.
    Persistence and the logo hand-off are now separate: the burger stays the
    whole way down, and the logo still appears when the wordmark docks.
  - Burger enlarged to a 30×14 icon in a 34px hit area, optically centred.
  - It now resolves into an **X** when open, with `aria-label` switching
    between "Open menu" and "Close menu", and inverting to ink over the paper
    menu.
  - Nav links **11.5px → 13px**, tracking eased to 0.16em, nudged onto the
    wordmark's optical line. Docked logo and links now centre within 1px.
- **Note:** the other two variants deliberately hand back to the normal links
  once the header docks — a lone "Contact" below the fold would leave no way
  to reach anything else. Only the burger persists, as asked.

  Also: I broke this myself between rounds. Silencing a lint rule with
  `useSyncExternalStore` stopped the variant being read after hydration, so
  all three briefly did nothing. Caught by measuring rather than looking.

### 4. Make the contact variant a button, not a link

- **Page:** `/?nav=contact`
- **Asked:** "can we make the contact link in the one with just the contact a
  button rather than just a link?"
- **Status:** ✅ Done
- **Done:** it now uses the site's own `.btn`, scaled down for a masthead
  (111×35px). Outlined over the photography — paper rule, paper text,
  transparent fill — and inverting to solid paper on hover.
- **Note:** outlined rather than solid on purpose. The hero already carries a
  full-size solid CTA ("Let's tell your story") lower down the same screen;
  two solid buttons would compete for the same attention. One line in
  `brand.css` makes it solid if she prefers that.

### 5. The logo doesn't line up with the button at the end of the shrink

- **Page:** `/?nav=contact`
- **Asked:** "the logo at its final glance doesn't align with the button, it
  looks soooo off"
- **Status:** ✅ Done
- **Done:** the wordmark finished at `top: 24px` while the masthead logo and
  the button both sit at `top: 18px`, so it landed 6px low. It now finishes
  exactly where the docked logo lives. On screens under 860px the button was
  also taller than the logo, so its padding is trimmed to bring both onto the
  same centre line.

  |      | before  | after   |
  | ---- | ------- | ------- |
  | 1440 | 6px off | **0px** |
  | 860  | 3px off | **0px** |
  | 390  | 3px off | **0px** |

- **Note:** this also removed a jump nobody had reported — the wordmark used
  to shift 6px at the moment it handed off to the masthead. Now 0.

  The rule is written as `[data-page='home'] #word` rather than a class: page
  stylesheets load after `brand.css` and set `.word` at equal specificity, so
  a class-based override here silently lost. Worth remembering for the next
  intentional override.

---

## Cross-cutting notes

Things that came up more than once, or that change every page at once. Worth
checking here before implementing a per-page comment — a change to the header,
the footer, the palette or the primitives lands everywhere.

| Area                                           | Where it lives                                          |
| ---------------------------------------------- | ------------------------------------------------------- |
| Header, footer, navigation                     | `src/shared/layout/`, `src/shared/config/navigation.ts` |
| Brand colours                                  | `src/shared/styles/tokens.css`                          |
| Shared pieces (`.rise`, `.btn`, `.eyebrow`)    | `src/shared/styles/primitives.css`                      |
| Deliberate departures from the original design | `src/shared/styles/brand.css`                           |
| One page only                                  | that feature's `styles/*.module.css`                    |
| Page copy                                      | that feature's `ui/*.tsx`, where it renders             |

---

## Already known, independent of this round

Carried over so they are not raised as new findings:

- **Page titles still read "Luxury Motion Study"** — e.g. `About | Luxury
Motion Study`. A mockup artefact that would ship to search results.
- **The contact form does not deliver anywhere.** It validates end to end and
  logs, by design, until the consent checkbox exists
  ([adr/0002](adr/0002-deferred-compliance.md)).
- **Legal pages are placeholder text**, `noindex`, excluded from the sitemap.
- **LinkedIn link is `href="#"`**, and the contact form still says "The final
  privacy-policy link will be added before launch."
