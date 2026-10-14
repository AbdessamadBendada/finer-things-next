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
- **Status:** ✅ Approved and adopted
- **Done:** the gallery is now `/projects` itself: a composed wall of
  photographs with credits on hover, a single-screen hero, and the shared CTA.
  The editorial index it replaced has been deleted, and the temporary
  comparison route with it. Both are in git history if ever wanted back.
- **Note:** their reference page is thirty-one identical tiles with no
  headline, no captions and no call to action. What works about it is that you
  land straight in the work; what makes it read cheap is the flatness and the
  missing credit. This keeps the first and fixes the second. We hold nineteen
  images against their thirty-one, and the format lives on density.

---

## Round 5 — 2026-09-08

### 25. Remove the Home "Our story" section

- **Page:** `/` (home)
- **Asked:** "Our story section in the home page should be removed!"
- **Read as:** remove the Home-only founders section, including its copy,
  portrait and "Meet the family" button. Keep the separate About page and its
  links in the menu and footer.
- **Status:** ✅ Done
- **Done:** the featured filmstrip is followed directly by the shared closing
  CTA. The section markup, every `.family-editorial*` style, its Home `#story`
  overrides, portrait drift, fail-open reveal registration and two obsolete
  visual-test references are gone.
- **Note:** no parity baseline was regenerated. The existing baseline set is
  stale from earlier approved work and all 39 route/viewport combinations were
  already red as documented in the Round 5 brief.

### 26. Remove the featured-card inset photographs

- **Page:** `/` (home)
- **Asked:** "in the featured section there are a big image and a small little
  image stick with it right ? Delete that small image please."
- **Read as:** remove the small rotated photograph pinned to the top-right of
  every featured card. Keep the full-bleed photograph, shade, number, title and
  caption.
- **Status:** ✅ Done
- **Done:** all five `.film-detail` wrappers and their four CSS rules are gone.
  The five main card images and all copy remain.
- **Note:** no image file was deleted. Contrary to the implementation brief,
  the five inset sources do not become unreferenced: all five are also used by
  the Projects gallery content. No parity baseline was regenerated because the
  complete 39-image baseline set is already stale.

### 27. The closing CTA button is filled brand orange

- **Page:** every page with the shared closing CTA (not Contact)
- **Asked:** "the start a project button in the final cta is gonna be a fill
  with the brand orange please"
- **Read as:** the "Start a project" button takes the brand accent as its fill
  instead of near-black, everywhere the shared CTA appears.
- **Status:** ✅ Done
- **Done:** `[data-page]:not([data-page='contact']) .closing .btn` in brand.css
  now fills `var(--clay)` with paper text, hovering to `var(--oxblood)`. Scoped
  to the closing CTA rather than to `.btn` in primitives.css, which is every
  button on the site.
- **Note:** paper on `--clay` measures **3.53:1**, under the 4.5:1 WCAG AA wants
  for text at this button's size (~12px uppercase). The ink fill it replaces was
  far above that, and `--oxblood` measures 6.9:1. Implemented as asked and
  recorded here rather than substituted quietly — if accessibility is raised
  later, `--oxblood` is the accent that passes.

### 28. Split the footer links and add an Imprint page

- **Page:** every page with the shared footer, plus `/imprint`
- **Asked:** "In the footer there is a contact column where there is linked
  contact and pricy .. this is not how it should be we should make the contact
  and make in it LinkedIn and instagram + contact and make a legal column or if
  we can make it bellow the contact column or something in it there will be in
  It privacy and terms and imprints which we didn't create yet, and we should,
  let's create it."
- **Read as:** keep Explore, split the mixed second column into Connect with
  LinkedIn, Instagram and Contact, and Legal with Privacy, Terms and Imprint.
  Build the missing Imprint route in the existing legal-page style.
- **Status:** ✅ Done
- **Done:** the shared footer now renders Explore, Connect and Legal. The new
  `/imprint` route mirrors the legal-page structure, is linked from every
  footer, carries exact metadata and one H1, and is `noindex, follow`.
- **Note:** no company information or social URL was invented. Every required
  Imprint field is visibly labelled as placeholder content under a "Draft
  only." notice, and LinkedIn and Instagram deliberately remain `href="#"`.
  At 390px Legal sits below Explore and Connect; at 768px all three link
  columns sit together below the brand. Only the three new Imprint baselines
  were generated after visual review. The pre-existing 39 baselines remain
  stale and were not replaced.

### 29. Finer Living's kicker names the collection

- **Page:** `/services/finer-living`
- **Asked:** "In the finer living page instead of WHAT WE DO / 03 we need to
  put curated collection."
- **Read as:** replace the linked service-number kicker with plain text reading
  "Curated collection" in the existing eyebrow style.
