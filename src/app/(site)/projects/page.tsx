import { ProjectsPage } from '@/features/projects';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Projects | Luxury Motion Study',
  description: 'Selected hospitality work at Jumeirah Marsa Al Arab and Waldorf Astoria Osaka.',
  path: ROUTES.projects,
});

export default function ProjectsRoute() {
  return (
    <>
      <ProjectsPage />
      <BreadcrumbJsonLd trail={[{ name: 'Projects', path: ROUTES.projects }]} />
    </>
  );
}
