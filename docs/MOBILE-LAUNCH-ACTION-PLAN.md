# Mobile launch action plan

Audit date: **2026-08-31**

This is the implementation queue for making the site launch-ready on mobile.
It is based on production-build measurements across all 13 routes at 320x568,
375x667, 390x844 and 844x390. It does not authorize a visual redesign: review
each deliberate design change against the parity baseline.

## Implementation status

**Codex change — 2026-09-05:** the newsletter popup was removed by client
request. Its earlier measurements remain below as historical implementation
notes, but it is no longer part of the live MOB-01 surface or regression suite.
The remaining text-entry controls are the Contact fields and shared footer
newsletter input. The physical-iPhone check in both orientations stays open.

**Codex change — 2026-09-04:** the browser/code half of MOB-01 is complete
after a landscape follow-up. The original 560px ceiling covered portrait
phones but not an 844px or 926px landscape iPhone, so it did not satisfy the
real-device acceptance criterion. The form-control-only ceiling is now 1024px.
A production build computes the Contact name, email and message controls, the
shared footer newsletter input and the newsletter popup input at exactly
`16px` at 320x844, 390x844, 560x844, 844x390, 926x428 and 744x1133. At 1025px
and desktop widths, their approved sizes remain unchanged. The Contact
landscape/tablet line box preserves the approved layout height. Automated
checks cover all three control groups throughout that matrix. The 12 reviewed
mobile baselines from the portrait pass and the 12 reviewed tablet baselines
from the landscape pass were deliberately regenerated; desktop was untouched.
A physical-iPhone focus check in both orientations is still required before
MOB-01 can close.

**Codex change — 2026-08-31:** the low-risk launch subset is implemented.
The burger and header logo now expose 44px hit areas without changing their
layout footprint; fixed chrome and the full-screen menu account for safe-area
insets; short-landscape menus and heroes remain usable; the Home newsletter
uses 16px input text; and Home now limits critical image work while warming
service images before reveal. Automated mobile and masthead checks cover these
behaviors, and the unchanged legacy screenshots pass at every route and
viewport.

The remaining items require either an approved visual change or real-device /
deployed-preview evidence. Form-control typography is now implemented under
MOB-01, but its physical-iPhone check remains. Page-content targets under
MOB-02 and MOB-04 are still deferred. Before launch, test focus zoom and safe
areas on a physical iPhone in both orientations, inspect an Android device,
and record deployed mobile LCP before deciding whether to approve those design
changes.

## Current baseline

- All audited routes return 200.
- No route has horizontal overflow at the tested widths.
- No broken images, failed requests or browser console errors were found.
- Viewport metadata is correct.
- The menu locks background scroll, traps and restores focus, closes with
  Escape and remains scrollable in short landscape.
- Responsive image dimensions, reduced-motion handling and mobile layout
  breakpoints are already present.

## P1: complete before launch

### MOB-01: Prevent iOS form-focus zoom

**Status: code complete; physical-iPhone confirmation outstanding.**

- [x] Set visible text-entry controls to at least `16px` through 1024px. A
      production build confirms `16px` at 320x844, 390x844, 560x844, 844x390,
      926x428 and 744x1133 for Contact and the shared footer newsletter. The
      1024px ceiling is intentional: a 560px ceiling misses landscape iPhones.
      `pointer: coarse` is deliberately not used because the parity and mobile
      harnesses do not emulate touch.
- [x] Keep desktop typography unchanged and preserve pinch zoom. No
      `maximum-scale` restriction was added.
- [ ] Focus every field on a physical iPhone in both orientations and confirm
      Safari does not zoom.
- Files:
  - `src/features/contact/styles/contact.module.css`
  - `src/shared/styles/brand.css`
  - `tests/visual/mobile-readiness.spec.ts`
- Existing but unchanged: `src/features/home/styles/home.module.css` already
  carries the original 16px Home-page rule. The live footer now needs the
  shared rule above because it renders outside that page wrapper.
