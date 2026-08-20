import type { MetadataRoute } from 'next';

import { ALL_ROUTES, ROUTES } from '@/shared/config/routes';
import { SITE } from '@/shared/config/site';

/** Pages that should not be advertised to crawlers. */
const EXCLUDED = new Set<string>([ROUTES.privacy, ROUTES.terms]);

/** Home first, then the work, then everything else. */
function priorityFor(route: string): number {
  if (route === ROUTES.home) return 1;
  if (route === ROUTES.ourWork || route === ROUTES.projects) return 0.9;
  if (route.startsWith('/projects/') || route.startsWith('/services/')) return 0.8;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ALL_ROUTES.filter((route) => !EXCLUDED.has(route)).map((route) => ({
    url: new URL(route, SITE.url).toString(),
    lastModified,
    changeFrequency: 'monthly',
    priority: priorityFor(route),
  }));
}
