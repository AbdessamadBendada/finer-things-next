'use client';

import { useEffect, useState } from 'react';

/**
 * Which navigation treatment the home hero shows before the wordmark has
 * handed off to the masthead.
 *
 * `none` is the original: nothing but the wordmark until you scroll. The others
 * exist to answer a review comment — the empty frame suits the brand, but a
 * visitor who arrives wanting to do something has no way to start.
 */
export type HeroNavVariant = 'none' | 'burger' | 'links' | 'contact';

const VARIANTS: readonly HeroNavVariant[] = ['none', 'burger', 'links', 'contact'];

const isVariant = (value: string | null): value is HeroNavVariant =>
  value !== null && VARIANTS.includes(value as HeroNavVariant);

/**
 * Read from the query string rather than a build flag so all four can be
 * compared on one deploy: `/?nav=burger`, `/?nav=links`, `/?nav=contact`.
 *
 * Deliberately read on the client after mount instead of through
 * `useSearchParams`, which would opt the home page out of static rendering for
 * the sake of a temporary experiment. The cost is that the nav appears a frame
 * late, which is invisible behind the intro sequence.
 *
 * Once a variant is chosen, this hook and the `heroNav` prop go away and the
 * winner becomes the default.
 */
export function useHeroNav(): HeroNavVariant {
  const [variant, setVariant] = useState<HeroNavVariant>('none');

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('nav');
    if (!isVariant(value)) return;
    /*
     * The query string is an external, non-reactive source: it cannot be read
     * during render without a hydration mismatch, and `useSyncExternalStore`
     * does not re-read after hydration when nothing ever notifies — which left
     * the variant stuck on 'none'.
     *
     * One setState, once, on mount. Temporary: this hook is deleted when a
     * variant is chosen.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariant(value);
  }, []);

  return variant;
}
