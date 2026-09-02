import { PrivacyPage } from '@/features/legal';
import { ROUTES } from '@/shared/config/routes';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Placeholder privacy policy for the Finer Things website.',
  path: ROUTES.privacy,
  noIndex: true,
});

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
