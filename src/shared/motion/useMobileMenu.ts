'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** Focusable descendants, in tab order. */
const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Drives the full-screen menu.
 *
 * Ported from legacy/study-shared.js, which toggled classes on elements found
 * by id. Here the open state is React state and the classes are applied by the
 * markup, except for `body.menu-open` — that one has to be written to the
 * document because the scroll lock lives on the document element.
 *
 * This is now the site's *only* navigation, on every page and at every width,
 * so it carries the keyboard and focus behaviour a primary menu owes:
 *
 *   - Escape closes it;
 *   - opening moves focus to the first link, closing puts it back on the
 *     toggle, so a keyboard user is never dropped at the top of the document;
 *   - Tab is trapped inside while it is open — the menu covers the page, and
 *     tabbing to something invisible underneath it is how a menu becomes
 *     unusable without a mouse;
 *   - a route change closes it, so it never survives navigation.
 *
 * Links stay reachable in the tab order only when open: the closed menu is
 * `visibility: hidden`, which takes it out of the tab order for free.
 */
export function useMobileMenu(
  menuRef: RefObject<HTMLElement | null>,
  toggleRef: RefObject<HTMLButtonElement | null>,
) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  useEffect(() => {
    if (!open) return;

    /*
     * Measure the scrollbar *before* locking: `overflow: hidden` removes it,
     * and the gap reads as zero from then on. Classic scrollbars occupy
     * layout, so hiding one widens the viewport and carries the masthead's
     * right padding edge outward, taking the burger with it.
     *
     * brand.css spends this on the icon alone — the masthead and the panel
     * stay full bleed, so no strip of page is left showing where the
     * scrollbar was.
     *
     * Zero wherever scrollbars are overlays, which makes this inert there.
     */
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty('--scrollbar-gap', `${gap}px`);
    document.body.classList.add('menu-open');

    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--scrollbar-gap');
    };
  }, [open]);

  /*
   * Close on a back/forward navigation. Clicking a link in the menu closes it
   * directly (see SiteHeader), which covers forward navigation and in-page
   * anchors; history moves fire no click, so they are subscribed to here.
   *
   * Deliberately a subscription rather than an effect on `usePathname()`:
   * setting state straight from a pathname effect is a cascading render, and
   * it also re-opens the menu if you navigate back to the page you opened it
   * on. The masthead lives in the layout and never unmounts, so that state
   * would really survive.
   */
  useEffect(() => {
    const onPopState = () => setOpen(false);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Where focus was before the menu took it, so it can be handed back.
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    if (!menu) return;

    restoreTo.current = (document.activeElement as HTMLElement | null) ?? toggleRef.current;

    /*
     * The menu transitions out of `visibility: hidden`, and a hidden element
     * cannot take focus — so this cannot be a single `focus()` call, nor a
     * single frame's delay. `visibility` only resolves to `visible` once the
     * transition has actually stepped, which is a frame or two after the class
     * lands, and the exact frame differs per page (the transition durations in
     * chrome.css are not all the same).
     *
     * So: try, check whether it took, and retry on the next frame if not.
     * Bounded, because a menu with nothing focusable in it must not spin.
     */
    let frame = 0;
    let attempts = 0;

    const focusFirst = () => {
      const first = menu.querySelector<HTMLElement>(FOCUSABLE);
      if (!first) return;

      first.focus();
      if (document.activeElement !== first && attempts++ < 12) {
        frame = requestAnimationFrame(focusFirst);
      }
    };

    frame = requestAnimationFrame(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      // The toggle stays reachable: it is the X that closes the menu, and it
      // sits outside the <nav>, so it has to be spliced into the cycle.
      const stops = [...menu.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (toggleRef.current) stops.push(toggleRef.current);
      if (!stops.length) return;

      const first = stops.at(0);
      const last = stops.at(-1);
      if (!first || !last) return;

      const active = document.activeElement;

      if (event.shiftKey ? active === first : active === last) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, menuRef, toggleRef]);

  // Hand focus back on close, but only after an actual open — never on first
  // mount, which would steal focus from the page on every load. The masthead
  // is rendered by the layout and survives navigation, so the toggle is still
  // there to receive it after a route change.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open && restoreTo.current?.isConnected) {
      restoreTo.current.focus();
      restoreTo.current = null;
    }
    wasOpen.current = open;
  }, [open]);

  return { open, toggle, close } as const;
}
