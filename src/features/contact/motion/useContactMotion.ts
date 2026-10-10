'use client';

import { useCallback, type RefObject } from 'react';

import { setDrift, useReveal, useScrollDriver } from '@/shared/motion';

/** Reveals, plus the slow drift on the contact photograph. */
export function useContactMotion(root: RefObject<HTMLElement | null>) {
  useReveal(root, { threshold: 0.15, rootMargin: '0px' });

  const drive = useCallback((element: HTMLElement) => {
    /*
     * The drift must stay inside the image's vertical overscan, which is 6%
     * of a frame that is landscape rather than a tall portrait, so there is
     * far less of it than there was. The phone sets this number, not the
     * desktop: the frame is smallest there and so is the room to move.
     * Drifting further than that slides the frame off the bottom of the
     * photograph and shows the background through it. Raising this means
     * raising the overscan in contact.module.css, which costs image width.
     */
    const image = element.querySelector<HTMLElement>('.image-wrap');
    if (image) setDrift(image, '--image-y', 4);
  }, []);

  useScrollDriver(root, drive);
}
