import { ProjectsPage } from '@/features/projects';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Selected Projects',
  description:
    "Selected work for the world's finest hotels and residences, photographed in place. Every image carries the property and the space it was made for.",
  path: ROUTES.projects,
});

/** The gallery, approved in review, is the projects page. */
export default function ProjectsRoute() {
  return (
    <>
      <ProjectsPage />
      <BreadcrumbJsonLd trail={[{ name: 'Projects', path: ROUTES.projects }]} />
    </>
  );
}
