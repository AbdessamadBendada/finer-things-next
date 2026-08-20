'use client';

import { useEffect, type RefObject } from 'react';

import { clamp01, prefersReducedMotion } from '@/shared/motion';

/** Easing factor of the filmstrip's follow-the-scroll damping. */
const DAMPING = 0.095;
/** Below this movement the animation loop parks itself. */
const EPSILON = 0.15;

/**
 * The horizontal atelier filmstrip.
 *
 * Vertical scroll through a tall section is mapped to horizontal travel, with
 * a damped follow so the strip glides rather than snapping. Cards scale and
 * fade by their distance from the centre of the viewport, and the nearest one
 * is marked `active`.
 *
 * The rAF loop is self-parking: it stops as soon as the strip has caught up,
 * so an idle page costs nothing.
 */
export function useFilmstrip(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const scroller = element.querySelector<HTMLElement>('#filmstripScroll');
    const track = element.querySelector<HTMLElement>('#filmstripTrack');
    const cards = [...element.querySelectorAll<HTMLElement>('.film-card')];
    if (!scroller || !track || !cards.length) return;

    const motionAllowed = !prefersReducedMotion() && 'IntersectionObserver' in window;

    // Entry treatment. Without motion, the strip simply starts settled.
    let entryTimer = 0;
    let observer: IntersectionObserver | undefined;

    if (motionAllowed) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            scroller.classList.add('entered');
            entryTimer = window.setTimeout(() => scroller.classList.add('settled'), 1500);
            observer?.unobserve(entry.target);
          }),
        { threshold: 0.08 },
      );
      observer.observe(scroller);
    } else {
      scroller.classList.add('entered', 'settled');
    }

    let targetX = 0;
    let currentX = 0;
    let running = false;
    let initialized = false;
    let frame = 0;

    const render = () => {
      currentX += (targetX - currentX) * DAMPING;
      track.style.transform = `translate3d(${currentX}px,0,0)`;

      let active = 0;
      let strongest = -1;

      cards.forEach((card, index) => {
        const centre = card.offsetLeft + card.offsetWidth / 2 + currentX;
        const focus = clamp01(
          1 - Math.abs(centre - window.innerWidth / 2) / (card.offsetWidth * 0.8),
        );
        // Smoothstep, so cards ease into focus instead of ramping linearly.
        const eased = focus * focus * (3 - 2 * focus);

        card.style.transform = `translateZ(0) scale(${0.91 + eased * 0.09})`;
        card.style.opacity = String(0.42 + eased * 0.58);
        const image = card.querySelector<HTMLElement>('.film-image');
        if (image) image.style.transform = `scale(${1.06 - eased * 0.06})`;

        if (focus > strongest) {
          strongest = focus;
          active = index;
        }
      });

      cards.forEach((card, index) => card.classList.toggle('active', index === active));

      if (Math.abs(targetX - currentX) > EPSILON) {
        frame = window.requestAnimationFrame(render);
      } else {
        currentX = targetX;
        running = false;
      }
    };

    const measure = () => {
      if (!motionAllowed) return;
      const rect = scroller.getBoundingClientRect();
      const travel = Math.max(1, scroller.offsetHeight - window.innerHeight);
      const progress = clamp01(-rect.top / travel);
      const maxShift = Math.max(0, track.scrollWidth - window.innerWidth);

      targetX = -progress * maxShift;

      if (!initialized) {
        currentX = targetX;
        initialized = true;
      }
      if (!running) {
        running = true;
        frame = window.requestAnimationFrame(render);
      }
    };

    const onResize = () => {
      initialized = false;
      measure();
    };

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    measure();

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(entryTimer);
      observer?.disconnect();
    };
  }, [root]);
}
