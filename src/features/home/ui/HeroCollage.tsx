'use client';

import { useEffect, useState } from 'react';

import { Media } from '@/shared/ui/Media';

import { COLLAGE_STILLS } from '../content/collage.content';

/**
 * The looping hero strip.
 *
 * The legacy page built these cells in JavaScript, which meant the largest
 * image on the site could not start downloading until the bundle had run. They
 * are server-rendered here instead, and the cell visible at the animation's
 * initial -50% position is preloaded because it is the page's LCP element.
 *
 * The list is duplicated because the CSS animation translates the track by
 * exactly -50%; the second copy is what makes the loop seamless, and it is
 * hidden from assistive technology as a purely decorative repeat.
 */
export function HeroCollage() {
  const [loadLoop, setLoadLoop] = useState(false);

  useEffect(() => {
    let timer = 0;

    const schedule = () => {
      // Give the LCP image and critical fonts the network first. The complete
      // loop is still requested long before the 65-second strip can expose it.
      timer = window.setTimeout(() => setLoadLoop(true), 1200);
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      window.removeEventListener('load', schedule);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="collage">
      <div className="track" id="track">
        {[0, 1].map((pass) =>
          COLLAGE_STILLS.map((src, index) => (
            <div className="cell" key={`${pass}-${src}`}>
              {(() => {
                /* The animation begins at -50%, so the second pass starts in
                   the viewport while the tail of the first pass is next to
                   enter from the left. Warm only those cells initially; the
                   rest follow after window.load, well before the loop reaches
                   them. */
                const isLcp = pass === 1 && index === 0;
                const entersImmediately =
                  (pass === 1 && index < 2) ||
                  (pass === 0 && index >= COLLAGE_STILLS.length - 2);

                return (
                  <Media
                    src={src}
                    alt=""
                    preload={isLcp}
                    loading={
                      isLcp ? undefined : loadLoop || entersImmediately ? 'eager' : 'lazy'
                    }
                    /* Measured: a cell renders at 506px on a 1440 viewport,
                       which is 35vw. An earlier attempt at 12vw was taken from
                       a mid-animation reading and served 200px files into a
                       506px box, which is visibly soft. */
                    sizes="(max-width: 860px) 60vw, 35vw"
                  />
                );
              })()}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
