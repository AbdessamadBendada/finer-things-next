import { ImprintShell } from './ImprintShell';

export function ImprintPage() {
  return (
    <ImprintShell>
      <main>
        <section className="hero">
          <div className="wrap">
            <span className="ey">Legal placeholder</span>
            <h1>Imprint</h1>
            <p className="dek">
              This draft page lists the company information required for the Finer Things
              website&apos;s legal notice.
            </p>
            <div className="notice">
              <strong>Draft only.</strong>
              {
                ' This placeholder is not a completed legal notice. The final content must be supplied for the actual operating entity and reviewed for the applicable jurisdiction before launch.'
              }
            </div>
          </div>
        </section>
        <section className="policy">
          <div className="wrap policy-grid">
            <nav className="index" aria-label="Imprint sections">
              <h2>On this page</h2>
              <a href="#identity">Company identity</a>
              <a href="#address">Registered office</a>
              <a href="#register">Company registration</a>
              <a href="#tax">Tax information</a>
              <a href="#management">Responsible management</a>
              <a href="#contact">Contact details</a>
            </nav>
            <article className="content">
              <section id="identity">
                <h2>Company identity</h2>
                <p className="placeholder">
                  Add the registered company name, legal form and any registered trading name
                  before launch.
                </p>
              </section>
              <section id="address">
                <h2>Registered office</h2>
                <p className="placeholder">
                  Add the complete registered office or legal business address before launch.
                </p>
              </section>
              <section id="register">
                <h2>Company registration</h2>
                <p className="placeholder">
                  Add the commercial or company register, registration authority, jurisdiction
                  and registration number before launch.
                </p>
              </section>
              <section id="tax">
                <h2>Tax information</h2>
                <p className="placeholder">
                  Add the VAT number and any other required tax identification before launch.
                </p>
              </section>
              <section id="management">
                <h2>Responsible management</h2>
                <p className="placeholder">
                  Add the full name and legal title of the managing director or authorized
                  representative before launch.
                </p>
              </section>
              <section id="contact">
                <h2>Contact details</h2>
                <p className="placeholder">
                  Add the approved legal contact email address, telephone number and postal
                  address before launch.
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
