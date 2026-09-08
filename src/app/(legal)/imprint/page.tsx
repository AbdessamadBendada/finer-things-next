import { ImprintPage } from '@/features/legal';
import { ROUTES } from '@/shared/config/routes';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Imprint',
  description: 'Placeholder imprint for the Finer Things website.',
  path: ROUTES.imprint,
  noIndex: true,
});

export default function ImprintRoute() {
  return <ImprintPage />;
}
