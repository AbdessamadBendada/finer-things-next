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
/**
 * Whether an element is clipped to nothing by its own start state.
 *
 * `clip-path: inset(0 50%)` and friends are how several reveals wipe open, and
 * a clipped element has no visible area at all. IntersectionObserver
 * therefore reports it as never intersecting, however far up the screen it
 * scrolls, so a reveal keyed on it can never fire.
 */
function isClippedAway(element: HTMLElement): boolean {
  const clip = getComputedStyle(element).clipPath;
  return clip !== 'none' && /inset\(/.test(clip) && /\b(?:[5-9]\d|100)%/.test(clip);
}

/**
 * What to watch on this element's behalf.
 *
 * For anything clipped away, the nearest ancestor that is not: it is laid out
 * in the same place and crosses the fold at the same moment, but has a real
 * box for the observer to measure.
 */
function observationTarget(element: HTMLElement): HTMLElement {
  if (!isClippedAway(element)) return element;
  let node = element.parentElement;
  while (node && isClippedAway(node)) node = node.parentElement;
  return node ?? element;
}

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

  /*
   * Watched element -> the element actually being revealed.
   *
   * They are usually the same. They differ for anything that starts clipped
   * away, where the observer has to watch an ancestor with a real box: those
   * reveals used to be rescued by the 2.2s fail-open watchdog rather than
   * fired by scrolling, which is why an image already on screen could take
   * seconds to appear.
   */
  const revealFor = new Map<Element, HTMLElement>();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = revealFor.get(entry.target);
      if (!target) return;
      onReveal(target, entry);
      revealFor.delete(entry.target);
      observer.unobserve(entry.target);
    });
  }, options);

  elements.forEach((element) => {
    const watched = observationTarget(element);
    // Two clipped siblings can share one unclipped parent; the first to be
    // revealed would otherwise unobserve it and strand the second.
    if (revealFor.has(watched)) {
      onReveal(element);
      return;
    }
    revealFor.set(watched, element);
    observer.observe(watched);
  });

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
