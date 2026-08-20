'use client';

import { useCallback, type RefObject } from 'react';

import { setDrift, useReveal, useScrollDriver } from '@/shared/motion';

/** Reveals, plus the slow drift on the contact portrait. */
export function useContactMotion(root: RefObject<HTMLElement | null>) {
  useReveal(root, { threshold: 0.15, rootMargin: '0px' });

  const drive = useCallback((element: HTMLElement) => {
    const image = element.querySelector<HTMLElement>('.image-wrap');
    if (image) setDrift(image, '--image-y', 28);
  }, []);

  useScrollDriver(root, drive);
}
