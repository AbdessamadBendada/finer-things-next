'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { SITE_MENU, chromeFor, withCurrent } from '@/shared/config/navigation';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

/**
 * The masthead and footer, rendered once per route group.
 *
 * Neither varies by page any more. The burger menu is the same everywhere,
 * and so is the footer, so the only thing still looked up by pathname is the
 * scroll threshold. A route missing from that table still gets working chrome,
 * which the old per-page configuration could not promise.
 */
export function SiteChrome({
  slug: slugOverride,
  newsletter,
  children,
}: {
  /**
   * Which page's chrome styling to use, when the pathname cannot say.
   *
   * The 404 is the case this exists for: it renders under whatever URL the
   * visitor typed, so its slug came out as `nope` or `c` and chrome.css had no
   * rules for it, leaving the masthead completely unstyled.
   */
  slug?: string;
  /**
   * The newsletter form, composed in by the route.
   *
   * `shared` and sibling features are off-limits to each other, so the form
   * cannot be imported here. See docs/ARCHITECTURE.md.
   */
  newsletter?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const chrome = chromeFor(pathname);
  const slug =
    slugOverride ??
    (pathname === '/' ? 'home' : (pathname.split('/').filter(Boolean).at(-1) ?? 'home'));

  return (
    <div data-page={slug}>
      <SiteHeader
        menu={withCurrent(SITE_MENU, pathname)}
        scrollThreshold={chrome?.scrollThreshold}
        // The shrinking wordmark hands off to the masthead on home alone.
        heroHandoff={pathname === '/'}
      />

      {children}

      <SiteFooter newsletter={newsletter} />
    </div>
  );
}
