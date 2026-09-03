import type { RegisteredImage } from '@/shared/config/image-registry';
import { ROUTES } from '@/shared/config/routes';

export type WallTile = {
  image: RegisteredImage;
  /** The property. Shown on hover, bottom left. */
  property: string;
  location: string;
  path: string;
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

const MARSA = {
  property: 'Jumeirah Marsa Al Arab',
  location: 'Dubai',
  path: ROUTES.project('marsa-al-arab'),
} as const;
const WALDORF = {
  property: 'Waldorf Astoria Osaka',
  location: 'Japan',
  path: ROUTES.project('waldorf-astoria-osaka'),
} as const;

/**
 * The wall, on the client's own photography.
 *
 * Deliberately not grouped by property. Each tile carries its own credit on
 * hover, so the two hotels sit together as one body of work, which is what
 * keeps the page immersive rather than turning it into two labelled runs.
 *
 * Sizes are composed rather than generated: a large tile every few positions
 * gives the scroll a rhythm. The order below is the order on the page, and it
 * alternates between the wide shots of rooms and the close ones of objects so
 * neighbouring tiles never read as a pair.
 *
 * Twenty of the twenty-two supplied are used. The two left out are a phone
 * snapshot and a duplicate angle.
 */
export const WALL: readonly WallTile[] = [
  {
    image: '/assets/new-work-marsa-lobby-11.webp',
    ...MARSA,
    space: 'Lobby, styling and bespoke accessories',
    size: 'wide',
    alt: 'Layered decorative details in the Marsa Al Arab lobby',
  },
  {
    image: '/assets/new-work-bespoke-inlays.webp',
    ...MARSA,
    space: 'Private suite, bespoke accessories',
    alt: 'Bespoke leather trays inlaid in a lit suite drawer',
  },
  {
    image: '/assets/new-work-an-01344.webp',
    ...MARSA,
    space: 'Iliana, styling and florals',
    alt: 'A floral centrepiece on a marble dining table at Iliana',
  },
  {
    image: '/assets/new-work-waldorf-16.webp',
    ...WALDORF,
    space: 'Entrance hall, styling and curation',
    size: 'wide',
    alt: 'The entrance hall at Waldorf Astoria Osaka',
  },
  {
    image: '/assets/new-work-marsa-suite2-08.webp',
    ...MARSA,
    space: 'Private suite, bespoke trays',
    alt: 'A stitched leather tray holding a book and a porcelain flower',
  },
  {
    image: '/assets/new-work-marsa-lobby-05.webp',
    ...MARSA,
    space: 'Lobby, objects and styling',
    size: 'tall',
    alt: 'Sculptural objects styled on a lacquered lobby console',
  },
  {
    image: '/assets/new-work-an-01321.webp',
    ...MARSA,
    space: 'The Bombay Club, styling and curation',
    alt: 'Cloches, books and a painted jar on a marble counter',
  },
  {
    image: '/assets/new-work-marsa-shelfs.webp',
    ...MARSA,
    space: 'Lobby, coral and crystal',
    alt: 'Coral, crystal and a shell-inlaid box on lit marble shelves',
  },
  {
    image: '/assets/new-work-an-01515.webp',
    ...MARSA,
    space: 'Terrace, styling',
    alt: 'A brass drinks trolley set with crystal, the Burj Al Arab beyond',
  },
  {
    image: '/assets/new-work-marsa-lobby-08.webp',
    ...MARSA,
    space: 'Lobby, glass and marble',
    alt: 'A glass cloche and cut-glass vase on a marble lobby table',
  },
  {
    image: '/assets/new-work-marsa-corridor-03.webp',
    ...MARSA,
    space: 'Corridor, considered detail',
    size: 'wide',
    alt: 'Considered detail along the corridor at Marsa Al Arab',
  },
  {
    image: '/assets/new-work-marsa-suite2-02.webp',
    ...MARSA,
    space: 'Private suite, ceramics and florals',
    alt: 'Orchids in a gilt-edged ceramic bowl',
  },
  {
    image: '/assets/new-work-an-01285.webp',
    ...MARSA,
    space: 'Iliana, art and objects',
    alt: 'A sea fan mounted against a lit turquoise panel',
  },
  {
    image: '/assets/new-work-marsa-lobby-12.webp',
    ...MARSA,
    space: 'Lobby, styling',
    size: 'tall',
    alt: 'Styled detail in the Marsa Al Arab lobby',
  },
  {
    image: '/assets/new-work-marsa-lobby-06.webp',
    ...MARSA,
    space: 'Suite, books and objects',
    alt: 'A photography book and carved figures on a dark timber table',
  },
  {
    image: '/assets/new-work-an-01347.webp',
    ...MARSA,
    space: 'The Bombay Club, table styling',
    alt: 'Table settings and glassware at The Bombay Club',
  },
  {
    image: '/assets/new-work-marsa-suite2-07.webp',
    ...MARSA,
    space: 'Private suite, bespoke accessories',
    alt: 'Bespoke accessories arranged in a guest suite',
  },
  {
    image: '/assets/new-work-an-01469.webp',
    ...MARSA,
    space: 'Iliana, styling and curation',
    size: 'wide',
    alt: 'A styled arrangement of objects and florals at Iliana',
  },
  {
    image: '/assets/new-work-marsa-lobby-09.webp',
    ...MARSA,
    space: 'Lobby, florals and objects',
    alt: 'Florals and decorative objects in the lobby',
  },
  {
    image: '/assets/new-work-marsa-original-01.webp',
    ...MARSA,
    space: 'Public spaces, styling',
    alt: 'A styled corner of the public spaces at Marsa Al Arab',
  },
];
