import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SERVICES } from '@/features/services';
import { SERVICE_SLUGS, ROUTES, type ServiceSlug } from '@/shared/config/routes';
import { BreadcrumbJsonLd, ServiceJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

type RouteParams = { params: Promise<{ slug: string }> };

const isServiceSlug = (slug: string): slug is ServiceSlug =>
  SERVICE_SLUGS.includes(slug as ServiceSlug);

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

/**
 * Deliberately not `dynamicParams = false`: on the Cloudflare adapter that
 * flag makes the worker 404 the prerendered pages themselves. The route
 * already calls `notFound()` for any slug that is not in the registry, so
 * unknown paths still 404 — this only changes which layer decides.
 */

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  if (!isServiceSlug(slug)) return {};
  return buildMetadata(SERVICES[slug].seo);
}

export default async function ServiceRoute({ params }: RouteParams) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  const service = SERVICES[slug];

  return (
    <>
      <service.Page />
      <BreadcrumbJsonLd
        trail={[
          { name: 'What we do', path: ROUTES.ourWork },
          { name: service.name, path: service.seo.path },
        ]}
      />
      <ServiceJsonLd
        name={service.name}
        description={service.seo.description}
        path={service.seo.path}
      />
    </>
  );
}
