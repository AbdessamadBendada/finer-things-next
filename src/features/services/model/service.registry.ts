import type { ComponentType } from 'react';

import { ROUTES, type ServiceSlug } from '@/shared/config/routes';
import type { PageSeo } from '@/shared/seo/metadata';

import { BespokeAccessoriesPage } from '../ui/BespokeAccessoriesPage';
import { FinerLivingPage } from '../ui/FinerLivingPage';
import { StylingCurationPage } from '../ui/StylingCurationPage';

export type ServiceEntry = {
  slug: ServiceSlug;
  name: string;
  seo: PageSeo;
  Page: ComponentType;
};

/** Slug -> service page. See project.registry.ts for the rationale. */
export const SERVICES: Record<ServiceSlug, ServiceEntry> = {
  'bespoke-accessories': {
    slug: 'bespoke-accessories',
    name: 'Bespoke Accessories',
    seo: {
      title: 'Bespoke Accessories for Luxury Hotels',
      description:
        "Bespoke hotel accessories shaped around the identity of a place, translating a property's architecture, heritage and materials into every detail guests touch.",
      path: ROUTES.service('bespoke-accessories'),
      image: {
        src: '/assets/new-cover-bespoke-accessories.webp',
        alt: 'A stitched leather tray on a walnut table',
      },
    },
    Page: BespokeAccessoriesPage,
  },
  'styling-curation': {
    slug: 'styling-curation',
    name: 'Styling & Curation',
    seo: {
      title: 'Styling and Curation for Hospitality',
      description:
        'Books, objects, art and florals sourced and arranged together, so guest rooms, public spaces and restaurants feel like nowhere else.',
      path: ROUTES.service('styling-curation'),
      /*
       * No `image`: the approved cover for this service is portrait 2:3 and a
       * link preview crops to roughly 1.91:1. The generated 1200x630 card is
       * the better preview until a landscape frame is approved.
       */
    },
    Page: StylingCurationPage,
  },
  'finer-living': {
    slug: 'finer-living',
    name: 'Finer Living',
    seo: {
      title: 'Finer Living, the Ready-Made Collection',
      description:
        'The ready-made collection by Finer Things. Wood, marble and glass, each piece chosen for its weight, texture and presence. In stock and fast to ship.',
      path: ROUTES.service('finer-living'),
      image: {
        src: '/assets/new-cover-finer-living.webp',
        alt: 'An oak and brass footed bowl from the Finer Living collection',
      },
    },
    Page: FinerLivingPage,
  },
};
