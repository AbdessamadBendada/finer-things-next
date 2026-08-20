import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PROJECTS } from '@/features/projects';
import { PROJECT_SLUGS, ROUTES, type ProjectSlug } from '@/shared/config/routes';
import { BreadcrumbJsonLd, CreativeWorkJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

type RouteParams = { params: Promise<{ slug: string }> };

const isProjectSlug = (slug: string): slug is ProjectSlug =>
  PROJECT_SLUGS.includes(slug as ProjectSlug);

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

/**
 * Deliberately not `dynamicParams = false`: on the Cloudflare adapter that
 * flag makes the worker 404 the prerendered pages themselves. The route
 * already calls `notFound()` for any slug that is not in the registry, so
 * unknown paths still 404 — this only changes which layer decides.
 */

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  if (!isProjectSlug(slug)) return {};
  return buildMetadata(PROJECTS[slug].seo);
}

export default async function ProjectRoute({ params }: RouteParams) {
  const { slug } = await params;
  if (!isProjectSlug(slug)) notFound();

  const project = PROJECTS[slug];

  return (
    <>
      <project.Page />
      <BreadcrumbJsonLd
        trail={[
          { name: 'Projects', path: ROUTES.projects },
          { name: project.name, path: project.seo.path },
        ]}
      />
      <CreativeWorkJsonLd
        name={project.name}
        description={project.seo.description}
        path={project.seo.path}
        image={project.cover}
      />
    </>
  );
}
