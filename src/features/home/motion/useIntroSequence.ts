'use client';

import { useEffect, type RefObject } from 'react';

/** Timings of the opening title card, in milliseconds. */
const INTRO = {
  /** How long the cover holds before it begins to lift. */
  hold: 3800,
  /** Gap between the handoff starting and the hero revealing. */
  handoff: 520,
  /** Hard backstop if `load` never fires (cached media, blocked request). */
  failSafe: 5600,
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
