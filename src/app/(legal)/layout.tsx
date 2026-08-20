import type { ReactNode } from 'react';

import { SiteChrome } from '@/shared/layout/SiteChrome';

/**
 * The legal pages: no navigation, a single link back to Contact, and a
 * compact footer bar.
 *
 * Route groups do not affect the URL — they exist so the chrome a page gets
 * is declared by where the page lives. See docs/ARCHITECTURE.md.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteChrome variant="minimal">{children}</SiteChrome>;
}
