import Link from 'next/link';
import { Media } from '@/shared/ui/Media';
import { AboutShell } from './AboutShell';

export function AboutPage() {
  return (
    <AboutShell>
      <main>
        {/* FAMILY-LED ABOUT HERO */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">About Finer Things</div>
            <h1>
              <span className="hero-line">
                <span>One family.</span>
              </span>
              <span className="hero-line">
                <span>One point of view.</span>
              </span>
            </h1>
            <p className="hero-intro">
              Behind Finer Things are Alex and Malika—a shared perspective shaped by
              hospitality, travel, storytelling and a discerning eye for detail.
            </p>
          </div>
          <figure className="hero-portrait">
            <Media
              src="/assets/finer-things-family.webp"
              alt="Alex and Malika, founders of Finer Things"
            />
            <figcaption className="hero-caption">Alex & Malika</figcaption>
          </figure>
        </section>
        {/* WHO WE ARE */}
        <section className="statement" id="story">
          <div className="wrap statement-grid">
            <div className="eyebrow rise">Our story</div>
            <div>
              <h2 className="rise" data-word-reveal="">
                {'Finer Things began with a belief that the right details give a place its '}
                <em>character.</em>
              </h2>
              <p className="statement-note rise">
                The family-owned boutique brings hospitality experience, sourcing, production
                and styling together to create distinctive decorative accessories and considered
                spaces for hospitality and residential projects.
              </p>
            </div>
          </div>
        </section>
        {/* ALEX'S HOSPITALITY EXPERIENCE */}
        <section className="experience">
          <div className="wrap experience-grid">
            <figure className="experience-image rise" data-drift="-20">
              <Media
                src="/assets/0676_Marsa_Al_Arab_Lobby_5_b2051520.webp"
                alt="Distinctive decorative details at Marsa Al Arab"
              />
            </figure>
            <div className="experience-copy">
              <div className="eyebrow rise">A hospitality perspective</div>
              <h2 className="rise">
                {'Experience from inside '}
                <em>the guest journey.</em>
              </h2>
              <p className="rise">
                Alex spent more than two decades opening and operating hotels, resorts and
                residences around the world. That experience brings a global perspective to
                every project and an understanding of how distinctive touchpoints shape the way
                a stay is remembered.
              </p>
              <div className="experience-fact rise">
                <strong>20+</strong>
                <span>Years of international hospitality experience</span>
              </div>
            </div>
          </div>
        </section>
        {/* TWO PERSPECTIVES */}
        <section className="perspectives">
          <div className="wrap">
            <div className="perspectives-head">
              <div className="eyebrow rise">Alex & Malika</div>
              <h2 className="rise">
                {'Two perspectives, '}
                <em>one family.</em>
              </h2>
            </div>
            <div className="people">
              <article className="person rise">
                <span className="role">Hospitality & storytelling</span>
                <h3>Alex</h3>
                <p>
                  Alex brings the operational understanding of international hospitality and a
                  particular fondness for styling, storytelling and bespoke touchpoints.
                </p>
              </article>
              <article className="person rise">
                <span className="role">Character & detail</span>
                <h3>Malika</h3>
                <p>
                  Malika brings the discerning eye that gives every space its final character,
                  complementing experience with instinct and attention to detail.
                </p>
              </article>
            </div>
          </div>
        </section>
        {/* GLOBAL POINT OF VIEW */}
        <section className="world">
          <div className="wrap">
            <div className="world-head">
              <h2 className="rise">A global eye, grounded in place.</h2>
              <p className="rise">
                Years spent working across countries and cultures inform a perspective that
                looks outward for the unexpected while remaining attentive to the identity of
                each destination.
              </p>
            </div>
            <div className="world-images">
              <figure className="world-image rise" data-drift="-18">
                <Media
                  src="/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp"
                  alt="Guest-room detail at Waldorf Astoria Osaka"
                />
              </figure>
              <figure className="world-image rise" data-drift="14">
                <Media
                  src="/assets/0670_Marsa_Al_Arab_Bombay_5_95764db5.webp"
                  alt="Decorative objects and florals at Bombay Club"
                />
              </figure>
              <figure className="world-image rise" data-drift="-9">
                <Media
                  src="/assets/0689_Marsa_Al_Arab_Iliana_5_0c49bd95.webp"
                  alt="Books and decorative objects at Iliana"
                />
              </figure>
            </div>
          </div>
        </section>
        {/* PRINCIPLES */}
        <section className="principles" id="principles">
          <div className="wrap">
            <div className="principles-head">
              <h2 className="rise">What guides the work.</h2>
              <p className="rise">
                A few enduring ideas connect the objects, spaces and stories Finer Things helps
                bring to life.
              </p>
            </div>
            <div className="principle rise">
              <span className="n">01</span>
              <h3>Story before style</h3>
              <p>
                The narrative of the property gives each selection and bespoke touchpoint its
                direction.
              </p>
            </div>
            <div className="principle rise">
              <span className="n">02</span>
              <h3>Attention to detail</h3>
              <p>
                Material, colour, texture, finish and placement are considered as part of one
                experience.
              </p>
            </div>
            <div className="principle rise">
              <span className="n">03</span>
              <h3>Craft with character</h3>
              <p>
                Quality materials and artisanal craftsmanship create pieces with a distinctive
                presence.
              </p>
            </div>
          </div>
        </section>
        {/* CLOSING INVITATION */}
        <section className="closing" id="contact">
          <div className="wrap">
            <div className="eyebrow rise">Start a project</div>
            <h2 className="rise">
              <span className="cta-line">
                <span>Tell us about the place</span>
              </span>
              <span className="cta-line">
                <span>and the story behind it.</span>
              </span>
            </h2>
            <p className="rise">
              We would love to hear about your property, its character and the details you want
              people to remember.
            </p>
            <Link className="btn rise" href="/contact">
              Begin a conversation
            </Link>
          </div>
        </section>
      </main>
    </AboutShell>
  );
}
