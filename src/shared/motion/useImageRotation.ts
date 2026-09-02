'use client';

import { useEffect, useRef, useState } from 'react';

import { prefersReducedMotion } from './useReducedMotion';

export type ImageRotationOptions = {
  /** How many images are on screen at once. */
  tiles: number;
  /** How many images the rotation can draw from. Must exceed `tiles`. */
  poolSize: number;
  /** How often one tile changes, in ms. */
  interval: number;
  /** Length of the CSS transition, in ms. The swap happens at its midpoint. */
  fade: number;
  /**
   * The opening set, as pool indices. Defaults to the first `tiles` images.
   * Pass it when the first paint is a reviewed arrangement rather than an
   * arbitrary one: it is the frame every visitor sees, and the only one that
   * appears in a screenshot.
   */
  initial?: readonly number[];
};

/**
 * A set of images where one position quietly turns over every few seconds.
 *
 * Extracted from the About artisan wall so the Our Work strip could behave the
 * same way. The subtle parts are the reason this is shared rather than copied:
 *
 * - **One at a time.** Simultaneous changes read as a slideshow; a single tile
 *   turning over reads as a room you keep noticing new things in.
 * - **Never a duplicate.** Replacements are drawn only from images not
 *   currently on screen. The same photograph appearing twice at once is the
 *   thing that would make it look broken rather than alive.
 * - **Deterministic first paint.** The server and client must agree, so the
 *   opening set is simply the first `tiles` images. Shuffling starts on mount.
 * - **It stops when nobody is watching** — scrolled out of view, or a
 *   backgrounded tab — and never starts at all under reduced motion.
 *
 * Returns the indices to render, which position is leaving, which is arriving,
 * and the ref to put on the container that should be observed.
 */
export function useImageRotation({
  tiles,
  poolSize,
  interval,
  fade,
  initial,
}: ImageRotationOptions) {
  const [indices, setIndices] = useState(() =>
    Array.from({ length: tiles }, (_, i) => initial?.[i] ?? i % Math.max(poolSize, 1)),
  );
  const [fading, setFading] = useState<number | null>(null);
  const [arriving, setArriving] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion() || poolSize <= tiles) return;

    let timer = 0;
    let swapTimer = 0;
    let arriveTimer = 0;
    let running = false;

    /*
     * An escape hatch for the visual gate, which cannot compare a page that
     * rewrites itself: two captures of an unchanged page would differ by
     * whichever images happened to turn over between them.
     *
     * Read on every tick rather than once, because the suite injects the
     * stylesheet after the component has mounted and started. Nothing in the
     * application sets `--frozen`, so the browser behaviour is untouched.
     * See the freeze note in tests/visual/pages.ts.
     */
    const isFrozen = () =>
      getComputedStyle(element).getPropertyValue('--frozen').trim() === '1';

    const swap = () => {
      if (isFrozen()) return;
      const position = Math.floor(Math.random() * tiles);
      setFading(position);

      // Change the image at the midpoint of the fade, while it cannot be seen.
      swapTimer = window.setTimeout(() => {
        setIndices((current) => {
          const onScreen = new Set(current);
          const available = Array.from({ length: poolSize }, (_, i) => i).filter(
            (i) => !onScreen.has(i),
          );
          const pick = available[Math.floor(Math.random() * available.length)];
          if (pick === undefined) return current;

          const next = [...current];
          next[position] = pick;
          return next;
        });
        setFading(null);
        // Marked for the length of the arrival animation, so the replacement
        // slides in rather than simply appearing where the old one was.
        setArriving(position);
        arriveTimer = window.setTimeout(() => setArriving(null), fade);
      }, fade / 2);
    };

    const start = () => {
      if (running) return;
      running = true;
      timer = window.setInterval(swap, interval);
    };

    const stop = () => {
      running = false;
      window.clearInterval(timer);
      window.clearTimeout(swapTimer);
      window.clearTimeout(arriveTimer);
      setFading(null);
      setArriving(null);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { threshold: 0.15 },
    );
    observer.observe(element);

    // A tab in the background should not be swapping images either.
    const onVisibility = () => (document.hidden ? stop() : undefined);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, [tiles, poolSize, interval, fade]);

  return { indices, fading, arriving, root };
}
