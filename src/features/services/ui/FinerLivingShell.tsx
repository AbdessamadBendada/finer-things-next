'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useProductFilms } from '../motion/useProductFilms';
import { useServicePageMotion } from '../motion/useServicePageMotion';
import styles from '../styles/finer-living.module.css';

/**
 * Client boundary for finer-living: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function FinerLivingShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useServicePageMotion(root, { projectDrift: { x: 7, y: 22, scale: 1.022 } });
  useProductFilms(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
