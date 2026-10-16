'use client';

import { useEffect, useRef, useState } from 'react';

import { prefersReducedMotion } from './useReducedMotion';

/**
 * The proportions of a slot, or of a photograph.
 *
 * `square` as a slot means "anything fits"; as an image it means the picture
 * is close enough to square to sit anywhere without a damaging crop.
 */
export type Shape = 'square' | 'wide' | 'tall';

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
   *
   * Ignored where it would put the wrong shape in a shaped slot: see below.
   */
  initial?: readonly number[];
  /**
   * The shape of each slot, in order. Omit for a grid of equal tiles.
   *
   * When a grid has slots of different proportions, the rotation has to know
   * about them, or a portrait photograph lands in a slot twice as wide as it
   * is tall and `object-fit: cover` throws away most of the picture. That is
   * not hypothetical: it is what happened to the workshop door.
   */
  tileShapes?: readonly Shape[];
  /** The shape of each pool image, in order. Required with `tileShapes`. */
  imageShapes?: readonly Shape[];
  /**
   * Where in the pool the opening set starts reading. Defaults to the top.
   *
   * Three pages render the same wall from the same pool, and with every one
   * of them starting at index 0 they all opened on the same ten photographs.
   * An offset walks each wall into the pool at a different point, so the
   * first paints differ. It only moves the starting position: the pool, the
   * rotation and the shape rules are unchanged, and a wall still never shows
   * the same photograph twice at once.
   */
  offset?: number;
};

/**
 * Whether a photograph can sit in a slot without being badly cropped.
 *
 * A square slot takes anything: cover trims a little from one pair of edges
 * and the subject survives. A shaped slot takes only its own orientation,
 * because the crop in the wrong one is severe rather than cosmetic.
 */
function fits(image: Shape, slot: Shape): boolean {
  return slot === 'square' || image === slot;
}

/**
 * The opening arrangement, honouring slot shapes.
 *
 * Walks the slots in order and takes the first unused image that fits each.
 * Deterministic, so the server and the client agree. Falls back to any unused
 * image if a shape runs out, which keeps the wall full rather than correct:
 * a blank tile is worse than a cropped one.
 */
function openingSet(
  tiles: number,
  poolSize: number,
  initial: readonly number[] | undefined,
  tileShapes: readonly Shape[] | undefined,
  imageShapes: readonly Shape[] | undefined,
  offset: number,
): number[] {
  const size = Math.max(poolSize, 1);
  /* Read the pool from `offset`, wrapping, so each wall opens elsewhere. */
  const at = (i: number) => (((offset + i) % size) + size) % size;

  if (!tileShapes || !imageShapes) {
    return Array.from({ length: tiles }, (_, i) => initial?.[i] ?? at(i));
  }

  const used = new Set<number>();
  const take = (slot: Shape) => {
    for (let i = 0; i < poolSize; i += 1) {
      const index = at(i);
      if (!used.has(index) && fits(imageShapes[index] ?? 'square', slot)) return index;
    }
    for (let i = 0; i < poolSize; i += 1) if (!used.has(at(i))) return at(i);
    return 0;
  };

  return Array.from({ length: tiles }, (_, position) => {
    const slot = tileShapes[position] ?? 'square';
    const preferred = initial?.[position];
    const pick =
      preferred !== undefined &&
      !used.has(preferred) &&
      fits(imageShapes[preferred] ?? 'square', slot)
        ? preferred
        : take(slot);
    used.add(pick);
    return pick;
  });
}

/**
 * A set of images where one position quietly turns over every few seconds.
 *
 * Shared by every artisan wall. The subtle parts are the reason this behavior
 * lives here rather than being copied into each page:
 *
 * - **One at a time, and never the same one twice.** Simultaneous changes read
 *   as a slideshow; a single tile turning over reads as a room you keep
 *   noticing new things in. The tile that just changed is excluded from the
 *   next pick, because a tile changing twice in a row reads as a fault.
 * - **Never a duplicate.** Replacements are drawn only from images not
 *   currently on screen. The same photograph appearing twice at once is the
 *   thing that would make it look broken rather than alive.
 * - **Deterministic first paint.** The server and client must agree, so the
 *   opening set is simply the first `tiles` images from `offset`. Shuffling
 *   starts on mount, and is random, so two walls sharing a pool diverge after
 *   the first swap whatever they opened on.
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
  tileShapes,
  imageShapes,
  offset = 0,
}: ImageRotationOptions) {
  const [indices, setIndices] = useState(() =>
    openingSet(tiles, poolSize, initial, tileShapes, imageShapes, offset),
  );
  const [fading, setFading] = useState<number | null>(null);
  const [arriving, setArriving] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  /*
   * Held in refs rather than listed as effect dependencies. They are arrays,
   * so a caller building them inline gets a new identity on every render; as
   * dependencies they would tear down and restart the rotation each time,
   * which resets the interval and the no-repeat memory with it.
   */
  const shapes = useRef({ tileShapes, imageShapes });
  useEffect(() => {
    // After commit, not during render: writing a ref mid-render is what
    // `react-hooks/refs` forbids. The first swap is an interval away, so the
    // rotation never reads a stale value.
    shapes.current = { tileShapes, imageShapes };
  });

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

    /*
     * The tile that changed last, so it cannot change again immediately.
     *
     * A plain `Math.floor(Math.random() * tiles)` has no memory, so with ten
     * tiles it picked the same one twice in a row about one tick in ten, and
     * occasionally three times running. At 2.6s apart that does not read as
     * drift; it reads as a glitch in one corner of the wall, which is exactly
     * what was reported. Measured before the fix: 7 immediate repeats in 34
     * swaps, including three separate triples.
     */
    let lastPosition = -1;

    const swap = () => {
      if (isFrozen()) return;

      /*
       * Pick uniformly from every tile except the one that just changed.
       * Choosing from `tiles - 1` and stepping over `lastPosition` keeps the
       * remaining tiles equally likely, where re-rolling until the value
       * differs would not terminate in bounded time.
       */
      const choices = lastPosition < 0 ? tiles : tiles - 1;
      let position = Math.floor(Math.random() * choices);
      if (lastPosition >= 0 && position >= lastPosition) position += 1;
      lastPosition = position;

      setFading(position);

      // Change the image at the midpoint of the fade, while it cannot be seen.
      swapTimer = window.setTimeout(() => {
        setIndices((current) => {
          const onScreen = new Set(current);
          const { tileShapes: slots, imageShapes: pictures } = shapes.current;
          const slot = slots?.[position] ?? 'square';

          const offScreen = Array.from({ length: poolSize }, (_, i) => i).filter(
            (i) => !onScreen.has(i),
          );

          /*
           * Only photographs that suit this slot. If the shape runs out, fall
           * back to any off-screen image rather than skipping the swap: a
           * wall that visibly stops turning over is a worse failure than one
           * cropped picture, and the pool can shrink as the client edits it.
           */
          const suitable = offScreen.filter((i) => fits(pictures?.[i] ?? 'square', slot));
          const available = suitable.length > 0 ? suitable : offScreen;

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
