import { TermsPage } from '@/features/legal';
import { ROUTES } from '@/shared/config/routes';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Terms and Conditions | Luxury Motion Study',
  description: 'Placeholder website terms and conditions for Finer Things.',
  path: ROUTES.terms,
  noIndex: true,
});

export default function TermsRoute() {
  return <TermsPage />;
}
