import Link from 'next/link';

import { SiteCta } from '@/shared/layout/SiteCta';
import { Media } from '@/shared/ui/Media';

import { WALL } from '../content/wall.content';
import { ProjectsShell } from './ProjectsShell';

/**
 * The `/projects` index: a gallery-led wall of the work.
 *
 * The client's own site shows this work as a wall of photographs with no copy
 * at all, and liked that you land straight in it. This keeps that, and adds
 * the three things it was missing: a first frame so you know what you are
 * looking at, credits so the work is attributable, and a way to act at the
 * end. See docs/FEEDBACK.md.
 */
export function ProjectsPage() {
  return (
    <ProjectsShell>
      <main>
        {/* One screen, then the work. Deliberately short: a long preamble is
            the thing the gallery format is meant to avoid. */}
        <section className="gallery-hero">
          <div className="gallery-hero-bg">
            <Media
              src="/assets/new-work-marsa-lobby-11.webp"
              alt="Layered decorative details in the Marsa Al Arab lobby"
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
            >
              <Media
                src={tile.image}
                alt={tile.alt}
                sizes="(max-width: 720px) 100vw, (max-width: 860px) 70vw, 50vw"
              />
              <figcaption>
                <span className="wall-property">
                  <Link className="context-link" href={tile.path}>
                    {tile.property}
                  </Link>
                  <span className="wall-location"> &middot; {tile.location}</span>
                </span>
                <span className="wall-space">{tile.space}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <SiteCta />
      </main>
    </ProjectsShell>
  );
}
