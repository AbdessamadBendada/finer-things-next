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
      title: 'Bespoke Accessories',
      description:
        'Bespoke hospitality accessories shaped around the identity, materials and story of each destination.',
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
      title: 'Styling & Curation',
      description:
        'Styling and curation for guest rooms, public spaces, restaurants, residences and libraries.',
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
      title: 'Finer Living',
      description:
        'A curated collection of timeless pieces shaped by craftsmanship, material character and modern luxury.',
      path: ROUTES.service('finer-living'),
      image: {
        src: '/assets/new-cover-finer-living.webp',
        alt: 'An oak and brass footed bowl from the Finer Living collection',
      },
    },
    Page: FinerLivingPage,
  },
};
