'use client';

import { useCallback, useEffect, type RefObject } from 'react';

import {
  clamp01,
  driftAll,
  observeOnce,
  useReveal,
  useScrollDriver,
  useWordReveal,
  viewportProgress,
} from '@/shared/motion';

export type ServicePageMotion = {
  /** Horizontal and vertical travel of the selected-project backdrop. */
  projectDrift: { x: number; y: number; scale: number };
};

/**
 * Shared choreography for the three service pages.
 *
 * Bespoke Accessories, Styling & Curation and Finer Living shipped byte-identical
 * scripts apart from the selected-project drift constants, so those are the
 * only thing a caller supplies.
 */
export function useServicePageMotion(
  root: RefObject<HTMLElement | null>,
  { projectDrift }: ServicePageMotion,
) {
  useReveal(root, { threshold: 0.14, rootMargin: '0px 0px -6% 0px', stagger: 90 });
  useWordReveal(root);

  // The process line and the selected-project title each reveal once, at their
  // own threshold.
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const disposers = [
      observeOnce(element, '.steps', { threshold: 0.22 }, (target) =>
        target.classList.add('line-in'),
      ),
      observeOnce(element, '.title-mask', { threshold: 0.45 }),
    ];
    return () => disposers.forEach((dispose) => dispose?.());
  }, [root]);

  const drive = useCallback(
    (element: HTMLElement) => {
      const hero = element.querySelector<HTMLElement>('.hero');
      const heroMedia = element.querySelector<HTMLElement>('.hero-media');
      if (hero && heroMedia) {
        const progress = clamp01(window.scrollY / hero.offsetHeight);
        heroMedia.style.setProperty('--hero-shift', `${progress * 34}px`);
        heroMedia.style.setProperty('--hero-dim', (progress * 0.12).toFixed(3));
      }

      driftAll(element, '[data-drift]', '--image-drift');

      // The backdrop is transformed directly rather than through a custom
      // property, matching the legacy implementation.
      const projectBg = element.querySelector<HTMLElement>('#projectBg');
      if (projectBg?.parentElement) {
        const progress = viewportProgress(projectBg.parentElement) - 0.5;
        projectBg.style.transform = `translate3d(${progress * projectDrift.x}px,${
          progress * projectDrift.y
        }px,0) scale(${projectDrift.scale})`;
      }
    },
    [projectDrift],
  );

  useScrollDriver(root, drive);
}