- **Status:** ✅ Done
- **Done:** the hero kicker now reads "CURATED COLLECTION" and is no longer a
  link. The now-unused `Link` and `ROUTES` imports and the obsolete contextual
  link expectation were removed.
- **Note:** the other two service pages still use "What we do / 01" and "What
  we do / 02", so the three service kickers are now intentionally inconsistent
  pending a client decision. No other service page was changed.

### 30. Use the full artisan wall on Our Work

- **Page:** `/our-work`, with shared implementation used by `/about` and
  `/our-craft`
- **Asked:** "The client wants the SAME gallery that /about has — the large
  multi-image artisan wall. The 3-image strip is removed from the site
  entirely."
- **Read as:** keep the existing Our Work artisan eyebrow, heading and note,
  but replace its three-image strip with the same rotating ten-tile wall used
  on About and Our Craft.
- **Status:** ✅ Done
- **Done:** the byte-identical feature copies of `ArtisanWall` were replaced
  by one shared component used on all three pages. Our Work now renders that
  wall, and the strip component, strip-specific visual test, transition CSS,
  keyframes and parity-freeze selectors were removed.
- **Note:** the task named only three `.artisan-wall` selector groups to extend,
  but every `.artisan-tile` rule was page-scoped too. Our Work was added to all
  of those rules so the shared component actually has the same layout and
  behavior. The requested eyebrow, heading and note still read coherently with
  the larger wall and were not changed.

### 31. Remove the founder experience badge

- **Page:** `/about`
- **Asked:** "delete the div className experience-fact block with the 20+ and
  Years of international hospitality experience. The founder photograph itself
  stays."
- **Read as:** remove only the proof-point badge over Alex's portrait, leaving
  the founder section, portrait and copy unchanged.
- **Status:** ✅ Done
- **Done:** the badge markup and every page-module and brand override for
  `.experience-fact` were removed. Alex's photograph remains in place.
- **Note:** contrary to the task's statement that only the reveal suite would
  break, `tests/visual/about-founders.spec.ts` also explicitly required this
  badge. That stale assertion was removed.

### 32. Remove the global-eye section

- **Page:** `/about`
- **Asked:** "delete the whole section after MEET THE FOUNDER: the comment
  GLOBAL POINT OF VIEW and section className world through its closing section."
- **Read as:** remove the heading, paragraph and all three photographs in that
  section, together with only their now-dead styling and reveal registration.
- **Status:** ✅ Done
- **Done:** the complete `.world` section, its responsive and reduced-motion
  CSS, its reveal test case and its shared fail-open selector were removed. The
  surrounding artisan and principles sections remain.
- **Note:** no parity baseline was regenerated. The existing baseline set was
  already stale across the original 39 route and viewport combinations.

### 33. Link the Finer Living hero to the collection site

- **Page:** `/services/finer-living`
- **Asked:** replace the hero scroll cue with an orange button below the intro
  that opens the Finer Living collection site in a new tab.
- **Read as:** preserve the existing hero copy, stack its lower content, and
  turn "Explore the collection" into an external brand-accent action.
- **Status:** ✅ Done
- **Done:** the non-interactive scroll cue and its page CSS were removed. The
  hero now has an `noopener noreferrer` external button beneath the intro.
- **Note:** one shared `.btn-accent` modifier now provides the requested clay
  fill and oxblood hover/focus state without changing the base button used
  elsewhere on the site.

### 34. Add a Finer Living collection gallery

- **Page:** `/services/finer-living`
- **Asked:** add a responsive image gallery after the manifesto with a centred
  orange "See more" link to the collection site.
- **Read as:** build the gallery from existing local Finer Living assets until
  the client supplies the intended photography.
- **Status:** ✅ Done
- **Done:** a six-image, three-column desktop and two-column small-screen grid
  now sits between the manifesto and materials, followed by the requested
  external action.
- **Note:** all six images are explicitly marked in code as placeholders. They
  are existing, registered stand-ins and must be replaced with the client's own
  photography when it becomes available.

### 35. Move Material character earlier

- **Page:** `/services/finer-living`
- **Asked:** move the complete "Material character" section directly after the
  new gallery.
- **Read as:** change only its position in the page sequence, not its content or
  internal markup.
- **Status:** ✅ Done
- **Done:** the original section now follows the gallery and precedes "Chosen
  for more than appearance." Nothing inside the section changed.

### 36. Remove the Finer Living point-of-view section

- **Page:** `/services/finer-living`
- **Asked:** remove the complete "The Finer Living point of view." section and
  its page CSS.
- **Read as:** delete the process section, its four numbered rows, and every
  style used only by that section on this page.
- **Status:** ✅ Done
- **Done:** the section and its base, responsive and reduced-motion CSS are
  gone. No `#process` link existed, so no link target had to be redirected.

