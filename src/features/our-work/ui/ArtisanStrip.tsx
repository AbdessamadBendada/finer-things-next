'use client';

import { ARTISAN_WALL } from '@/shared/content/artisans.content';
import { useImageRotation } from '@/shared/motion';
import { Media } from '@/shared/ui/Media';

/** Three across, matching the detail cards above. */
const TILES = 3;

/** One photograph turns over every two seconds. */
const INTERVAL = 2000;

/** Matches the CSS transition, so the swap happens mid-slide. */
const FADE = 700;

/**
 * The three the page opened on before it rotated: wood, ceramics, metal.
 * Kept as the first paint because it is a reviewed spread of materials, and
 * because it is the frame the parity screenshots capture.
 */
const OPENING = [
  ARTISAN_WALL.findIndex((shot) => shot.image === '/assets/new-artisan-wood-01.webp'),
  ARTISAN_WALL.findIndex((shot) => shot.image === '/assets/new-artisan-ceramics-07.webp'),
  ARTISAN_WALL.findIndex((shot) => shot.image === '/assets/new-artisan-glass-06.webp'),
];

/**
 * Three workshops, one of which is always changing.
 *
 * With only three on screen the turnover is far more noticeable than on the
 * About wall, so the interval is shorter and the slide is quicker: at this size
 * a slow fade reads as a page still loading rather than as motion.
 *
 * The `rise` class stays on each figure so the strip still performs its
 * one-time scroll reveal; the rotation is a separate, later behaviour and the
 * two do not fight, because the reveal animates the figure and the rotation
 * animates the image inside it.
 */
export function ArtisanStrip() {
  const { indices, fading, arriving, root } = useImageRotation({
    tiles: TILES,
    poolSize: ARTISAN_WALL.length,
    interval: INTERVAL,
    fade: FADE,
    initial: OPENING,
  });

  return (
    <div className="artisan-strip" ref={root} aria-label="Workshops we work with">
      {indices.map((imageIndex, position) => {
        const shot = ARTISAN_WALL[imageIndex];
        if (!shot) return null;
        return (
          /*
           * The figure's class never changes, and that is load-bearing. The
           * scroll reveal adds `in` to `.rise` elements imperatively, through
           * classList. If React also owned this className it would rewrite the
           * attribute on every swap and strip `in` back off, dropping the
           * figure to opacity 0 — the whole strip would vanish after the first
           * rotation. The changing classes live on the inner element instead,
           * which nothing else touches.
           */
          <figure className="artisan-shot rise" key={position}>
            <div
              className={[
                'artisan-swap',
                fading === position ? 'is-fading' : '',
                arriving === position ? 'is-arriving' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Media src={shot.image} alt={shot.alt} sizes="(max-width: 720px) 92vw, 30vw" />
            </div>
          </figure>
        );
      })}
    </div>
  );
}
