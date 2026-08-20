'use client';

import { useCallback, useEffect, type RefObject } from 'react';

import { driftAll, prefersReducedMotion, useServiceIndexMotion } from '@/shared/motion';

/**
 * The projects index: the shared index choreography plus a progress marker
 * that counts the project currently filling the viewport.
 */
export function useProjectsIndexMotion(root: RefObject<HTMLElement | null>) {
  const drive = useCallback((element: HTMLElement) => {
    driftAll(element, '[data-place-drift]', '--place-shift', { datasetKey: 'placeDrift' });
  }, []);

  useServiceIndexMotion(root, { onDrive: drive });

  useEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const progress = element.querySelector<HTMLElement>('#projectProgress');
    const label = progress?.querySelector('span');
    const services = [...element.querySelectorAll<HTMLElement>('.service')];
    if (!progress || !label || !services.length) return;

    const isCentred = (service: HTMLElement) => {
      const rect = service.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.65 && rect.bottom > window.innerHeight * 0.35;
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            progress.classList.add('visible');
            const index = services.indexOf(entry.target as HTMLElement) + 1;
            label.textContent = `${String(index).padStart(2, '0')} / ${String(
              services.length,
            ).padStart(2, '0')}`;
          } else if (!services.some(isCentred)) {
            progress.classList.remove('visible');
          }
        }),
      { threshold: 0.5 },
    );

    services.forEach((service) => observer.observe(service));
    return () => observer.disconnect();
  }, [root]);
}
