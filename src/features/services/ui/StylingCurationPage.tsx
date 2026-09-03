import Link from 'next/link';

import { ROUTES } from '@/shared/config/routes';
import { Media } from '@/shared/ui/Media';
import { StylingCurationShell } from './StylingCurationShell';
import { SiteCta } from '@/shared/layout/SiteCta';

export function StylingCurationPage() {
  return (
    <StylingCurationShell>
      <main>
        {/* STYLING & CURATION SERVICE HERO */}
        <section className="hero">
          <div className="hero-media">
            <Media
              src="/assets/0667_Marsa_Al_Arab_Lobby_9_dff7cff7.webp"
              alt="Sculptural object, florals and seating in the Marsa Al Arab lobby"
              sizes="100vw"
            />
          </div>
          <div className="wrap hero-content">
            <div className="hero-kicker eyebrow">
              <Link className="context-link" href={ROUTES.ourWork}>
                What we do / 02
              </Link>
            </div>
            <h1>
              <span className="hero-line">
                <span>Styling</span>
              </span>{' '}
              <span className="hero-line">
                <span>
                  <em>& Curation</em>
                </span>
              </span>
            </h1>
            <div className="hero-bottom">
              <p className="hero-intro">
                Books, objects, art and florals considered together to give guest rooms, public
                spaces, restaurants and residences their final character.
              </p>
              <span className="scroll-cue">Enter the story ↓</span>
            </div>
          </div>
        </section>
        {/* OPENING STATEMENT */}
        <section className="manifesto">
          <div className="wrap manifesto-grid">
            <div className="eyebrow rise">The final layer</div>
            <div>
              <h2 className="rise" data-word-reveal="">
                {'A space becomes memorable when every detail feels '}
                <em>connected.</em>
              </h2>
              <p className="manifesto-note rise">
                Finer Things brings styling and storytelling together, sourcing the unexpected
                and composing each layer around the identity of the place.
              </p>
            </div>
          </div>
        </section>
        {/* SCOPE OF WORK */}
        <section className="scope" id="scope">
          <div className="wrap">
            <div className="scope-head">
              <h2 className="rise">One narrative, many layers.</h2>
              <p className="rise">
                The work moves from the wider story to the details within a room, creating a
                considered relationship between objects, books, florals and their surroundings.
              </p>
            </div>
            <div className="scope-list">
              <div className="scope-row rise">
                <span className="scope-num">01</span>
                <h3>Styling & storytelling</h3>
                <p>Creating a distinct narrative through the details that complete a space.</p>
              </div>
              <div className="scope-row rise">
                <span className="scope-num">02</span>
                <h3>Sourcing & selection</h3>
                <p>
                  Finding objects, materials and styles chosen for their quality and character.
                </p>
              </div>
              <div className="scope-row rise">
                <span className="scope-num">03</span>
                <h3>Opening support</h3>
                <p>Supporting hotel, residence, restaurant, lounge and bar openings.</p>
              </div>
              <div className="scope-row rise">
                <span className="scope-num">04</span>
                <h3>Project fulfillment</h3>
                <p>
                  Customizable support shaped around the complexity and requirements of each
                  project.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* EDITORIAL PROJECT STORY */}
        <section className="story">
          <div className="wrap">
            <div className="story-head">
              <h2 className="rise">The art of bringing a room together.</h2>
              <p className="rise">
                Each object holds its own presence. Together, they establish rhythm, contrast
                and a sense of character within the space.
              </p>
            </div>
            <div className="story-grid">
              <figure className="story-figure story-main rise" data-drift="-18">
                <Media
                  src="/assets/0680_Marsa_Al_Arab_Iliana_3_e20bcd92.webp"
                  alt="Ceramic installation and styled display niche at Iliana"
                />
                <figcaption>Marsa Al Arab / Iliana</figcaption>
              </figure>
              <figure className="story-figure story-small rise" data-drift="14">
                <Media
                  src="/assets/0662_Waldorf_Astoria_Osaka_13_c71bc2ac.webp"
                  alt="Clock and writing accessories on a guest-room bedside table"
                />
                <figcaption>Waldorf Astoria Osaka / Guest room</figcaption>
              </figure>
              <figure className="story-figure story-detail rise" data-drift="-7">
                <Media
                  src="/assets/0679_Marsa_Al_Arab_Bombay_3_09aae676.webp"
                  alt="Books and decorative objects arranged at Bombay Club"
                  sizes="(max-width: 860px) 80vw, 20vw"
                />
                <figcaption>Marsa Al Arab / Bombay Club</figcaption>
              </figure>
            </div>
          </div>
        </section>
        {/* SPACES & LAYERS */}
        <section className="materials">
          <div className="wrap">
            <div className="materials-top">
              <div className="eyebrow rise">Where we work</div>
              <div>
                <h2 className="rise">
                  {'Character, from room to '}
                  <em>residence.</em>
                </h2>
                <p className="materials-copy rise">
                  Styling can support a single setting or a wider opening, with each selection
                  shaped around the space, its use and the story it wants to tell.
                </p>
              </div>
            </div>
            <div className="material-list rise" aria-label="Styling and curation settings">
              <div className="material">
                <span className="material-name">Guest rooms</span>
                <span className="material-detail">Rooms · suites · residences</span>
              </div>
              <div className="material">
                <span className="material-name">Public spaces</span>
                <span className="material-detail">Arrival · lobby · lounge</span>
              </div>
              <div className="material">
                <span className="material-name">Restaurants & bars</span>
                <span className="material-detail">Dining · lounge · storytelling</span>
              </div>
              <div className="material">
                <span className="material-name">Libraries</span>
                <span className="material-detail">Books · lists · curation</span>
              </div>
              <div className="material">
                <span className="material-name">Seasonal moments</span>
                <span className="material-detail">Decoration · styling · florals</span>
              </div>
            </div>
          </div>
        </section>
        {/* PROCESS */}
        <section className="process" id="process">
          <div className="wrap">
            <div className="process-title">
              <h2 className="rise">From story to setting.</h2>
              <p className="rise">
                A clear narrative guides the selections while customizable project support
                responds to the needs of each space.
              </p>
            </div>
            <div className="steps">
              <article className="step rise">
                <span className="step-num">01</span>
                <h3>Reading the space</h3>
                <p>Its purpose, setting and the experience it wants to create.</p>
              </article>
              <article className="step rise">
                <span className="step-num">02</span>
                <h3>Building the narrative</h3>
                <p>A clear point of view connecting the property and its story.</p>
              </article>
              <article className="step rise">
                <span className="step-num">03</span>
                <h3>Curating the layers</h3>
                <p>Objects, books, materials and florals considered together.</p>
              </article>
              <article className="step rise">
                <span className="step-num">04</span>
                <h3>Bringing it together</h3>
                <p>Project fulfillment support adapted to the space and its requirements.</p>
              </article>
            </div>
          </div>
        </section>
        {/* SELECTED WORK */}
        <section className="project" aria-labelledby="project-title">
          <div className="project-bg" id="projectBg">
            <Media
              src="/assets/0686_Waldorf_Astoria_Osaka_16_948b5f8c.webp"
              alt="A considered interior detail at Waldorf Astoria Osaka"
              sizes="100vw"
            />
          </div>
          <div className="wrap project-copy">
            <div className="eyebrow rise">Selected work</div>
            <h2 id="project-title">
              <Link className="context-link" href={ROUTES.project('waldorf-astoria-osaka')}>
                <span className="title-mask">
                  <span>Waldorf Astoria Osaka</span>
                </span>
              </Link>
            </h2>
            <div className="project-meta rise">
              <span>Osaka</span>
              <span>Selected details</span>
              <span>Hospitality</span>
            </div>
          </div>
        </section>
        {/* PROJECT CTA */}
        <SiteCta />
      </main>
    </StylingCurationShell>
  );
}
