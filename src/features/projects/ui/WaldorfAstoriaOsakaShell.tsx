'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useProjectStoryMotion } from '../motion/useProjectStoryMotion';
import styles from '../styles/waldorf-astoria-osaka.module.css';

/**
 * Client boundary for waldorf-astoria-osaka: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function WaldorfAstoriaOsakaShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useProjectStoryMotion(root, {
    heroDrift: 24,
    chapterDrift: 22,
    chapterNumberDrift: 14,
    shotFactor: 0.55,
    markPassing: false,
  });

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
