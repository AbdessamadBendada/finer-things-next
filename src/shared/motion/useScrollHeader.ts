'use client';

import { useEffect, useState } from 'react';

/**
 * Toggles the header's `scrolled` state once the page has scrolled past a
 * fraction of the viewport height.
 *
 * Legacy pages configured this with `data-scroll-threshold` on the header;
 * here it is an argument, so the value is visible in the component that uses
 * it rather than hidden in a DOM attribute.
 */
export function useScrollHeader(threshold = 0.72): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * threshold);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [threshold]);

  return scrolled;
}
