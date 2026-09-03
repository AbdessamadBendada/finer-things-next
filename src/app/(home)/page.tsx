import { HomePage } from '@/features/home';
import { ROUTES } from '@/shared/config/routes';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Finer Things | Exclusive Design Boutique',
  description:
    "Finer Things helps the world's finest hotels and residences tell their story through bespoke accessories, thoughtful styling and distinctive designs.",
  path: ROUTES.home,
  absoluteTitle: true,
});

export default function HomeRoute() {
  return <HomePage />;
}
