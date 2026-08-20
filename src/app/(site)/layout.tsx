import type { ReactNode } from 'react';

import { SiteChrome } from '@/shared/layout/SiteChrome';

/**
 * The main body of the site — Our Work, Projects, the project stories, the
 * service pages and About. They share the full three-column footer.
 *
 * Route groups do not affect the URL — they exist so the chrome a page gets
 * is declared by where the page lives. See docs/ARCHITECTURE.md.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteChrome variant="site">{children}</SiteChrome>;
}
