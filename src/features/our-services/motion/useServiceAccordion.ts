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

    /*
     * What the panel is *meant* to be, which is not the same as `panel.open`.
     *
     * A closing panel keeps `open === true` for the whole animation, because
     * the content has to stay in the box while the box shrinks. Deciding from
     * the DOM flag therefore made a second click during a close read as "it is
     * open, close it" and start the close again — the panel stopped responding
     * until you stopped clicking. This map is the source of truth for what a
     * click should do; `panel.open` is only ever the rendering of it.
     */
    const intent = new WeakMap<HTMLDetailsElement, boolean>();
    panels.forEach((panel) => intent.set(panel, panel.open));

    /* Stop the running animation without letting its handlers fire. Removing it
       from the map first is what makes the guard in `animateTo` reject it: a
       cancel event is delivered asynchronously, so a stale handler would
       otherwise land after the replacement had started and strip its styles. */
    const stop = (panel: HTMLDetailsElement) => {
      const animation = running.get(panel);
      if (!animation) return;
      running.delete(panel);
      animation.cancel();
    };

    const animateTo = (
      panel: HTMLDetailsElement,
      from: number,
      to: number,
      after?: () => void,
    ) => {
      panel.style.overflow = 'hidden';
      const animation = panel.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: DURATION, easing: EASE },
      );
      running.set(panel, animation);

      const done = (finished: boolean) => {
        if (running.get(panel) !== animation) return; // superseded
        running.delete(panel);
        if (finished) after?.();
        panel.style.height = '';
        panel.style.overflow = '';
      };
      animation.onfinish = () => done(true);
      animation.oncancel = () => done(false);
    };

    const open = (panel: HTMLDetailsElement) => {
      if (intent.get(panel)) return;
      intent.set(panel, true);

      // Measure where it is now — mid-animation is fine and is the point —
      // then stop that animation so the natural full height can be read.
      const from = panel.offsetHeight;
      stop(panel);
      panel.style.height = '';
      panel.open = true;
      animateTo(panel, from, panel.offsetHeight);
    };

    const close = (panel: HTMLDetailsElement) => {
      if (!intent.get(panel)) return;
      intent.set(panel, false);

      const from = panel.offsetHeight;
      stop(panel);
      panel.style.height = '';
      const summary = panel.querySelector('summary');
      animateTo(panel, from, summary ? summary.offsetHeight : 0, () => {
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

      const wasOpen = intent.get(panel) ?? panel.open;

      if (instant()) {
        panels.forEach((other) => {
          const next = other === panel ? !wasOpen : false;
          intent.set(other, next);
          stop(other);
          other.style.height = '';
          other.style.overflow = '';
          other.open = next;
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
        stop(panel);
        panel.style.height = '';
        panel.style.overflow = '';
        const next = panel === target;
        intent.set(panel, next);
        panel.open = next;
      });
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
