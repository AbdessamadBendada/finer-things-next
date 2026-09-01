import { HomePage } from '@/features/home';
import { ROUTES } from '@/shared/config/routes';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Finer Things | Luxury Motion Study',
  description:
    'Finer Things creates bespoke accessories, styling and curation for hospitality, residences and the world’s finest spaces.',
  path: ROUTES.home,
});

export default function HomeRoute() {
  return <HomePage />;
}