### 37. Rename the Finer Living story heading

- **Page:** `/services/finer-living`
- **Asked:** replace "Three objects. Three expressions of craft." with "From
  first sketch to final unique design."
- **Read as:** change only the story headline and bring the rendered-heading
  test backlog into sync.
- **Status:** ✅ Done
- **Done:** the exact new headline is rendered. It remains three lines at 1440,
  860 and 390 pixels, so the old three-line exemption was rekeyed to the new
  text; the deleted process heading's exemption was removed.

### 38. Make Discover the collection readable

- **Page:** `/services/finer-living`
- **Asked:** add a dark overlay strongest behind the copy instead of changing
  the clay eyebrow colour.
- **Read as:** preserve the established colours and darken the image locally
  until the smallest overlay copy has dependable contrast.
- **Status:** ✅ Done
- **Done:** the project image now has a layered left-and-bottom scrim. Rendered
  pixels directly behind the clay eyebrow measure **5.23:1** at 1440, 860 and
  390 pixels.
- **Note:** the page already had a bottom-only gradient despite the work order
  saying there was no scrim. It measured as low as 1.0:1 and did not protect the
  copy, so it was replaced rather than duplicated.

### 39. Rename and left-align the Contact heading

- **Page:** `/contact`
- **Asked:** replace "Perhaps it begins with a place." with "Contact Finer
  Things", remove the second-line indent, and keep the result within two lines.
- **Read as:** retain the two-mask entrance treatment but make both deliberate
  lines share the same left edge and heading colour.
- **Status:** ✅ Done
- **Done:** the H1 is now "Contact" over "Finer Things" with all obsolete
  second-mask indentation and emphasis rules removed. It measures exactly two
  lines at 1440, 860 and 390 pixels without horizontal overflow.
- **Note:** the unchanged eyebrow immediately above it also says "Contact Finer
  Things", so the same words intentionally appear twice in a row pending any
  further client direction.

---

## Round 6 — 2026-10-09

### 40. Shorten the first service description

- **Page:** `/` (home)
- **Asked:** turn the first service description into "Design and production of
  bespoke accessories to see, touch and feel."
- **Status:** ✅ Done
- **Done:** the `01 / Bespoke Accessories` row description in
  `features/home/ui/HomePage.tsx`. It previously read "...bespoke accessories
  guests can see, touch and feel."
- **Note:** drops the explicit "guests", who are still named in the section
  copy above the rows.

### 41. Set the Home section intros on two lines

- **Page:** `/` (home)
- **Asked:** set the "What we do" paragraph on two lines instead of three, and
  the Featured intro the same way.
- **Read as:** a measure change, not a copy cut: keep both sentences as written
  and widen the column until each falls on two lines.
- **Status:** ✅ Done
- **Done:** two `max-width` overrides in `brand.css`, id-scoped so they beat
  the page module (which loads after `brand.css` and would otherwise win the
  tie). "What we do" goes 44ch to 58ch; the Featured intro 48ch to 84ch.
  Measured two lines at 1440, 1280, 1100, 1024 and 900.
- **Note:** the two are not equivalent. "What we do" is 139 characters and two
  lines arrive at 50ch, so 58ch is comfortable. The Featured intro is 199
  characters and two lines do not arrive until **80ch**, which puts about 99
  characters on a line — well beyond the 55-75 that reads comfortably. The
  honest fix there is shorter copy, which is a client decision. Flagged rather
  than taken.

### 42. Rename the five featured projects

- **Page:** `/` (home)
- **Asked:** rename the filmstrip cards to The Living Room, Private
  Residences, Dining Destinations, Residential Suites and Elegant Residences,
  in that order.
- **Read as:** **wrongly, first time round.** The comment said "bottom right",
  and the bottom-right element is the venue caption ("Marsa Al Arab · Dubai" /
  "Bespoke accessories and styling"); the heading is bottom-left. It was read
  as the headings, on the reasoning that five room names map one-to-one onto
  five cards. The client meant the captions. Corrected below.
- **Status:** ✅ Done
- **Done:** the five `<h3>` headings in the filmstrip now read The Living
  Room, Private Residences, Dining Destinations, Residential Suites and
  Elegant Residences. On being told of the misreading the client chose to
  **keep** those headings and **delete the bottom-right captions entirely**
  rather than move the names across, so all five `<p>` elements are gone from
  `.film-copy`.
