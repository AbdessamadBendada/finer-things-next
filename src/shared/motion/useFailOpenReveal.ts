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
      const leeway = Math.min(180, window.innerHeight * 0.2);

      for (const [selector, classes] of GROUPS) {
        element.querySelectorAll<HTMLElement>(selector).forEach((target) => {
          if (classes.every((name) => target.classList.contains(name))) return;
          if (pending.has(target)) return;

          const rect = target.getBoundingClientRect();
          const offscreen = rect.bottom < -leeway || rect.top > window.innerHeight + leeway;
          if (offscreen) return;

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
