import type { ReactNode } from 'react';

import { SiteChrome } from '@/shared/layout/SiteChrome';

/**
 * The home page: its masthead stays hidden until the oversized wordmark in
 * the hero hands off to it, and its footer is bespoke (it carries the
 * newsletter), so this group renders no shared footer.
 *
 * Route groups do not affect the URL — they exist so the chrome a page gets
 * is declared by where the page lives. See docs/ARCHITECTURE.md.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteChrome variant="home">{children}</SiteChrome>;
}
