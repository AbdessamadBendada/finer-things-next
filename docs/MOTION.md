# Motion

The site's character is in its motion, so this layer is treated as load-bearing
rather than decorative. It is hand-written hooks over CSS keyframes — no
animation library, and therefore no bundle cost beyond the hooks themselves.

## How it works

Elements start hidden in CSS (`opacity: 0`, clipped, translated). An
IntersectionObserver adds a class when they scroll into view, and the CSS
transition does the rest. Scroll-linked effects write CSS custom properties
from a rAF loop; the stylesheet decides what to do with them.

## The primitives

| Hook                             | Purpose                                                              |
| -------------------------------- | -------------------------------------------------------------------- |
| `usePageRoot()`                  | Root ref + `body.ready` + fail-open watchdog. Every shell uses this. |
| `useReveal(root, opts)`          | `.rise` elements reveal once, with sibling stagger                   |
| `useRevealClass(root, sel, cls)` | Adds a class while elements are in view                              |
| `useWordReveal(root, opts)`      | Splits headings into per-word masks and reveals them                 |
| `useScrollDriver(root, fn)`      | rAF-throttled scroll/resize loop, reduced-motion aware               |
| `useScrollHeader(threshold)`     | Header `scrolled` state                                              |
| `useMobileMenu(ref)`             | Menu open state and the body scroll lock                             |
| `useServiceIndexMotion(root)`    | The shared index-page choreography                                   |

Helpers: `viewportProgress`, `clamp01`, `setDrift`, `driftAll`.

## Two rules that are not optional

**1. Reduced motion is honoured everywhere.** `prefersReducedMotion()` is
checked inside the primitives, not at call sites. When it is on, elements are
revealed immediately rather than animated, and scroll drivers never attach.
Content is never gated behind an animation someone has asked not to see.

**2. Motion fails open.** `useFailOpenReveal` watches every element that starts
hidden. If an observer never fires — a script error, a restored scroll
position, an unusual browser — the element is revealed anyway after 2.2s. A
motion bug can cost polish; it must never cost content.

This is also why `body.ready` matters: a large part of the entrance
choreography hangs off `body.ready …` selectors. Without it, heroes render
blank. `usePageRoot` sets it, which is why every shell must use it.

## Composing a page's motion

Page motion lives in `features/*/motion/` and composes primitives:

```ts
export function useAboutMotion(root: RefObject<HTMLElement | null>) {
  useReveal(root, { threshold: 0.14, rootMargin: '0px 0px -6% 0px', stagger: 90 });
  useWordReveal(root);

  const drive = useCallback((element: HTMLElement) => {
    const portrait = element.querySelector<HTMLElement>('.hero-portrait');
    portrait?.style.setProperty('--portrait-shift', `${heroProgress() * 28}px`);
  }, []);

  useScrollDriver(root, drive);
}
```

Where pages shared a script with different constants, they share a hook with
those constants as arguments — `useProjectStoryMotion` (two project stories)
and `useServicePageMotion` (three service pages).

## Why the DOM is queried directly

The reveal system works by adding classes to elements the stylesheet already
targets. Expressing that as React state would mean re-rendering large subtrees
on scroll and rewriting the CSS to match, for no visual gain and a real
performance cost. The hooks scope every query to the page root, so they never
reach across the document.

The exceptions are genuinely stateful: the mobile menu and the home page's
masthead visibility are React state, because they are UI state rather than
scroll position. Both live in `SiteHeader` — the masthead hand-off is header
behaviour, so the header owns it rather than being told about it from the
page.

## Adding motion

1. Reach for a primitive first.
2. If two pages need the same new behaviour, it goes in `shared/motion`.
3. Anything that starts hidden must be covered by the fail-open watchdog —
   add its selector to the `GROUPS` table in `useFailOpenReveal.ts`.
4. Check it with reduced motion enabled before you call it done.