- **Note:** consequences of dropping the captions.
  1. The home page no longer names any venue or discipline on these cards.
     "Marsa Al Arab · Dubai", "Osaka · Japan" and the four service lines were
     the only place either appeared in the filmstrip.
  2. `.film-copy` is `display: flex; justify-content: space-between` with one
     child left, so the heading sits left as before. Its `.film-copy p` rules
     in `home.module.css` are now dead, and were left in place rather than
     edited: that file is kept diffable against `legacy/`.
  3. The captions were already `display: none` below 860px, so mobile is
     unchanged by this.
  4. The photograph `alt` text still names Iliana and the Bombay Club, and
     `/projects/marsa-al-arab` plus the page description in
     [SEO-LAUNCH-ACTION-PLAN.md](SEO-LAUNCH-ACTION-PLAN.md) still call these
     spaces by their venue names. Home and the project page now disagree.
  5. Three of the five names are residence or suite words — Private
     Residences, Residential Suites, Elegant Residences — which read as
     similar at a glance in a strip the reader moves through quickly.

### 43. Add a sixth featured card, Exclusive Collections

- **Page:** `/` (home)
- **Asked:** add a sixth image to the filmstrip called Exclusive Collections.
  The client supplied a portrait photograph.
- **Status:** ✅ Done
- **Done:** a sixth `.film-card` with the supplied still, converted to WebP as
  `new-work-exclusive-collections.webp` and registered through
  `pnpm migrate:images`. All six cards renumbered to `/ 06`, and the slider's
  counter total with them.
- **Note:** the shape had to be solved, not just dropped in. The photograph is
  1200x1600 and the card runs 1.75:1, so `object-fit: cover` keeps about
  **43% of the image height**. Centred, that band lands on the wall panelling
  and the framed print above the subject and the card reads as a photograph
  of a wall. The card carries `data-focal="low"` and a matching
  `object-position: center 88%` in `brand.css`, which pulls the band down onto
  the book and its marble stand while leaving a little panelling above them.
  Verified by driving the slider to the last card: 43% visible height,
  `object-position` applied, counter reads `06 / 06`, next arrow disabled.
- **Note:** no code change was needed for the count itself. Both filmstrip
  hooks derive progress, arrow state and bounds from `cards.length`, so the
  strip, rail and arrows took the sixth card without edits. Only the hardcoded
  `/ 05` strings in the markup and two stale comments needed updating.

### 44. A seventh material, in four above a centred three

- **Page:** `/our-work`, Our materials
- **Asked:** make the six materials seven, with the cards a little smaller,
  four on the first row and three centred on the second. Left-align the
  second row instead if centring looks odd. The seventh is marble, using the
  still added to the hero collage.
- **Status:** ✅ Done, centred
- **Done:** Marble added as the seventh card, reusing
  `new-material-marble.webp`. The grid takes `columns={4}` and, above 1200px,
  renders as **eight narrow columns with every card spanning two**, the fifth
  card starting at column 2. That is the only way to centre three under four
  while keeping every card the same width. Measured at 1440: two rows of 4
  and 3, all cards 282px, 152px clear at both ends of the second row.
- **Note:** the cards got smaller on their own. Three columns to four takes
  them from about 412px wide to 282px, so no separate size rule was needed.
  The hover paragraphs were written for the larger card and were checked
  rather than assumed: the longest, Leather at 246 characters, starts 45px
  down a 352px card. Tight, but nothing overflows.
- **Note:** `grid-column: span 2` puts `span 2` in the _start_ slot. Adding a
  bare `grid-column-start: 2` for the fifth card replaced that start and left
  the end auto, so the card rendered one 130px track wide and the row
  decentred. It needs `grid-column: 2 / span 2`. Worth knowing before anyone
  edits this block.
- **Note, needs a decision:** seven cards divide awkwardly below 1200px.
  The grid falls back to three columns (3 + 3 + 1) and then two (2 + 2 + 2 +
  1), leaving a single orphan card on the last row at both. Six used to fill
  those rows evenly. The same eight-column trick could centre those too, if
  the orphan looks wrong.

### 45. Swap four photographs in the artisan wall

- **Page:** `/our-craft`, `/our-work` and `/about` (one shared wall)
- **Asked:** remove four images, supplied as screenshots with crosses drawn
  over them, and add four others supplied as files.
- **Read as:** matched the four crossed thumbnails against a contact sheet of
  the pool rather than by position, since the wall rotates and a screenshot
  does not identify a tile. Removed: `new-artisan-wood-12` (walnut boards),
  `new-artisan-fl-13` (open book, gilt edges), `new-artisan-fl-33` (scalloped
  tile field, checked against its near-twin `fl-29`) and
  `new-artisan-ceramics-29` (clay in a tub).
- **Status:** ✅ Done, with a correction to the brief
- **Done:** the four are out of `ARTISAN_WALL`. Two went in: the workshop door
  and the marble yard. The pool is now **18**.
