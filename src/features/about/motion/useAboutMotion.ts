'use client';

import { useCallback, type RefObject } from 'react';

import { clamp01, setDrift, useReveal, useScrollDriver, useWordReveal } from '@/shared/motion';

/** Editorial reveals, the masked story statement, and the portrait drift. */
export function useAboutMotion(root: RefObject<HTMLElement | null>) {
  useReveal(root, { threshold: 0.14, rootMargin: '0px 0px -6% 0px', stagger: 90 });
  useWordReveal(root);

  const drive = useCallback((element: HTMLElement) => {
    const portrait = element.querySelector<HTMLElement>('.hero-portrait');
    portrait?.style.setProperty(
      '--portrait-shift',
      `${clamp01(window.scrollY / window.innerHeight) * 28}px`,
    );

    // Experience imagery and story imagery drift on separate properties.
    element.querySelectorAll<HTMLElement>('[data-drift]').forEach((figure) => {
      const property = figure.classList.contains('experience-image')
        ? '--experience-shift'
        : '--image-shift';
      setDrift(figure, property, Number(figure.dataset.drift ?? 0));
    });
  }, []);

  useScrollDriver(root, drive);
}
