import { ProjectNewPage } from '@/features/project-new';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Projects | Luxury Motion Study',
  description:
    'Bespoke accessories, styling and curation for the world\u2019s finest hotels and residences.',
  path: ROUTES.projects,
});

/**
 * The gallery, approved in review, is now the projects page.
 *
 * The editorial index it replaced is still built and reachable at
 * /projects-editorial, kept out of search and out of the menu, so the two can
 * be compared without a checkout. Delete that route once nobody wants to look
 * at it again.
 */
export default function ProjectsRoute() {
  return (
    <>
      <ProjectNewPage />
      <BreadcrumbJsonLd trail={[{ name: 'Projects', path: ROUTES.projects }]} />
    </>
  );
}
