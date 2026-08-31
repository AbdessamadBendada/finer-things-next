'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Timings of the opening title card, in milliseconds.
 *
 * The hold was 3800ms on top of `load`, with a 5600ms backstop, which put the
 * hero 5.4 seconds away on a normal connection. Measured, and reported as
 * images being slow: they were not, every image arrived inside a second. The
 * wait was this.
 *
 * 1600ms is long enough for the wordmark to register as a deliberate opening
 * and short enough that nobody thinks the page has failed. A returning
 * visitor sees it on every single visit, which is the case the old number
 * ignored.
 */
const INTRO = {
  /** How long the cover holds before it begins to lift. */
  hold: 1600,
  /** Gap between the handoff starting and the hero revealing. */
  handoff: 420,
  /**
   * Hard backstop if `load` never fires (cached media, blocked request).
   *
   * Measured from navigation, not from `load`, so it has to clear the point
   * at which the normal path would have finished or it wins the race and
   * becomes the timing everyone sees. `load` lands near 1s on a 4Mbps
   * connection, so the normal reveal is around 2.6s and this sits well past
   * it, doing nothing unless something has genuinely gone wrong.
   */
  failSafe: 6000,
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
