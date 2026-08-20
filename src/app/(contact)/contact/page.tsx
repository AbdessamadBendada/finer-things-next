import { ContactPage } from '@/features/contact';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Contact | Luxury Motion Study',
  description: 'Contact Finer Things to begin a conversation about your project.',
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
