'use client';

import type { ReactNode } from 'react';

import { useReveal } from '@/shared/motion';
import { usePageRoot } from '@/shared/motion/usePageRoot';

import styles from '../styles/projects.module.css';

/**
 * Client boundary for the gallery page: owns the page root, reveals the wall
 * as it is scrolled, and applies the shared fail-open watchdog through
 * `usePageRoot`. The markup itself stays a Server Component.
 */
export function ProjectsShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();

  // Tiles arrive in their own time rather than as one block, capped so a long
  // wall never trails far behind the scroll.
  useReveal(root, { selector: '.rise', stagger: 70, staggerCap: 3 });

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
