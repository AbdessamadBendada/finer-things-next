import { Media } from '@/shared/ui/Media';

import { COLLAGE_STILLS } from '../content/collage.content';

/**
 * The looping hero strip.
 *
 * The legacy page built these cells in JavaScript, which meant the largest
 * image on the site could not start downloading until the bundle had run. They
 * are server-rendered here instead, and the first cell is marked `priority`
 * because it is the page's LCP element.
 *
 * The list is duplicated because the CSS animation translates the track by
 * exactly -50%; the second copy is what makes the loop seamless, and it is
 * hidden from assistive technology as a purely decorative repeat.
 */
export function HeroCollage() {
  return (
    <div className="collage">
      <div className="track" id="track">
        {[0, 1].map((pass) =>
          COLLAGE_STILLS.map((src, index) => (
            <div className="cell" key={`${pass}-${src}`}>
              <Media
                src={src}
                alt=""
                priority={pass === 0 && index < 2}
                sizes="(max-width: 860px) 60vw, 30vw"
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
