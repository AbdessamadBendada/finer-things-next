import type { ReactNode } from 'react';

import { NewsletterForm } from '@/features/newsletter';
import { SiteChrome } from '@/shared/layout/SiteChrome';

/**
 * Route groups do not affect the URL — they exist so the chrome a page gets is
 * declared by where the page lives. See docs/ARCHITECTURE.md.
 *
 * Every group now renders the same chrome, including the newsletter: the
 * footer is identical site-wide. The groups remain because the legal and
 * contact pages differ in other ways, and because collapsing the routing tree
 * is a larger change than this one.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteChrome newsletter={<NewsletterForm />}>{children}</SiteChrome>;
}
