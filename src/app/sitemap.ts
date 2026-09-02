import type { MetadataRoute } from 'next';

import { ALL_ROUTES, ROUTES } from '@/shared/config/routes';
import { canonicalUrl } from '@/shared/seo/url';

/** Pages that should not be advertised to crawlers. */
const EXCLUDED = new Set<string>([ROUTES.privacy, ROUTES.terms]);

export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_ROUTES.filter((route) => !EXCLUDED.has(route)).map((route) => ({
    url: canonicalUrl(route),
  }));
}
