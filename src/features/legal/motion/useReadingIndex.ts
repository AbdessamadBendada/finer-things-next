'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Highlights the current section in the legal pages' side index as the reader
 * scrolls, and fades each section in as it is reached.
 *
 * Without IntersectionObserver every section is shown immediately — a legal
 * document must be readable under any conditions.
 */
export function useReadingIndex(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const sections = [...element.querySelectorAll<HTMLElement>('.policy .content section')];
    const links = [...element.querySelectorAll<HTMLAnchorElement>('.policy .index a')];
    if (!sections.length || !links.length) return;

    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('reading-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reading-in');
          links.forEach((link) =>
            link.classList.toggle('active', link.hash === `#${entry.target.id}`),
          );
        }),
      { rootMargin: '-18% 0px -62% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [root]);
}
