import type { ComponentType } from 'react';

import { ROUTES, type ProjectSlug } from '@/shared/config/routes';
import type { PageSeo } from '@/shared/seo/metadata';

import { MarsaAlArabPage } from '../ui/MarsaAlArabPage';
import { WaldorfAstoriaOsakaPage } from '../ui/WaldorfAstoriaOsakaPage';

export type ProjectEntry = {
  slug: ProjectSlug;
  /** Display name, used for breadcrumbs and structured data. */
  name: string;
  location: string;
  cover: string;
  seo: PageSeo;
  Page: ComponentType;
};

/**
 * Each project is an individually art-directed document rather than a
 * templated record, so the registry maps a slug to its component plus the
 * metadata the route needs. Adding a project means adding one entry here and
 * one component — the route file never changes.
 */
export const PROJECTS: Record<ProjectSlug, ProjectEntry> = {
  'marsa-al-arab': {
    slug: 'marsa-al-arab',
    name: 'Jumeirah Marsa Al Arab',
    location: 'Dubai, United Arab Emirates',
    cover: '/assets/0687_Marsa_Al_Arab_Lobby_8_25ea7574.webp',
    seo: {
      title: 'Jumeirah Marsa Al Arab | Luxury Motion Study',
      description: 'A visual story of selected spaces at Jumeirah Marsa Al Arab in Dubai.',
      path: ROUTES.project('marsa-al-arab'),
    },
    Page: MarsaAlArabPage,
  },
  'waldorf-astoria-osaka': {
    slug: 'waldorf-astoria-osaka',
    name: 'Waldorf Astoria Osaka',
    location: 'Osaka, Japan',
    cover: '/assets/0686_Waldorf_Astoria_Osaka_16_948b5f8c.webp',
    seo: {
      title: 'Waldorf Astoria Osaka | Luxury Motion Study',
      description:
        'A visual story of selected guest-room details at Waldorf Astoria Osaka in Japan.',
      path: ROUTES.project('waldorf-astoria-osaka'),
    },
    Page: WaldorfAstoriaOsakaPage,
  },
};
