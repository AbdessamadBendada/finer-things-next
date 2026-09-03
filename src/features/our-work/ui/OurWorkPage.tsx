import Link from 'next/link';

import { ROUTES } from '@/shared/config/routes';
import { Media } from '@/shared/ui/Media';
import { SiteCta } from '@/shared/layout/SiteCta';

import { DETAILS, MATERIALS, PROCESS_STEPS } from '../content/materials.content';
import { ArtisanStrip } from './ArtisanStrip';
import { MaterialCards } from './MaterialCards';
import { OurWorkShell } from './OurWorkShell';

export function OurWorkPage() {
  return (
    <OurWorkShell>
      <main>
        <section className="hero">
          <div className="hero-bg">
            <Media
              src="/assets/new-work-marsa-lobby-11.webp"
              alt="Layered decorative details in a styled hotel lobby"
            />
          </div>
          <div className="wrap hero-content">
            <h1>
              <span className="hero-line">
                <span>We turn the ordinary</span>
              </span>{' '}
              <span className="hero-line">
                <span>into extraordinary</span>
              </span>
            </h1>
            <div className="hero-foot">
              <p>
                Finer Things is a full-service boutique that creates bespoke, one-of-a-kind
                accessories for the luxury hotels and residences creating a new level of
                experience.
              </p>
              <span className="scroll-cue">Explore what we do ↓</span>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="wrap intro-grid">
            <div>
              <h2 className="rise" data-word-reveal="">
                {'From first sketch to final installation we craft your '}
                <em>narrative</em>
                {' together'}
              </h2>
              <p className="intro-note rise">
                We work with 100s of artisans across the globe that bring a wealth of experience
                and knowledge to the table, combining traditional techniques with innovative
                designs to create products that stand the test of time.
              </p>
            </div>
          </div>
        </section>

        <section className="services" id="services">
          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/new-cover-bespoke-accessories.webp"
                alt="A stitched leather tray on a walnut table"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">01</span>
              </div>
              <h2>
                <Link className="context-link" href={ROUTES.service('bespoke-accessories')}>
                  {'Bespoke '}
                  <em>Accessories</em>
                </Link>
              </h2>
              <div className="service-bottom">
                <p>
                  The details guests touch. Every hanger, tray and bill folder individually
                  designed and produced for one property only, in leather, marble, wood and
                  brass that carry its story.
                </p>
              </div>
            </div>
          </article>

          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/new-cover-styling-curation.webp"
                alt="Sculptural objects styled on a lacquered console"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">02</span>
              </div>
              <h2>
                <Link className="context-link" href={ROUTES.service('styling-curation')}>
                  {'Styling '}
                  <em>& Curation</em>
                </Link>
              </h2>
              <div className="service-bottom">
                <p>
                  Books, objects, art and florals found with 100+ artisans around the world and
                  arranged so every lobby and suite feels as unique as their story.
                </p>
              </div>
            </div>
          </article>

          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/new-cover-finer-living.webp"
                alt="An oak and brass footed bowl from the Finer Living collection"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">03</span>
              </div>
              <h2>
                <Link className="context-link" href={ROUTES.service('finer-living')}>
                  {'Finer '}
                  <em>Living</em>
                </Link>
              </h2>
              <div className="service-bottom">
                <p>
                  The ready-made collection by Finer Things where european craftsmanship meets
                  design: wood, marble and glass, in stock and fast to ship.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="continuity" id="materials">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">Our materials</div>
              <div>
                <h2 className="rise">
                  {'At the heart of every accessory lies a '}
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

        <section className="continuity details-section">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">The details</div>
              <div>
                <h2 className="rise">
                  {'At Finer Things we believe that an utmost attention to quality is '}
                  <em>paramount</em>
                </h2>
              </div>
            </div>
            <MaterialCards cards={DETAILS} columns={2} />
          </div>
        </section>

        {/* The workshops. Dark, so three stone sections do not run together,
            and inside `.wrap` so the photographs line up with the detail cards
            above rather than running wider than them. */}
        <section className="continuity artisans-section" id="artisans">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">Our artisans</div>
              <div>
                <h2 className="rise">
                  {'Made in workshops we know, by artisans we '}
                  <em>trust</em>
                </h2>
                <p className="continuity-note rise">
                  Wood, ceramics, glass and metal, each from a maker chosen for that material
                  and that place.
                </p>
              </div>
            </div>
            <ArtisanStrip />
          </div>
        </section>

        <section className="continuity process-section" id="process">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">Our process</div>
              <div>
                <h2 className="rise">
                  {'New level of experience in pursuit of '}
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
    </OurWorkShell>
  );
}
