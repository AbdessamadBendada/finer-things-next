import { Media } from '@/shared/ui/Media';
import { SiteCta } from '@/shared/layout/SiteCta';

import { DETAILS, MATERIALS, PROCESS_STEPS } from '../content/materials.content';
import { ArtisanWall } from './ArtisanWall';
import { MaterialCards } from './MaterialCards';
import { OurCraftShell } from './OurCraftShell';

/**
 * Our Craft — the materials, the workshops and the process, on one page.
 *
 * None of this is new writing. All four sections used to sit in the bottom
 * half of /our-work, below three full-bleed service blocks, where a visitor
 * had to scroll past everything we sell before reaching anything about how it
 * is made. The two halves answer different questions — "what can I buy" and
 * "why should I trust you with it" — so they are two pages now. /our-work
 * keeps the hero, the intro and the three services; everything below the
 * services moved here.
 *
 * The artisan wall came the other way, off /about. It is the strongest craft
 * asset the site has and it was illustrating a founder story; here it is the
 * evidence for the section it belongs to. Nothing is duplicated: /about links
 * across rather than keeping a copy, and /our-work shows a three-shot teaser
 * that is a pointer to this page, not the same content twice.
 *
 * Section grounds run paper → stone → stone → ink → stone, which is the
 * rhythm /our-work already used. The dark artisan block is what stops four
 * stone sections reading as one long slab.
 */
export function OurCraftPage() {
  return (
    <OurCraftShell>
      <main>
        <section className="hero">
          <div className="hero-bg">
            {/*
             * Molten glass going into the press: hands, tools and heat. The
             * one photograph in the delivery that is unmistakably about
             * making rather than about a finished object, which is the whole
             * argument of this page. It is also the only strong workshop shot
             * not in the wall's pool, so the hero never repeats a tile.
             */}
            <Media
              src="/assets/new-artisan-fl-56.webp"
              alt="Molten glass being shaped into a metal mould at the bench"
              sizes="100vw"
            />
          </div>
          <div className="wrap hero-content">
            <h1>
              <span className="hero-line">
                <span>The material</span>
              </span>{' '}
              <span className="hero-line">
                <span>comes first</span>
              </span>
            </h1>
            <div className="hero-foot">
              <p>
                Leather, wood, horn, lacquer, resin and shell, worked by hand in workshops we
                have spent years finding. What a Finer Things piece is made of, and who makes
                it.
              </p>
              <span className="scroll-cue">See how it is made ↓</span>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="wrap intro-grid">
            <div>
              <h2 className="rise" data-word-reveal="">
                {'The making is '}
                <em>everything</em>
              </h2>
              <p className="intro-note rise">
                A finished piece hides its own making. This page does the opposite: the
                materials we work in, the details that decide how they read in a room, the
                workshops behind them, and the seven steps between a first conversation and an
                installed piece.
              </p>
            </div>
          </div>
        </section>

        <section className="continuity" id="materials">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">Our materials</div>
              <div>
                <h2 className="rise">
                  {'Every piece carries a '}
                  <em>story</em>
                </h2>
                <p className="continuity-note rise">
                  From the selection of luxurious materials to the meticulous craftsmanship that
                  goes into the creation of our products, we ensure that our accessories are of
                  highest quality and stand the test of time.
                </p>
              </div>
            </div>
            <MaterialCards cards={MATERIALS} columns={3} />
          </div>
        </section>

        <section className="continuity details-section" id="details">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">The details</div>
              <div>
                <h2 className="rise">
                  {'Quality is '}
                  <em>paramount</em>
                </h2>
              </div>
            </div>
            <MaterialCards cards={DETAILS} columns={2} />
          </div>
        </section>

        {/* The workshops. Dark, so four stone sections do not run together, and
            inside `.wrap` so the wall lines up with the detail cards above
            rather than running wider than them. */}
        <section className="continuity artisans-section" id="artisans">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">Our artisans</div>
              <div>
                <h2 className="rise">
                  {'Made by artisans we '}
                  <em>trust</em>
                </h2>
                <p className="continuity-note rise">
                  Wood, ceramics, glass and metal, each from a maker chosen for that material
                  and that place.
                </p>
              </div>
            </div>
            <ArtisanWall />
            <p className="artisans-foot rise">
              Ceramics, glass, wood, leather and metal, worked by hand in small workshops across
              Europe and beyond.
            </p>
          </div>
        </section>

        <section className="continuity process-section" id="process">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">Our process</div>
              <div>
                <h2 className="rise">
                  {'In pursuit of '}
                  <em>perfection</em>
                </h2>
                <p className="continuity-note rise">
                  We refined our process and production to guarantee uniqueness, meticulous
                  craftsmanship and highest quality in every piece.
                </p>
              </div>
            </div>
            <ol className="process-steps">
              {PROCESS_STEPS.map((step, index) => (
                <li className="process-step rise" key={step}>
                  <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="process-label">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <SiteCta />
      </main>
    </OurCraftShell>
  );
}
