import { SITE } from '@/shared/config/site';

import { LEGAL_ENTITIES } from '../content/entities.content';
import { ImprintShell } from './ImprintShell';

export function ImprintPage() {
  return (
    <ImprintShell>
      <main>
        <section className="hero">
          <div className="wrap">
            <span className="ey">Legal notice</span>
            <h1>Imprint</h1>
            <p className="dek">
              The companies behind Finer Things, their registered offices and the registration
              and tax numbers under which they trade.
            </p>
            <div className="notice">
              <strong>Pending legal review.</strong>
              {
                ' The company details below are as supplied by Finer Things. Which entity legally operates this website, and what the applicable jurisdiction requires of this notice, must be confirmed with counsel before launch.'
              }
            </div>
          </div>
        </section>
        <section className="policy">
          <div className="wrap policy-grid">
            <nav className="index" aria-label="Imprint sections">
              <h2>On this page</h2>
              {LEGAL_ENTITIES.map((entity) => (
                <a key={entity.id} href={`#${entity.id}`}>
                  {entity.jurisdiction}
                </a>
              ))}
              <a href="#management">Responsible management</a>
              <a href="#contact">Contact details</a>
            </nav>
            <article className="content">
              {LEGAL_ENTITIES.map((entity) => (
                <section key={entity.id} id={entity.id}>
                  <h2>{entity.jurisdiction}</h2>
                  <p className="entity-name">{entity.name}</p>
                  <p>
                    {entity.address.map((line, index) => (
                      <span key={line}>
                        {index > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                  <dl className="entity-registrations">
                    {entity.registrations.map(({ label, value }) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
              <section id="management">
                <h2>Responsible management</h2>
                <p>
                  <strong>Alex Lahmer</strong>
                  <br />
                  Founder
                  <br />
                  {'Email: '}
                  <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
                </p>
              </section>
              <section id="contact">
                <h2>Contact details</h2>
                <p>
                  {'Email: '}
                  <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
                  <br />
                  {'Phone: '}
                  <a href={`tel:${SITE.contact.phone.replace(/\s/g, '')}`}>
                    {SITE.contact.phone}
                  </a>
                  <br />
                  {'Phone: '}
                  <a href={`tel:${SITE.contact.phoneAlt.replace(/\s/g, '')}`}>
                    {SITE.contact.phoneAlt}
                  </a>
                  <br />
                  {`Postal address: ${SITE.contact.street}, ${SITE.contact.district}, ${SITE.contact.city}, ${SITE.contact.country}`}
                </p>
                <div className="meta">
                  <span>
                    {'Effective date: '}
                    <span className="placeholder">To be confirmed</span>
                  </span>
                  <span>
                    {'Last reviewed: '}
                    <span className="placeholder">To be confirmed</span>
                  </span>
                </div>
              </section>
            </article>
          </div>
        </section>
      </main>
    </ImprintShell>
  );
}
