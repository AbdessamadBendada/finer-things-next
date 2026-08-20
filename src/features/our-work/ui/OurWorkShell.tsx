'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useServiceIndexMotion } from '@/shared/motion';
import styles from '../styles/our-work.module.css';

/**
 * Client boundary for our-work: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function OurWorkShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useServiceIndexMotion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
