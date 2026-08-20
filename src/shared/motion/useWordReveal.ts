'use client';

import { useEffect, type RefObject } from 'react';

import { prefersReducedMotion } from './useReducedMotion';

const PROCESSED = 'wordRevealReady';

/**
 * Splits `[data-word-reveal]` headings into per-word masks, then reveals them
 * as a group when the heading scrolls into view.
 *
 * The wrapping is deliberately imperative, exactly as in the legacy scripts:
 * the copy is authored as ordinary prose in the markup (so it stays readable,
 * selectable and crawlable) and the spans are a purely presentational overlay.
 * A dataset flag makes it idempotent, which matters because React runs effects
 * twice in development Strict Mode.
 */
export function useWordReveal(
  root: RefObject<HTMLElement | null>,
  {
    selector = '[data-word-reveal]',
    threshold = 0.35,
    rootMargin,
    /** Class applied to each generated word wrapper. */
    maskClass = 'word-mask',
    /** Custom property carrying the word's index, used for the stagger. */
    indexProperty = '--i',
  }: {
    selector?: string;
    threshold?: number;
    rootMargin?: string;
    maskClass?: string;
    indexProperty?: string;
  } = {},
) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const statements = [...element.querySelectorAll<HTMLElement>(selector)];
    if (!statements.length) return;

    for (const statement of statements) {
      if (statement.dataset[PROCESSED]) continue;
      statement.dataset[PROCESSED] = 'true';

      let index = 0;
      const wrapWords = (node: Node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const fragment = document.createDocumentFragment();
            (child.textContent ?? '').split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                fragment.appendChild(document.createTextNode(part));
                return;
              }
              const mask = document.createElement('span');
              const word = document.createElement('span');
              mask.className = maskClass;
              mask.style.setProperty(indexProperty, String(index));
              index += 1;
              word.textContent = part;
              mask.appendChild(word);
              fragment.appendChild(mask);
            });
            (child as ChildNode).replaceWith(fragment);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            wrapWords(child);
          }
        });
      };

      wrapWords(statement);
    }

    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      statements.forEach((statement) => statement.classList.add('words-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('words-in');
          observer.unobserve(entry.target);
        }),
      { threshold, ...(rootMargin ? { rootMargin } : {}) },
    );
    statements.forEach((statement) => observer.observe(statement));

    return () => observer.disconnect();
  }, [root, selector, threshold, rootMargin, maskClass, indexProperty]);
}
