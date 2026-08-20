'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { chromeFor, withCurrent, type FooterVariant } from '@/shared/config/navigation';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { useHeroNav } from './useHeroNav';

/**
 * The masthead and footer, rendered once per route group.
 *
 * Which footer a page gets is decided by the layout that renders this — that
 * is what the route groups in `app/` are for, and it means the shape of the
 * chrome is visible in the routing tree rather than looked up at runtime.
 *
 * The navigation links still vary per page (each page points at what matters
 * next), so those come from the central table keyed by pathname.
 */
export function SiteChrome({
  variant,
  children,
}: {
  variant: FooterVariant;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const chrome = chromeFor(pathname);
  const heroNav = useHeroNav();
  const slug =
    pathname === '/' ? 'home' : (pathname.split('/').filter(Boolean).at(-1) ?? 'home');

  return (
    <div data-page={slug}>
      <SiteHeader
        links={withCurrent(chrome?.header ?? [], pathname)}
        menu={chrome?.menu ? withCurrent(chrome.menu, pathname) : undefined}
        logo={chrome?.logo}
        scrollThreshold={chrome?.scrollThreshold}
        heroNav={variant === 'home' ? heroNav : 'none'}
        trailing={
          variant === 'minimal' ? (
            <a className="back" href="/contact">
              Contact
            </a>
          ) : undefined
        }
      />

      {children}

      {/* The home page composes its own footer: it carries the newsletter and
          a layout nothing else shares. */}
      {variant !== 'home' && <SiteFooter variant={variant} config={chrome?.footer} />}
    </div>
  );
}