- **Note:** only two of the four "new" files were new. Compared side by side,
  **"Our Artisans 1" is the same photograph as `new-artisan-glass-26` and
  "Our Artisans 4" is the same as `new-artisan-ft-08`**, both already live in
  the wall. The client had most likely seen them there. Nothing was imported:
  the other two were already on disk among the held-back set, as
  `new-artisan-ft-05` (door) and `new-artisan-fl-62` (marble). So the whole
  change is which images the pool draws from.
- **Note:** the marble yard is one of the phone snapshots the curation note
  describes, and goes in **as supplied on the client's explicit call**. It
  reads as lower quality than the workshop photography beside it. It is also
  the only picture in the wall showing raw material before it is worked.
- **Note:** 18 against 10 tiles still leaves the rotation room to breathe, but
  the pool has to stay comfortably above the tile count or the wall gets
  repetitive. Five unused photographs remain if it needs topping back up:
  `fl-02`, `fl-03`, `fl-38`, `fl-56`, `fl-64`.

### 46. Give the workshop door a tall tile, and keep tall pictures in it

- **Page:** `/our-craft`, `/our-work` and `/about` (one shared wall)
- **Asked:** the door should take two spaces, stacked vertically rather than
  side by side, and the images that rotate through that slot should also be
  tall ones.
- **Status:** ✅ Done
- **Done:** one of the two double-width tiles is now double-height instead,
  and the rotation became shape-aware. The door opens in the tall slot on
  first paint; after that the slot rotates, drawing only from the portrait
  photographs.
- **Note:** the two halves had to be done together. The door was landing in a
  **double-width** tile, which is the worst possible slot for a portrait
  photograph: `object-fit: cover` cropped it to a letterbox showing the
  middle of the doors. Widening the grid alone would not have fixed it,
  because nothing stopped the rotation putting a portrait back in a wide slot
  five seconds later. `useImageRotation` now takes `tileShapes` and
  `imageShapes` and will only place a picture in a slot whose proportions
  suit it.
- **Note:** the tall tile **replaces** a wide one rather than being added.
  The wall has to consume a multiple of four cells or the last row ends in a
  hole: eight square plus one double-wide plus one double-tall is twelve,
  which is three full rows, and the tile count stays at ten.
- **Note:** image shapes are derived from the real pixel dimensions already
  in `IMAGE_REGISTRY`, not hand-listed, so they cannot drift out of step with
  the files. Of the 18 in the pool, 11 are portrait and 7 landscape, so both
  shaped slots have plenty to draw on.
- **Note:** `TILE_SHAPES` in `ArtisanWall.tsx` mirrors the `nth-child` rules
  in `brand.css`. Change one and you must change the other, and re-check the
  cell count.

### 47. Move Marble to the end of the first row

- **Page:** `/our-work`, Our materials
- **Asked:** Marble should sit fourth, closing the first row.
- **Status:** ✅ Done
- **Done:** reordered `MATERIALS`. The array order is the page order, so this
  was a move rather than a layout change. Row one is now Lustrous Leather,
  Wood, Horn, Marble; row two is Lacquer, Resin, Elegant Shells, still
  centred with 152px clear at both ends.
- **Note, needs a decision:** `/our-craft` has its **own copy** of the
  materials content and still shows the original six, in three columns, with
  no Marble. Entry 44 and this one both applied to `/our-work` only, as
  asked, so the two pages now show different material sets in different
  layouts. Worth deciding whether they should match.

### 48. The small grey write-ups are hard to read

- **Page:** `/our-services`, and in the event every page
- **Asked:** "review the small grey write-ups, they are a bit difficult to
  read. Maybe the colour tone needs to be a bit darker or the background
  colour a different one to create more of a contrast."
- **Read as:** darken the type rather than change the background. The paper
  and stone grounds are the brand; the secondary grey is not.
- **Status:** ✅ Done
- **Done:** `--soft` is now `rgba(41,40,31,.78)` inside `main`, up from .66.
  Measured against the paper ground that is **4.62:1 to 6.69:1**. Two
  footnote rules that hardcoded .5 alpha rather than using the token were
  corrected as well.
- **Note:** the client was right, and the numbers are closer than they look.
  At .66 the services copy measured **4.62:1**, which clears WCAG AA for body
  text by 0.12 and no more, at 15.7px. A technical pass and genuinely hard
  work to read.
- **Note:** not a services problem. `tokens.css` sets `--soft` to .72 and
  then nearly every page stylesheet redeclares it at .66, contact at .64.
  The fix is one rule on `main`, which sits inside the element the page
  stylesheets declare the variable on, so it wins by inheritance instead of
  fighting specificity and load order.
- **Note:** two worse cases turned up in the sweep, both hardcoding .5 alpha
  instead of the token. `/about`'s artisan footnote was **2.77:1**, the worst
  on the site; `/our-craft`'s twin on the dark section was 4.40:1. Both now
  pass. Every page checked is clear of AA, worst case 5:1.
