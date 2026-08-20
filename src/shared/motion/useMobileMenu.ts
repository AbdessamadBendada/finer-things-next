'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';

/**
 * Drives the full-screen mobile menu.
 *
 * Ported from legacy/study-shared.js, which toggled classes on elements found
 * by id. Here the open state is React state and the classes are applied by the
 * markup, except for `body.menu-open` — that one has to be written to the
 * document because the scroll lock lives on the document element.
 */
export function useMobileMenu(menuRef: RefObject<HTMLElement | null>) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Any navigation from inside the menu closes it.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const links = [...menu.querySelectorAll('a')];
    links.forEach((link) => link.addEventListener('click', close));
    return () => links.forEach((link) => link.removeEventListener('click', close));
  }, [menuRef, close]);

  return { open, toggle, close } as const;
}
