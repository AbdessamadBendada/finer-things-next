import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  FOOTER_COPY,
  type FooterConfig,
  type FooterVariant,
  type NavLink,
} from '@/shared/config/navigation';

/**
 * The site footer, in the three shapes the design actually uses.
 *
 * Previously this markup was copy-pasted into eight page components, so a
 * change to the footer meant eight edits. It is one component now; the link
 * sets come from shared/config/navigation.ts.
 *
 * Class names are the legacy ones because the page stylesheets target them
 * directly — see docs/ARCHITECTURE.md.
 */

function FooterLink({ href, label, current }: NavLink) {
  // In-page anchors and placeholder hrefs stay plain <a>.
  if (href.startsWith('#')) return <a href={href}>{label}</a>;
  return (
    <Link href={href} {...(current ? { 'aria-current': 'page' as const } : {})}>
      {label}
    </Link>
  );
}

/**
 * The wordmark, where the footer used to set the words "Finer Things" as type.
 *
 * Rendered as a masked box rather than an `<img>`: the only logo asset is dark
 * artwork, and every footer is dark. The mask paints the mark in
 * `currentColor`, so it takes each footer's own ink and stays legible without
 * a second, inverted copy of the file to keep in sync. Styled in brand.css.
 *
 * `role="img"` with a label because the box has no text of its own — the
 * footer would otherwise lose the brand name for a screen reader.
 */
export function FooterBrand({ className }: { className: string }) {
  return (
    <div className={`${className} footer-mark`} role="img" aria-label={FOOTER_COPY.brand} />
  );
}

function Separated({ links }: { links: readonly NavLink[] }) {
  return links.map((link, index) => (
    <span key={link.href}>
      {index > 0 && ' · '}
      <FooterLink {...link} />
    </span>
  ));
}

export function SiteFooter({
  variant,
  config,
  children,
}: {
  /** Comes from the route group's layout. */
  variant: FooterVariant;
  config?: FooterConfig;
  children?: ReactNode;
}) {
  if (variant === 'home') {
    // The home page's footer carries the newsletter and its own composition.
    return <footer>{children}</footer>;
  }

  if (variant === 'minimal') {
    return (
      <footer>
        <div className="wrap footer-row">
          <span>{FOOTER_COPY.copyright}</span>
          <span>
            <Separated links={config?.variant === 'minimal' ? config.links : []} />
          </span>
        </div>
      </footer>
    );
  }

  if (variant === 'contact') {
    return (
      <footer>
        <div className="wrap footer-row">
          <FooterBrand className="footer-brand" />
          <nav className="footer-links" aria-label="Footer navigation">
            {(config?.variant === 'row' ? config.links : []).map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </nav>
          <span className="copyright">
            {`${FOOTER_COPY.copyright} · `}
            <Link href="/privacy">Privacy</Link>
            {' · '}
            <Link href="/terms">Terms</Link>
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div>
            <FooterBrand className="footer-brand" />
            <p className="footer-tag">{FOOTER_COPY.tagline}</p>
          </div>
          <div className="footer-links">
            <div>
              <h3>Explore</h3>
              {(config?.variant === 'full' ? config.explore : []).map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </div>
            <div>
              <h3>Connect</h3>
              {(config?.variant === 'full' ? config.connect : []).map((link) => (
                <FooterLink key={`${link.href}-${link.label}`} {...link} />
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{FOOTER_COPY.copyright}</span>
          <em>{FOOTER_COPY.sign_off}</em>
        </div>
      </div>
    </footer>
  );
}
