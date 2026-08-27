'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import {
  CHROME_ALIAS,
  SITE_MENU,
  chromeFor,
  withCurrent,
  type ChromeConfig,
  type FooterVariant,
} from '@/shared/config/navigation';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

/**
 * The masthead and footer, rendered once per route group.
 *
 * Which footer a page gets is decided by the layout that renders this — that
 * is what the route groups in `app/` are for, and it means the shape of the
 * chrome is visible in the routing tree rather than looked up at runtime.
 *
 * Navigation no longer varies: every page gets the same burger menu, so the
 * only thing still looked up by pathname is the footer and the scroll
 * threshold. A route missing from that table therefore still gets a working
 * menu, which the old per-page link sets could not promise.
 */
export function SiteChrome({
  variant,
  slug: slugOverride,
  footer: footerOverride,
  children,
}: {
  variant: FooterVariant;
  /**
   * Which page's chrome styling to use, when the pathname cannot say.
   *
   * The 404 is the case this exists for: it renders under whatever URL the
   * visitor typed, so its slug came out as `nope` or `c` and chrome.css had no
   * rules for it, leaving the masthead completely unstyled. Only in production
   * does Next report `/_not-found`, so a pathname-keyed alias fixed the build
   * and did nothing in dev, which is where it was being looked at.
   */
  slug?: string;
  /**
   * Footer contents, when the pathname cannot be looked up. Same reason as
   * `slug`: the 404 renders under any URL, so `chromeFor()` finds nothing and
   * its footer would come out empty.
   */
  footer?: ChromeConfig['footer'];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const chrome = chromeFor(pathname);
  const slug =
    slugOverride ??
    CHROME_ALIAS[pathname] ??
    (pathname === '/' ? 'home' : (pathname.split('/').filter(Boolean).at(-1) ?? 'home'));

  return (
    <div data-page={slug}>
      <SiteHeader
        menu={withCurrent(SITE_MENU, pathname)}
        scrollThreshold={chrome?.scrollThreshold}
        heroHandoff={variant === 'home'}
      />

      {children}

      {/* The home page composes its own footer: it carries the newsletter and
          a layout nothing else shares. */}
      {variant !== 'home' && (
        <SiteFooter variant={variant} config={footerOverride ?? chrome?.footer} />
      )}
    </div>
  );
}
