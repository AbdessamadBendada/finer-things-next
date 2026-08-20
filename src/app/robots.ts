import type { MetadataRoute } from 'next';

import { ROUTES } from '@/shared/config/routes';
import { SITE } from '@/shared/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Placeholder legal text should not be indexed while it is still a draft.
      disallow: [ROUTES.privacy, ROUTES.terms],
    },
    sitemap: new URL('/sitemap.xml', SITE.url).toString(),
    host: SITE.url,
  };
}
