'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useProjectsIndexMotion } from '../motion/useProjectsIndexMotion';
import styles from '../styles/projects.module.css';

/**
 * Client boundary for projects: owns the page root element, runs the
 * page's motion, and applies the shared fail-open watchdog. The markup itself
 * stays a Server Component.
 */
export function ProjectsShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useProjectsIndexMotion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
