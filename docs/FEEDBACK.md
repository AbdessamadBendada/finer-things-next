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
- **Status:** ✅ Resolved — **the burger won**, see comment 6
- **Done:** three treatments were live behind a query string, all on one page
  so they could be compared on one deploy:

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

### 6. Keep only the burger, and use it across the whole site

- **Page:** every page
- **Asked:** "drop everything but the burger one, and I want the burger menu
  to be the only menu on the whole website, not just the home page" — and make
  it production ready.
- **Status:** ✅ Done
- **Done:**
  - `?nav=` and `useHeroNav.ts` are gone, along with the links and contact
    treatments and their CSS. The burger is no longer a variant; it is the
    navigation.
  - **The desktop link row is gone from all twelve pages.** `.links` is no
    longer rendered anywhere, so the 860px breakpoint that used to swap the
    row for a menu no longer exists — one navigation, one behaviour, every
    width.
  - **One menu, not twelve.** The per-page `menu`/`header` link sets collapsed
    into a single `SITE_MENU`. The page you are on is marked with
    `aria-current` instead of being dropped from the list: as the only way
    through the site, the menu must not change shape as you move around it.
  - **Privacy and Terms now have navigation at all.** They previously carried
    a lone "Contact" link and no menu, which made them dead ends.
  - Keyboard and focus behaviour a primary menu owes: Escape closes; opening
    moves focus to the first link and closing returns it to the toggle; Tab is
    trapped inside while open; a back/forward navigation closes it.
- **Two real bugs this surfaced, both caught by measuring rather than looking:**
  - The legal pages had **no `.mobile-menu` rules at all** — they were the
    pages with no menu — so the new panel rendered as a static block and
    pushed the whole document down. The parity gate failed on exactly those
    two pages. Fixed by styling the panel **once** for every page rather than
    patching the two.
  - Opening the menu on the home hero left the **X in paper on a paper
    panel**, all but invisible: the hero rule and the open-menu rule have
    identical specificity, and the hero one came later. Source order now puts
    the open state last, with a comment saying why.
- **Note:** the burger is now the only route to any page, so it is gated on
  every page at both desktop and mobile widths in `masthead.spec.ts`, not
  spot-checked on one.

### 7. The X shifts when the menu opens

- **Page:** every page
- **Asked:** locking the scroll on open is good, but the X moves as it happens
  — "if you want to click on the burger and then immediately on the X you have
  to move the cursor a bit."
- **Status:** ✅ Done
- **Cause:** `body.menu-open { overflow: hidden }` removes the scrollbar.
  Where the scrollbar occupies layout — Windows, Linux, macOS set to "Show
  scroll bars: Always" — losing it widens the viewport by ~15px, and every
  `position: fixed` element pinned to the right edge jumps outward with it.
  The burger is one, and it moves at the exact moment it becomes the X.
- **Done:** `useMobileMenu` measures the scrollbar _before_ locking and
  publishes it as `--scrollbar-gap`; `brand.css` spends it on the burger, which
  moves back by exactly that much while locked. The two cancel, so the X stays
  under the cursor.
- **Corrected once, on review:** the first version spent the gap on `.head` and
  `.mobile-menu`, pulling both in by the scrollbar width. That holds the burger
  just as still, but it un-covers a strip of the page exactly where the
  scrollbar was — the panel is meant to be full bleed. Rightly rejected. The
  correction belongs on the icon, not on the boxes; both now keep `right: 0`
  and the test asserts they still span the viewport.
- **Rejected:** `scrollbar-gutter: stable`, the one-line declarative fix, which
  is what I reached for first. It reserves the gutter **even where scrollbars
  overlay**, so it narrowed every page by 15px and failed all 36 parity
  snapshots. The measured gap is 0 on those platforms and does nothing, which
  is the behaviour we want.
- **Note on verification:** headless Chromium forces overlay scrollbars and
  cannot be made to use classic ones, so this bug cannot be reproduced in the
  test environment at all — "does it move?" passes there no matter what. The
  test gates the compensation instead: that the measurement is published, and
  that the rule spending it still outranks the per-page `.head` rules in
  chrome.css. **Worth confirming by hand on a machine with classic
  scrollbars.**

---

## Round 2 — 2026-08-21

Copy and design changes on the home page, plus two that apply site-wide.

### 8. Our Work: stack the heading and subheading

- **Page:** `/` (home)
- **Asked:** "can we make the our work heading and the subheading one on top of
  the other not one in the left and one in the right it doesn't look good."
  New copy supplied.
