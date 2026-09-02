import { HomePage } from '@/features/home';
import { ROUTES } from '@/shared/config/routes';
import { SITE } from '@/shared/config/site';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: SITE.name,
  description:
    'Finer Things creates bespoke accessories, styling and curation for hospitality, residences and the world’s finest spaces.',
  path: ROUTES.home,
  absoluteTitle: true,
});

export default function HomeRoute() {
  return <HomePage />;
}
