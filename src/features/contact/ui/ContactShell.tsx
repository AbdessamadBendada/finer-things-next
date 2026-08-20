'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useContactMotion } from '../motion/useContactMotion';
import styles from '../styles/contact.module.css';

/**
 * Client boundary for contact: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function ContactShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useContactMotion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
