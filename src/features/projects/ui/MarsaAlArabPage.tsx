import Link from 'next/link';

import { ROUTES } from '@/shared/config/routes';
import { Media } from '@/shared/ui/Media';
import { MarsaAlArabShell } from './MarsaAlArabShell';
import { SiteCta } from '@/shared/layout/SiteCta';

export function MarsaAlArabPage() {
  return (
    <MarsaAlArabShell>
      <main>
        <section className="hero">
          <div className="hero-bg">
            <Media
              src="/assets/0685_Marsa_Al_Arab_Lobby_11_c9061482.webp"
              alt="Interior view at Jumeirah Marsa Al Arab"
              sizes="100vw"
            />
          </div>
          <div className="wrap hero-content">
            <div className="hero-meta">
              <span className="ey">
                <Link className="context-link" href={ROUTES.projects}>
                  Selected project
                </Link>
              </span>
              <i />
              <span className="ey">Dubai · United Arab Emirates</span>
            </div>
            <h1>
              <span className="mask">
                <span>Jumeirah</span>
              </span>{' '}
              <span className="mask">
                <span>Marsa Al Arab</span>
              </span>
            </h1>
            <div className="hero-foot">
              <p>
                A visual journey through arrival, residence and dining spaces at Jumeirah Marsa
                Al Arab.
              </p>
              <span className="count">01 / 02</span>
            </div>
          </div>
        </section>
        <section className="intro">
          <div className="wrap intro-grid">
            <div className="ey rise">The property</div>
            <div>
              <h2 className="rise">
                {'Four settings, each with a character of '}
                <em>its own.</em>
              </h2>
              <p className="intro-copy rise">
                The selected imagery moves from the hotel lobby and guest suites to The Bombay
                Club and Iliana, distinct spaces within one Dubai destination.
              </p>
            </div>
          </div>
        </section>
        <section className="chapter">
          <div className="chapter-bg">
            <Media
              src="/assets/0676_Marsa_Al_Arab_Lobby_5_b2051520.webp"
              alt="Decorative objects in the lobby at Jumeirah Marsa Al Arab"
              sizes="100vw"
            />
          </div>
          <div className="wrap chapter-copy">
            <span className="chapter-no">01</span>
            <h2>
              {'The '}
              <em>Lobby</em>
            </h2>
            <div className="chapter-bottom">
              <p>
                Sculptural objects, books and floral moments appear against a richly layered
                interior.
              </p>
              <span className="chapter-label">Arrival · Public space</span>
            </div>
          </div>
        </section>
        <section className="chapter">
          <div className="chapter-bg">
            <Media
              src="/assets/0663_Marsa_Al_Arab_Suite1_7_a51be4a1.webp"
              alt="Crystal decanters and a brass trolley in a guest suite at Jumeirah Marsa Al Arab"
              sizes="100vw"
            />
          </div>
          <div className="wrap chapter-copy">
            <span className="chapter-no">02</span>
            <h2>
              {'Guest '}
              <em>Suites</em>
            </h2>
            <div className="chapter-bottom">
              <p>
                Objects are encountered at a closer scale within the private rhythm of the
                suite.
              </p>
              <span className="chapter-label">Residence · Guest room</span>
            </div>
          </div>
        </section>
        <section className="chapter">
          <div className="chapter-bg">
            <Media
              src="/assets/0670_Marsa_Al_Arab_Bombay_5_95764db5.webp"
              alt="Interior view at The Bombay Club in Jumeirah Marsa Al Arab"
              sizes="100vw"
            />
          </div>
          <div className="wrap chapter-copy">
            <span className="chapter-no">03</span>
            <h2>
              {'The Bombay '}
              <em>Club</em>
            </h2>
            <div className="chapter-bottom">
              <p>
                The Bombay Club explores India’s culinary heritage through authentic flavours,
                intricate spices and elegant presentation.
              </p>
              <span className="chapter-label">Indian dining · Dubai</span>
            </div>
          </div>
        </section>
        <section className="chapter">
          <div className="chapter-bg">
            <Media
              src="/assets/0680_Marsa_Al_Arab_Iliana_3_e20bcd92.webp"
              alt="Ceramic installation and display niche at Iliana in Jumeirah Marsa Al Arab"
              sizes="100vw"
            />
          </div>
          <div className="wrap chapter-copy">
            <span className="chapter-no">04</span>
            <h2>
              <em>Iliana</em>
            </h2>
            <div className="chapter-bottom">
              <p>A Greek restaurant and pool-club setting at Jumeirah Marsa Al Arab.</p>
              <span className="chapter-label">Greek dining · Pool club</span>
            </div>
          </div>
        </section>
        <section className="gallery">
          <div className="wrap">
            <div className="gallery-head">
              <div className="ey rise">Closer details</div>
              <h2 className="rise">
                {'The atmosphere lives in the '}
                <em>smallest frame.</em>
              </h2>
            </div>
            <div className="gallery-grid">
              <figure className="shot rise" data-drift="-18">
                <Media
                  src="/assets/0681_Marsa_Al_Arab_Lobby_2_d21675ab.webp"
                  alt="Lobby detail at Jumeirah Marsa Al Arab"
                />
                <figcaption>Lobby</figcaption>
              </figure>
              <figure className="shot rise" data-drift="13">
                <Media
                  src="/assets/0664_Marsa_Al_Arab_Suite2_4_78452d9c.webp"
                  alt="Guest suite at Jumeirah Marsa Al Arab"
                />
                <figcaption>Guest suite</figcaption>
              </figure>
              <figure className="shot rise" data-drift="-9">
                <Media
                  src="/assets/0679_Marsa_Al_Arab_Bombay_3_09aae676.webp"
                  alt="Decorative details at The Bombay Club"
                />
                <figcaption>The Bombay Club</figcaption>
              </figure>
              <figure className="shot rise" data-drift="11">
                <Media
                  src="/assets/0689_Marsa_Al_Arab_Iliana_5_0c49bd95.webp"
                  alt="Books and objects at Iliana"
                />
                <figcaption>Iliana</figcaption>
              </figure>
            </div>
          </div>
        </section>
        <Link className="next" href={ROUTES.project('waldorf-astoria-osaka')}>
          <Media
            src="/assets/0669_Waldorf_Astoria_Osaka_18_536d1f9e.webp"
            alt="Interior details at Waldorf Astoria Osaka"
          />
          <div className="wrap next-copy">
            <div className="ey">Next project · Osaka</div>
            <div className="next-row">
              <h2>Waldorf Astoria Osaka</h2>
              <span className="next-go">View next project →</span>
            </div>
          </div>
        </Link>
        <SiteCta />
      </main>
    </MarsaAlArabShell>
  );
}
