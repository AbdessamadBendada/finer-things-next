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

import { FILMSTRIP_MODE } from '../model/filmstrip.mode';
import { useFilmstrip } from './useFilmstrip';
import { useFilmstripSlider } from './useFilmstripSlider';
import { useIntroSequence } from './useIntroSequence';
import { usePurposeReveal } from './usePurposeReveal';
import { useServiceImageWarmup } from './useServiceImageWarmup';
import { useTouchWipe } from './useTouchWipe';

/** Composes the home page's choreography. */
export function useHomeMotion(root: RefObject<HTMLElement | null>): void {
  useIntroSequence(root);

  /*
   * Both filmstrip hooks are called, and one of them returns immediately.
   *
   * `FILMSTRIP_MODE` is a module constant, so the branch is decided at build
   * time and never changes between renders — but writing it as a conditional
   * call would still break the rules of hooks, and would break for real the
   * moment the mode became a prop or a query flag. Each hook looks for markup
   * the other mode does not render (`[data-film-prev]`, the pinned track) and
   * bails when it is absent, so the idle one costs a single querySelector.
   */
  useFilmstrip(root, FILMSTRIP_MODE === 'scroll');
  useFilmstripSlider(root, FILMSTRIP_MODE === 'slider');

  useServiceImageWarmup(root);
  useTouchWipe(root);

  useReveal(root, {
    /*
     * The defaults, plus a gentle stagger.
     *
     * This used threshold 0.15 with a -6% margin and `staggerCap: 99`, which
     * combined into a reveal that could land two seconds after the element was
     * already on screen: the portrait in the story section entered the
     * viewport at 1.6s and did not appear until 3.8s. The cap is what makes
     * the stagger a flourish between neighbours rather than a queue.
     */
    stagger: 90,
    staggerCap: 3,
  });

  // The home page masks words with its own class and index property.
  useWordReveal(root, {
    threshold: 0.3,
    rootMargin: '0px 0px -8% 0px',
    maskClass: 'reveal-word',
    indexProperty: '--word-index',
  });

  // …and the purpose statement then hands its reveal over to the scroll, so
  // the pinned sentence is read at the reader's own pace. Must come after
  // useWordReveal: it takes over the words that hook creates.
  usePurposeReveal(root);

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
