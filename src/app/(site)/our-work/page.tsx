import { OurWorkPage } from '@/features/our-work';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'What we do | Luxury Motion Study',
  description: 'Bespoke accessories, styling and curation, and Finer Living by Finer Things.',
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
