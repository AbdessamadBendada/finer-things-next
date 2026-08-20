'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';

import { Media } from '@/shared/ui/Media';
import { useMobileMenu } from '@/shared/motion/useMobileMenu';
import { useScrollHeader } from '@/shared/motion/useScrollHeader';
import { useWordmark } from '@/shared/motion/useWordmark';

import { isAnchorLink, type NavLink } from './navigation';
import type { HeroNavVariant } from './useHeroNav';

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
  /**
   * Home only, and temporary: which navigation to show while the hero
   * wordmark is still on screen. See useHeroNav.
   */
  heroNav?: HeroNavVariant;
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
  heroNav = 'none',
}: SiteHeaderProps) {
  const menuRef = useRef<HTMLElement>(null);
  const { open, toggle } = useMobileMenu(menuRef);
  const scrolled = useScrollHeader(scrollThreshold ?? 0.72);

  // The wordmark masthead stays hidden until the oversized logo in the hero
  // has finished shrinking into it. Inert on every other page.
  const visible = useWordmark(logo === 'wordmark');

  /**
   * Two separate things, which used to be conflated:
   *
   * `variantActive` — this page is running a hero-nav variant at all. The
   *   burger persists the whole way down the page, so this does not stop at
   *   the hand-off; that is what made it vanish on scroll.
   * `beforeHandoff` — the wordmark still holds the logo's place, so the
   *   masthead shows navigation but no logo of its own.
   */
  const variantActive = heroNav !== 'none';
  const beforeHandoff = variantActive && !visible;

  // Only the burger is meant to stay for the whole page. A lone "Contact"
  // below the fold would leave no way to reach anything else, so the other
  // variants hand back to the normal navigation once the header docks.
  const navTreatment = heroNav === 'burger' || beforeHandoff ? heroNav : 'none';

  const headerClass = [
    'head',
    scrollThreshold !== undefined && scrolled ? 'scrolled' : '',
    visible ? 'show' : '',
    open ? 'menu-active' : '',
    beforeHandoff ? 'hero-nav' : '',
    navTreatment !== 'none' ? `nav-${navTreatment}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={headerClass} id="head">
        {beforeHandoff ? (
          // Placeholder keeps the nav pinned right while the wordmark holds
          // the logo's place. Hidden from assistive tech: the wordmark below
          // already carries the site name.
          <span className="logo logo-placeholder" aria-hidden="true" />
        ) : logo === 'wordmark' ? (
          <Link href="/" className="logo" aria-label="Finer Things home">
            <Media src="/assets/finer-things-logo.png" alt="" priority />
          </Link>
        ) : (
          <Link className="logo" href="/">
            Finer Things
          </Link>
        )}

        {navTreatment === 'contact' && (
          <Link href="/contact" className="hero-nav-link">
            Contact
          </Link>
        )}

        {links.length > 0 && navTreatment !== 'burger' && navTreatment !== 'contact' && (
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
            className={
              navTreatment === 'burger' ? 'menu-toggle menu-toggle-burger' : 'menu-toggle'
            }
            id="menuToggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobileMenu"
            aria-label={
              navTreatment === 'burger' ? (open ? 'Close menu' : 'Open menu') : undefined
            }
            onClick={toggle}
          >
            {navTreatment === 'burger' ? (
              <span className="burger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : open ? (
              'Close'
            ) : (
              'Menu'
            )}
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
