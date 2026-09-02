import { AboutPage } from '@/features/about';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Meet Alex and Malika, the family behind Finer Things, shaped by two decades of international hospitality experience.',
  path: ROUTES.about,
});

export default function AboutRoute() {
  return (
    <>
      <AboutPage />
      <BreadcrumbJsonLd trail={[{ name: 'About', path: ROUTES.about }]} />
    </>
  );
}
