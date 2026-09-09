'use client';

import type { ReactNode } from 'react';

import { useReveal } from '@/shared/motion';
import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useServiceAccordion } from '../motion/useServiceAccordion';
import styles from '../styles/our-services.module.css';

/**
 * Client boundary for our-services: owns the page root element, runs the page's
 * motion, and applies the shared fail-open watchdog. The markup itself stays a
 * Server Component.
 */
export function OurServicesShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useReveal(root);
  useServiceAccordion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
