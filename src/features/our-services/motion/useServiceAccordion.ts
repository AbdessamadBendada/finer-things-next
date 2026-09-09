'use client';

import { useEffect, type RefObject } from 'react';

import { prefersReducedMotion } from '@/shared/motion';

/**
 * The two things `<details>` does not do on its own.
 *
 * 1. **One at a time.** Opening a panel closes the others, so the page never
 *    becomes three services deep and the reader always knows where they are.
 * 2. **Opening from the URL.** `/our-services#styling-curation` opens that
 *    panel and brings it to the top, which is what makes the panels linkable
 *    from anywhere else on the site.
 *
 * Everything else — keyboard operation, the open/closed state being announced,
 * the content existing whether or not it is open — is the element's own
 * behaviour and is deliberately not reimplemented here. If this hook never
 * runs, the accordion still works; it just stops closing its siblings, which is
 * a nicety rather than the feature.
 */
export function useServiceAccordion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const panels = [...element.querySelectorAll<HTMLDetailsElement>('details.service-panel')];
    if (!panels.length) return;

    /*
     * Closing the siblings fires `toggle` on each of them, which lands back
     * here. The guard makes that a no-op rather than a loop: only a panel that
     * has just *opened* closes anything.
     */
    const onToggle = (event: Event) => {
      const opened = event.currentTarget as HTMLDetailsElement;
      if (!opened.open) return;
      panels.forEach((panel) => {
        if (panel !== opened) panel.open = false;
      });
    };

    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = panels.find((panel) => panel.id === id);
      if (!target) return;

      panels.forEach((panel) => {
        panel.open = panel === target;
      });
      target.scrollIntoView({
        block: 'start',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    };

    panels.forEach((panel) => panel.addEventListener('toggle', onToggle));
    window.addEventListener('hashchange', openFromHash);
    openFromHash();

    return () => {
      panels.forEach((panel) => panel.removeEventListener('toggle', onToggle));
      window.removeEventListener('hashchange', openFromHash);
    };
  }, [root]);
}
