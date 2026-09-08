import { OurCraftPage } from '@/features/our-craft';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Our Craft, the materials and the makers',
  description:
    'The materials behind every Finer Things piece: leather, wood, horn, lacquer, resin and shell. The workshops that work them by hand, and the process from a first conversation to an installed piece.',
  path: ROUTES.ourCraft,
});

export default function OurCraftRoute() {
  return (
    <>
      <OurCraftPage />
      <BreadcrumbJsonLd trail={[{ name: 'Our craft', path: ROUTES.ourCraft }]} />
    </>
  );
}