- **Status:** ✅ Done
- **Done:** `.svc-head` was a two-column split — eyebrow left, paragraph right.
  It stacks now, so the paragraph reads as belonging to the heading above it.
  Copy replaced with: "Curated touch points and distinct design elements are
  essential for every guest's journey. At Finer Things, this is where your
  story begins."

### 9. New service descriptions

- **Page:** `/` (home)
- **Status:** ✅ Done
- **Done:** all three replaced verbatim —
  - Bespoke Accessories: "Design and production of bespoke accessories, the
    finer things guests can see, touch and feel."
  - Styling & Curation: "Styling and curation that give spaces character and
    soul."
  - Finer Living: "Finer Living — the ready-made collection of European-crafted
    pieces."
- **Note:** these are the home page's summaries only. The service pages
  themselves still carry their own longer descriptions — say the word if those
  should follow.

### 10. Featured / Selected work: new subheading, and lose the rule

- **Page:** `/` (home)
- **Asked:** a new subheading, and "the line between the text in this section
  and the actual project there is a line remove it".
- **Read as:** the supplied text arrived merged with the existing sentence
  ("…hotels and residences fromMove through elected projects…"), so it was
  checked rather than guessed at. Confirmed: the new sentence leads and the
  existing one follows.
- **Status:** ✅ Done
- **Done:** subheading now reads "Discover our best work across the world's
  finest hotels and residences. Move through selected projects as an editorial
  sequence—each chapter revealing its atmosphere, objects and material
  character." The hairline was `border-top` on the filmstrip; it is gone.

### 11. Headlines in one colour — whole website

- **Page:** every page
- **Asked:** "make the headlines in one color, they do not like it
  multicolors."
- **Read as:** checked — the tint removed entirely rather than unified to a
  single accent. Confirmed.
- **Status:** ✅ Done
- **Done:** every page tinted the italic half of its headlines with an accent:
  oxblood on home and about, brass in the home break, salmon on the project
  stories. Three accents across one site read as multicoloured rather than
  considered. The italic now carries the emphasis on its own and the headline
  is a single colour.
- **Note:** one rule in `brand.css`, not eleven edits across the page
  stylesheets — so a new page inherits the policy instead of having to
  remember it. It uses `!important` deliberately; the reason is recorded
  beside it.

### 12. Behind Finer Things

- **Page:** `/` (home)
- **Asked:** drop the closing "Inspired, always, by family", and caption the
  portrait "Malika and Alex" rather than the other way round.
- **Status:** ✅ Done
- **Done:** both. The caption order now matches left-to-right in the
  photograph, and the image's alt text was flipped to match.
- **Note:** the paragraph above still reads "founded by Alex and Malika". That
  was not part of the comment so it is untouched — flag it if it should follow
  the caption.

### 13. Final CTA: drop the first heading

- **Page:** `/` (home)
- **Asked:** "remove the first heading that says start a project."
- **Read as:** the small eyebrow above "Let's tell your story.", not the button
  of the same name at the foot of the section.
- **Status:** ✅ Done

### 14. The footer carries the logo, not the words — whole website

- **Page:** every page with a footer
- **Asked:** "in the footer in the whole website instead of Finer Things use
  their logo."
- **Status:** ✅ Done
- **Done:** one `FooterBrand` component, used by all four footer shapes.
- **Note:** the only logo asset is dark artwork and every footer is dark, so
  the mark is painted as a CSS mask in `currentColor` rather than dropped in as
  an image. It takes each footer's own ink, and there is no second inverted
  copy of the file to keep in sync. Privacy and Terms have no footer brand at
  all, so they are unaffected.

### Parity consequence of this round

