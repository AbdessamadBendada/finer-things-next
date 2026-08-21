'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Fail-open motion watchdog.
 *
 * The pages intentionally begin many elements clipped or transparent and let
 * observers reveal them. If one of those observers never fires — a script
 * error, a restored scroll position, an unusual browser — the section must not
 * stay visually empty. Anything that reaches the viewport gets a generous
 * grace period for its designed animation and is then revealed regardless.
 *
 * Ported from legacy/study-shared.js; it is the reason a motion bug can
 * degrade the site's polish but never its content.
 */
const GRACE_PERIOD = 2200;

/**
 * How much of an element must be on screen before the watchdog will arm for
 * it. Matches the threshold the real reveal observers use, and that is the
 * whole point: the fallback must never be able to fire *before* the animation
 * it is backstopping.
 */
const VISIBLE_RATIO = 0.3;

/**
 * The previous test armed anything within 180px of the fold — ported from
 * `legacy/study-shared.js`, which the inner pages used.
 *
 * That made the watchdog a second, competing trigger rather than a fallback.
 * The home page's purpose statement sits ~108px below the fold at rest, so on
 * every load it armed while off screen and force-revealed itself 2.2s later —
 * the whole word-by-word animation played out before the reader had scrolled
 * anywhere near it. The reference document has no watchdog at all; its
 * statement is driven purely by an IntersectionObserver.
 *
 * So: require the element to be as visible as its own observer would demand.
 * Content you can actually see still never stays blank, and content you
 * cannot see is left for the animation that was designed for it. An element
 * taller than the viewport is measured against the viewport instead, since it
 * can never show 30% of itself.
 */
function isVisibleEnough(target: HTMLElement): boolean {
  const rect = target.getBoundingClientRect();
  const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
  if (visible <= 0) return false;

  const reference = Math.min(rect.height, window.innerHeight);
  return reference <= 0 || visible / reference >= VISIBLE_RATIO;
}

const GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  [
    '.rise, .place, .shot, .story-figure, .story-small, .story-detail, .experience-image, .world-image, .person, .principle, .family-editorial-portrait, .title-mask',
    ['in'],
  ],
  ['.service, .chapter', ['in-view']],
  ['[data-word-reveal]', ['words-in']],
  ['.steps', ['line-in']],
  ['.svc-row', ['luxury-in']],
  ['.filmstrip-scroll', ['entered', 'settled']],
];

export function useFailOpenReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const pending = new WeakSet<Element>();
    const timers: number[] = [];
    let queued = false;
    let frame = 0;

    const check = () => {
      queued = false;

      for (const [selector, classes] of GROUPS) {
        element.querySelectorAll<HTMLElement>(selector).forEach((target) => {
          if (classes.every((name) => target.classList.contains(name))) return;
          if (pending.has(target)) return;

          if (!isVisibleEnough(target)) return;

          pending.add(target);
          timers.push(
            window.setTimeout(
              () => classes.forEach((name) => target.classList.add(name)),
              GRACE_PERIOD,
            ),
          );
        });
      }
    };

    const queue = () => {
      if (queued) return;
      queued = true;
      frame = window.requestAnimationFrame(check);
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    queue();

    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [root]);
}
