import { TermsShell } from './TermsShell';

export function TermsPage() {
  return (
    <TermsShell>
      <main>
        <section className="hero">
          <div className="wrap">
            <span className="ey">Legal placeholder</span>
            <h1>Terms & Conditions</h1>
            <p className="dek">
              These draft terms are intended to govern access to and use of the Finer Things
              website.
            </p>
            <div className="notice">
              <strong>Draft only.</strong>
              {
                ' These placeholder terms are not a substitute for legal advice and must be reviewed against the final company structure, website functionality, jurisdiction and commercial activity before launch.'
              }
            </div>
          </div>
        </section>
        <section className="policy">
          <div className="wrap policy-grid">
            <nav className="index" aria-label="Terms sections">
              <h2>On this page</h2>
              <a href="#operator">Website operator</a>
              <a href="#use">Using the website</a>
              <a href="#content">Content and accuracy</a>
              <a href="#ip">Intellectual property</a>
              <a href="#enquiries">Enquiries</a>
              <a href="#links">External links</a>
              <a href="#liability">Liability</a>
              <a href="#law">Governing law</a>
            </nav>
            <article className="content">
              <section id="operator">
                <h2>Website operator</h2>
                <p>
                  This website is operated by Finer Things. References to “Finer Things,” “we,”
                  “us” or “our” refer to the legal entity responsible for the website.
                </p>
                <p className="placeholder">
                  Add the registered company name, registered address, registration number and
                  contact details before launch.
                </p>
              </section>
              <section id="use">
                <h2>Using the website</h2>
                <p>
                  Visitors may use the website for lawful, personal and business-information
                  purposes. They must not misuse the website, interfere with its operation,
                  attempt unauthorized access, introduce harmful code, scrape protected content
                  unlawfully or use the website in a way that infringes another person’s rights.
                </p>
              </section>
              <section id="content">
                <h2>Information and accuracy</h2>
                <p>
                  Website content is provided for general information and presentation of Finer
                  Things’ work and services. Reasonable care should be taken with published
                  information, but content may change and should not be treated as professional,
                  technical or contractual advice.
                </p>
                <p>
                  Images, materials, colours and dimensions displayed on screens may vary from
                  physical products or project conditions. Availability, specifications and
                  project services should be confirmed directly.
                </p>
              </section>
              <section id="ip">
                <h2>Intellectual property</h2>
                <p>
                  Unless stated otherwise, the website design, text, branding, graphics, video
                  and other original content are owned by or licensed to Finer Things and are
                  protected by applicable intellectual-property laws.
                </p>
                <p>
                  No content may be copied, modified, distributed, published or used
                  commercially without prior written permission, except where applicable law
                  expressly allows it.
                </p>
                <p className="placeholder">
                  Confirm ownership, licences, photographer credits, trademarks and permitted
                  press use before launch.
                </p>
              </section>
              <section id="enquiries">
                <h2>Project enquiries and communications</h2>
                <p>
                  Submitting an enquiry does not create a client relationship, contract,
                  exclusivity obligation or commitment to accept work. Any project engagement
                  should be governed by a separate written proposal or agreement approved by the
                  relevant parties.
                </p>
                <p>
                  Visitors should not submit confidential or commercially sensitive information
                  until appropriate arrangements are in place.
                </p>
              </section>
              <section id="links">
                <h2>External links</h2>
                <p>
                  The website may link to third-party websites, social platforms or collection
                  destinations for convenience. Finer Things does not control those services and
                  is not responsible for their content, availability or privacy practices.
                  Visitors should review the third party’s own terms and policies.
                </p>
              </section>
              <section id="liability">
                <h2>Availability and liability</h2>
                <p>
                  Finer Things may update, suspend or withdraw parts of the website without
                  notice. The website is provided on an “as available” basis, subject to any
                  rights that cannot lawfully be excluded.
                </p>
                <p className="placeholder">
                  The final limitations, exclusions, warranties, indemnities and consumer-law
                  wording must be prepared for the governing jurisdiction and actual website
                  functionality.
                </p>
              </section>
              <section id="law">
                <h2>Governing law and contact</h2>
                <p>
                  These terms should be governed by the law and courts appropriate to the Finer
                  Things operating entity.
                </p>
                <p className="placeholder">
                  Insert the governing jurisdiction, dispute forum and approved legal contact.
                </p>
                <p>
                  Questions about these terms may be sent through the website’s contact page.
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
    </TermsShell>
  );
}
