import Link from 'next/link';

import { ROUTES } from '@/shared/config/routes';

import styles from './status.module.css';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={styles.status} data-page="status">
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
  );
}
