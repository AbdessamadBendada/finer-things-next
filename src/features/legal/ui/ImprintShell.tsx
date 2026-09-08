'use client';

import type { ReactNode } from 'react';

import { usePageRoot } from '@/shared/motion/usePageRoot';

import { useReadingIndex } from '../motion/useReadingIndex';
import styles from '../styles/terms.module.css';

/** Client boundary for the Imprint page's reading index and reveal state. */
export function ImprintShell({ children }: { children: ReactNode }) {
  const root = usePageRoot();
  useReadingIndex(root);

  return (
    <div ref={root} className={styles.page}>
      {children}
    </div>
  );
}
