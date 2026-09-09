import type { RegisteredImage } from '@/shared/config/image-registry';
import { ROUTES } from '@/shared/config/routes';

/**
 * The three services, as the accordion presents them.
 *
 * This is a *summary* of each service, not a second copy of its page. Each
 * panel carries enough to decide whether the service is the one you want — the
 * proposition, what it covers, one photograph — and then sends you to the page
 * that holds the whole story.
 *
 * That boundary is deliberate. Putting the full service copy here would mean
 * the same sentences living in two files, and the next edit would land in one
 * of them: exactly how the artisan wall ended up duplicated across two features
 * before it was moved to `shared`. Facts that appear on both are short enough
 * to check at a glance; anything longer stays on the service page alone.
 */
export type ServiceScope = {
  /** Two digits, matching the numbering the service pages use. */
  number: string;
  title: string;
  note: string;
};

export type Service = {
  /** Also the panel's DOM id, so `/our-services#styling-curation` opens it. */
  slug: string;
  number: string;
  name: string;
  /** One line, shown in the closed summary row. */
  lede: string;
  /** The proposition, shown when the panel opens. */
  statement: string;
  scope: readonly ServiceScope[];
  /* `RegisteredImage`, not `string`: every asset on the site is registered with
     its dimensions, and typing it here means a photograph that does not exist
     fails the build rather than the page. */
  image: { src: RegisteredImage; alt: string };
  href: string;
};

export const SERVICES: readonly Service[] = [
  {
    slug: 'bespoke-accessories',
    number: '01',
    name: 'Bespoke Accessories',
    lede: 'The details guests touch, designed and produced for one property only.',
    statement:
      'We translate a property’s architecture, heritage and sense of place into distinctive accessories, considered as part of the experience, never added as an afterthought.',
    scope: [
      {
        number: '01',
        title: 'Narrative & identity',
        note: 'Creating bespoke touchpoints that reflect the property’s character and story.',
      },
      {
        number: '02',
        title: 'Customization',
        note: 'Considering material, colour, form, texture, finish and stitching.',
      },
      {
        number: '03',
        title: 'Sourcing & craftsmanship',
        note: 'Bringing quality materials together with artisanal craftsmanship.',
      },
      {
        number: '04',
        title: 'Project rollout support',
        note: 'Support shaped around the requirements and complexity of each project.',
      },
    ],
    image: {
      src: '/assets/new-cover-bespoke-accessories.webp',
      alt: 'A stitched leather tray on a walnut table',
    },
    href: ROUTES.service('bespoke-accessories'),
  },
  {
    slug: 'styling-curation',
    number: '02',
    name: 'Styling & Curation',
    lede: 'Objects, art and florals composed so every room feels like the place it is in.',
    statement:
      'Finer Things brings styling and storytelling together, sourcing the unexpected and composing each layer around the identity of the place.',
    scope: [
      {
        number: '01',
        title: 'Styling & storytelling',
        note: 'Creating a distinct narrative through the details that complete a space.',
      },
      {
        number: '02',
        title: 'Sourcing & selection',
        note: 'Books, objects, art and florals found with artisans around the world.',
      },
      {
        number: '03',
        title: 'Opening support',
        note: 'Supporting hotel, residence, restaurant, lounge and bar openings.',
      },
      {
        number: '04',
        title: 'Project fulfillment',
        note: 'Support shaped around the complexity and requirements of each project.',
      },
    ],
    image: {
      src: '/assets/new-cover-styling-curation.webp',
      alt: 'Sculptural objects styled on a lacquered console',
    },
    href: ROUTES.service('styling-curation'),
  },
  {
    slug: 'finer-living',
    number: '03',
    name: 'Finer Living',
    lede: 'The ready-made collection: European craftsmanship, in stock and fast to ship.',
    statement:
      'Finer Living carries the Finer Things point of view into a collection of distinctive pieces, bringing material character and considered design into the home.',
    scope: [
      {
        number: '01',
        title: 'Timeless pieces',
        note: 'A curated selection designed to live beyond passing trends.',
      },
      {
        number: '02',
        title: 'Distinctive stories',
        note: 'Objects chosen for the individual story and character they bring.',
      },
      {
        number: '03',
        title: 'Exceptional craftsmanship',
        note: 'Craft and material quality held at the centre of each piece.',
      },
      {
        number: '04',
        title: 'Enduring quality',
        note: 'A collection considered for modern living and lasting relevance.',
      },
    ],
    image: {
      src: '/assets/new-cover-finer-living.webp',
      alt: 'An oak and brass footed bowl from the Finer Living collection',
    },
    href: ROUTES.service('finer-living'),
  },
];

/**
 * The situation someone arrives with, and the service that answers it.
 *
 * Written as the reader's problem rather than as our offer — "the space is
 * built but it feels unfinished" is the sentence a client actually says on a
 * call, and it is what makes the choice obvious without them learning our
 * vocabulary first. The `href` is a panel id, so choosing an answer opens it.
 */
export const CHOICES = [
  {
    situation:
      'You are opening a property, and the details guests touch should exist nowhere else.',
    service: 'Bespoke Accessories',
    href: '#bespoke-accessories',
  },
  {
    situation: 'The space is built and furnished, but it still feels unfinished.',
    service: 'Styling & Curation',
    href: '#styling-curation',
  },
  {
    situation: 'You want considered pieces now, without commissioning them.',
    service: 'Finer Living',
    href: '#finer-living',
  },
] as const;
