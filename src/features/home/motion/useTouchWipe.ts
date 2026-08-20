'use client';

import { useEffect, type RefObject } from 'react';

import { prefersReducedMotion } from '@/shared/motion';

/**
 * On touch devices the service rows cannot be hovered, so the row nearest the
 * centre of the screen takes the wipe treatment instead.
 *
 * The thresholds are deliberately asymmetric: a row must be clearly closer
 * than the current one before it steals focus, which stops the highlight
 * flickering between two rows during a slow scroll.
 */
export function useTouchWipe(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (!isTouch || prefersReducedMotion()) return;

    const rows = [...element.querySelectorAll<HTMLElement>('.svc-row')];
    if (!rows.length) return;

    let activeRow: HTMLElement | null = null;
    let queued = false;
    let frame = 0;

    const update = () => {
      queued = false;
      const centre = window.innerHeight / 2;

      const visible = rows
        .map((row) => {
          const rect = row.getBoundingClientRect();
          return { row, rect, distance: Math.abs(rect.top + rect.height / 2 - centre) };
        })
        .filter((item) => item.rect.bottom > 0 && item.rect.top < window.innerHeight)
        .sort((a, b) => a.distance - b.distance);

      const nearest = visible[0];
      const current = visible.find((item) => item.row === activeRow);
      let next = activeRow;

      if (!nearest || nearest.distance > window.innerHeight * 0.42) {
        next = null;
      } else if (
        !current ||
        current.distance > window.innerHeight * 0.38 ||
        nearest.distance + 42 < current.distance
      ) {
        next = nearest.row;
      }

      if (next !== activeRow) {
        rows.forEach((row) => row.classList.toggle('wiped', row === next));
        activeRow = next;
      }
    };

    const queue = () => {
      if (queued) return;
      queued = true;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      window.cancelAnimationFrame(frame);
    };
  }, [root]);
}
