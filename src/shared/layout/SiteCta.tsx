import Link from 'next/link';

import { ROUTES } from '@/shared/config/routes';

/**
 * The closing call to action, shared by every page that has one.
 *
 * It used to be nine copies of nearly the same markup, each with its own
 * heading, its own button label and its own eyebrow, which is how the site
 * ended up asking for the same thing in nine different voices. Review asked
 * for one CTA everywhere, so this is it: one component, one set of copy, one
 * edit to change all of them.
 *
 * The "Start a project" eyebrow that sat above the heading is gone. Those
 * words are the button, and having them twice in one section read as a
 * stutter.
 *
 * The contact page is the deliberate exception and does not use this: its
 * closing section is a "Stay connected" panel rather than a call to action,
 * and pointing a "Start a project" button at /contact from /contact would
 * send you nowhere.
 *
 * Class names are the legacy ones because the page stylesheets target them;
 * brand.css gives `.closing` one shared treatment so it looks the same on
 * every page, not just says the same thing. See docs/ARCHITECTURE.md.
 */
export function SiteCta() {
  return (
    <section className="closing" id="contact">
      <div className="wrap">
        <h2 className="rise">Let us bring your story to life.</h2>
        <p className="rise">
          Tell us about the property, its character and the details you have in mind.
        </p>
        <Link className="btn rise" href={ROUTES.contact}>
          Start a project
        </Link>
      </div>
    </section>
  );
}
