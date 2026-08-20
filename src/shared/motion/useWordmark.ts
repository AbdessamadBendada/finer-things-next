'use client';

import { useEffect, useState } from 'react';

import { clamp01 } from './useScrollDriver';

/** Scroll distance over which the wordmark shrinks into the header, in pixels. */
const TRAVEL = 520;

/**
 * The oversized wordmark that shrinks into the masthead logo as you scroll,
 * and hands off to it.
 *
 * Lives in the header rather than the page because it *is* header behaviour:
 * it returns whether the masthead should be showing yet. The wordmark element
 * itself is a fixed-position element in the page body, so it is looked up in
 * the document — the header is not an ancestor of it.
 *
 * Inert unless `enabled`, which only the home masthead sets.
 */
export function useWordmark(enabled: boolean) {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const word = document.querySelector<HTMLElement>('#word');
    if (!word) return;

    /**
     * Starting width of the wordmark, before it shrinks into the masthead.
     *
     * 28% on desktop — reduced from 70% after review: the mark dominated the
     * photography. It still shrinks to the ~161px header logo, a 2.4x change,
     * so the hand-off remains legible.
     *
     * Narrow screens keep a much larger share, because 28% of a phone is
     * smaller than the header logo it is shrinking *into* — the animation
     * would run backwards.
     */
    const startWidth = () =>
      window.innerWidth <= 860 ? window.innerWidth * 0.65 : window.innerWidth * 0.28;

    let start = startWidth();

    const update = () => {
      const progress = clamp01(window.scrollY / TRAVEL);
      const eased = 1 - Math.pow(1 - progress, 3);
      const target = document.querySelector('.head .logo')?.getBoundingClientRect().width ?? 0;

      word.style.width = `${start + (target - start) * eased}px`;
      word.classList.toggle('hide', progress >= 0.98);
      setHeaderVisible(window.scrollY > TRAVEL * 0.92);
    };

    const remeasure = () => {
      start = startWidth();
      update();
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', remeasure);
    remeasure();

    // The target width depends on the logo's rendered font, so re-measure once
    // webfonts have settled and again after late layout shifts.
    const timers = [window.setTimeout(remeasure, 700), window.setTimeout(remeasure, 2400)];
    document.fonts?.ready.then(remeasure).catch(() => undefined);
    window.addEventListener('load', remeasure);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('load', remeasure);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [enabled]);

  return headerVisible;
}
