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
      title: 'Bespoke Accessories | Luxury Motion Study',
      description:
        'Bespoke hospitality accessories shaped around the identity, materials and story of each destination.',
      path: ROUTES.service('bespoke-accessories'),
    },
    Page: BespokeAccessoriesPage,
  },
  'styling-curation': {
    slug: 'styling-curation',
    name: 'Styling & Curation',
    seo: {
      title: 'Styling & Curation | Luxury Motion Study',
      description:
        'Styling and curation for guest rooms, public spaces, restaurants, residences and libraries.',
      path: ROUTES.service('styling-curation'),
    },
    Page: StylingCurationPage,
  },
  'finer-living': {
    slug: 'finer-living',
    name: 'Finer Living',
    seo: {
      title: 'Finer Living | Luxury Motion Study',
      description:
        'A curated collection of timeless pieces shaped by craftsmanship, material character and modern luxury.',
      path: ROUTES.service('finer-living'),
    },
    Page: FinerLivingPage,
  },
};
