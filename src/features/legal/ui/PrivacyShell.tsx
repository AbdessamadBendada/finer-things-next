'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useReadingIndex } from '../motion/useReadingIndex';
import styles from '../styles/privacy.module.css';

/**
 * Client boundary for privacy: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function PrivacyShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useReadingIndex(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