- **Note, needs a decision:** the **"Start a project" button fails**, and is
  not fixed here. Paper text on clay `#B56D43` is **3.53:1** against the 4.5
  it needs. Fixing it means either darkening the clay to about `#9C5733`
  (4.83:1) or using the oxblood (7.69:1), and both change a brand colour on
  a button that appears on nine pages. Ink text on the existing clay does not
  help: 3.69:1.
- **Note:** project captions sit over photographs, so their contrast cannot
  be computed from the CSS and is excluded above rather than reported as a
  pass. Judging those needs the actual pixels behind the type.

### 49. Reword the Bespoke Accessories description

- **Page:** `/our-services`
- **Asked:** change the Bespoke Accessories description to "The details that
  define the experience. Every piece is individually designed and produced
  exclusively for one setting".
- **Status:** ✅ Done
- **Done:** the `lede` on the bespoke-accessories entry in
  `services.content.ts`. It was "The details guests touch. Every hanger, tray
  and bill folder individually designed and produced for one property only."
  Two lines at 1440, as before.
- **Note:** a full stop was added at the end. The supplied wording had none
  and the other two service ledes are full sentences; say so if it was meant
  to run without one.
- **Note:** the wording drops the concrete examples, "hanger, tray and bill
  folder", in favour of "every piece", and "property" becomes "setting".
  Worth knowing that those nouns were the only place on the overview page
  that said what the accessories actually are.

### 50. Reword Styling & Curation, and drop florals from its second scope item

- **Page:** `/our-services`
- **Asked:** set the Styling & Curation description to "Books, objects, art
  and decorative pieces sourced through a global network of 100+ artisans and
  thoughtfully arranged to give every space its own distinctive character and
  story", and remove "florals" from the second scope item so it reads "Books,
  objects and art found with...".
- **Status:** ✅ Done
- **Done:** the `lede` and the `02 / Sourcing & selection` note in
  `services.content.ts`.
- **Note:** the new lede is 178 characters against the previous 141, and runs
  to **three lines** where the other two services sit on two. On a 390px
  phone it is six lines against their four. Nothing breaks, but the panel
  rows are no longer the same height when closed.
- **Note, needs a decision:** "florals" is gone from the overview panel but
  survives in nine other places, including the **Styling & Curation detail
  page** itself ("Books, objects, art and florals considered together...",
  and a "Decoration, styling, florals" caption) and the service registry
  entry used for that page's search description. The overview and the detail
  page for the same service now describe it differently. Say the word and
  the rest follow.

### 51. Replace three Finer Living gallery images, and the panel image

- **Page:** `/our-services/finer-living` and `/our-services`
- **Asked:** three images crossed out in the six-image collection gallery,
  with named replacements, and a new photograph for the Finer Living image on
  the services overview.
- **Status:** ✅ Done
- **Done:** gallery positions 1, 2 and 6 now show the oak-stand cloche, the
  red marble footed bowl and the walnut tray. The overview panel shows the
  new cherry-bowl photograph. Four assets converted to WebP and registered.
- **Note:** three of the supplied files were **5906px wide**, two to three
  times anything else in the library and 500 to 700KB each. Re-encoded at
  2400px, which is still ample for a tile that renders at a third of the
  page, and they came down to 150 to 185KB.
- **Note:** the panel points at a **new** asset rather than overwriting
  `new-cover-finer-living.webp`. That file is also the home page service row
  and the detail page's registry image, so replacing it would have changed
  three places when one was asked for. The consequence is that home still
  shows the older cherry-bowl photograph; worth deciding whether it should
  follow.
- **Note, needs a decision:** two of the three removed photographs are
  **still on the same page in larger placements**. The wooden stools
  (`0698_...`) is the page's **hero image**, and the stone samples
  (`0694_...`) is a **full-bleed background** behind the closing section.
  The client crossed them out as thumbnails and may not have realised; if
  they are out, those two placements matter more than the grid did.

### 52. Remove every location caption beneath an image

- **Page:** site-wide
- **Asked:** "go through the whole website and remove all locations
  underneath the images."
- **Read as:** the captions naming a property, city or room beneath a
  photograph. Not every caption: three were left, see below.
- **Status:** ✅ Done
- **Done:** fourteen captions removed across five pages.

  | Page                                | Removed                                                        |
  | ----------------------------------- | -------------------------------------------------------------- |
  | `/projects`                         | the whole tile caption: property, city and space, 20 tiles     |
  | `/projects/marsa-al-arab`           | Lobby, Guest suite, The Bombay Club, Iliana                    |
  | `/projects/waldorf-astoria-osaka`   | Bedside detail, Material contrast, Guest room, Selected detail |
  | `/our-services/bespoke-accessories` | three "Marsa Al Arab / ..." captions                           |
  | `/our-services/styling-curation`    | three venue captions                                           |

