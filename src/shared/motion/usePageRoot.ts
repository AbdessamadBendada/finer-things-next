'use client';

import { useEffect, useRef, type RefObject } from 'react';

import { useFailOpenReveal } from './useFailOpenReveal';

/**
 * Marks the document ready on the first frame after mount.
 *
 * A large part of the design's entrance choreography hangs off `body.ready`
 * selectors — hero headings, portraits and masked lines all start hidden and
 * are revealed by that class. Without it those sections render blank, so this
 * is load-bearing, not decorative.
 */
function useDocumentReady() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => document.body.classList.add('ready'));
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.classList.remove('ready');
    };
  }, []);
}

/**
 * Everything every page shell needs: the root element reference, the ready
 * flag, and the fail-open watchdog.
 */
export function usePageRoot<T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> {
  const root = useRef<T>(null);
  useDocumentReady();
  useFailOpenReveal(root);
  return root;
}
