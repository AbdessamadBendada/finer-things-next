import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SERVICES } from '@/features/services';
import { SERVICE_SLUGS, ROUTES, type ServiceSlug } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

type RouteParams = { params: Promise<{ slug: string }> };

const isServiceSlug = (slug: string): slug is ServiceSlug =>
  SERVICE_SLUGS.includes(slug as ServiceSlug);

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

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
          { name: 'Our Work', path: ROUTES.ourWork },
          { name: service.name, path: service.seo.path },
        ]}
      />
    </>
  );
}
