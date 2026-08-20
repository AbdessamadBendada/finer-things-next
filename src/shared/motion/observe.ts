import { prefersReducedMotion } from './useReducedMotion';

export type RevealHandler = (element: HTMLElement, entry?: IntersectionObserverEntry) => void;

const addIn: RevealHandler = (element) => element.classList.add('in');

/**
 * Reveals each match once it enters the viewport, then stops observing it.
 *
 * Direct port of `observeOnce` from legacy/study-shared.js, including its two
 * fail-open guards: with no IntersectionObserver support, or when the user has
 * asked for reduced motion, every element is revealed immediately rather than
 * left in its hidden start state.
 */
export function observeOnce(
  root: ParentNode,
  selector: string,
  options: IntersectionObserverInit = {},
  onReveal: RevealHandler = addIn,
): (() => void) | null {
  const elements = [...root.querySelectorAll<HTMLElement>(selector)];
  if (!elements.length) return null;

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    elements.forEach((element) => onReveal(element));
    return null;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      onReveal(entry.target as HTMLElement, entry);
      observer.unobserve(entry.target);
    });
  }, options);

  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

/**
 * Adds a class while elements are intersecting. Unlike `observeOnce` the
 * observer stays attached, matching the legacy `.service` / `.chapter`
 * behaviour.
 */
export function observeClass(
  root: ParentNode,
  selector: string,
  className: string,
  options: IntersectionObserverInit = {},
): (() => void) | null {
  const elements = [...root.querySelectorAll<HTMLElement>(selector)];
  if (!elements.length) return null;

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    elements.forEach((element) => element.classList.add(className));
    return null;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add(className);
    });
  }, options);

  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}
