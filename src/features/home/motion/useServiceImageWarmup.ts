'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Starts each clipped service image shortly before it can be revealed.
 *
 * Native lazy loading does not fetch an image clipped to zero width. Keeping
 * every service image eager fixed the empty wipe, but made below-fold media
 * compete with the Home LCP. This observer warms a row while it is still one
 * viewport away; pointer and focus listeners cover a visitor who reaches it
 * before the observer callback runs.
 */
export function useServiceImageWarmup(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const rows = [...element.querySelectorAll<HTMLElement>('.svc-row')];
    if (!rows.length) return;

    const warm = (row: HTMLElement) => {
      const image = row.querySelector<HTMLImageElement>('.wipe img');
      if (!image || image.complete) return;
      image.loading = 'eager';
    };

    const cleanups = rows.map((row) => {
      const onApproach = () => warm(row);
      row.addEventListener('pointerenter', onApproach, { once: true });
      row.addEventListener('focusin', onApproach, { once: true });
      return () => {
        row.removeEventListener('pointerenter', onApproach);
        row.removeEventListener('focusin', onApproach);
      };
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          warm(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '80% 0px', threshold: 0 },
    );

    rows.forEach((row) => observer.observe(row));

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [root]);
}
