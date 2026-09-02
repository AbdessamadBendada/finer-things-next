import { Media } from '@/shared/ui/Media';
import { ContactForm } from './ContactForm';
import { SITE } from '@/shared/config/site';

import { ContactShell } from './ContactShell';

export function ContactPage() {
  return (
    <ContactShell>
      <main>
        <section className="contact">
          <div className="wrap contact-grid">
            <figure className="image-wrap">
              <Media
                src="/assets/new-contact.webp"
                alt="An artisan cutting leather by hand at a workbench"
              />
              <figcaption className="image-caption">Begin a conversation</figcaption>
            </figure>
            <div className="copy">
              <span className="ey">Contact Finer Things</span>
              <h1>
                <span className="mask">
                  <span>Perhaps it begins</span>
                </span>{' '}
                <span className="mask">
                  <span>with a place.</span>
                </span>
              </h1>
              <p className="lead">
                Tell us what you are creating, where it is, and what you want people to
                remember.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
        {/*
         * How to reach the studio.
         *
         * This replaces a block that advertised the newsletter, which now sits
         * in the footer directly below it, and carried a line telling visitors
         * the contact email and LinkedIn "will be connected when supplied" —
         * a note from the build that should never have been on a client-facing
         * page.
         *
         * The values are placeholders in shared/config/site.ts, flagged there
         * so they can be found and replaced in one edit.
         */}
        <section className="closing">
          <div className="wrap closing-grid">
            <div>
              <span className="ey rise">Find us</span>
              <h2 className="rise">
                {'Come and see '}
                <em>the work.</em>
              </h2>
            </div>
            <div className="contact-details">
              <div className="rise">
                <h3>Studio</h3>
                <p>
                  {SITE.contact.street}
                  <br />
                  {SITE.contact.district}
                  <br />
                  {SITE.contact.city}, {SITE.contact.country}
                </p>
              </div>
              <div className="rise">
                <h3>Enquiries</h3>
                <p>
                  <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
                  <br />
                  <a href={`tel:${SITE.contact.phone.replace(/\s/g, '')}`}>
                    {SITE.contact.phone}
                  </a>
                </p>
              </div>
              <div className="rise">
                <h3>Hours</h3>
                <p>{SITE.contact.hours}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </ContactShell>
  );
}
