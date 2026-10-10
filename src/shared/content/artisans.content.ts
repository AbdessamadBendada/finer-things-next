import type { RegisteredImage } from '@/shared/config/image-registry';

export type ArtisanShot = {
  image: RegisteredImage;
  alt: string;
};

/**
 * The pool the artisan wall draws from.
 *
 * Curated rather than the whole delivery: of the twenty-seven photographs the
 * client sent, several are phone snapshots of stone yards and pallets that sit
 * oddly beside the workshop photography.
 *
 * Eighteen are in the pool. The client reviewed the wall on 2026-10-09 and cut
 * four (clay in a tub, a scalloped tile field, timber offcuts and a book at
 * the bench) and asked for two back in, the workshop door and the marble yard.
 * Both of those were already in the delivery, among the ones held back.
 *
 * Ten tiles are on screen and one swaps every few seconds, so a little over
 * half the set is visible at once and the arrangement never settles. The hook
 * needs the pool to stay comfortably above the tile count: at 18 against 10
 * there is room, but removing many more would make the rotation repetitive.
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
    image: '/assets/new-artisan-ft-14.webp',
    alt: 'A ceramics studio of plaster moulds and unglazed figures',
  },
  {
    image: '/assets/new-artisan-ft-13.webp',
    alt: 'A newly formed clay dish drying on a board',
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
    image: '/assets/new-artisan-fl-11.webp',
    alt: 'A workshop in the middle of a production run',
  },
  {
    image: '/assets/new-artisan-fl-12.webp',
    alt: 'Finished pieces set out for inspection',
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
  /*
   * Both added at the client's request, and both were already in the
   * delivery rather than newly supplied: they sat among the photographs held
   * back below. The marble yard in particular is one of the phone snapshots
   * that note describes. It goes in as supplied, on the client's call, and
   * it is the only picture in the wall that shows raw material before it is
   * worked.
   */
  {
    image: '/assets/new-artisan-ft-05.webp',
    alt: 'A workshop door, hand planes carved into its panels',
  },
  {
    image: '/assets/new-artisan-fl-62.webp',
    alt: 'Blocks of red and white veined marble in the yard',
  },
];
