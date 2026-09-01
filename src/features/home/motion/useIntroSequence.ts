'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Timings of the opening title card, in milliseconds.
 *
 * The hold and the handoff are the brand's, restored after being shortened by
 * mistake: the cover is meant to be a deliberate pause on the wordmark, not
 * something to get past.
 *
 * The failsafe is the one number that is not original. It was 5600ms measured
 * from navigation, while the hold is measured from `load`, so on any
 * connection slower than a fast one the backstop reached `begin` first and
 * became the timing every visitor saw. A backstop that fires on the happy
 * path is not a backstop. At 9000ms it sits clear of the normal path and does
 * nothing unless `load` genuinely never arrives.
 */
const INTRO = {
  /** How long the cover holds before it begins to lift. */
  hold: 3800,
  /** Gap between the handoff starting and the hero revealing. */
  handoff: 520,
  /** Hard backstop if `load` never fires (cached media, blocked request). */
  failSafe: 9000,
} as const;

/**
 * The opening cover lift.
 *
 * Two timers race deliberately: the normal one starts after `load`, and the
 * backstop fires regardless. A visitor must never be left staring at a cover
 * that failed to lift because one image never resolved.
 */
export function useIntroSequence(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const cover = element.querySelector<HTMLElement>('#cover');
    const hero = element.querySelector<HTMLElement>('#hero');
    if (!cover || !hero) return;

    const timers: number[] = [];

    const begin = () => {
      if (hero.classList.contains('reveal')) return;
      cover.classList.add('handoff');
      timers.push(
        window.setTimeout(() => {
          cover.classList.add('lift');
          hero.classList.add('reveal');
        }, INTRO.handoff),
      );
    };

    /*
     * The hold starts on `load`.
     *
     * Gating it on the hero's own images instead was tried and reverted: the
     * collage renders its strip twice and both passes are eager, so waiting on
     * "the first four" waited on more bytes than `load` did, and the reveal
     * went from 2.4s to 3.7s on a fast connection. Measured both ways.
     */
    const onLoad = () => timers.push(window.setTimeout(begin, INTRO.hold));

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);

    timers.push(window.setTimeout(begin, INTRO.failSafe));

    return () => {
      window.removeEventListener('load', onLoad);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [root]);
}
