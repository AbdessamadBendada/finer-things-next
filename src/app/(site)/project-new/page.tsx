import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';
import { ROUTES } from '@/shared/config/routes';
import { ProjectNewPage } from '@/features/project-new';

export const metadata = buildMetadata({
  title: 'Selected work | Luxury Motion Study',
  description:
    'A gallery of bespoke accessories, styling and curation for the world’s finest hotels and residences.',
  path: ROUTES.projectNew,
});

export default function ProjectNewRoute() {
  return (
    <>
      <ProjectNewPage />
      <BreadcrumbJsonLd trail={[{ name: 'Selected work', path: ROUTES.projectNew }]} />
    </>
  );
}
