'use client';

import { useCallback, type RefObject } from 'react';

import { useReveal, useRevealClass } from './useReveal';
import { useWordReveal } from './useWordReveal';
import { clamp01, useScrollDriver, viewportProgress } from './useScrollDriver';

/**
 * Shared by Our Work and Projects: both are index pages built from `.service`
 * blocks that drift gently against a fixed hero.
 */
export function useServiceIndexMotion(
  root: RefObject<HTMLElement | null>,
  { onDrive }: { onDrive?: (root: HTMLElement) => void } = {},
) {
  useReveal(root, { threshold: 0.14, rootMargin: '0px 0px -6% 0px', stagger: 90 });
  useWordReveal(root);
  useRevealClass(root, '.service', 'in-view', { threshold: 0.18 });

  const drive = useCallback(
    (element: HTMLElement) => {
      const hero = element.querySelector<HTMLElement>('.hero-bg');
      hero?.style.setProperty(
        '--hero-shift',
        `${clamp01(window.scrollY / window.innerHeight) * 32}px`,
      );

      element.querySelectorAll<HTMLElement>('.service').forEach((service) => {
        service.style.setProperty(
          '--service-shift',
          `${(viewportProgress(service) - 0.5) * 28}px`,
        );
      });

      onDrive?.(element);
    },
    [onDrive],
  );

  useScrollDriver(root, drive);
}
