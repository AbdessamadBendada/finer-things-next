import { Media } from '@/shared/ui/Media';
import { SiteCta } from '@/shared/layout/SiteCta';
import Link from 'next/link';

import { SERVICES } from '../content/services.content';
import { OurServicesShell } from './OurServicesShell';

/**
 * The three services on one page, each opening in place.
 *
 * Built on `<details>` and `<summary>` rather than on buttons and state. That
 * choice carries the whole accessibility and fail-open story for free: the
 * panels are keyboard operable, announced correctly, and every word is in the
 * DOM whether or not the panel is open — so the page still works with no
 * JavaScript, and a crawler reads all three services. `useServiceAccordion`
 * only adds the parts the element does not do itself: closing the others when
 * one opens, and opening a panel named in the URL.
 *
 * The first panel is open on arrival, so nobody meets three closed bars and has
 * to guess that they do something.
 *
 * Each panel is a summary. The service pages are still the whole story and each
 * panel ends with a link to its own — see the note in services.content.ts for
 * why the copy is not repeated wholesale.
 */
export function OurServicesPage() {
  return (
    <OurServicesShell>
      <main>
        <section className="intro">
          <div className="wrap intro-grid">
            <div className="eyebrow rise">Our services</div>
            <div>
              <h1 className="rise">Three services, one standard.</h1>
              <p className="intro-note rise">
                Bespoke accessories made for a single property, styling and curation that
                complete a space, and the ready-made Finer Living collection. Open one to see
                what it covers.
              </p>
            </div>
          </div>
        </section>

        <section className="services-accordion" aria-label="Our services">
          <div className="wrap">
            {SERVICES.map((service, index) => (
              <details
                key={service.slug}
                id={service.slug}
                className="service-panel rise"
                open={index === 0}
              >
                <summary className="panel-summary">
                  <span className="panel-number" aria-hidden="true">
                    {service.number}
                  </span>
                  <span className="panel-title">
                    <h2 className="panel-name">{service.name}</h2>
                    <span className="panel-lede">{service.lede}</span>
                  </span>
                  {/* Drawn in CSS: a plus that closes into a minus. Decorative —
                      `details` already tells assistive tech the state. */}
                  <span className="panel-mark" aria-hidden="true" />
                </summary>

                <div className="panel-body">
                  <div className="panel-media">
                    <Media
                      src={service.image.src}
                      alt={service.image.alt}
                      sizes="(max-width: 860px) 100vw, 40vw"
                    />
                  </div>
                  <div className="panel-copy">
                    <p className="panel-statement">{service.statement}</p>
                    <ul className="panel-scope">
                      {service.scope.map((item) => (
                        <li key={item.number}>
                          <span className="scope-num" aria-hidden="true">
                            {item.number}
                          </span>
                          <h3>{item.title}</h3>
                          <p>{item.note}</p>
                        </li>
                      ))}
                    </ul>
                    <Link className="panel-link" href={service.href}>
                      {`See ${service.name} in full`}
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <SiteCta />
      </main>
    </OurServicesShell>
  );
}
