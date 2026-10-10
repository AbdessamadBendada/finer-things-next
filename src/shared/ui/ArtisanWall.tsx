'use client';

import { useMemo } from 'react';

import { ARTISAN_WALL } from '@/shared/content/artisans.content';
import { IMAGE_REGISTRY } from '@/shared/config/image-registry';
import { useImageRotation, type Shape } from '@/shared/motion';
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

/**
 * The shape of each slot, matching the grid in brand.css.
 *
 * Position 2 runs double width and position 4 runs double height, so the wall
 * still consumes exactly twelve cells: three full rows of four. Change either
 * here and you have to change the `nth-child` rules there too, and check the
 * cells still come to a multiple of four or the last row gains a hole.
 */
const TILE_SHAPES: readonly Shape[] = [
  'square',
  'wide', // nth-child(2), spans two columns
  'square',
  'tall', // nth-child(4), spans two rows
  'square',
  'square',
  'square',
  'square',
  'square',
  'square',
];

/**
 * Each photograph's shape, read from the registry rather than hand-listed.
 *
 * The registry already records real pixel dimensions for every asset, so
 * orientation is derivable and cannot drift out of sync with the files. The
 * thresholds are deliberately loose: anything close to square is treated as
 * square and allowed anywhere, since the crop there is cosmetic.
 */
function shapeOf(src: string): Shape {
  const size = IMAGE_REGISTRY[src as keyof typeof IMAGE_REGISTRY];
  if (!size) return 'square';
  const ratio = size.width / size.height;
  if (ratio < 0.9) return 'tall';
  if (ratio > 1.15) return 'wide';
  return 'square';
}

/** How often one tile changes. Slow enough to read as drift, not a slideshow. */
const INTERVAL = 2600;

/** Matches the CSS fade, so the swap happens while the tile is invisible. */
const FADE = 900;

/**
 * A wall of workshop photography that quietly rearranges itself.
 *
 * The rotation lives in `useImageRotation`. It changes one tile at a time,
 * never duplicates an image on screen, and stops when the wall is out of view
 * or the tab is in the background.
 */
/** The slot that runs two rows tall. Index into `TILE_SHAPES`. */
const TALL_SLOT = TILE_SHAPES.indexOf('tall');

/**
 * The photograph the tall slot opens on.
 *
 * The client asked for the workshop door in the tall slot specifically, and
 * first paint is the one frame every visitor sees and the only one that ends
 * up in a screenshot. After that the slot rotates like any other, drawing
 * from the portrait photographs.
 */
const OPENING_TALL_IMAGE = '/assets/new-artisan-ft-05.webp';

export function ArtisanWall() {
  const imageShapes = useMemo(() => ARTISAN_WALL.map((shot) => shapeOf(shot.image)), []);

  const initial = useMemo(() => {
    const door = ARTISAN_WALL.findIndex((shot) => shot.image === OPENING_TALL_IMAGE);
    if (door < 0 || TALL_SLOT < 0) return undefined;
    const set: number[] = [];
    set[TALL_SLOT] = door;
    return set;
  }, []);

  const { indices, fading, arriving, root } = useImageRotation({
    tiles: TILES,
    poolSize: ARTISAN_WALL.length,
    interval: INTERVAL,
    fade: FADE,
    initial,
    tileShapes: TILE_SHAPES,
    imageShapes,
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
