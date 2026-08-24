'use client';

import Link from 'next/link';
import { useRef } from 'react';

import { useMobileMenu } from '@/shared/motion/useMobileMenu';
import { useScrollHeader } from '@/shared/motion/useScrollHeader';
import { useWordmark } from '@/shared/motion/useWordmark';

import { isAnchorLink, type NavLink } from './navigation';

type SiteHeaderProps = {
  /** The site menu. One set, every page — see config/navigation.ts. */
  menu: readonly NavLink[];
  /**
   * Fraction of viewport height after which the header takes its `scrolled`
   * state. Omit to leave the header static.
   */
  scrollThreshold?: number;
  /**
   * Home only: the oversized hero wordmark shrinks into this masthead's logo.
   * Until it lands, the masthead shows no logo of its own and no bar.
   */
  heroHandoff?: boolean;
};

function NavAnchor({ href, label, current }: NavLink) {
  const props = current ? { 'aria-current': 'page' as const } : {};
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
 * Navigation is a burger and nothing else, at every width and on every page.
 * The desktop link row is gone: with one menu there is only one list to keep
 * correct, and the masthead stays out of the way of the photography — which is
 * what the review was asking for. See docs/FEEDBACK.md.
 *
 * Every page renders the logo image (docs/adr/0007-one-logo.md). The class
 * names are deliberately the legacy ones — the page stylesheets target them
 * directly. See docs/ARCHITECTURE.md.
 */
export function SiteHeader({ menu, scrollThreshold, heroHandoff = false }: SiteHeaderProps) {
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { open, toggle, close } = useMobileMenu(menuRef, toggleRef);
  const scrolled = useScrollHeader(scrollThreshold ?? 0.72);

  // On home the masthead stays hidden until the oversized hero wordmark has
  // finished shrinking into it. Inert on every other page.
  const docked = useWordmark(heroHandoff);
  const beforeHandoff = heroHandoff && !docked;

  const headerClass = [
    'head',
    scrollThreshold !== undefined && scrolled ? 'scrolled' : '',
    docked ? 'show' : '',
    open ? 'menu-active' : '',
    beforeHandoff ? 'hero-nav' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={headerClass} id="head">
        {beforeHandoff ? (
          // Placeholder keeps the burger pinned right while the hero wordmark
          // holds the logo's place. Hidden from assistive tech: the wordmark
          // below already carries the site name.
          <span className="logo logo-placeholder" aria-hidden="true" />
        ) : (
          <Link href="/" className="logo" aria-label="Finer Things home">
            {/* Painted by a CSS mask rather than served as an image, so the
                mark takes the masthead's own colour. See brand.css. */}
            <span className="logo-mark" aria-hidden="true" />
          </Link>
        )}

        <button
          ref={toggleRef}
          className="menu-toggle"
          id="menuToggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobileMenu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={toggle}
        >
          <span className="burger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <nav
        ref={menuRef}
        className={open ? 'mobile-menu open' : 'mobile-menu'}
        id="mobileMenu"
        aria-label="Site navigation"
        /*
         * Delegated so it survives the menu's contents changing, and so it
         * catches in-page anchors — those never change the pathname, so the
         * route-change close in useMobileMenu would not fire for them.
         */
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) close();
        }}
      >
        {menu.map((link) => (
          <NavAnchor key={`${link.href}-${link.label}`} {...link} />
        ))}
      </nav>
    </>
  );
}
