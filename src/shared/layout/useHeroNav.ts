'use client';

import { useSyncExternalStore } from 'react';

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
  return useSyncExternalStore(
    // The query string cannot change without a navigation, so there is
    // nothing to subscribe to.
    () => () => {},
    () => {
      const value = new URLSearchParams(window.location.search).get('nav');
      return isVariant(value) ? value : 'none';
    },
    () => 'none',
  );
}
