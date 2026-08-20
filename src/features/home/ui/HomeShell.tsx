'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useHomeMotion } from '../motion/useHomeMotion';
import styles from '../styles/home.module.css';

/**
 * Client boundary for the home page: owns the page root, runs the page's
 * motion, and applies the fail-open watchdog. The masthead is not its concern
 * — the shared header handles the wordmark hand-off itself.
 */
export function HomeShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useHomeMotion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
