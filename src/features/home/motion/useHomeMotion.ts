'use client';

import { useCallback, type RefObject } from 'react';

import {
  setDrift,
  useReveal,
  useScrollDriver,
  useWordReveal,
  observeOnce,
  prefersReducedMotion,
} from '@/shared/motion';
import { useEffect } from 'react';

import { useFilmstrip } from './useFilmstrip';
import { useIntroSequence } from './useIntroSequence';
import { useTouchWipe } from './useTouchWipe';

/** Composes the home page's choreography. */
export function useHomeMotion(root: RefObject<HTMLElement | null>): void {
  useIntroSequence(root);
  useFilmstrip(root);
  useTouchWipe(root);

  useReveal(root, {
    threshold: 0.15,
    rootMargin: '0px 0px -6% 0px',
    stagger: 110,
    staggerCap: 99,
  });

  // The home page masks words with its own class and index property.
  useWordReveal(root, {
    threshold: 0.3,
    rootMargin: '0px 0px -8% 0px',
    maskClass: 'reveal-word',
    indexProperty: '--word-index',
  });

  // Service rows arrive with a directional wipe, once each.
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      element.querySelectorAll('.svc-row').forEach((row) => row.classList.add('luxury-in'));
      return;
    }

    return (
      observeOnce(
        element,
        '.svc-row',
        { threshold: 0.22, rootMargin: '0px 0px -8% 0px' },
        (target) => target.classList.add('luxury-in'),
      ) ?? undefined
    );
  }, [root]);

  const drive = useCallback((element: HTMLElement) => {
    const portrait = element.querySelector<HTMLElement>('.family-editorial-portrait');
    if (portrait) setDrift(portrait, '--family-shift', 28);

    // Generic parallax: `data-parallax` carries the speed multiplier.
    element.querySelectorAll<HTMLElement>('[data-parallax]').forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const speed = Number.parseFloat(target.dataset.parallax ?? '0');
      const centre = rect.top + rect.height / 2;
      target.style.transform = `translateY(${(centre - window.innerHeight / 2) * -speed}px)`;
    });
  }, []);

  useScrollDriver(root, drive);
}
