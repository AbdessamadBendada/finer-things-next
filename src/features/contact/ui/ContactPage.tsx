import Link from 'next/link';
import { Media } from '@/shared/ui/Media';
import { ContactForm } from './ContactForm';
import { ContactShell } from './ContactShell';

export function ContactPage() {
  return (
    <ContactShell>
      <main>
        <section className="contact">
          <div className="wrap contact-grid">
            <figure className="image-wrap">
              <Media
                src="/assets/0692_Get_in_touch_7b21b857.webp"
                alt="An atmospheric Finer Things interior detail"
              />
              <figcaption className="image-caption">Begin a conversation</figcaption>
            </figure>
            <div className="copy">
              <span className="ey">Contact Finer Things</span>
              <h1>
                <span className="mask">
                  <span>Perhaps it begins</span>
                </span>
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
        <section className="closing">
          <div className="wrap closing-grid">
            <div>
              <span className="ey rise">Stay connected</span>
              <h2 className="rise">
                {'Stories, projects and '}
                <em>considered objects.</em>
              </h2>
            </div>
            <div className="closing-side">
              <p className="rise">
                The final contact email, LinkedIn profile and newsletter destination will be
                connected when supplied.
              </p>
              <Link className="small-link rise" href="/about">
                Meet the family →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </ContactShell>
  );
}