- **Note:** the `/projects` caption held **the only link on that page**.
  Removing it would have left the project wall a dead end with no route to
  either project. The whole tile is the link now, with the property and space
  supplying an `aria-label` so the destination is still announced even though
  nothing is printed. Verified: clicking a tile reaches
  `/projects/marsa-al-arab`, and the page went from 18 links to 21.
- **Note:** the dark scrim on the project tiles went with the captions. It
  was painted on the `figcaption` itself rather than a pseudo-element, so
  deleting the element removed the wash too. The photographs are now clean,
  which is the bigger visible change.
- **Note:** two of the Waldorf captions, "Material contrast" and "Selected
  detail", were descriptive rather than locations. They were removed anyway:
  they sit in a four-up gallery with two that were locations, and captioning
  half a row reads as an accident.
- **Note:** three captions **kept**, none of them locations. Contact's "Begin
  a conversation", About's "Malika and Alex", and Finer Living's three
  material labels ("Glass / Cloche" and so on). Say the word if those should
  go too.
- **Note:** place names remain in page headings, hero eyebrows and body copy,
  which are not captions. One stray: the chapter label on
  `/projects/marsa-al-arab` reads "Indian dining · Dubai" where its siblings
  are descriptive ("Arrival · Public space"). Left alone, but it is the one
  remaining location sitting over a photograph.

---

## Round 7 — 2026-10-10

Three comments, all supplying content the build had been waiting for: a
photograph of Malika, the real contact details, and the company registrations.
Between them they clear the oldest placeholder on the site.

### 53. Remove the joint portrait, and give Malika her own

- **Page:** `/about`
- **Asked:** remove the photograph where Alex and Malika appear together.
  Supplied a portrait of Malika, her name as **Malika Yilmaz**, and a revised
  biography.
- **Read as:** the image is out everywhere it appears, not only from the one
  placement that was pointed at. It was on the page twice.
- **Status:** ✅ Done
- **Discussed:** the suggestion was a hero diptych of both founders, then
  both again below. Pushed back on the duplication: the same two files twice
  on one page reads as a shortage of photography, which is the impression to
  avoid while real photography is still the open item. The two portraits also
  disagree tonally — his is warm leather and wood, hers a cool teal curtain
  and a red chair — and the hero's light filter cannot reconcile them where
  the founder sections' heavier one can. Agreed instead: a non-portrait hero,
  and one full section per founder.
- **Done:** hero right half now shows `new-work-detail-01.webp`, the open
  book on a marble stand. Malika's section shows `founder-malika-lahmer.webp`,
  converted from the supplied JPEG. `finer-things-family.webp` is no longer
  referenced. The "Malika and Alex" hero caption went with it, consistent
  with comment 52.
- **Note:** the first choice for the hero was the lit marble alcove
  (`new-work-marsa-shelfs.webp`). A 2:3 image in a tall half-viewport column
  crops to the middle shelf and loses the composition. The book photograph is
  3:4 against a ~4:5 slot and barely crops at all. Aspect ratio decided this,
  not taste.
- **Note:** three crop positions were needed and are commented where they
  sit. Below 860px the hero goes full width and crops to a wide band that
  landed on the framed print rather than the book.
- **Note:** the supplied copy read "until a **every** tells a story"; set as
  "until a **space** tells a story". The new second line also drops "from
  Jumeirah to private residences" for "the most wonderful and loved
  projects", so the only mention of a named hotel in her biography is gone.
  Assumed deliberate.
- **Note:** the surname was flagged as a question rather than applied, and
  shipped as the old "Malika Lahmer" for one build. Wrong call — a name in
  the brief is an instruction, not an open question. Now **Malika Yilmaz**.

### 54. The real contact details

- **Page:** `/contact`, `/imprint`, and the footer
- **Asked:** supplied Alex Lahmer, Founder,
  `alex.lahmer@finerthingsdesigns.com`, two telephone numbers (+43 and +971)
  and the IFZA Business Park address.
- **Status:** ✅ Done
- **Done:** `SITE.contact` replaced wholesale and `placeholder` set to
  `false`. The Contact page shows both numbers as separate `tel:` links; the
  config only had one `phone`, so `phoneAlt` was added.
- **Note:** the placeholder email was `studio@finerthings.com` — not merely
  unconfirmed but on the **wrong domain**. The real one is
  `finerthingsdesigns.com`. It had been feeding the Contact page and the
  footer.
- **Note:** the address is split across `street` and `district` on the
  client's own line breaks, so "DDP" is not orphaned on its own line.
