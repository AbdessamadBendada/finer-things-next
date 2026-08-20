'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import styles from './status.module.css';

/**
 * Route-level error boundary.
 *
 * `digest` is the server-side identifier for the failure; showing it lets a
 * visitor quote something useful in a support email without exposing any of
 * the underlying detail.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side failures are not visible to the server logger, so this is
    // the seam where a browser-side reporter would be attached.
    console.error('[render-error]', error.digest ?? error.message);
  }, [error]);

  return (
    <div className={styles.status} data-page="status">
      <span className={styles.eyebrow}>Something went wrong</span>
      <h1 className={styles.title}>
        A detail is <em>out of place.</em>
      </h1>
      <p className={styles.copy}>
        This page could not be shown. Trying again usually resolves it; if it does not, please
        get in touch and quote the reference below.
      </p>
      <nav className={styles.links} aria-label="Recovery actions">
        <button type="button" onClick={reset}>
          Try again
        </button>
        <Link href="/">Home</Link>
      </nav>
      {error.digest && <p className={styles.copy}>Reference: {error.digest}</p>}
    </div>
  );
}
