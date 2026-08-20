'use client';

import { useEffect, type RefObject } from 'react';

import { prefersReducedMotion } from './useReducedMotion';

/**
 * Runs `update` on scroll and resize, coalesced into a single animation frame.
 *
 * The legacy pages each re-implemented this rAF-throttled loop to write CSS
 * custom properties for their parallax offsets; this is that loop, once.
 * Skipped entirely when the user prefers reduced motion, so the elements keep
 * whatever static values their stylesheet defines.
 */
export function useScrollDriver(
  root: RefObject<HTMLElement | null>,
  update: (root: HTMLElement) => void,
  { enabled = true }: { enabled?: boolean } = {},
) {
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled || prefersReducedMotion()) return;

    let queued = false;

    const run = () => {
      queued = false;
      update(element);
    };

    const queue = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(run);
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    run();

    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, [root, update, enabled]);
}

/** Clamps a value into the 0–1 range. */
export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/**
 * Progress of an element through the viewport: 0 as it enters from below,
 * 1 once it has fully passed the top. The parallax maths every legacy page
 * repeated inline.
 */
export function viewportProgress(element: Element): number {
  const rect = element.getBoundingClientRect();
  return clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
}

/** How far the page has scrolled into the first viewport, 0–1. */
export const heroProgress = (height = window.innerHeight): number =>
  clamp01(window.scrollY / height);

/**
 * Writes a centred parallax offset (`-amount/2` … `+amount/2`) to a custom
 * property. Used by every page that drifts an image against the scroll.
 */
export function setDrift(element: HTMLElement, property: string, amount: number) {
  element.style.setProperty(property, `${(viewportProgress(element) - 0.5) * amount}px`);
}

/**
 * Applies `setDrift` to every match, reading the distance from a data
 * attribute — the legacy `data-drift="-18"` convention.
 */
export function driftAll(
  root: ParentNode,
  selector: string,
  property: string,
  { datasetKey = 'drift', factor = 1 }: { datasetKey?: string; factor?: number } = {},
) {
  root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    const amount = Number(element.dataset[datasetKey] ?? 0) * factor;
    setDrift(element, property, amount);
  });
}
