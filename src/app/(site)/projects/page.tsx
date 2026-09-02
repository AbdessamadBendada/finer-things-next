import { ProjectsPage } from '@/features/projects';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Projects | Luxury Motion Study',
  description:
    'Bespoke accessories, styling and curation for the world\u2019s finest hotels and residences.',
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
