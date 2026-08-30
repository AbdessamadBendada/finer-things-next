import type { RegisteredImage } from '@/shared/config/image-registry';

export type ArtisanShot = {
  image: RegisteredImage;
  alt: string;
};

/**
 * The pool the artisan wall draws from.
 *
 * Curated rather than the whole delivery: of the twenty-seven photographs the
 * client sent, a few are phone snapshots of stone yards and pallets that would
 * drag the wall down beside the workshop photography. Twenty are strong enough
 * to appear at any moment, which is what a wall that changes itself requires.
 *
 * Twelve tiles are on screen and one swaps every few seconds, so roughly half
 * the set is visible at once and the arrangement never settles.
 */
export const ARTISAN_WALL: readonly ArtisanShot[] = [
  {
    image: '/assets/new-artisan-fl-05.webp',
    alt: 'A glassblower shaping molten glass in a mould',
  },
  {
    image: '/assets/new-artisan-glass-30.webp',
    alt: 'A craftsman holding a wooden mould worn smooth by decades of use',
  },
  {
    image: '/assets/new-artisan-ceramics-07.webp',
    alt: 'A ceramicist throwing a cup on the wheel',
  },
  {
    image: '/assets/new-artisan-wood-16.webp',
    alt: 'A workshop wall of labelled timber samples and finished boxes',
  },
  {
    image: '/assets/new-artisan-ft-08.webp',
    alt: 'The open door of a kiln, its burner lit',
  },
  {
    image: '/assets/new-artisan-wood-01.webp',
    alt: 'Sawn walnut, oak and maple stacked in a joinery workshop',
  },
  {
    image: '/assets/new-artisan-glass-06.webp',
    alt: 'Metal moulds and tools racked along a workshop wall',
  },
  {
    image: '/assets/new-artisan-ceramics-29.webp',
    alt: 'Hand-formed clay pieces waiting to be fired',
  },
  {
    image: '/assets/new-artisan-ft-14.webp',
    alt: 'A ceramics studio of plaster moulds and unglazed figures',
  },
  {
    image: '/assets/new-artisan-ft-13.webp',
    alt: 'A newly formed clay dish drying on a board',
  },
  {
    image: '/assets/new-artisan-fl-33.webp',
    alt: 'Rows of scalloped tiles laid out to dry',
  },
  {
    image: '/assets/new-artisan-glass-20.webp',
    alt: 'Glassblowing tools laid out at the bench',
  },
  {
    image: '/assets/new-artisan-glass-26.webp',
    alt: 'A glass workshop bench at work',
  },
  {
    image: '/assets/new-artisan-wood-12.webp',
    alt: 'Timber offcuts and templates in a joinery',
  },
  {
    image: '/assets/new-artisan-fl-11.webp',
    alt: 'A workshop in the middle of a production run',
  },
  {
    image: '/assets/new-artisan-fl-12.webp',
    alt: 'Finished pieces set out for inspection',
  },
  {
    image: '/assets/new-artisan-fl-13.webp',
    alt: 'A maker at the bench, mid-process',
  },
  {
    image: '/assets/new-artisan-fl-16.webp',
    alt: 'Components laid out before assembly',
  },
  {
    image: '/assets/new-artisan-ft-10.webp',
    alt: 'Detail of a piece being finished by hand',
  },
  {
    image: '/assets/new-artisan-fl-29.webp',
    alt: 'A workshop interior, tools at rest',
  },
];
