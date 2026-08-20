import { PrivacyShell } from './PrivacyShell';

export function PrivacyPage() {
  return (
    <PrivacyShell>
      <main>
        <section className="hero">
          <div className="wrap">
            <span className="ey">Legal placeholder</span>
            <h1>Privacy Policy</h1>
            <p className="dek">
              This page outlines how information may be handled when visitors use the Finer
              Things website, submit an enquiry or join the newsletter.
            </p>
            <div className="notice">
              <strong>Draft only.</strong>
              {
                ' This placeholder must be reviewed and replaced or approved by qualified legal counsel before the website launches. Exact company, hosting, analytics, mailing-list and form-processing details remain to be supplied.'
              }
            </div>
          </div>
        </section>
        <section className="policy">
          <div className="wrap policy-grid">
            <nav className="index" aria-label="Privacy sections">
              <h2>On this page</h2>
              <a href="#controller">Who is responsible</a>
              <a href="#collect">Information collected</a>
              <a href="#use">How it may be used</a>
              <a href="#sharing">Sharing and storage</a>
              <a href="#cookies">Cookies</a>
              <a href="#rights">Your choices</a>
              <a href="#contact">Contact</a>
            </nav>
            <article className="content">
              <section id="controller">
                <h2>Who is responsible</h2>
                <p>
                  Finer Things is responsible for the personal information described in this
                  policy when it determines how and why that information is used.
                </p>
                <p className="placeholder">
                  Add the registered company name, legal address, registration details and
                  privacy contact before launch.
                </p>
              </section>
              <section id="collect">
                <h2>Information we may collect</h2>
                <p>
                  Information may be provided directly when someone contacts Finer Things,
                  submits a project enquiry or subscribes to receive occasional updates.
                </p>
                <ul>
                  <li>Name and contact details.</li>
                  <li>
                    Company, property, project, location and service-interest information
                    included in an enquiry.
                  </li>
                  <li>The content of messages and subsequent correspondence.</li>
                  <li>Email address and subscription preferences for the newsletter.</li>
                  <li>
                    Basic technical and usage information if analytics or essential website
                    technologies are enabled.
                  </li>
                </ul>
              </section>
              <section id="use">
                <h2>How information may be used</h2>
                <p>
                  Information may be used to respond to enquiries, discuss potential
                  collaborations, provide requested information, administer newsletter
                  subscriptions, operate and protect the website, and meet applicable legal
                  obligations.
                </p>
                <p>
                  Where required, Finer Things will rely on an appropriate legal basis, such as
                  consent, steps requested before entering an agreement, legitimate interests or
                  compliance with law.
                </p>
              </section>
              <section id="sharing">
                <h2>Sharing, storage and retention</h2>
                <p>
                  Information may be processed by carefully selected service providers that
                  support website hosting, form delivery, email, newsletter distribution,
                  security or professional advice. Personal information should not be sold.
                </p>
                <p>
                  Information should be kept only for as long as reasonably necessary for the
                  purpose for which it was collected and to meet legal, accounting or reporting
                  requirements.
                </p>
                <p className="placeholder">
                  Identify every actual service provider, storage location, international
                  transfer mechanism and retention period before launch.
                </p>
              </section>
              <section id="cookies">
                <h2>Cookies and similar technologies</h2>
                <p>
                  The final website may use technologies required for basic operation and, if
                  enabled, tools that help understand website use. Non-essential technologies
                  should be used only in accordance with applicable consent requirements.
                </p>
                <p className="placeholder">
                  Complete this section after the hosting, analytics, embedded media and consent
                  tools are confirmed.
                </p>
              </section>
              <section id="rights">
                <h2>Your choices and rights</h2>
                <p>
                  Depending on applicable law, individuals may have rights to request access,
                  correction, deletion, restriction, objection, portability or withdrawal of
                  consent. Newsletter recipients should be able to unsubscribe using the link
                  provided in each message.
                </p>
                <p>Requests may be subject to identity verification and lawful limitations.</p>
              </section>
              <section id="contact">
                <h2>Contact and updates</h2>
                <p>
                  Questions or privacy requests should be sent to the designated Finer Things
                  privacy contact.
                </p>
                <p className="placeholder">
                  Add the approved privacy email and postal address.
                </p>
                <p>
                  This policy may be updated to reflect changes to the website, services or
                  applicable requirements.
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
    </PrivacyShell>
  );
}
