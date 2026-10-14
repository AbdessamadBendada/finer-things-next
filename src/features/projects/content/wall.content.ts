import type { RegisteredImage } from '@/shared/config/image-registry';
import { ROUTES } from '@/shared/config/routes';

export type WallTile = {
  image: RegisteredImage;
  /**
   * The property. Shown on hover, bottom left.
   *
   * Optional, and absent on the second run of tiles below. The client supplied
   * nineteen further photographs with no accompanying property names, and
   * neither the deck nor the company spreadsheet in the same handover names
   * them. An uncredited tile is a photograph only: no link, no accessible name
   * beyond its alt text. Fill these in and they become links like the rest.
   */
  property?: string;
  location?: string;
  path?: string;
  /** The room or space, and what we supplied there. */
  space?: string;
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

  /*
   * The second handover: nineteen photographs, no property names supplied.
   * See the note on `property` above. They are a visibly different body of
   * work from the twenty above — leather desk and spa accessories, a
   * toile-papered residence, a panelled club room — so they run after the
   * hotel work rather than being interleaved with it.
   *
   * The order is composed around the grid rather than around the shoot. Every
   * landscape frame takes `wide`, because a landscape photograph forced into
   * the default 3 / 4 tile loses both its ends; the five of them are then
   * spaced at least three apart so the wall never shows two large tiles side
   * by side. `tall` goes only to the 2:3 frames that can carry it. Those
   * choices together leave the four-column grid with no gaps and a full last
   * row — change one and check the wall still packs.
   */
  {
    image: '/assets/new-work-woven-folio.webp',
    size: 'wide',
    alt: 'A woven leather folio on a tan tray beside a bowl of matcha',
  },
  {
    image: '/assets/new-work-skyline-folio.webp',
    space: 'Leather folio and tea service, above the city',
    alt: 'A leather folio and glasses case on marble, a city skyline at dusk beyond',
  },
  {
    image: '/assets/new-work-backgammon-board.webp',
    space: 'Bespoke games, timber and leather',
    alt: 'An inlaid backgammon board in timber with leather-edged detailing',
  },
  {
    image: '/assets/new-work-campaign-stool.webp',
    size: 'wide',
    alt: 'A stitched tan leather campaign stool, close on the seat and frame',
  },
  {
    image: '/assets/new-work-green-folio-tray.webp',
    space: 'Guest directory on a stone tray',
    alt: 'A dark green guest directory standing on a textured stone tray',
  },
  {
    image: '/assets/new-work-spa-terracotta.webp',
    space: 'Spa accessories, terracotta and timber',
    alt: 'Terracotta dishes, a wooden spoon and a coral bath flower in low sunlight',
  },
  {
    image: '/assets/new-work-shoe-tray.webp',
    size: 'wide',
    alt: 'Shoe trees and a horn shoehorn set in a lined leather valet tray',
  },
  {
    image: '/assets/new-work-reed-detail.webp',
    alt: 'A single slender reed against a pale, out-of-focus ground',
  },
  {
    image: '/assets/new-work-london-book-marble.webp',
    space: 'Library styling, books and stone',
    alt: 'A green London volume propped on a marble block on a stone table',
  },
  {
    image: '/assets/new-work-bath-celadon.webp',
    size: 'tall',
    alt: 'Celadon boxes, rolled towels and moss on a bathroom vanity',
  },
  {
    image: '/assets/new-work-beaton-bowl.webp',
    space: 'Books and a carved stone bowl',
    alt: 'A Cecil Beaton monograph beneath a weathered carved stone bowl',
  },
  {
    image: '/assets/new-work-sculpture-sky.webp',
    alt: 'A dark curved sculpture silhouetted against a bright blue sky',
  },
  {
    image: '/assets/new-work-suite-florals-tray.webp',
    size: 'tall',
    alt: 'Purple blooms in a glass vase on a lacquer tray in a sunlit suite',
  },
  {
    image: '/assets/new-work-toile-niche-boat.webp',
    space: 'Toile-papered niche, a model hull and florals',
    alt: 'A lit arched niche in leopard toile wallpaper holding a model boat and flowers',
  },
  {
    image: '/assets/new-work-toile-buffet.webp',
    space: 'Buffet styling, lanterns and fruit',
    alt: 'A dressed buffet of fruit, flowers and lanterns against toile wallpaper',
  },
  {
    image: '/assets/new-work-spa-towels-lacquer.webp',
    size: 'wide',
    alt: 'Folded linen and lacquered lidded pots on woven mats at a spa counter',
  },
  {
    image: '/assets/new-work-toile-shelf-vase.webp',
    space: 'Shelf styling, books and ceramics',
    alt: 'A fluted ceramic vase, books and glassware on a lit toile-papered shelf',
  },
  {
    image: '/assets/new-work-toile-ferrari-book.webp',
    space: 'Shelf styling, books and a model car',
    alt: 'A model Ferrari on a red book beside a framed photograph on a timber shelf',
  },
  {
    image: '/assets/new-work-velvet-banquettes.webp',
    size: 'wide',
    alt: 'Blue velvet sofas and marble tables in a timber-panelled room',
  },
];
