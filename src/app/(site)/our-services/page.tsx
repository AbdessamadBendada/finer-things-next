import { OurServicesPage } from '@/features/our-services';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Our Services, bespoke accessories, styling and Finer Living',
  description:
    'The three ways Finer Things works with a property: bespoke accessories designed for one place, styling and curation that complete a space, and the ready-made Finer Living collection.',
  path: ROUTES.ourServices,
});

export default function OurServicesRoute() {
  return (
    <>
      <OurServicesPage />
      <BreadcrumbJsonLd trail={[{ name: 'Our services', path: ROUTES.ourServices }]} />
    </>
  );
}
