'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useServicePageMotion } from '../motion/useServicePageMotion';
import styles from '../styles/bespoke-accessories.module.css';

/**
 * Client boundary for bespoke-accessories: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function BespokeAccessoriesShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useServicePageMotion(root, { projectDrift: { x: 12, y: 28, scale: 1.025 } });

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
