import type { ReactNode } from 'react';

import { SiteChrome } from '@/shared/layout/SiteChrome';

/**
 * Contact closes on a single-row footer aligned to the baseline.
 *
 * Route groups do not affect the URL — they exist so the chrome a page gets
 * is declared by where the page lives. See docs/ARCHITECTURE.md.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteChrome variant="contact">{children}</SiteChrome>;
}
