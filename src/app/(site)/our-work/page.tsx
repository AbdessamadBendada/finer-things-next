import { OurWorkPage } from '@/features/our-work';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Full-service design boutique',
  description:
    'Full-service design boutique creating bespoke, one-of-a-kind accessories for the luxury hotels and residences behind a new level of experience.',
  path: ROUTES.ourWork,
});

export default function OurWorkRoute() {
  return (
    <>
      <OurWorkPage />
      <BreadcrumbJsonLd trail={[{ name: 'What we do', path: ROUTES.ourWork }]} />
    </>
  );
}
