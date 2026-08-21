import Link from 'next/link';
import { Media } from '@/shared/ui/Media';
import { OurWorkShell } from './OurWorkShell';

export function OurWorkPage() {
  return (
    <OurWorkShell>
      <main>
        <section className="hero">
          <div className="hero-bg">
            <Media
              src="/assets/0687_Marsa_Al_Arab_Lobby_8_25ea7574.webp"
              alt="Layered decorative details in the Marsa Al Arab lobby"
            />
          </div>
          <div className="wrap hero-content">
            <div className="eyebrow">Our Work</div>
            <h1>
              <span className="hero-line">
                <span>One story.</span>
              </span>
              <span className="hero-line">
                <span>Three expressions.</span>
              </span>
            </h1>
            <div className="hero-foot">
              <p>
                Bespoke accessories, thoughtful styling and a considered collection: three ways
                of giving a place character through the details that surround us.
              </p>
              <span className="scroll-cue">Explore our work ↓</span>
            </div>
          </div>
        </section>
        <section className="intro">
          <div className="wrap intro-grid">
            <div className="eyebrow rise">What we do</div>
            <div>
              <h2 className="rise" data-word-reveal="">
                {'From the first narrative to the final placement, every detail belongs to '}
                <em>one vision.</em>
              </h2>
              <p className="intro-note rise">
                Finer Things brings sourcing, production, styling and project rollout together,
                supporting hospitality and residential projects with a distinct point of view.
              </p>
            </div>
          </div>
        </section>
        <section className="services" id="services">
          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/0676_Marsa_Al_Arab_Lobby_5_b2051520.webp"
                alt="Distinctive decorative objects at Marsa Al Arab"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">01</span>
                <span className="eyebrow">Our Work</span>
              </div>
              <h2>
                {'Bespoke '}
                <em>Accessories</em>
              </h2>
              <div className="service-bottom">
                <p>
                  Distinctive accessories shaped around each property’s identity, with material,
                  colour, form, texture, finish and stitching considered together.
                </p>
                <Link className="service-link" href="/services/bespoke-accessories">
                  Discover bespoke accessories →
                </Link>
              </div>
            </div>
          </article>
          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/0680_Marsa_Al_Arab_Iliana_3_e20bcd92.webp"
                alt="Ceramic installation and styled display at Iliana"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">02</span>
                <span className="eyebrow">Our Work</span>
              </div>
              <h2>
                {'Styling '}
                <em>& Curation</em>
              </h2>
              <div className="service-bottom">
                <p>
                  Objects, books, materials and florals considered together for guest rooms,
                  public spaces, restaurants, residences and libraries.
                </p>
                <Link className="service-link" href="/services/styling-curation">
                  Discover styling & curation →
                </Link>
              </div>
            </div>
          </article>
          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/0698_Finer_Living_July_2025_edited_1_a006768d.webp"
                alt="Sculptural wooden stools from the Finer Living collection"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">03</span>
                <span className="eyebrow">Our Work</span>
              </div>
              <h2>
                {'Finer '}
                <em>Living</em>
              </h2>
              <div className="service-bottom">
                <p>
                  A curated selection of timeless pieces where exceptional craftsmanship meets
                  modern luxury, each chosen for its story and enduring quality.
                </p>
                <Link className="service-link" href="/services/finer-living">
                  Discover Finer Living →
                </Link>
              </div>
            </div>
          </article>
        </section>
        <section className="continuity">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">The connecting thread</div>
              <div>
                <h2 className="rise">
                  {'Different expressions, '}
                  <em>one point of view.</em>
                </h2>
                <p className="continuity-note rise">
                  Each part of the work is guided by narrative, attention to detail and the
                  character of the materials and spaces involved.
                </p>
              </div>
            </div>
            <div className="thread">
              <article className="thread-item rise">
                <span>01</span>
                <h3>Story</h3>
                <p>A clear narrative gives every decision its direction.</p>
              </article>
              <article className="thread-item rise">
                <span>02</span>
                <h3>Detail</h3>
                <p>The smallest touchpoints shape how a space is experienced.</p>
              </article>
              <article className="thread-item rise">
                <span>03</span>
                <h3>Craft</h3>
                <p>Quality materials and artisanal craftsmanship bring character to life.</p>
              </article>
            </div>
          </div>
        </section>
        <section className="closing" id="contact">
          <div className="wrap">
            <div className="eyebrow rise">Start a project</div>
            <h2 className="rise">Which part of your story can we help bring to life?</h2>
            <p className="rise">
              Tell us about the property, its character and the details you have in mind.
            </p>
            <Link className="btn rise" href="/contact">
              Begin a conversation
            </Link>
          </div>
        </section>
      </main>
    </OurWorkShell>
  );
}
