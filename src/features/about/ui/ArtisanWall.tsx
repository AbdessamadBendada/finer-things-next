'use client';

import { ARTISAN_WALL } from '@/shared/content/artisans.content';
import { useImageRotation } from '@/shared/motion';
import { Media } from '@/shared/ui/Media';

/**
 * Ten on screen.
 *
 * The grid is four columns and two of the tiles run double width, so the wall
 * consumes twelve cells: exactly three full rows. Twelve tiles consumed
 * fifteen, which is three and three quarter rows, and left a visible hole in
 * the last one.
 */
const TILES = 10;

/** How often one tile changes. Slow enough to read as drift, not a slideshow. */
const INTERVAL = 2600;

/** Matches the CSS fade, so the swap happens while the tile is invisible. */
const FADE = 900;

/**
 * A wall of workshop photography that quietly rearranges itself.
 *
 * The rotation itself lives in `useImageRotation`, shared with the Our Work
 * artisan strip. Everything that makes it feel alive rather than broken — one
 * tile at a time, never a duplicate on screen, stopping when out of view or in
 * a background tab — is documented there.
 */
export function ArtisanWall() {
  const { indices, fading, arriving, root } = useImageRotation({
    tiles: TILES,
    poolSize: ARTISAN_WALL.length,
    interval: INTERVAL,
    fade: FADE,
  });

  return (
    <div className="artisan-wall" ref={root} aria-label="Workshops we work with">
      {indices.map((imageIndex, position) => {
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
            <Media src={shot.image} alt={shot.alt} sizes="(max-width: 860px) 45vw, 42vw" />
          </figure>
        );
      })}
    </div>
  );
}
