import type { CSSProperties, ReactNode } from 'react';
import { Media } from '@/shared/ui/Media';
import { FooterBrand } from '@/shared/layout/SiteFooter';
import Link from 'next/link';
import { HeroCollage } from './HeroCollage';
import { HomeShell } from './HomeShell';
import { SiteCta } from '@/shared/layout/SiteCta';

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
          <span>Unique</span>
          <span>Story</span>
        </div>
      </div>
      {/* PURPOSE */}
      <section className="purpose" id="purpose" aria-labelledby="purpose-title">
        {/* The statement holds the screen while it is read. The pin is the
            same device the filmstrip uses further down the page. */}
        <div className="purpose-pin">
          <div className="wrap">
            <h2 id="purpose-title" data-word-reveal="">
              {
                'Guided by brave techniques and material combinations, Finer Things designs unique accessories that fill a stay with '
              }
              <span className="outcome">story, personality and soul.</span>
            </h2>
          </div>
        </div>
      </section>
      {/* 3. SERVICES */}
      <section className="svc" id="work">
        <div className="wrap svc-head">
          <div className="ey rise">What we do</div>
          <p className="rise">
            Curated touch points and distinct design elements are essential for every guest’s
            journey. At Finer Things, this is where your story begins.
          </p>
        </div>
        <div className="svc-row rise">
          <div className="wipe">
            <Media
              src="/assets/new-cover-bespoke-accessories.webp"
              alt="A stitched leather tray on a walnut table"
            />
          </div>
          <Link href="/services/bespoke-accessories">
            <span className="idx">01</span>
            <h3 className="serif">Bespoke Accessories</h3>
            <span className="desc">
              Design and production of bespoke accessories, the finer things guests can see,
              touch and feel.
            </span>
          </Link>
        </div>
        <div className="svc-row rise">
          <div className="wipe">
            <Media
              src="/assets/new-cover-styling-curation.webp"
              alt="Sculptural objects styled on a lacquered console"
            />
          </div>
          <Link href="/services/styling-curation">
            <span className="idx">02</span>
            <h3 className="serif">Styling & Curation</h3>
            <span className="desc">
              Styling and curation that give spaces character and soul.
            </span>
          </Link>
        </div>
        <div className="svc-row rise">
          <div className="wipe">
            <Media
              src="/assets/new-cover-finer-living.webp"
              alt="An oak and brass footed bowl from the Finer Living collection"
            />
          </div>
          <Link href="/services/finer-living">
            <span className="idx">03</span>
            <h3 className="serif">Finer Living</h3>
            <span className="desc">
              Finer Living - the ready-made collection of European-crafted pieces.
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
                Discover our best work across the world’s finest hotels and residences. Move
                through selected projects as an editorial sequence, each chapter revealing its
                atmosphere, objects and material character.
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
                  src="/assets/new-work-marsa-lobby-05.webp"
                  className="film-image"
                  alt="Sculptural objects styled on a lacquered lobby console"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-lobby-08.webp"
                    alt="A glass cloche and cut-glass vase on a marble lobby table"
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
                  src="/assets/new-work-bespoke-inlays.webp"
                  className="film-image"
                  alt="Bespoke leather trays inlaid in a lit suite drawer"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-suite2-02.webp"
                    alt="Orchids in a gilt-edged ceramic bowl"
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
                  src="/assets/new-work-an-01344.webp"
                  className="film-image"
                  alt="A floral centrepiece on a marble dining table at Iliana"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-shelfs.webp"
                    alt="Coral, crystal and a shell-inlaid box on lit marble shelves"
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
                  src="/assets/new-work-an-01515.webp"
                  className="film-image"
                  alt="A brass drinks trolley set with crystal, the Burj Al Arab beyond"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-corridor-03.webp"
                    alt="Considered detail along the corridor at Marsa Al Arab"
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
                  src="/assets/new-work-waldorf-16.webp"
                  className="film-image"
                  alt="The entrance hall at Waldorf Astoria Osaka"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-lobby-12.webp"
                    alt="Styled detail at Waldorf Astoria Osaka"
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
      <section className="family-editorial" id="story" aria-labelledby="family-editorial-title">
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
          </div>
          <figure className="family-editorial-portrait rise">
            <Media
              src="/assets/finer-things-family.webp"
              alt="Malika and Alex, founders of Finer Things"
            />
            <figcaption>Malika and Alex</figcaption>
          </figure>
        </div>
      </section>
      {/* 9. CLOSING */}
      <SiteCta />
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
              <FooterBrand className="brand serif" />
              <p className="tag">
                Bespoke details for the world’s finest spaces. Across the globe.
              </p>
            </div>
            <div className="ft-cols">
              <div>
                <h4>Explore</h4>
                <Link href="/our-work">What we do</Link>
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