- **Note, needs a decision:** `placeholder: false` no longer describes the
  whole object. **Opening hours** ("Sunday to Thursday, 9am to 6pm GST") and
  the **LinkedIn URL** were never supplied and are still invented. Both are
  now flagged individually as `hoursPlaceholder` and `linkedInPlaceholder`.
  The hours render on `/contact` beside the real address, which is the same
  hazard the wrong address was: nothing announces them as fake and the
  aggregators pick them up.

### 55. The company registrations

- **Page:** `/imprint`
- **Asked:** supplied three entities — Finer Things GmbH (Austria, UID and
  EORI), FINER THINGS DESIGNS FZCO (Dubai free zone, licence and TRN) and
  Finer Things Decoration Materials L.L.C. (Dubai mainland, licence and TRN).
- **Status:** ✅ Done
- **Done:** the imprint is restructured around one section per entity, each
  with its registered address and its numbers. The page previously had four
  generic sections (identity, registered office, registration, tax) written
  when we knew nothing; that shape would have put the Austrian company's name
  in one section and its VAT number two sections below. Data lives in
  `src/features/legal/content/entities.content.ts`.
- **Done:** hero changed from "Legal placeholder / Draft only" to "Legal
  notice / Pending legal review", since five of six sections are no longer
  placeholders.
- **Note, needs a decision:** an imprint normally names the **one** entity
  that operates the website. With three, that is a legal determination and
  not ours to make, so all three are listed as peers. If counsel names the
  operating company it should lead the page.
- **Note:** the mainland address reads "DIGIBIZ **BUSIENSS** CENTER" as
  supplied. Carried through uncorrected: a silently tidied legal address is
  worse than a visibly wrong one. Needs confirming.
- **Note:** both tax numbers were labelled **TNR**; set as **TRN**, the UAE
  term. Labels only, the figures are untouched.

### 56. Remove the main CTA from the home hero

- **Page:** `/`
- **Asked:** remove the hero's call to action.
- **Status:** ✅ Done
- **Done:** the "Let's tell your story" button and its `.cta-wrap` are gone
  from `HomePage.tsx`, with the five CSS rules that could no longer match
  anything (`.hero-copy .cta-wrap` ×3, `.hero-copy .btn` ×2, and the hero half
  of a shared font-size rule). The hero now ends on the subheading.
- **Note:** `/contact` is still reached from home by the shared `SiteCta` at
  the foot of the page and by the masthead, so nothing is orphaned.
- **Note, needs a decision:** comment 4 made the masthead's contact button
  **outlined rather than solid**, and the recorded reason was that "the hero
  already carries a full-size solid CTA lower down the same screen; two solid
  buttons would compete". That reason no longer holds. The first screen now
  has one call to action and it is the quieter treatment. One line in
  `brand.css` makes it solid, if a quieter opening screen was not the point.

### 57. Do not repeat the same artisan photographs across the walls

- **Page:** `/about`, `/our-work`, `/our-craft`
- **Asked:** "just about not to double up images — I believe we have a good
  selection — so that way we can choose some that we do not have yet".
- **Status:** ⏸️ Deferred, waiting on photographs
- **Read as:** each wall gets its own set, with no photograph appearing on
  more than one page.
- **Note:** there are **three** walls, not two. `/about`, `/our-work` and
  `/our-craft` all render the same `<ArtisanWall />` from the same pool, so
  all three show the same photographs.
- **Note, the blocker:** the library does not stretch to it. 27 artisan
  photographs exist, **4 of which the client himself cut** on 2026-10-09
  (`wood-12`, `fl-13`, `fl-33`, `ceramics-29`), leaving **23 usable**. Three
  walls at ten tiles need **30** distinct images before any rotation headroom
  at all. Searched for more and found none: the delivery folder's only
  artisan files are `Our Artisans 1-4`, two of which are pixel-identical to
  photographs already in the wall, and the older `alex-mockups/assets`
  folder is the pre-delivery set — hotel interiors, heroes and product shots,
  no workshops.
- **Note:** options were discussed and the design is approved as it stands, so
  shrinking the wall to six tiles (which would fit three disjoint pools inside 23) was declined. The client is sourcing more photographs. Roughly **15
  more** makes three pools of ten work properly.
- **Note, for whoever picks this up:** do this as one component taking a
  `pool` prop, not as two or three copies of `ArtisanWall.tsx`. `TILE_SHAPES`
  there is manually mirrored by `nth-child` rules in `brand.css` and the two
  must change together; forking the component duplicates that coupling. This
  repository already has `/our-work` and `/our-craft` holding separate copies
  of the materials content and disagreeing as a result (comment 47).

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
- **Privacy and Terms are placeholder text**, `noindex`, excluded from the
  sitemap. Imprint no longer is, as of comment 55, but keeps the same
  `noindex` until counsel has reviewed it.
- **LinkedIn link is `href="#"`**, and the contact form still says "The final
  privacy-policy link will be added before launch."
