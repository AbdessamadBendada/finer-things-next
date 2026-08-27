import { Media } from '@/shared/ui/Media';
import { BespokeAccessoriesShell } from './BespokeAccessoriesShell';
import { SiteCta } from '@/shared/layout/SiteCta';

export function BespokeAccessoriesPage() {
  return (
    <BespokeAccessoriesShell>
      <main>
        {/* BESPOKE SERVICE HERO */}
        <section className="hero">
          <div className="hero-media">
            <Media
              src="/assets/0676_Marsa_Al_Arab_Lobby_5_b2051520.webp"
              alt="Bespoke decorative objects arranged in the Marsa Al Arab lobby"
            />
          </div>
          <div className="wrap hero-content">
            <div className="hero-kicker eyebrow">What we do / 01</div>
            <h1>
              <span className="hero-line">
                <span>Bespoke</span>
              </span>
              <span className="hero-line">
                <span>
                  <em>Accessories</em>
                </span>
              </span>
            </h1>
            <div className="hero-bottom">
              <p className="hero-intro">
                Objects shaped around the identity of a place, from material, colour and scale
                to finish, stitching and every detail guests touch.
              </p>
              <span className="scroll-cue">Discover the details ↓</span>
            </div>
          </div>
        </section>
        {/* OPENING STATEMENT */}
        <section className="manifesto">
          <div className="wrap manifesto-grid">
            <div className="eyebrow rise">Made for one place</div>
            <div>
              <h2 className="rise" data-word-reveal="">
                {'The smallest object can carry the '}
                <em>whole story.</em>
              </h2>
              <p className="manifesto-note rise">
                We translate a property’s architecture, heritage and sense of place into
                distinctive accessories, considered as part of the experience, never added as an
                afterthought.
              </p>
            </div>
          </div>
        </section>
        {/* SCOPE OF WORK */}
        <section className="scope" id="scope">
          <div className="wrap">
            <div className="scope-head">
              <h2 className="rise">From narrative to final placement.</h2>
              <p className="rise">
                One studio brings the creative and practical journey together, helping each
                detail remain true to the original idea through development, production and
                rollout.
              </p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">01</span>
              <h3>Narrative & identity</h3>
              <p>
                Creating bespoke touchpoints that reflect the property’s character and story.
              </p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">02</span>
              <h3>Customization</h3>
              <p>Considering material, colour, form, texture, finish and stitching.</p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">03</span>
              <h3>Sourcing & craftsmanship</h3>
              <p>Bringing quality materials together with artisanal craftsmanship.</p>
            </div>
            <div className="scope-row rise">
              <span className="scope-num">04</span>
              <h3>Project rollout support</h3>
              <p>
                Customizable support shaped around the requirements and complexity of each
                project.
              </p>
            </div>
          </div>
        </section>
        {/* EDITORIAL PROJECT STORY */}
        <section className="story">
          <div className="wrap">
            <div className="story-head">
              <h2 className="rise">Details that belong to the room.</h2>
              <p className="rise">
                Accessories are read in context: alongside the material palette, the
                architecture and the way a guest moves through the space.
              </p>
            </div>
            <div className="story-grid">
              <figure className="story-figure story-main rise" data-drift="-18">
                <Media
                  src="/assets/0663_Marsa_Al_Arab_Suite1_7_a51be4a1.webp"
                  alt="Crystal decanters and a brass service trolley in a Marsa Al Arab suite"
                />
                <figcaption>Marsa Al Arab / Suite</figcaption>
              </figure>
              <figure className="story-figure story-small rise" data-drift="14">
                <Media
                  src="/assets/0670_Marsa_Al_Arab_Bombay_5_95764db5.webp"
                  alt="Decorative accessories and florals at Bombay Club"
                />
                <figcaption>Marsa Al Arab / Bombay Club</figcaption>
              </figure>
              <figure className="story-figure story-detail rise" data-drift="-7">
                <Media
                  src="/assets/0689_Marsa_Al_Arab_Iliana_5_0c49bd95.webp"
                  alt="Books, ceramics and decorative bowls within an illuminated niche"
                />
                <figcaption>Marsa Al Arab / Iliana</figcaption>
              </figure>
            </div>
          </div>
        </section>
        {/* MATERIAL LANGUAGE */}
        <section className="materials">
          <div className="wrap">
            <div className="materials-top">
              <div className="eyebrow rise">A material language</div>
              <div>
                <h2 className="rise">
                  {'Crafted to feel '}
                  <em>inevitable.</em>
                </h2>
                <p className="materials-copy rise">
                  Material is never decoration alone. Its weight, touch, patina and precision
                  shape how an object belongs within the property and how it will be remembered.
                </p>
              </div>
            </div>
            <div className="material-list rise" aria-label="Customizable materials and details">
              <div className="material">
                <span className="material-name">Leather</span>
                <span className="material-detail">Colour · texture · stitching · finish</span>
              </div>
              <div className="material">
                <span className="material-name">Marble & stone</span>
                <span className="material-detail">Colour · form · finish</span>
              </div>
              <div className="material">
                <span className="material-name">Wood</span>
                <span className="material-detail">Species · tone · finish</span>
              </div>
              <div className="material">
                <span className="material-name">Metal</span>
                <span className="material-detail">Colour · finish</span>
              </div>
              <div className="material">
                <span className="material-name">Shell</span>
                <span className="material-detail">Texture · colour · embellishment</span>
              </div>
            </div>
          </div>
        </section>
        {/* PROCESS */}
        <section className="process" id="process">
          <div className="wrap">
            <div className="process-title">
              <h2 className="rise">A considered journey.</h2>
              <p className="rise">
                From the first conversation to project rollout, each decision is guided by the
                property’s identity, practical requirements and material character.
              </p>
            </div>
            <div className="steps">
              <article className="step rise">
                <span className="step-num">01</span>
                <h3>Understanding the story</h3>
                <p>The property, its setting and the experience it wants to create.</p>
              </article>
              <article className="step rise">
                <span className="step-num">02</span>
                <h3>Shaping the direction</h3>
                <p>A visual and material language for its bespoke touchpoints.</p>
              </article>
              <article className="step rise">
                <span className="step-num">03</span>
                <h3>Developing the details</h3>
                <p>Colours, materials, forms, finishes and stitching considered together.</p>
              </article>
              <article className="step rise">
                <span className="step-num">04</span>
                <h3>Supporting the rollout</h3>
                <p>
                  Customization and project rollout support shaped around each project’s
                  requirements.
                </p>
              </article>
            </div>
          </div>
        </section>
        {/* SELECTED WORK */}
        <section className="project" aria-labelledby="project-title">
          <div className="project-bg" id="projectBg">
            <Media
              src="/assets/0678_Marsa_Al_Arab_Lobby_4_b7af1dee.webp"
              alt="Bespoke accessories and sculptural objects at Marsa Al Arab"
            />
          </div>
          <div className="wrap project-copy">
            <div className="eyebrow rise">Selected work</div>
            <h2 id="project-title">
              <span className="title-mask">
                <span>Marsa Al Arab</span>
              </span>
            </h2>
            <div className="project-meta rise">
              <span>Dubai</span>
              <span>Selected details</span>
              <span>Hospitality</span>
            </div>
          </div>
        </section>
        {/* PROJECT CTA */}
        <SiteCta />
      </main>
    </BespokeAccessoriesShell>
  );
}
