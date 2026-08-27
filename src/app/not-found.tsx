import Link from 'next/link';

import { FOOTER_LINKS } from '@/shared/config/navigation';
import { ROUTES } from '@/shared/config/routes';
import { SiteChrome } from '@/shared/layout/SiteChrome';
import { Media } from '@/shared/ui/Media';

import styles from './status.module.css';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

/**
 * Four pieces of the work, two down each side of the message.
 *
 * The page used to be cream with three lines of type in one corner, and read
 * as a system page rather than part of the site. These give it the
 * photography every other page has. Staggered rather than aligned, and pulled
 * back in contrast, so they frame the message instead of competing with it.
 */
const ASIDES = [
  {
    src: '/assets/0674_Marsa_Al_Arab_Suite1_1_49bd6513.webp',
    alt: 'Suite detail at Marsa Al Arab',
    side: 'left',
  },
  {
    src: '/assets/0679_Marsa_Al_Arab_Bombay_3_09aae676.webp',
    alt: 'Shelf detail at The Bombay Club',
    side: 'left',
  },
  {
    src: '/assets/0689_Marsa_Al_Arab_Iliana_5_0c49bd95.webp',
    alt: 'Decorative objects at Iliana',
    side: 'right',
  },
  {
    src: '/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp',
    alt: 'Guest-room detail at Waldorf Astoria Osaka',
    side: 'right',
  },
] as const;

export default function NotFound() {
  // The chrome slug is stated rather than derived: this page renders under
  // whatever URL the visitor typed, so the pathname cannot identify it.
  return (
    <SiteChrome
      variant="contact"
      slug="contact"
      footer={{ variant: 'row', links: FOOTER_LINKS }}
    >
      <div className={styles.status} data-page="status">
        <div className={styles.asides} aria-hidden="true">
          {ASIDES.map((aside, index) => (
            <figure
              key={aside.src}
              className={`${styles.aside} ${styles[aside.side]}`}
              data-index={index}
            >
              <Media src={aside.src} alt="" sizes="(max-width: 900px) 60vw, 22vw" />
            </figure>
          ))}
        </div>

        <div className={styles.middle}>
          <span className={styles.eyebrow}>404</span>
          <h1 className={styles.title}>
            This page has been <em>put away.</em>
          </h1>
          <p className={styles.copy}>
            The page you were looking for is no longer here. The work, the projects and the
            collection are all a click away.
          </p>
          <nav className={styles.links} aria-label="Recovery navigation">
            <Link href={ROUTES.home}>Home</Link>
            <Link href={ROUTES.projects}>Projects</Link>
            <Link href={ROUTES.contact}>Contact</Link>
          </nav>
        </div>
      </div>
    </SiteChrome>
  );
}