- Acceptance:
  - All visible text-entry controls compute to at least `16px` at widths up to
    1024px.
  - Focusing every field on a physical iPhone in both orientations does not
    zoom the page.
  - Contact and newsletter form tests still pass.

### MOB-02: Enlarge primary touch targets

**Newer control to include when MOB-02 resumes:** the consent checkbox added in
`ae7141a` measures `15x15px` throughout the MOB-01 portrait, landscape and
tablet matrix. It remains native and was measured but deliberately not resized
during MOB-01.

- Give interactive controls at least a `44x44px` hit area without necessarily
  enlarging their visible artwork.
- Fix the site-wide `34x34px` burger first, followed by the header logo,
  Contact submit control, Contact interest options, project links, legal index
  links and footer links.
- Work in:
  - `src/shared/styles/brand.css`
  - `src/shared/styles/chrome.css`
  - `src/features/contact/styles/contact.module.css`
  - `src/features/legal/styles/privacy.module.css`
  - `src/features/legal/styles/terms.module.css`
  - relevant project stylesheets
- Acceptance:
  - Automated measurement finds no primary control below `44x44px`.
  - Adjacent hit areas do not overlap.
  - The burger remains optically aligned before, during and after opening.

### MOB-03: Reduce Home's eager image work

- Keep eager/preload behavior only for the actual LCP candidate and images
  genuinely visible in the first viewport.
- The 390px audit measured 31 image elements, 22 initial image requests and 17
  eager images on Home. Representative inner pages made 1 to 9 initial image
  requests.
- Preserve the existing fix for reveal/hover images: prefetch them shortly
  before interaction or reveal rather than allowing an empty animation.
- Work in:
  - `src/features/home/ui/HomePage.tsx`
  - `src/features/home/ui/HeroCollage.tsx`
  - `src/shared/ui/Media.tsx` only if the shared contract genuinely changes
- Acceptance:
  - Only the LCP image and immediately visible supporting images are eager.
  - Slow-network testing never reveals an empty image.
  - Mobile LCP is measured on the deployed preview and recorded before/after.
  - All visual parity checks pass.

## P2: complete if launch time permits

### MOB-04: Raise essential small text

- Increase instructional, actionable and meaningful metadata text that
  currently renders between `8.8px` and `10.9px`.
- Prioritize buttons, scroll instructions, project links, form privacy copy and
  meaningful gallery captions. Decorative counters can remain secondary but
  must stay legible.
- Avoid a blanket global increase: page modules load after shared styles and
  the approved hierarchy differs by component.
- Acceptance:
  - Essential instructions and actions are at least `12px`, preferably
    `14px` where space permits.
  - Test at 320px and with browser text enlarged to 200%.

### MOB-05: Support notched-device safe areas

- Add `env(safe-area-inset-top)`, `env(safe-area-inset-right)` and matching
  bottom/left handling to the fixed header and full-screen menu where needed.
- Keep the current visual padding as the minimum using `max()` or `calc()`.
- Acceptance:
  - Header, burger, logo and menu links clear the notch and home indicator on
    portrait and landscape iPhones.
  - Edge-to-edge backgrounds still cover the viewport.

### MOB-06: Polish short landscape layouts

- Add height-aware rules for short viewports where the menu reaches 755px and
  service heroes retain a 680px minimum height.
- Reduce vertical padding/type only where height is constrained; do not add a
  second navigation.
- Acceptance:
  - At 844x390, the first menu item and close button are immediately reachable
    and the last item is reachable by scrolling.
  - Hero copy is readable without clipping or overlapping the masthead.

## Verification sequence

1. Run focused form and masthead tests while iterating.
2. Run automated measurements at all four audited viewports.
3. Inspect Home, Contact, one service page and one project page on a physical
   iPhone and Android device.
4. Run `pnpm verify`.
5. Review parity diffs visually; never raise the allowed pixel ratio.

## Reference standards

- [Next.js Image component](https://nextjs.org/docs/app/api-reference/components/image)
- [web.dev responsive design](https://web.dev/learn/design/)
- [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG text resizing](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
