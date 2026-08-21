import Link from 'next/link';
import { Media } from '@/shared/ui/Media';
import { WaldorfAstoriaOsakaShell } from './WaldorfAstoriaOsakaShell';
import { SiteCta } from '@/shared/layout/SiteCta';

export function WaldorfAstoriaOsakaPage() {
  return (
    <WaldorfAstoriaOsakaShell>
      <main>
        <section className="hero">
          <div className="hero-bg">
            <Media
              src="/assets/0669_Waldorf_Astoria_Osaka_18_536d1f9e.webp"
              alt="Guest-room detail at Waldorf Astoria Osaka"
            />
          </div>
          <div className="wrap hero-content">
            <div className="hero-meta">
              <span className="ey">Selected project</span>
              <i />
              <span className="ey">Osaka · Japan</span>
            </div>
            <h1>
              <span className="mask">
                <span>Waldorf Astoria</span>
              </span>
              <span className="mask">
                <span>Osaka</span>
              </span>
            </h1>
            <div className="hero-foot">
              <p>A close study of guest-room touchpoints within Waldorf Astoria Osaka.</p>
              <span className="count">02 / 02</span>
            </div>
          </div>
        </section>
        <section className="intro">
          <div className="wrap intro-grid">
            <div className="ey rise">The property</div>
            <div>
              <h2 className="rise">
                {'Art Deco geometry meets the precision of '}
                <em>Japanese craft.</em>
              </h2>
              <p className="intro-copy rise">
                Designed by André Fu, Waldorf Astoria Osaka combines the brand’s heritage with
                the spirit of modern Japan. Guest rooms and suites begin on the 31st floor.
              </p>
            </div>
          </div>
        </section>
        <section className="chapter">
          <div className="chapter-bg">
            <Media
              src="/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp"
              alt="Clock and writing accessories on a bedside table at Waldorf Astoria Osaka"
            />
          </div>
          <div className="wrap chapter-copy">
            <span className="chapter-no">01</span>
            <h2>
              {'Quiet '}
              <em>Rituals</em>
            </h2>
            <div className="chapter-bottom">
              <p>
                A clock, writing paper and pen sit within the warm timber geometry of the
                bedside table.
              </p>
              <span className="chapter-label">Guest room · Bedside</span>
            </div>
          </div>
        </section>
        <section className="chapter">
          <div className="chapter-bg">
            <Media
              src="/assets/0682_Waldorf_Astoria_Osaka_12_ef1532bb.webp"
              alt="Dark vessel, glass and brass objects at Waldorf Astoria Osaka"
            />
          </div>
          <div className="wrap chapter-copy">
            <span className="chapter-no">02</span>
            <h2>
              {'Material '}
              <em>Contrast</em>
            </h2>
            <div className="chapter-bottom">
              <p>
                Dark lacquer, clear glass, brass and stone create contrast within a warm,
                restrained palette.
              </p>
              <span className="chapter-label">Lacquer · Glass · Brass</span>
            </div>
          </div>
        </section>
        <section className="chapter">
          <div className="chapter-bg">
            <Media
              src="/assets/0686_Waldorf_Astoria_Osaka_16_948b5f8c.webp"
              alt="Decorative guest-room detail at Waldorf Astoria Osaka"
            />
          </div>
          <div className="wrap chapter-copy">
            <span className="chapter-no">03</span>
            <h2>
              {'Private '}
              <em>Retreat</em>
            </h2>
            <div className="chapter-bottom">
              <p>
                The hotel’s guest rooms balance Art Deco form with the intimacy of a private
                retreat and Japanese craft traditions.
              </p>
              <span className="chapter-label">Art Deco · Japanese design</span>
            </div>
          </div>
        </section>
        <section className="gallery">
          <div className="wrap">
            <div className="gallery-head">
              <div className="ey rise">Closer details</div>
              <h2 className="rise">
                {'Precision is felt in the '}
                <em>quietest moments.</em>
              </h2>
            </div>
            <div className="gallery-grid">
              <figure className="shot rise" data-drift="-18">
                <Media
                  src="/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp"
                  alt="Bedside clock and writing set at Waldorf Astoria Osaka"
                />
                <figcaption>Bedside detail</figcaption>
              </figure>
              <figure className="shot rise" data-drift="13">
                <Media
                  src="/assets/0682_Waldorf_Astoria_Osaka_12_ef1532bb.webp"
                  alt="Lacquer, glass and brass guest-room objects"
                />
                <figcaption>Material contrast</figcaption>
              </figure>
              <figure className="shot rise" data-drift="-9">
                <Media
                  src="/assets/0669_Waldorf_Astoria_Osaka_18_536d1f9e.webp"
                  alt="Guest-room objects against a patterned wall at Waldorf Astoria Osaka"
                />
                <figcaption>Guest room</figcaption>
              </figure>
              <figure className="shot rise" data-drift="11">
                <Media
                  src="/assets/0686_Waldorf_Astoria_Osaka_16_948b5f8c.webp"
                  alt="Selected guest-room detail at Waldorf Astoria Osaka"
                />
                <figcaption>Selected detail</figcaption>
              </figure>
            </div>
          </div>
        </section>
        <Link className="next" href="/projects/marsa-al-arab">
          <Media
            src="/assets/0685_Marsa_Al_Arab_Lobby_11_c9061482.webp"
            alt="Interior at Jumeirah Marsa Al Arab"
          />
          <div className="wrap next-copy">
            <div className="ey">Previous project · Dubai</div>
            <div className="next-row">
              <h2>Jumeirah Marsa Al Arab</h2>
              <span className="next-go">Return to project →</span>
            </div>
          </div>
        </Link>
        <SiteCta />
      </main>
    </WaldorfAstoriaOsakaShell>
  );
}
