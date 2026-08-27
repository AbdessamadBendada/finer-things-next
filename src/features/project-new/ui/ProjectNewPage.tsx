import { SiteCta } from '@/shared/layout/SiteCta';
import { Media } from '@/shared/ui/Media';

import { WALL } from '../content/wall.content';
import { ProjectNewShell } from './ProjectNewShell';

/**
 * A gallery-led alternative to /projects, under review.
 *
 * The client's own site shows this work as a wall of photographs with no copy
 * at all, and liked that you land straight in it. This keeps that, and adds
 * the three things it was missing: a first frame so you know what you are
 * looking at, credits so the work is attributable, and a way to act at the
 * end. See docs/FEEDBACK.md.
 */
export function ProjectNewPage() {
  return (
    <ProjectNewShell>
      <main>
        {/* One screen, then the work. Deliberately shorter than the editorial
            hero on /projects: a long preamble is the thing the gallery format
            is meant to avoid. */}
        <section className="gallery-hero">
          <div className="gallery-hero-bg">
            <Media
              src="/assets/0667_Marsa_Al_Arab_Lobby_9_dff7cff7.webp"
              alt="The lobby at Jumeirah Marsa Al Arab"
              priority
            />
          </div>
          <div className="wrap gallery-hero-copy">
            <div className="eyebrow">Selected work</div>
            <h1>Every detail, in its place.</h1>
            <p>
              Bespoke accessories, styling and curation for the world&rsquo;s finest hotels and
              residences. Every image carries the property and the space it was made for.
            </p>
          </div>
        </section>

        <section className="wall" aria-label="Project gallery">
          {WALL.map((tile) => (
            <figure
              className={`wall-tile rise${tile.size ? ` wall-tile-${tile.size}` : ''}`}
              key={tile.image}
              tabIndex={0}
            >
              <Media src={tile.image} alt={tile.alt} sizes="(max-width: 860px) 50vw, 33vw" />
              <figcaption>
                <span className="wall-property">
                  {tile.property}
                  <span className="wall-location"> &middot; {tile.location}</span>
                </span>
                <span className="wall-space">{tile.space}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <SiteCta />
      </main>
    </ProjectNewShell>
  );
}
