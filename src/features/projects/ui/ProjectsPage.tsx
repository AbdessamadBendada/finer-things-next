import Link from 'next/link';
import { Media } from '@/shared/ui/Media';
import { ProjectsShell } from './ProjectsShell';

export function ProjectsPage() {
  return (
    <ProjectsShell>
      <div className="project-progress" id="projectProgress" aria-hidden="true">
        <span>01 / 02</span>
      </div>
      <main>
        <section className="hero">
          <div className="hero-bg">
            <Media
              src="/assets/0685_Marsa_Al_Arab_Lobby_11_c9061482.webp"
              alt="A layered interior view at Jumeirah Marsa Al Arab"
            />
          </div>
          <div className="wrap hero-content">
            <div className="eyebrow">Selected projects</div>
            <h1>
              <span className="hero-line">
                <span>Places with</span>
              </span>
              <span className="hero-line">
                <span>a story to tell.</span>
              </span>
            </h1>
            <div className="hero-foot">
              <p>
                A visual index of selected hospitality work across rooms, public spaces and
                dining destinations.
              </p>
              <span className="scroll-cue">View selected places ↓</span>
            </div>
          </div>
        </section>
        <section className="intro">
          <div className="wrap intro-grid">
            <div className="eyebrow rise">The work in place</div>
            <div>
              <h2 className="rise" data-word-reveal="">
                {
                  'Every destination has its own character. The details should feel as though they could belong '
                }
                <em>nowhere else.</em>
              </h2>
              <p className="intro-note rise">
                The current project imagery brings together two properties and a series of
                distinctive spaces within them.
              </p>
            </div>
          </div>
        </section>
        <section className="services" id="projects">
          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/0678_Marsa_Al_Arab_Lobby_4_b7af1dee.webp"
                alt="Decorative objects in the lobby of Jumeirah Marsa Al Arab"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">01</span>
                <span className="eyebrow">Dubai · United Arab Emirates</span>
              </div>
              <h2>
                {'Jumeirah '}
                <em>Marsa Al Arab</em>
              </h2>
              <div className="service-bottom">
                <p>
                  Selected imagery from the lobby, guest suites, The Bombay Club and Iliana.
                </p>
                <Link className="service-link" href="/projects/marsa-al-arab">
                  View project →
                </Link>
              </div>
            </div>
          </article>
          <article className="service">
            <div className="service-media">
              <Media
                src="/assets/0669_Waldorf_Astoria_Osaka_18_536d1f9e.webp"
                alt="Guest-room details at Waldorf Astoria Osaka"
              />
            </div>
            <div className="wrap service-content">
              <div className="service-top">
                <span className="service-number">02</span>
                <span className="eyebrow">Osaka · Japan</span>
              </div>
              <h2>
                {'Waldorf Astoria '}
                <em>Osaka</em>
              </h2>
              <div className="service-bottom">
                <p>
                  Selected imagery from guest-room and hospitality spaces at the property in
                  Osaka’s Umekita district.
                </p>
                <Link className="service-link" href="/projects/waldorf-astoria-osaka">
                  View project →
                </Link>
              </div>
            </div>
          </article>
        </section>
        <section className="continuity">
          <div className="wrap">
            <div className="continuity-head">
              <div className="eyebrow rise">Within Marsa Al Arab</div>
              <div>
                <h2 className="rise">
                  {'One property, '}
                  <em>many characters.</em>
                </h2>
                <p className="continuity-note rise">
                  The imagery moves from arrival and residence to two distinct dining settings:
                  The Bombay Club and Iliana.
                </p>
              </div>
            </div>
            <div className="places-grid">
              <figure className="place rise" data-place-drift="-18">
                <Media
                  src="/assets/0681_Marsa_Al_Arab_Lobby_2_d21675ab.webp"
                  alt="Lobby interior at Jumeirah Marsa Al Arab"
                />
                <figcaption>Lobby</figcaption>
              </figure>
              <figure className="place rise" data-place-drift="13">
                <Media
                  src="/assets/0664_Marsa_Al_Arab_Suite2_4_78452d9c.webp"
                  alt="Guest-suite interior at Jumeirah Marsa Al Arab"
                />
                <figcaption>Guest suite</figcaption>
              </figure>
              <figure className="place rise" data-place-drift="-8">
                <Media
                  src="/assets/0679_Marsa_Al_Arab_Bombay_3_09aae676.webp"
                  alt="Interior details at The Bombay Club"
                />
                <figcaption>The Bombay Club</figcaption>
              </figure>
              <figure className="place rise" data-place-drift="10">
                <Media
                  src="/assets/0680_Marsa_Al_Arab_Iliana_3_e20bcd92.webp"
                  alt="Interior details at Iliana"
                />
                <figcaption>Iliana</figcaption>
              </figure>
            </div>
          </div>
        </section>
        <section className="closing" id="contact">
          <div className="wrap">
            <div className="eyebrow rise">Start a project</div>
            <h2 className="rise">Let’s create details that belong to the place.</h2>
            <p className="rise">
              Tell us about the property, its story and the experience you want to shape.
            </p>
            <Link className="btn rise" href="/contact">
              Begin a conversation
            </Link>
          </div>
        </section>
      </main>
    </ProjectsShell>
  );
}
