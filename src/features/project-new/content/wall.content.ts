import type { RegisteredImage } from '@/shared/config/image-registry';

export type WallTile = {
  image: RegisteredImage;
  /** The property. Shown on hover, bottom left. */
  property: string;
  location: string;
  /** The room or space, and what we supplied there. */
  space: string;
  /**
   * How much of the grid the tile takes. `wide` and `tall` are what stop the
   * wall reading as a uniform sheet of thumbnails, which is the single thing
   * that makes the reference page look like a template.
   */
  size?: 'wide' | 'tall';
  alt: string;
};

const MARSA = { property: 'Jumeirah Marsa Al Arab', location: 'Dubai' } as const;
const WALDORF = { property: 'Waldorf Astoria Osaka', location: 'Japan' } as const;

/**
 * The wall.
 *
 * Deliberately not grouped by property. Each tile carries its own credit on
 * hover, so the two hotels can sit together as one body of work rather than
 * as two labelled runs, which is what keeps the page immersive.
 *
 * Sizes are composed rather than generated: a large tile every few positions
 * gives the scroll a rhythm. The order below is the order on the page.
 *
 * We hold nineteen images against the thirty-one on the client's own gallery.
 * The format lives on density, so this wants the rest of the set when it
 * arrives. See docs/FEEDBACK.md.
 */
export const WALL: readonly WallTile[] = [
  {
    image: '/assets/0687_Marsa_Al_Arab_Lobby_8_25ea7574.webp',
    ...MARSA,
    space: 'Lobby, styling and bespoke accessories',
    size: 'wide',
    alt: 'Layered decorative details in the Marsa Al Arab lobby',
  },
  {
    image: '/assets/0663_Marsa_Al_Arab_Suite1_7_a51be4a1.webp',
    ...MARSA,
    space: 'Private suite, bespoke accessories',
    alt: 'A private suite at Marsa Al Arab',
  },
  {
    image: '/assets/0670_Marsa_Al_Arab_Bombay_5_95764db5.webp',
    ...MARSA,
    space: 'The Bombay Club, styling and curation',
    alt: 'Table settings at The Bombay Club',
  },
  {
    image: '/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp',
    ...WALDORF,
    space: 'Guest room, bespoke accessories',
    size: 'wide',
    alt: 'A guest room at Waldorf Astoria Osaka',
  },
  {
    image: '/assets/0661_Marsa_Al_Arab_Iliana_2_829970fd.webp',
    ...MARSA,
    space: 'Iliana, styling and curation',
    alt: 'Ceramic detail at Iliana',
  },
  {
    image: '/assets/0672_Marsa_Al_Arab_Lobby_10_4fff97ed.webp',
    ...MARSA,
    space: 'Lobby, objects and florals',
    size: 'tall',
    alt: 'Lobby detail at Marsa Al Arab',
  },
  {
    image: '/assets/0674_Marsa_Al_Arab_Suite1_1_49bd6513.webp',
    ...MARSA,
    space: 'Private suite, styling',
    alt: 'Suite detail at Marsa Al Arab',
  },
  {
    image: '/assets/0669_Waldorf_Astoria_Osaka_18_536d1f9e.webp',
    ...WALDORF,
    space: 'Corridor, curated objects',
    alt: 'A corridor at Waldorf Astoria Osaka',
  },
  {
    image: '/assets/0676_Marsa_Al_Arab_Lobby_5_b2051520.webp',
    ...MARSA,
    space: 'Lobby, bespoke accessories',
    alt: 'Distinctive objects in the Marsa Al Arab lobby',
  },
  {
    image: '/assets/0664_Marsa_Al_Arab_Suite2_4_78452d9c.webp',
    ...MARSA,
    space: 'Second suite, bespoke accessories',
    alt: 'A second suite at Marsa Al Arab',
  },
  {
    image: '/assets/0682_Waldorf_Astoria_Osaka_12_ef1532bb.webp',
    ...WALDORF,
    space: 'Lounge, styling and curation',
    size: 'wide',
    alt: 'A lounge at Waldorf Astoria Osaka',
  },
  {
    image: '/assets/0679_Marsa_Al_Arab_Bombay_3_09aae676.webp',
    ...MARSA,
    space: 'The Bombay Club, objects and books',
    alt: 'Shelf detail at The Bombay Club',
  },
  {
    image: '/assets/0681_Marsa_Al_Arab_Lobby_2_d21675ab.webp',
    ...MARSA,
    space: 'Lobby, marble and brass detail',
    alt: 'Marble and brass detail in the lobby',
  },
  {
    image: '/assets/0667_Marsa_Al_Arab_Lobby_9_dff7cff7.webp',
    ...MARSA,
    space: 'Lobby, styling',
    size: 'tall',
    alt: 'The lobby at Marsa Al Arab',
  },
  {
    image: '/assets/0689_Marsa_Al_Arab_Iliana_5_0c49bd95.webp',
    ...MARSA,
    space: 'Iliana, decorative objects',
    alt: 'Decorative objects at Iliana',
  },
  {
    image: '/assets/0686_Waldorf_Astoria_Osaka_16_948b5f8c.webp',
    ...WALDORF,
    space: 'Suite, bespoke accessories',
    alt: 'A suite at Waldorf Astoria Osaka',
  },
  {
    image: '/assets/0678_Marsa_Al_Arab_Lobby_4_b7af1dee.webp',
    ...MARSA,
    space: 'Lobby, considered detail',
    alt: 'Considered detail in the lobby',
  },
  {
    image: '/assets/0680_Marsa_Al_Arab_Iliana_3_e20bcd92.webp',
    ...MARSA,
    space: 'Iliana, ceramic installation',
    size: 'wide',
    alt: 'Ceramic installation at Iliana',
  },
  {
    image: '/assets/0685_Marsa_Al_Arab_Lobby_11_c9061482.webp',
    ...MARSA,
    space: 'Lobby, florals and objects',
    alt: 'Florals and objects in the lobby',
  },
];
