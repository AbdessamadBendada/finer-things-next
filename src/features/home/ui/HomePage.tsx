import type { CSSProperties, ReactNode } from 'react';
import { Media } from '@/shared/ui/Media';
import Link from 'next/link';
import { HeroCollage } from './HeroCollage';
import { HomeShell } from './HomeShell';

/**
 * The newsletter form arrives as a slot rather than an import: `shared` and
 * sibling features are off-limits to each other, so cross-feature composition
 * happens at the route. See docs/ARCHITECTURE.md.
 */
export function HomePage({ newsletter }: { newsletter: ReactNode }) {
  return (
    <HomeShell>
      {/* HEADER */}
      {/* big shrinking wordmark */}
      <div className="word" id="word" aria-hidden="true">
        <Media src="/assets/finer-things-logo.png" alt="" />
      </div>
      {/* 1. HERO */}
      <section className="hero" id="hero">
        <HeroCollage />
        <div className="collage-veil" />
        <div className="hero-copy">
          <h1>Every place should tell a story.</h1>
          <div className="sub">
            We help the world’s finest hotels and residences express their character through
            bespoke accessories, thoughtful styling and distinctive objects.
          </div>
          <div className="cta-wrap">
            <Link href="/contact" className="btn">
              Let’s tell your story
            </Link>
          </div>
        </div>
      </section>
      {/* INTRO COVER */}
      <div className="cover" id="cover">
        <div className="intro-name" id="introName" role="img" aria-label="Finer Things">
          <Media
            src="/assets/finer-things-logo.png"
            className="intro-logo-layer intro-logo-mark"
            alt=""
            aria-hidden="true"
          />
          <Media
            src="/assets/finer-things-logo.png"
            className="intro-logo-layer intro-logo-name"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div className="brandwords">
          <span>Bespoke</span>
          <span>Styling</span>
          <span>Heritage</span>
        </div>
      </div>
      {/* PURPOSE */}
      <section className="purpose" aria-labelledby="purpose-title">
        <div className="wrap">
          <h2 id="purpose-title" data-word-reveal="">
            {
              'Guided by brave techniques and material combinations, Finer Things designs unique accessories that fill a stay with '
            }
            <span className="outcome">story, personality and soul.</span>
          </h2>
        </div>
      </section>
      {/* 3. SERVICES */}
      <section className="svc" id="work">
        <div className="wrap svc-head">
          <div className="ey rise">Our Work</div>
          <p className="rise">
            From first narrative to final placement, we bring sourcing, production, styling and
            project rollout together in one design studio.
          </p>
        </div>
        <div className="svc-row rise">
          <div className="wipe">
            <Media
              src="/assets/0676_Marsa_Al_Arab_Lobby_5_b2051520.webp"
              alt="Bespoke details at Marsa Al Arab"
            />
          </div>
          <Link href="/services/bespoke-accessories">
            <span className="idx">01</span>
            <h3 className="serif">Bespoke Accessories</h3>
            <span className="desc">
              Made around each property’s identity—from material, colour and scale to finish,
              stitching and every detail guests touch.
            </span>
          </Link>
        </div>
        <div className="svc-row rise">
          <div className="wipe">
            <Media
              src="/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp"
              alt="Curated interior at Waldorf Astoria Osaka"
            />
          </div>
          <Link href="/services/styling-curation">
            <span className="idx">02</span>
            <h3 className="serif">Styling & Curation</h3>
            <span className="desc">
              Books, objects, art and florals sourced with remarkable artisans for guest rooms,
              public spaces, restaurants, residences and libraries.
            </span>
          </Link>
        </div>
        <div className="svc-row rise">
          <div className="wipe">
            <Media
              src="/assets/0698_Finer_Living_July_2025_edited_1_a006768d.webp"
              alt="Finer Living crafted objects"
            />
          </div>
          <Link href="/services/finer-living">
            <span className="idx">03</span>
            <h3 className="serif">Finer Living</h3>
            <span className="desc">
              The collection by Finer Things, where European craftsmanship shapes marble, wood,
              leather, metal and glass into considered objects for daily living.
            </span>
          </Link>
        </div>
      </section>
      {/* 4. FEATURED */}
      <section className="featured filmstrip-featured" id="collection">
        <div className="wrap">
          <div className="featured-head">
            <div>
              <div className="ey rise">Featured / Selected work</div>
              <h2 className="rise serif">A journey through places with soul.</h2>
              <p className="intro rise">
                Move through selected projects as an editorial sequence—each chapter revealing
                its atmosphere, objects and material character.
              </p>
            </div>
            <Link href="/projects" className="more rise">
              View all projects →
            </Link>
          </div>
        </div>
        <div className="filmstrip-scroll" id="filmstripScroll">
          <div className="filmstrip-pin">
            <div className="film-hint">Scroll to explore</div>
            <div className="filmstrip-track" id="filmstripTrack">
              <article className="film-card active" style={{ '--f': '0' } as CSSProperties}>
                <Media
                  src="/assets/0667_Marsa_Al_Arab_Lobby_9_dff7cff7.webp"
                  className="film-image"
                  alt="The lobby at Marsa Al Arab"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/0672_Marsa_Al_Arab_Lobby_10_4fff97ed.webp"
                    alt="Lobby detail at Marsa Al Arab"
                  />
                </div>
                <div className="film-copy">
                  <div>
                    <span className="film-num">01 / 05</span>
                    <h3>The Lobby</h3>
                  </div>
                  <p>
                    {'Marsa Al Arab · Dubai'}
                    <br />
                    {'Bespoke accessories and styling'}
                  </p>
                </div>
              </article>
              <article className="film-card" style={{ '--f': '1' } as CSSProperties}>
                <Media
                  src="/assets/0663_Marsa_Al_Arab_Suite1_7_a51be4a1.webp"
                  className="film-image"
                  alt="A private suite at Marsa Al Arab"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/0674_Marsa_Al_Arab_Suite1_1_49bd6513.webp"
                    alt="Suite detail at Marsa Al Arab"
                  />
                </div>
                <div className="film-copy">
                  <div>
                    <span className="film-num">02 / 05</span>
                    <h3>Private Suites</h3>
                  </div>
                  <p>
                    {'Marsa Al Arab · Dubai'}
                    <br />
                    {'Objects shaped around a sense of place'}
                  </p>
                </div>
              </article>
              <article className="film-card" style={{ '--f': '2' } as CSSProperties}>
                <Media
                  src="/assets/0661_Marsa_Al_Arab_Iliana_2_829970fd.webp"
                  className="film-image"
                  alt="Iliana at Marsa Al Arab"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/0689_Marsa_Al_Arab_Iliana_5_0c49bd95.webp"
                    alt="Iliana detail at Marsa Al Arab"
                  />
                </div>
                <div className="film-copy">
                  <div>
                    <span className="film-num">03 / 05</span>
                    <h3>Iliana</h3>
                  </div>
                  <p>
                    {'Marsa Al Arab · Dubai'}
                    <br />
                    {'A collection with warmth and character'}
                  </p>
                </div>
              </article>
              <article className="film-card" style={{ '--f': '3' } as CSSProperties}>
                <Media
                  src="/assets/0670_Marsa_Al_Arab_Bombay_5_95764db5.webp"
                  className="film-image"
                  alt="Bombay Club at Marsa Al Arab"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/0679_Marsa_Al_Arab_Bombay_3_09aae676.webp"
                    alt="Bombay Club detail at Marsa Al Arab"
                  />
                </div>
                <div className="film-copy">
                  <div>
                    <span className="film-num">04 / 05</span>
                    <h3>Bombay Club</h3>
                  </div>
                  <p>
                    {'Marsa Al Arab · Dubai'}
                    <br />
                    {'Layered objects and storied materials'}
                  </p>
                </div>
              </article>
              <article className="film-card" style={{ '--f': '4' } as CSSProperties}>
                <Media
                  src="/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp"
                  className="film-image"
                  alt="Waldorf Astoria Osaka"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/0686_Waldorf_Astoria_Osaka_16_948b5f8c.webp"
                    alt="Waldorf Astoria Osaka detail"
                  />
                </div>
                <div className="film-copy">
                  <div>
                    <span className="film-num">05 / 05</span>
                    <h3>Waldorf Osaka</h3>
                  </div>
                  <p>
                    {'Osaka · Japan'}
                    <br />
                    {'Quiet luxury through crafted detail'}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
      {/* FAMILY EDITORIAL PORTRAIT */}
      <section className="family-editorial" aria-labelledby="family-editorial-title">
        <div className="wrap family-editorial-grid">
          <div className="family-editorial-copy">
            <div className="ey rise">Our story</div>
            <h2 className="rise" id="family-editorial-title">
              {'Behind Finer Things is '}
              <em>one family.</em>
            </h2>
            <p className="story rise">
              Finer Things is a family business founded by Alex and Malika. After two decades
              opening and operating hotels, resorts and residences around the world, Alex
              understands the details that make a stay unforgettable. Malika brings the
              discerning eye that gives every space its final character.
            </p>
            <p className="family-note rise">Inspired, always, by family.</p>
          </div>
          <figure className="family-editorial-portrait rise">
            <Media
              src="/assets/finer-things-family.webp"
              alt="Alex and Malika, founders of Finer Things"
            />
            <figcaption>Alex & Malika</figcaption>
          </figure>
        </div>
      </section>
      {/* 9. CLOSING */}
      <section className="closing" id="contact">
        <div className="wrap">
          <div className="ey rise">Start a project</div>
          <h2 className="rise serif">{"Let's tell your story."}</h2>
          <p className="rise">
            {
              "Tell us about your property, the building's past, the land's soul and the seal on the family crest. We'll craft the details that make guests feel it."
            }
          </p>
          <Link href="/contact" className="btn rise">
            Start a project
          </Link>
        </div>
      </section>
      {/* 10. FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-newsletter" aria-labelledby="newsletter-title">
            <div>
              <h2 id="newsletter-title">Stay in touch.</h2>
              <p>Occasional stories, new projects and considered objects.</p>
            </div>
            {newsletter}
          </div>
          <div className="ft-top">
            <div>
              <div className="brand serif">Finer Things</div>
              <p className="tag">
                Bespoke details for the world’s finest spaces. Across the globe.
              </p>
            </div>
            <div className="ft-cols">
              <div>
                <h4>Explore</h4>
                <Link href="/our-work">Our Work</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/about">About</Link>
                <Link href="/services/finer-living">Finer Living</Link>
              </div>
              <div>
                <h4>Connect</h4>
                <a href="#">LinkedIn</a>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </div>
            </div>
          </div>
          <div className="ft-btm">
            <span>© 2026 Finer Things. Family owned.</span>
            <span className="tagline">Every place should tell a story. So should yours.</span>
          </div>
        </div>
      </footer>
    </HomeShell>
  );
}