Comments 11 and 14 are site-wide, so ten of the twelve pages have now
deliberately diverged from the legacy documents. Following
[PARITY.md](PARITY.md#changing-the-design-on-purpose): each diff was reviewed
first — they showed the recoloured headline halves and the footer mark, and
nothing else — and those pages then moved to `baseline: 'current'`. They are
protected against regression from here, rather than against the original.

**Privacy and Terms carry neither change and stay verified against `legacy/`.**

---

## Round 3 — 2026-08-21

What we do and About, largely rebuilt. See the commit for detail.

### 15. Rebuild the What we do page

- **Page:** `/our-work`
- **Asked:** new hero copy, new service descriptions, no CTA on the rows, and
  three new sections: materials, the details, and the process.
- **Status:** ✅ Done
- **Note:** the client's own materials page lists seven materials, not five.
  Exclusive Styles and Stitching moved to "The details" as asked, leaving five,
  so the sixth card repeats Marble to fill two rows of three. It carries a
  `placeholder` flag so it cannot ship unnoticed. Two errors on their page were
  not carried over: the shells entry ends "the natural elegance of these
  precious metals", which belongs to metal, and the colour list reads "azure
  and, sienna".

### 16. Meet the founder, and remove Two perspectives

- **Page:** `/about`
- **Status:** ✅ Done
- **Done:** Alex's own words, with his photograph taken from their live site.
  It replaces both the old "Our story" and the Alex experience block, which
  said the same thing twice once the new copy landed. A co-founder section for
  Malika follows with placeholder copy and a labelled panel in the exact shape
  her portrait will take.

### 17. One CTA for the whole site

- **Asked:** "the CTA section should be the same all over the website."
- **Status:** ✅ Done — `shared/layout/SiteCta.tsx`, nine pages.
- **Note:** Contact is excluded deliberately. Its closing is a "Stay connected"
  panel, and a "Start a project" button pointing at `/contact` from `/contact`
  goes nowhere.

### 18. Highlighted words

- **Asked:** highlight `narrative`, `story` and `family`.
- **Status:** ✅ Done, but not as asked.
- **Note:** this pulled against comment 11, one colour for headlines, because
  colour was the only thing `em` did. Italic could not replace it: the site
  ships one upright file per family with `font-synthesis: none`, so
  `font-style: italic` renders identically to regular text. The emphasis is a
  hairline underline instead. **This is a judgment call and worth confirming
  with the client.**

---

## Round 4 — 2026-08-24 to 27

Layout and polish, plus one page rebuilt speculatively.

### 19. No heading may run to four lines

- **Asked:** headings must not stack four and five lines deep; make better use
  of the space.
- **Status:** ✅ Done
- **Done:** audited every `h1`, `h2` and `h3` on all twelve pages by measuring
  rendered height against line height, at three widths. Desktop and tablet went
  from five offenders to **zero**; mobile from six to one.
- **Note:** the remaining one is the home purpose statement at 144 characters.
  Three lines on a 390px screen would need type smaller than the body copy
  beside it. Shortening the copy is the only real fix.

### 20. Section heads stack

- **Asked:** "do not make the heading in the left and the subheading in the
  right."
- **Status:** ✅ Done
- **Note:** the two-column split was also the main cause of comment 19. Fixing
  the alignment fixed most of the wrapping in the same move.

### 21. The home statement holds the screen

- **Asked:** sections two and three read as incoherent and the statement
  carried no weight. The client suggested full height with a scroll-stop.
- **Status:** ✅ Done
- **Done:** the section runs two viewports and pins while it is read, the same
  device the filmstrip uses. The words arrive as the page is scrolled rather
  than on a timer.
- **Note:** the weight had been lost by my own doing, cutting the type from
  61px to 49px to satisfy comment 19. It is back to 58px. A wider measure was
  built first and reverted: it bought more size but left the statement starting
  110px left of everything beneath it.

### 22. The hero CTA takes too much focus

- **Asked:** the client suggested an italic text link instead.
- **Status:** ✅ Done, outlined rather than italic.
- **Note:** an italic link cannot be built, for the reason in comment 18. It
  would have been plain roman prose. Outlined keeps the border and padding that
  make a control read as a control, and gives the photography back its first
  frame.

### 23. "Our Work" becomes "What we do"

- **Status:** ✅ Done, in the interface only.
- **Note:** the routes are unchanged, deliberately. The three row eyebrows were
  dropped: they already said "What we do", so with the page renamed the phrase
  would have appeared five times on one screen.

### 24. The projects page, reimagined

- **Asked:** the client dislikes `/projects` and pointed at the Style With Us
  page on their own site, wanting it "chicer and more luxurious". Asked for it
  on a separate route until approved.
- **Status:** 🤔 Awaiting the client
- **Done:** `/project-new`. A composed wall of photographs with credits on
  hover, a single-screen hero, and the shared CTA. `/projects` is untouched;
  reverting the commit removes it entirely.
- **Note:** their reference page is thirty-one identical tiles with no
  headline, no captions and no call to action. What works about it is that you
  land straight in the work; what makes it read cheap is the flatness and the
  missing credit. This keeps the first and fixes the second. We hold nineteen
  images against their thirty-one, and the format lives on density.

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
