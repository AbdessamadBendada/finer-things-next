import type { CSSProperties } from 'react';
import { Media } from '@/shared/ui/Media';
import Link from 'next/link';
import { HeroCollage } from './HeroCollage';
import { HomeShell } from './HomeShell';
import { SiteCta } from '@/shared/layout/SiteCta';
import { FILMSTRIP_MODE } from '../model/filmstrip.mode';

const IS_SLIDER = FILMSTRIP_MODE === 'slider';

export function HomePage() {
  return (
    <HomeShell>
      {/* HEADER */}
      {/* big shrinking wordmark */}
      <div className="word" id="word" aria-hidden="true">
        <Media
          src="/assets/finer-things-logo.png"
          alt=""
          sizes="(max-width: 860px) 65vw, 28vw"
        />
      </div>
      {/* 1. HERO */}
      <section className="hero" id="hero">
        <HeroCollage />
        <div className="collage-veil" />
        <div className="hero-copy">
          <h1>Every place should tell a story.</h1>
          <div className="sub">
            We help the world’s finest hotels and residences express their character through
            bespoke accessories, thoughtful styling and distinctive designs.
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
            sizes="(max-width: 860px) 80vw, 56vw"
          />
          <Media
            src="/assets/finer-things-logo.png"
            className="intro-logo-layer intro-logo-name"
            alt=""
            aria-hidden="true"
            sizes="(max-width: 860px) 80vw, 56vw"
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
              sizes="100vw"
              src="/assets/new-cover-bespoke-accessories.webp"
              alt="A stitched leather tray on a walnut table"
            />
          </div>
          <Link href="/services/bespoke-accessories">
            <span className="idx">01</span>
            <h3 className="serif">Bespoke Accessories</h3>
            <span className="desc">
              Design and production of bespoke accessories guests can see, touch and feel.
            </span>
            {/* The row is a link and did not look like one. Decorative: the
                anchor already carries the accessible name. */}
            <span className="go" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
        {/* The only portrait photograph of the three. See the `data-crop` rule
            in home.module.css for why it needs its own focal point. */}
        <div className="svc-row rise" data-crop="lower">
          <div className="wipe">
            <Media
              sizes="100vw"
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
            <span className="go" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
        <div className="svc-row rise">
          <div className="wipe">
            <Media
              sizes="100vw"
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
            <span className="go" aria-hidden="true">
              →
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
        {/*
         * Two shapes for the same five cards, chosen by FILMSTRIP_MODE.
         *
         * `slider` puts the scroll container on the element the hook listens
         * to, so `#filmstripScroll` is the overflow box itself rather than a
         * 400svh spacer wrapping a sticky pin. The card markup below is shared
         * and unchanged; only the frame around it differs.
         */}
        <div
          className={IS_SLIDER ? 'filmstrip-slider' : 'filmstrip-scroll'}
          id={IS_SLIDER ? undefined : 'filmstripScroll'}
        >
          <div
            className={IS_SLIDER ? 'filmstrip-viewport' : 'filmstrip-pin'}
            id={IS_SLIDER ? 'filmstripScroll' : undefined}
            /*
             * A native overflow box is not focusable in Firefox or Safari
             * without this, which would leave keyboard users unable to reach
             * the cards at all. With it, arrow keys scroll the strip.
             */
            tabIndex={IS_SLIDER ? 0 : undefined}
            role={IS_SLIDER ? 'group' : undefined}
            aria-label={IS_SLIDER ? 'Featured projects' : undefined}
          >
            {!IS_SLIDER && <div className="film-hint">Scroll to explore</div>}
            <div className="filmstrip-track" id="filmstripTrack">
              <article className="film-card active" style={{ '--f': '0' } as CSSProperties}>
                <Media
                  src="/assets/new-work-marsa-lobby-05.webp"
                  className="film-image"
                  alt="Sculptural objects styled on a lacquered lobby console"
                  sizes="(max-width: 860px) 100vw, 80vw"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-lobby-08.webp"
                    alt="A glass cloche and cut-glass vase on a marble lobby table"
                    sizes="(max-width: 860px) 30vw, 14vw"
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
                  sizes="(max-width: 860px) 100vw, 80vw"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-suite2-02.webp"
                    alt="Orchids in a gilt-edged ceramic bowl"
                    sizes="(max-width: 860px) 30vw, 14vw"
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
                  sizes="(max-width: 860px) 100vw, 80vw"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-shelfs.webp"
                    alt="Coral, crystal and a shell-inlaid box on lit marble shelves"
                    sizes="(max-width: 860px) 30vw, 14vw"
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
                  sizes="(max-width: 860px) 100vw, 80vw"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-corridor-03.webp"
                    alt="Considered detail along the corridor at Marsa Al Arab"
                    sizes="(max-width: 860px) 30vw, 14vw"
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
                  sizes="(max-width: 860px) 100vw, 80vw"
                />
                <div className="film-shade" />
                <div className="film-detail">
                  <Media
                    src="/assets/new-work-marsa-lobby-12.webp"
                    alt="Styled detail at Waldorf Astoria Osaka"
                    sizes="(max-width: 860px) 30vw, 14vw"
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
          {/*
           * The wayfinding the pinned version never had: how many there are,
           * which one you are on, and two controls that move it. Outside the
           * overflow box so the arrows are not themselves scrolled away.
           *
           * The counter is not a live region. It changes on every swipe, and
           * announcing "03 of 05" mid-drag talks over the card titles, which
           * are what a screen reader user is actually there for. The cards
           * each carry their own "03 / 05" in the copy already.
           */}
          {IS_SLIDER && (
            <div className="wrap film-controls">
              <div className="film-progress-rail" aria-hidden="true">
                <span className="film-progress" data-film-progress />
              </div>
              <div className="film-controls-right">
                <p className="film-counter" aria-hidden="true">
                  <span data-film-counter>01</span>
                  <span className="film-counter-total"> / 05</span>
                </p>
                <button
                  type="button"
                  className="film-arrow"
                  data-film-prev
                  aria-label="Previous project"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  className="film-arrow"
                  data-film-next
                  aria-label="Next project"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* 9. CLOSING */}
      <SiteCta />
    </HomeShell>
  );
}
