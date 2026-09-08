'use client';

import { useEffect, type RefObject } from 'react';

import { clamp01, prefersReducedMotion } from '@/shared/motion';

/**
 * Focus range for the slider.
 *
 * Deliberately gentler than the pinned version, which runs 0.42 → 1 opacity
 * and 0.91 → 1 scale. At that strength an off-centre card in a slider reads as
 * disabled rather than as out of focus, and a slider invites you to look at
 * the cards either side of the one you are on. This keeps the cinematic
 * character without dimming the thing you are being asked to swipe towards.
 */
const MIN_SCALE = 0.96;
const MIN_OPACITY = 0.72;

/**
 * The featured work as a horizontal slider.
 *
 * Everything that moves the strip is native: `overflow-x` with scroll snap, so
 * a trackpad swipe, a touch drag, the arrow buttons and the keyboard all work
 * without a scroll listener between the user and the page. Vertical scroll is
 * never intercepted, which is the whole point of this mode — see
 * model/filmstrip.mode.ts.
 *
 * What this hook adds on top of the native behaviour is presentation only: the
 * focus treatment on the nearest card, the position counter and the progress
 * rule, and the disabled state on the arrows at each end. If the JavaScript
 * never runs, the section is still a working, scrollable, snapping gallery.
 */
export function useFilmstripSlider(root: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const element = root.current;
    if (!element) return;

    const scroller = element.querySelector<HTMLElement>('#filmstripScroll');
    const track = element.querySelector<HTMLElement>('#filmstripTrack');
    const cards = [...element.querySelectorAll<HTMLElement>('.film-card')];
    if (!scroller || !track || !cards.length) return;

    const previous = element.querySelector<HTMLButtonElement>('[data-film-prev]');
    const next = element.querySelector<HTMLButtonElement>('[data-film-next]');
    const counter = element.querySelector<HTMLElement>('[data-film-counter]');
    const progress = element.querySelector<HTMLElement>('[data-film-progress]');

    const gentle = prefersReducedMotion();

    // The entry wipe is the one thing shared with the pinned version. Without
    // it the cards would pop in at full strength on first paint.
    let entryTimer = 0;
    let observer: IntersectionObserver | undefined;

    if (!gentle && 'IntersectionObserver' in window) {
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

    let frame = 0;
    let active = 0;

    const render = () => {
      frame = 0;

      const view = scroller.getBoundingClientRect();
      const centre = view.left + view.width / 2;

      let nearest = 0;
      let strongest = -1;

      cards.forEach((card, index) => {
        const box = card.getBoundingClientRect();
        const cardCentre = box.left + box.width / 2;
        const focus = clamp01(1 - Math.abs(cardCentre - centre) / (box.width * 0.9));
        // Smoothstep, so cards ease into focus instead of ramping linearly.
        const eased = focus * focus * (3 - 2 * focus);

        if (!gentle) {
          card.style.transform = `translateZ(0) scale(${MIN_SCALE + eased * (1 - MIN_SCALE)})`;
          card.style.opacity = String(MIN_OPACITY + eased * (1 - MIN_OPACITY));
        }

        if (focus > strongest) {
          strongest = focus;
          nearest = index;
        }
      });

      cards.forEach((card, index) => card.classList.toggle('active', index === nearest));

      if (nearest !== active) {
        active = nearest;
        if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')}`;
      }

      /*
       * Progress is measured from scroll position, not from the active index,
       * so the rule moves continuously with the drag rather than jumping a
       * fifth at a time. `scrollWidth - clientWidth` is zero when every card
       * already fits, which is the case on a very wide display; guard it or
       * the rule renders as NaN and disappears.
       */
      const travel = scroller.scrollWidth - scroller.clientWidth;
      if (progress) {
        const ratio = travel > 0 ? clamp01(scroller.scrollLeft / travel) : 1;
        progress.style.transform = `scaleX(${Math.max(1 / cards.length, ratio)})`;
      }

      if (previous) previous.disabled = scroller.scrollLeft <= 1;
      if (next) next.disabled = travel <= 0 || scroller.scrollLeft >= travel - 1;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    /** Scrolls one card in `direction`, letting the snap points do the landing. */
    const step = (direction: 1 | -1) => {
      const target = cards[Math.min(cards.length - 1, Math.max(0, active + direction))];
      if (!target) return;
      const view = scroller.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      const delta = box.left + box.width / 2 - (view.left + view.width / 2);
      scroller.scrollBy({ left: delta, behavior: gentle ? 'auto' : 'smooth' });
    };

    const onPrevious = () => step(-1);
    const onNext = () => step(1);

    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    previous?.addEventListener('click', onPrevious);
    next?.addEventListener('click', onNext);

    render();

    return () => {
      scroller.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      previous?.removeEventListener('click', onPrevious);
      next?.removeEventListener('click', onNext);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(entryTimer);
      observer?.disconnect();
    };
  }, [root, enabled]);
}
