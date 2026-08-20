'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';

import { Media } from '@/shared/ui/Media';
import { useMobileMenu } from '@/shared/motion/useMobileMenu';
import { useScrollHeader } from '@/shared/motion/useScrollHeader';
import { useWordmark } from '@/shared/motion/useWordmark';

import { isAnchorLink, type NavLink } from './navigation';

type SiteHeaderProps = {
  /** Desktop navigation. */
  links?: readonly NavLink[];
  /** Full-screen menu below 860px. Omit on pages that have no menu (legal). */
  menu?: readonly NavLink[];
  /**
   * Every page renders the logo image. `mark` (the text wordmark the legacy
   * inner pages used) is kept for the rare case a page wants it.
   */
  logo?: 'wordmark' | 'mark';
  /**
   * Fraction of viewport height after which the header takes its `scrolled`
   * state. Omit to leave the header static.
   */
  scrollThreshold?: number;
  /** Extra element rendered in place of navigation (the legal "Contact" link). */
  trailing?: ReactNode;
};

function NavAnchor({ href, label, current, className }: NavLink & { className?: string }) {
  const props = {
    className,
    ...(current ? { 'aria-current': 'page' as const } : {}),
  };
  return isAnchorLink(href) ? (
    <a href={href} {...props}>
      {label}
    </a>
  ) : (
    <Link href={href} {...props}>
      {label}
    </Link>
  );
}

/**
 * The site masthead, shared by all twelve pages.
 *
 * Every page ships its own header *styling* (each legacy document defined its
 * own palette and header treatment, and those stylesheets were ported
 * verbatim), but the markup and behaviour are identical, so they live here.
 * The class names are deliberately the legacy ones — the page stylesheets
 * target them directly. See docs/ARCHITECTURE.md.
 */
export function SiteHeader({
  links = [],
  menu,
  logo = 'mark',
  scrollThreshold,
  trailing,
}: SiteHeaderProps) {
  const menuRef = useRef<HTMLElement>(null);
  const { open, toggle } = useMobileMenu(menuRef);
  const scrolled = useScrollHeader(scrollThreshold ?? 0.72);

  // The wordmark masthead stays hidden until the oversized logo in the hero
  // has finished shrinking into it. Inert on every other page.
  const visible = useWordmark(logo === 'wordmark');

  const headerClass = [
    'head',
    scrollThreshold !== undefined && scrolled ? 'scrolled' : '',
    visible ? 'show' : '',
    open ? 'menu-active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={headerClass} id="head">
        {logo === 'wordmark' ? (
          <Link href="/" className="logo" aria-label="Finer Things home">
            <Media src="/assets/finer-things-logo.png" alt="" priority />
          </Link>
        ) : (
          <Link className="logo" href="/">
            Finer Things
          </Link>
        )}

        {links.length > 0 && (
          <ul className="links">
            {links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <NavAnchor {...link} />
              </li>
            ))}
          </ul>
        )}

        {trailing}

        {menu && (
          <button
            className="menu-toggle"
            id="menuToggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={toggle}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        )}
      </header>

      {menu && (
        <nav
          ref={menuRef}
          className={open ? 'mobile-menu open' : 'mobile-menu'}
          id="mobileMenu"
          aria-label="Mobile navigation"
        >
          {menu.map((link) => (
            <NavAnchor key={`${link.href}-${link.label}`} {...link} />
          ))}
        </nav>
      )}
    </>
  );
}
