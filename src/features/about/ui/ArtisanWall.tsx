'use client';

import { useEffect, useRef, useState } from 'react';

import { Media } from '@/shared/ui/Media';
import { prefersReducedMotion } from '@/shared/motion';

import { ARTISAN_WALL } from '../content/artisans.content';

/** Twelve on screen: three rows of four. */
const TILES = 12;

/** How often one tile changes. Slow enough to read as drift, not a slideshow. */
const INTERVAL = 2600;

/** Matches the CSS fade, so the swap happens while the tile is invisible. */
const FADE = 900;

/**
 * A wall of workshop photography that quietly rearranges itself.
 *
 * Twelve tiles, one changing every few seconds at a random position. Never two
 * at once: simultaneous changes read as a slideshow, where a single tile
 * turning over reads as a room you keep noticing new things in.
 *
 * The replacement is drawn only from images not currently on the wall, so the
 * same photograph can never appear twice at the same moment, which is the
 * thing that would make it look broken rather than alive.
 *
 * It stops when scrolled out of view, and never starts under reduced motion:
 * an animation that runs forever in a tab nobody is looking at is a waste of
 * battery, and this one has no meaning without an audience.
 */
export function ArtisanWall() {
  // Deterministic first paint. The server and the client must agree, so the
  // initial twelve are simply the first twelve; shuffling starts after mount.
  const [tiles, setTiles] = useState(() =>
    Array.from({ length: TILES }, (_, i) => i % ARTISAN_WALL.length),
  );
  const [fading, setFading] = useState<number | null>(null);
  const [arriving, setArriving] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    let timer = 0;
    let running = false;

    const swap = () => {
      const position = Math.floor(Math.random() * TILES);
      setFading(position);

      // Change the image at the midpoint of the fade, while it cannot be seen.
      window.setTimeout(() => {
        setTiles((current) => {
          const onScreen = new Set(current);
          const available = ARTISAN_WALL.map((_, i) => i).filter((i) => !onScreen.has(i));
          if (!available.length) return current;

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
        window.setTimeout(() => setArriving(null), FADE);
      }, FADE / 2);
    };

    const start = () => {
      if (running) return;
      running = true;
      timer = window.setInterval(swap, INTERVAL);
    };

    const stop = () => {
      running = false;
      window.clearInterval(timer);
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
  }, []);

  return (
    <div className="artisan-wall" ref={root} aria-label="Workshops we work with">
      {tiles.map((imageIndex, position) => {
        const shot = ARTISAN_WALL[imageIndex];
        if (!shot) return null;
        return (
          <figure
            className={[
              'artisan-tile',
              fading === position ? 'is-fading' : '',
              arriving === position ? 'is-arriving' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={position}
          >
            <Media src={shot.image} alt={shot.alt} sizes="(max-width: 860px) 33vw, 22vw" />
          </figure>
        );
      })}
    </div>
  );
}
