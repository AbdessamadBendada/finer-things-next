import { Media } from '@/shared/ui/Media';
import { AboutShell } from './AboutShell';
import { ArtisanWall } from './ArtisanWall';
import { SiteCta } from '@/shared/layout/SiteCta';

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
                <span>Values rooted in</span>
              </span>
              <span className="hero-line">
                <span>
                  <em>family</em>
                </span>
              </span>
            </h1>
            <p className="hero-intro">
              Finer Things is a family-owned boutique that brings hospitality experience,
              sourcing, production and styling together to create distinctive bespoke
              accessories and designs for world’s finest hotels and residences.
            </p>
          </div>
          <figure className="hero-portrait">
            <Media
              src="/assets/finer-things-family.webp"
              alt="Alex and Malika, founders of Finer Things"
            />
            <figcaption className="hero-caption">Malika and Alex</figcaption>
          </figure>
        </section>
        {/* MEET THE FOUNDER */}
        <section className="experience" id="story">
          <div className="wrap experience-grid">
            <figure className="experience-image rise" data-drift="-20">
              <Media
                src="/assets/founder-alex-lahmer.webp"
                alt="Alex Lahmer, founder of Finer Things, in a leather workshop"
              />
              <div
                className="experience-fact rise"
                aria-label="20 plus years of international hospitality experience"
              >
                <strong>20+</strong>
                <span>Years of international hospitality experience</span>
              </div>
            </figure>
            <div className="experience-copy">
              <div className="eyebrow rise">Meet the founder</div>
              <h2 className="rise">
                {'Alex Lahmer designs the details he once '}
                <em>bought.</em>
              </h2>
              <p className="rise">
                For two decades, Alex Lahmer stood on the other side of the table, opening and
                operating the world’s finest hotels, receiving the products everyone else
                designed. He saw which materials survived a thousand guests and which didn’t,
                which pieces guests photographed and which they ignored. He can tell you a
                hundred stories about wrong materials, wrong sizes, wrong finishes.
              </p>
              <p className="rise">
                Finer Things exists so their clients never become one of those stories.
              </p>
              <p className="rise">
                Today Alex designs the details he once purchased, combining materials few dare
                to put together, and giving every piece a function, a story, and the one place
                it was made for.
              </p>
            </div>
          </div>
        </section>
        {/* MEET MALIKA */}
        <section className="experience experience-reverse">
          <div className="wrap experience-grid">
            <figure className="experience-image rise" data-drift="-20">
              <Media
                src="/assets/finer-things-family.webp"
                alt="Malika Lahmer with Alex Lahmer, founders of Finer Things"
              />
            </figure>
            <div className="experience-copy">
              <div className="eyebrow rise">Meet the co-founder</div>
              <h2 id="malika-founder-heading" className="rise">
                {'Malika Lahmer gives spaces their '}
                <em>soul.</em>
              </h2>
              <p className="rise">
                While Alex builds the pieces, Malika gives spaces their soul. With her eye for
                styling and an instinct for the unexpected, she layers books, ceramics, art and
                found objects until a lobby tells a story no one else could write.
              </p>
              <p className="rise">
                Some of the most loved projects, from Jumeirah to private residences, carry her
                signature touch.
              </p>
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
        {/* THE ARTISANS */}
        <section className="artisans" id="artisans">
          <div className="wrap">
            <div className="artisans-head">
              <div className="eyebrow rise">The artisans</div>
              <h2 className="rise">
                {'Nothing here is made by '}
                <em>us alone.</em>
              </h2>
              <p className="artisans-note rise">
                Behind every piece is a workshop somewhere in the world: a ceramicist who has
                kept the same moulds for forty years, a glassblower who works to the minute, a
                joiner who knows which board to cut and which to leave. We spend as much time
                finding them as we do designing, because the making is the difference between an
                object and a piece worth keeping.
              </p>
            </div>

            <ArtisanWall />

            <p className="artisans-foot rise">
              Ceramics, glass, wood, leather and metal, worked by hand in small workshops across
              Europe and beyond.
            </p>
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
        <SiteCta />
      </main>
    </AboutShell>
  );
}
