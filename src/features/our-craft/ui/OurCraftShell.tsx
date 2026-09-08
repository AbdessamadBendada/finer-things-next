'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useServiceIndexMotion } from '@/shared/motion';
import styles from '../styles/our-craft.module.css';

/**
 * Client boundary for our-craft: owns the page root element, runs the page's
 * motion, and applies the shared fail-open watchdog. The markup itself stays a
 * Server Component.
 *
 * The motion is the same hook /our-work uses. This page carries the hero, the
 * word-revealed intro and the `rise` sections that hook drives; it has no
 * service rows, and the hook is a no-op where it finds none.
 */
export function OurCraftShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useServiceIndexMotion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
