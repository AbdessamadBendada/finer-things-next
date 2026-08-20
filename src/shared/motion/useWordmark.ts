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

    // Mobile gives the wordmark the full width minus the gutter; desktop 70%.
    const startWidth = () =>
      window.innerWidth <= 860 ? window.innerWidth - 44 : window.innerWidth * 0.7;

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
