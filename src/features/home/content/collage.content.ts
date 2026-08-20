import type { RegisteredImage } from '@/shared/config/image-registry';

/**
 * The tall stills that slide behind the hero.
 *
 * The strip animates from -50% to 0, so the list is rendered twice to make the
 * loop seamless — see HeroCollage.
 */
export const COLLAGE_STILLS: readonly RegisteredImage[] = [
  '/assets/hero1.webp',
  '/assets/hero2.webp',
  '/assets/hero3.webp',
  '/assets/hero4.webp',
  '/assets/hero5.webp',
  '/assets/hero6.webp',
  '/assets/hero7.webp',
];
