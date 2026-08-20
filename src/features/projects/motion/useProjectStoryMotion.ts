'use client';

import { useCallback, type RefObject } from 'react';

import {
  clamp01,
  driftAll,
  useReveal,
  useRevealClass,
  useScrollDriver,
  viewportProgress,
} from '@/shared/motion';

export type ProjectStoryMotion = {
  /** Vertical drift of the hero image, in pixels. */
  heroDrift: number;
  /** Drift applied to each chapter's imagery. */
  chapterDrift: number;
  /** Counter-drift applied to the chapter number. */
  chapterNumberDrift: number;
  /** Multiplier on each shot's own `data-drift` value. */
  shotFactor: number;
  /** Marks chapters that have scrolled past — only the Dubai story uses it. */
  markPassing: boolean;
};

/**
 * Shared choreography for the two project stories.
 *
 * Both documents ran the same script with different constants; keeping one
 * hook means a change to the story rhythm applies to both, and the numbers
 * that actually differ stay visible at the call site.
 */
export function useProjectStoryMotion(
  root: RefObject<HTMLElement | null>,
  { heroDrift, chapterDrift, chapterNumberDrift, shotFactor, markPassing }: ProjectStoryMotion,
) {
  useReveal(root, { threshold: 0.14, rootMargin: '0px 0px -6%' });
  useRevealClass(root, '.chapter', 'in-view', { threshold: 0.16 });

  const drive = useCallback(
    (element: HTMLElement) => {
      const hero = element.querySelector<HTMLElement>('.hero-bg');
      hero?.style.setProperty(
        '--hero-y',
        `${clamp01(window.scrollY / window.innerHeight) * heroDrift}px`,
      );

      element.querySelectorAll<HTMLElement>('.chapter').forEach((chapter) => {
        const progress = viewportProgress(chapter) - 0.5;
        chapter.style.setProperty('--chapter-y', `${progress * chapterDrift}px`);
        chapter.style.setProperty('--chapter-no-y', `${progress * -chapterNumberDrift}px`);

        if (markPassing) {
          const rect = chapter.getBoundingClientRect();
          chapter.classList.toggle(
            'passing',
            rect.top < 0 && rect.bottom < window.innerHeight * 0.72,
          );
        }
      });

      driftAll(element, '[data-drift]', '--shot-y', { factor: shotFactor });
    },
    [heroDrift, chapterDrift, chapterNumberDrift, shotFactor, markPassing],
  );

  useScrollDriver(root, drive);
}
