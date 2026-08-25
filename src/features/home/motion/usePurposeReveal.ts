'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';

import { clamp01, prefersReducedMotion, useScrollDriver } from '@/shared/motion';

/** Below this the section is full height but does not pin, so nor does the reveal. */
const PIN_QUERY = '(min-width: 861px)';

/**
 * Fraction of the pin over which the words arrive. The rest is the hold: the
 * finished sentence stays on screen for a moment before the page moves on,
 * which is the point of pinning it at all.
 */
const REVEAL_THROUGH = 0.62;

/**
 * Reveals the purpose statement a word at a time, paced by scrolling.
 *
 * `useWordReveal` has already split the heading into per-word masks and would
 * reveal them all at once on a timer when the heading intersects. Here the
 * reader's own scrolling performs the sentence instead: the section is three
 * viewports tall with a sticky inner, and each word arrives as the pin is
 * scrolled through.
 *
 * Fail-open, which the house rule requires of anything that starts hidden:
 *
 *   - without JavaScript the words are never split, so the heading is just
 *     text and nothing can hide it;
 *   - with reduced motion, or on a phone where the section does not pin, this
 *     never arms and `useWordReveal`'s ordinary reveal applies;
 *   - the class that hides the words is added by the same effect that installs
 *     the driver, so the words cannot be hidden by a driver that failed to
 *     start.
 */
export function usePurposeReveal(root: RefObject<HTMLElement | null>) {
  const words = useRef<HTMLElement[]>([]);
  const armed = useRef(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (prefersReducedMotion()) return;

    const heading = element.querySelector<HTMLElement>('#purpose-title');
    if (!heading) return;

    const query = window.matchMedia(PIN_QUERY);

    const arm = () => {
      // Split by useWordReveal in an earlier effect. If it has not run, leave
      // the heading alone rather than hiding text that nothing will reveal.
      const found = [...heading.querySelectorAll<HTMLElement>('.reveal-word')];
      if (!found.length) return;

      words.current = found;
      armed.current = true;
      heading.classList.add('scroll-reveal');
    };

    const disarm = () => {
      armed.current = false;
      heading.classList.remove('scroll-reveal');
      words.current.forEach((word) => word.classList.remove('is-in'));
      words.current = [];
    };

    const sync = () => (query.matches ? arm() : disarm());

    sync();
    query.addEventListener('change', sync);

    return () => {
      query.removeEventListener('change', sync);
      disarm();
    };
  }, [root]);

  const update = useCallback((element: HTMLElement) => {
    if (!armed.current) return;

    const section = element.querySelector<HTMLElement>('#purpose');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    // Before the pin, 0. After it, 1. Guard the degenerate case where the
    // section is not taller than the viewport and there is nothing to travel.
    const progress = travel > 0 ? clamp01(-rect.top / travel) : rect.top <= 0 ? 1 : 0;

    const shown = Math.round(clamp01(progress / REVEAL_THROUGH) * words.current.length);
    words.current.forEach((word, index) => word.classList.toggle('is-in', index < shown));
  }, []);

  useScrollDriver(root, update);
}
