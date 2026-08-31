import type { MetadataRoute } from 'next';

import { ROUTES } from '@/shared/config/routes';
import { SITE } from '@/shared/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // Placeholder legal text, while it is still a draft.
        ROUTES.privacy,
        ROUTES.terms,
        // The editorial projects index, superseded by the gallery.
        ROUTES.projectsEditorial,
      ],
    },
    sitemap: new URL('/sitemap.xml', SITE.url).toString(),
    host: SITE.url,
  };
}
