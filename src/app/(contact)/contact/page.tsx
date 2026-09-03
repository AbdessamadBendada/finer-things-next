import { ContactPage } from '@/features/contact';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Tell us what you are creating, where it is, and what you want people to remember. Finer Things works with hotels and residences worldwide.',
  path: ROUTES.contact,
});

export default function ContactRoute() {
  return (
    <>
      <ContactPage />
      <BreadcrumbJsonLd trail={[{ name: 'Contact', path: ROUTES.contact }]} />
    </>
  );
}
