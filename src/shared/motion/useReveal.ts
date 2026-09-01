'use client';

import { useEffect, type RefObject } from 'react';

import { observeOnce, observeClass } from './observe';

export type RevealOptions = {
  /** Defaults to the site-wide `.rise` convention. */
  selector?: string;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  /**
   * Milliseconds between siblings revealing. The legacy pages stagger by the
   * element's index among its not-yet-revealed siblings, capped so a long list
   * never trails far behind the scroll.
   */
  stagger?: number;
  staggerCap?: number;
};

/** Reveals `.rise` elements once, with the legacy sibling stagger. */
export function useReveal(
  root: RefObject<HTMLElement | null>,
  {
    selector = '.rise',
    className = 'in',
    /*
     * A fraction of the *element*, so a tall figure has to push far further up
     * the screen than a short one before it counts as visible. On a 750px
     * portrait the old 0.14 meant 105px had to clear the fold, and with the
     * negative rootMargin on top the reveal fired well after the reader could
     * already see it: it read as the trigger having failed.
     *
     * Small enough that anything reaching the fold is treated as arrived,
     * whatever its height.
     */
    threshold = 0.02,
    /*
     * Negative on the bottom edge *shrinks* the trigger area, so an element
     * must come further up the screen before it counts. That is the wrong
     * direction here: the original -6% was part of why reveals felt late.
     *
     * Zero, so an element reveals the moment any part of it reaches the fold.
     * A positive value was tried and is worse: it grows the root box below the
     * viewport, and combined with `threshold` being a fraction of the element
     * it pushed the trigger past the image entirely.
     */
    rootMargin = '0px',
    stagger = 0,
    staggerCap = 4,
  }: RevealOptions = {},
) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const timers: number[] = [];

    const disconnect = observeOnce(element, selector, { threshold, rootMargin }, (target) => {
      if (!stagger) {
        target.classList.add(className);
        return;
      }

      const siblings = [
        ...(target.parentElement?.querySelectorAll<HTMLElement>(
          `${selector}:not(.${className})`,
        ) ?? []),
      ];
      const index = Math.max(0, siblings.indexOf(target));
      timers.push(
        window.setTimeout(
          () => target.classList.add(className),
          Math.min(index, staggerCap) * stagger,
        ),
      );
    });

    return () => {
      disconnect?.();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [root, selector, className, threshold, rootMargin, stagger, staggerCap]);
}

/** Adds `className` to every match while it is in view, and keeps observing. */
export function useRevealClass(
  root: RefObject<HTMLElement | null>,
  selector: string,
  className: string,
  options: IntersectionObserverInit = {},
) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    return observeClass(element, selector, className, options) ?? undefined;
    // `options` is expected to be a stable literal at the call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, selector, className]);
}
