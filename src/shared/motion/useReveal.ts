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
    threshold = 0.14,
    rootMargin = '0px 0px -6% 0px',
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
