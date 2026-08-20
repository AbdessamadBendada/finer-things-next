'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useProjectStoryMotion } from '../motion/useProjectStoryMotion';
import styles from '../styles/marsa-al-arab.module.css';

/**
 * Client boundary for marsa-al-arab: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function MarsaAlArabShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useProjectStoryMotion(root, {
    heroDrift: 34,
    chapterDrift: 38,
    chapterNumberDrift: 22,
    shotFactor: 1,
    markPassing: true,
  });

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
