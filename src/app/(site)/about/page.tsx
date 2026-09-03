import { AboutPage } from '@/features/about';
import { ROUTES } from '@/shared/config/routes';
import { BreadcrumbJsonLd } from '@/shared/seo/JsonLd';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Alex Lahmer, the Founder of Finer Things',
  description:
    "Alex Lahmer founded Finer Things to create distinctive bespoke accessories and designs for the world's finest hotels and residences.",
  path: ROUTES.about,
  /*
   * Absolute, because the approved title already ends in the brand. Letting the
   * root template append it again renders "Alex Lahmer, the Founder of Finer
   * Things | Finer Things", which is the duplication SEO-02 existed to remove.
   */
  absoluteTitle: true,
});

export default function AboutRoute() {
  return (
    <>
      <AboutPage />
      <BreadcrumbJsonLd trail={[{ name: 'About', path: ROUTES.about }]} />
    </>
  );
}
