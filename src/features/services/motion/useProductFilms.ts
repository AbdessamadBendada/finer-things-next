'use client';

import { useEffect, type RefObject } from 'react';

import { prefersReducedMotion } from '@/shared/motion';

/**
 * Finer Living only: each product still plays its making-of film on hover
 * (or on tap, where hover does not exist).
 *
 * Playback is never started for users who prefer reduced motion, and any film
 * that scrolls out of view is stopped and rewound so nothing plays unseen.
 */
export function useProductFilms(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const figures = [...element.querySelectorAll<HTMLElement>('.story-figure')];
    if (!figures.length) return;

    const motionAllowed = !prefersReducedMotion();

    const play = (figure: HTMLElement) => {
      if (!motionAllowed) return;
      const video = figure.querySelector('video');
      if (!video) return;
      figure.classList.add('video-active');
      video.play().catch(() => figure.classList.remove('video-active'));
    };

    const stop = (figure: HTMLElement) => {
      const video = figure.querySelector('video');
      figure.classList.remove('video-active');
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    };

    const cleanups: Array<() => void> = [];
    const listen = (target: HTMLElement, event: string, handler: () => void) => {
      target.addEventListener(event, handler);
      cleanups.push(() => target.removeEventListener(event, handler));
    };

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      figures.forEach((figure) => {
        listen(figure, 'mouseenter', () => play(figure));
        listen(figure, 'mouseleave', () => stop(figure));
        listen(figure, 'focus', () => play(figure));
        listen(figure, 'blur', () => stop(figure));
      });
    } else if (motionAllowed) {
      figures.forEach((figure) => {
        listen(figure, 'click', () => {
          const active = figure.classList.contains('video-active');
          figures.forEach(stop);
          if (!active) play(figure);
        });
      });
    }

    if (motionAllowed) {
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) stop(entry.target as HTMLElement);
          }),
        { threshold: 0.08 },
      );
      figures.forEach((figure) => observer.observe(figure));
      cleanups.push(() => observer.disconnect());
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      figures.forEach(stop);
    };
  }, [root]);
}
