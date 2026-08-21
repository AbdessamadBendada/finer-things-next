import { Media } from '@/shared/ui/Media';
import { FinerLivingShell } from './FinerLivingShell';

export function FinerLivingPage() {
  return (
    <FinerLivingShell>
      <main>
        {/* FINER LIVING COLLECTION HERO */}
        <section className="hero">
          <div className="hero-media">
            <Media
              src="/assets/0698_Finer_Living_July_2025_edited_1_a006768d.webp"
              alt="Three sculptural wooden stools from the Finer Living collection"
            />
          </div>
          <div className="wrap hero-content">
            <div className="hero-kicker eyebrow">Our Work / 03</div>
            <h1>
              <span className="hero-line">
                <span>Finer</span>
              </span>
              <span className="hero-line">
                <span>
                  <em>Living</em>
                </span>
              </span>
            </h1>
            <div className="hero-bottom">
              <p className="hero-intro">
                A curated selection of timeless pieces where exceptional craftsmanship meets
                modern luxury, each chosen for its story and enduring quality.
              </p>
              <span className="scroll-cue">Explore the collection ↓</span>
            </div>
          </div>
        </section>
        {/* OPENING STATEMENT */}
        <section className="manifesto">
          <div className="wrap manifesto-grid">
            <div className="eyebrow rise">The collection</div>
            <div>
              <h2 className="rise" data-word-reveal="">
                {'Objects with a story, made for the rituals of '}
                <em>daily life.</em>
              </h2>
              <p className="manifesto-note rise">
                Finer Living carries the Finer Things point of view into a collection of
                distinctive pieces, bringing material character and considered design into the
                home.
              </p>
            </div>
          </div>
        </section>
        {/* SCOPE OF WORK */}
        <section className="scope" id="scope">
          <div className="wrap">
            <div className="scope-head">
              <h2 className="rise">Chosen for more than appearance.</h2>
              <p className="rise">
                The collection brings together objects with presence: pieces intended to feel
                relevant beyond a season and to become part of the way a space is lived in.
              </p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">01</span>
              <h3>Timeless pieces</h3>
              <p>A curated selection designed to live beyond passing trends.</p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">02</span>
              <h3>Distinctive stories</h3>
              <p>Objects chosen for the individual story and character they bring.</p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">03</span>
              <h3>Exceptional craftsmanship</h3>
              <p>Craft and material quality held at the centre of each piece.</p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">04</span>
              <h3>Enduring quality</h3>
              <p>A collection considered for modern living and lasting relevance.</p>
            </div>
          </div>
        </section>
        {/* EDITORIAL PROJECT STORY */}
        <section className="story">
          <div className="wrap">
            <div className="story-head">
              <h2 className="rise">Three objects. Three expressions of craft.</h2>
              <p className="rise">
                Glass, marble and wood give each piece its own weight, texture and presence.
              </p>
            </div>
            <div className="story-grid">
              <figure className="story-figure story-main rise" data-drift="-18" tabIndex={0}>
                <Media
                  src="/assets/1.webp"
                  alt="Glass cloche from the Finer Living collection"
                />
                <video
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/assets/1.webp"
                  aria-label="Making process for the glass cloche"
                >
                  <source src="/assets/1.webm" type="video/webm" />
                </video>
                <span className="making-label">Making of</span>
                <figcaption>Glass / Cloche</figcaption>
              </figure>
              <figure className="story-figure story-small rise" data-drift="14" tabIndex={0}>
                <Media
                  src="/assets/2.webp"
                  alt="Marble and glass serving stand from the Finer Living collection"
                />
                <video
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/assets/2.webp"
                  aria-label="Making process for the serving stand"
                >
                  <source src="/assets/2.webm" type="video/webm" />
                </video>
                <span className="making-label">Making of</span>
                <figcaption>Marble & glass / Serving stand</figcaption>
              </figure>
              <figure className="story-figure story-detail rise" data-drift="-7" tabIndex={0}>
                <Media
                  src="/assets/3.webp"
                  alt="Wooden footed bowl from the Finer Living collection"
                />
                <video
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/assets/3.webp"
                  aria-label="Making process for the footed bowl"
                >
                  <source src="/assets/3.webm" type="video/webm" />
                </video>
                <span className="making-label">Making of</span>
                <figcaption>Wood / Footed bowl</figcaption>
              </figure>
            </div>
          </div>
        </section>
        {/* COLLECTION MATERIALS */}
        <section className="materials">
          <div className="wrap">
            <div className="materials-top">
              <div className="eyebrow rise">Material character</div>
              <div>
                <h2 className="rise">
                  {'Nature gives each piece its '}
                  <em>voice.</em>
                </h2>
                <p className="materials-copy rise">
                  Colour, grain, veining, weight and finish make every material distinct. The
                  collection lets those qualities remain visible and felt.
                </p>
              </div>
            </div>
            <div className="material-list rise" aria-label="Finer Living material palette">
              <div className="material">
                <span className="material-name">Marble & stone</span>
                <span className="material-detail">Veining · colour · weight</span>
              </div>
              <div className="material">
                <span className="material-name">Wood</span>
                <span className="material-detail">Grain · warmth · tactility</span>
              </div>
              <div className="material">
                <span className="material-name">Glass</span>
                <span className="material-detail">Clarity · colour · light</span>
              </div>
              <div className="material">
                <span className="material-name">Leather</span>
                <span className="material-detail">Texture · tone · touch</span>
              </div>
              <div className="material">
                <span className="material-name">Metal</span>
                <span className="material-detail">Finish · contrast · detail</span>
              </div>
            </div>
          </div>
        </section>
        {/* PROCESS */}
        <section className="process" id="process">
          <div className="wrap">
            <div className="process-title">
              <h2 className="rise">The Finer Living point of view.</h2>
              <p className="rise">
                Four qualities connect the collection, from the first impression of an object to
                the place it earns in daily life.
              </p>
            </div>
            <div className="steps">
              <article className="step rise">
                <span className="step-num">01</span>
                <h3>Story</h3>
                <p>A distinctive idea that gives the object character.</p>
              </article>
              <article className="step rise">
                <span className="step-num">02</span>
                <h3>Craft</h3>
                <p>Exceptional craftsmanship expressed through considered details.</p>
              </article>
              <article className="step rise">
                <span className="step-num">03</span>
                <h3>Material</h3>
                <p>Intrinsic qualities allowed to remain present and individual.</p>
              </article>
              <article className="step rise">
                <span className="step-num">04</span>
                <h3>Living</h3>
                <p>Timeless pieces made to become part of everyday rituals.</p>
              </article>
            </div>
          </div>
        </section>
        {/* COLLECTION PREVIEW */}
        <section className="project" aria-labelledby="project-title">
          <div className="project-bg" id="projectBg">
            <Media
              src="/assets/0694_27I6900-6copy_51177df8.webp"
              alt="A palette of marble and stone samples"
            />
          </div>
          <div className="wrap project-copy">
            <div className="eyebrow rise">Discover the collection</div>
            <h2 id="project-title">
              <span className="title-mask">
                <span>Finer Living</span>
              </span>
            </h2>
            <div className="project-meta rise">
              <span>Timeless pieces</span>
              <span>Exceptional craftsmanship</span>
              <span>Modern luxury</span>
            </div>
          </div>
        </section>
        {/* PROJECT CTA */}
        <section className="closing" id="contact">
          <div className="wrap">
            <div className="eyebrow rise">Finer Living</div>
            <h2 className="rise">
              <span className="cta-line">
                <span>Discover objects with</span>
              </span>
              <span className="cta-line">
                <span>a story of their own.</span>
              </span>
            </h2>
            <p className="rise">
              Explore the full Finer Living collection and its considered material world.
            </p>
            <a
              className="btn rise"
              href="https://finerlivingcollection.com/"
              target="_blank"
              rel="noopener"
            >
              Explore the collection
            </a>
          </div>
        </section>
      </main>
    </FinerLivingShell>
  );
}
