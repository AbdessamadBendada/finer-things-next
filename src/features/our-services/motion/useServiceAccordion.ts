'use client';

import { useEffect, type RefObject } from 'react';

import { prefersReducedMotion } from '@/shared/motion';

/** Long enough to read as a panel opening, short enough not to be a wait. */
const DURATION = 520;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * The accordion's motion, and the two things `<details>` does not do on its own.
 *
 * **Why the height is animated in JavaScript.** `<details>` shows its content
 * the instant it opens: there is no intermediate state to put a CSS transition
 * on, so the panel snaps to full height and any animation on the content plays
 * inside a box that has already finished moving. That reads as nothing
 * happening. The height is therefore animated here, on the `details` element
 * itself, with the Web Animations API — measure where it is, let it open,
 * measure where it lands, and animate between the two.
 *
 * The alternatives were considered and rejected: `interpolate-size` with
 * `::details-content` is the CSS answer to exactly this and is the right one
 * eventually, but it is Chromium-only today, and a page whose interaction only
 * animates in one browser is worse than one that animates everywhere.
 *
 * **The two behavioural additions** are one panel open at a time, and opening a
 * panel named in the URL so `/our-services#styling-curation` works from
 * anywhere.
 *
 * Everything else — keyboard operation, the open state being announced, the
 * content existing whether or not it is open — is the element's own behaviour
 * and is deliberately not reimplemented. If this hook never runs, the panels
 * still open and close natively; they just do it instantly and stop closing
 * their siblings. That is the fail-open the house rules ask for.
 */
export function useServiceAccordion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const panels = [...element.querySelectorAll<HTMLDetailsElement>('details.service-panel')];
    if (!panels.length) return;

    const running = new Map<HTMLDetailsElement, Animation>();

    /** Hand the element back to the stylesheet once an animation is done. */
    const settle = (panel: HTMLDetailsElement) => {
      panel.style.height = '';
      panel.style.overflow = '';
      running.delete(panel);
    };

    const animateTo = (
      panel: HTMLDetailsElement,
      from: number,
      to: number,
      after?: () => void,
    ) => {
      running.get(panel)?.cancel();
      panel.style.overflow = 'hidden';
      const animation = panel.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: DURATION, easing: EASE },
      );
      running.set(panel, animation);
      animation.onfinish = () => {
        after?.();
        settle(panel);
      };
      // A cancelled animation must not run `after`, or a panel interrupted
      // mid-close would close after the click that reopened it.
      animation.oncancel = () => settle(panel);
    };

    const open = (panel: HTMLDetailsElement) => {
      if (panel.open) return;
      const from = panel.offsetHeight;
      panel.open = true;
      animateTo(panel, from, panel.offsetHeight);
    };

    const close = (panel: HTMLDetailsElement) => {
      if (!panel.open) return;
      const summary = panel.querySelector('summary');
      const to = summary ? summary.offsetHeight : 0;
      animateTo(panel, panel.offsetHeight, to, () => {
        panel.open = false;
      });
    };

    const instant = () => prefersReducedMotion();

    const onSummaryClick = (event: MouseEvent) => {
      const summary = event.currentTarget as HTMLElement;
      const panel = summary.closest('details.service-panel') as HTMLDetailsElement | null;
      if (!panel) return;

      // Taking over the toggle is what makes the animation possible; the
      // element would otherwise have finished opening before we measured it.
      event.preventDefault();

      const wasOpen = panel.open;

      if (instant()) {
        panels.forEach((other) => {
          other.open = other === panel ? !wasOpen : false;
        });
        return;
      }

      panels.forEach((other) => {
        if (other !== panel) close(other);
      });
      if (wasOpen) close(panel);
      else open(panel);
    };

    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = panels.find((panel) => panel.id === id);
      if (!target) return;

      panels.forEach((panel) => {
        if (panel !== target) panel.open = false;
      });
      target.open = true;
      target.scrollIntoView({ block: 'start', behavior: instant() ? 'auto' : 'smooth' });
    };

    const summaries = panels
      .map((panel) => panel.querySelector('summary'))
      .filter((summary): summary is HTMLElement => summary !== null);

    summaries.forEach((summary) => summary.addEventListener('click', onSummaryClick));
    window.addEventListener('hashchange', openFromHash);
    openFromHash();

    return () => {
      summaries.forEach((summary) => summary.removeEventListener('click', onSummaryClick));
      window.removeEventListener('hashchange', openFromHash);
      running.forEach((animation) => animation.cancel());
    };
  }, [root]);
}
