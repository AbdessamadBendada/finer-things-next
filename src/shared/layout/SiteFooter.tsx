import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  FOOTER_CONNECT,
  FOOTER_COPY,
  FOOTER_EXPLORE,
  type NavLink,
} from '@/shared/config/navigation';

/**
 * The site footer.
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

/**
 * The site footer. One shape, every page.
 *
 * There were four: the home page's own, a three-column version for the main
 * body, a compact row for contact, and a bare line for the legal pages. They
 * had drifted into four different link sets and four different heights, and
 * the client asked for one.
 *
 * This is the home page's, which was the fullest and the only one carrying the
 * newsletter. The `variant` prop is gone with the alternatives: a footer that
 * is the same everywhere does not need to be told which page it is on.
 */
export function SiteFooter({ newsletter }: { newsletter?: ReactNode }) {
  return (
    <footer>
      <div className="wrap">
        {newsletter && (
          <div className="footer-newsletter" aria-labelledby="newsletter-title">
            <div>
              <h2 id="newsletter-title">Stay in touch.</h2>
              <p>Occasional stories, new projects and distinctive designs.</p>
            </div>
            {newsletter}
          </div>
        )}

        <div className="ft-top">
          <div>
            <FooterBrand className="brand serif" />
            <p className="tag">{FOOTER_COPY.tagline}</p>
          </div>
          <div className="ft-cols">
            <div>
              <h4>Explore</h4>
              {FOOTER_EXPLORE.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </div>
            <div>
              <h4>Connect</h4>
              {FOOTER_CONNECT.map((link) => (
                <FooterLink key={`${link.href}-${link.label}`} {...link} />
              ))}
            </div>
          </div>
        </div>

        <div className="ft-btm">
          <span>{FOOTER_COPY.copyright}</span>
          <span className="tagline">{FOOTER_COPY.sign_off}</span>
        </div>
      </div>
    </footer>
  );
}
