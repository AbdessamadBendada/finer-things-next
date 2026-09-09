'use client';

import type { ReactNode } from 'react';

import { useReveal, useServiceIndexMotion } from '@/shared/motion';
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
  /* Drives `--hero-shift`, the hero's parallax, exactly as on /our-work and
     /our-craft. The rest of that hook looks for service rows this page does not
     have and is a no-op without them. */
  useServiceIndexMotion(root);
  useServiceAccordion(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
