import type { RegisteredImage } from '@/shared/config/image-registry';

/**
 * The tall stills that slide behind the hero.
 *
 * The strip animates from -50% to 0, so the list is rendered twice to make the
 * loop seamless — see HeroCollage.
 */
export const COLLAGE_STILLS: readonly RegisteredImage[] = [
  /*
   * The client's own materials, in place of the stock textures that shipped
   * with the mockup. They were the only generic photography left on the site.
   *
   * Ordered so neighbours contrast: the strip is always showing two or three
   * cells at once, and putting the two pale materials together left a washed
   * band sliding past. Dark leather, pale shell, wood, glass, horn, fabric,
   * lacquer.
   *
   * Nine were supplied and seven are used. Resin and stitching are held back:
   * stitching is a detail of leather rather than a material of its own, and
   * resin reads as glass at the size a moving cell allows.
   *
   * Every cell is cropped to 9/16 by `.collage .cell`, so roughly the middle
   * 56% of each square survives. That is less than the images it replaces
   * lost, which were nearer square still.
   */
  '/assets/new-material-leather.webp',
  '/assets/new-material-shell.webp',
  '/assets/new-material-wood.webp',
  '/assets/new-material-glass.webp',
  '/assets/new-material-horn.webp',
  '/assets/new-material-fabric.webp',
  '/assets/new-material-lacquer.webp',
];
