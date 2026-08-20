import { SITE } from '@/shared/config/site';
import { ROUTES } from '@/shared/config/routes';

/**
 * Structured data helpers.
 *
 * JSON-LD is injected as a script tag with a fixed `application/ld+json` type,
 * so it is inert content rather than executable script — the CSP does not need
 * to allow it (docs/SECURITY.md).
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Serialised server-side from typed objects we construct ourselves; no
      // user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo: new URL(SITE.logo, SITE.url).toString(),
        description: SITE.description,
        slogan: SITE.tagline,
      }}
    />
  );
}

export type Breadcrumb = { name: string; path: string };

export function BreadcrumbJsonLd({ trail }: { trail: readonly Breadcrumb[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: ROUTES.home }, ...trail].map(
          (crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: new URL(crumb.path, SITE.url).toString(),
          }),
        ),
      }}
    />
  );
}

export function CreativeWorkJsonLd({
  name,
  description,
  path,
  image,
}: {
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name,
        description,
        url: new URL(path, SITE.url).toString(),
        ...(image ? { image: new URL(image, SITE.url).toString() } : {}),
        creator: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      }}
    />
  );
}
