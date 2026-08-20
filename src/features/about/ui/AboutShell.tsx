'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useAboutMotion } from '../motion/useAboutMotion';
import styles from '../styles/about.module.css';

/**
 * Client boundary for about: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function AboutShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useAboutMotion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
