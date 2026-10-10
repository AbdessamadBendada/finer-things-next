import { clientEnv } from './env';

/** Brand-level constants shared by metadata, JSON-LD and the footer. */
export const SITE = {
  name: 'Finer Things',
  legalName: 'Finer Things',
  tagline: "Bespoke details for the world's finest spaces. Across the globe.",
  description:
    'Finer Things creates bespoke accessories, styling and curation for hospitality, residences and the world’s finest spaces.',
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  locale: 'en',
  ogLocale: 'en_US',
  logo: '/assets/finer-things-logo.png',
  favicon: '/assets/favicon.png',
  copyrightYear: 2026,
  external: {
    finerLivingCollection: 'https://finerlivingcollection.com/',
  },
  /*
   * How to reach the studio.
   *
   * Address, email and both telephone numbers were supplied by the client on
   * 2026-10-10 and are real. `placeholder` is false from that date; it is the
   * flag the pre-launch check in docs/PRELAUNCH.md looks for.
   *
   * Two fields below are still invented and are flagged separately, because
   * one `placeholder` boolean can no longer describe the whole object: the
   * opening hours and the LinkedIn URL have never been supplied. Do not let
   * `placeholder: false` be read as "every field here is confirmed".
   */
  contact: {
    placeholder: false,
    email: 'alex.lahmer@finerthingsdesigns.com',
    /* Austria first: the number the client listed first. */
    phone: '+43 664 428 7294',
    phoneAlt: '+971 50 362 0480',
    /* Split on the client's own line breaks, so "DDP" is not left orphaned. */
    street: 'IFZA Business Park',
    district: 'DDP, PO Box 342001',
    city: 'Dubai',
    country: 'United Arab Emirates',
    /* Still invented. Ask before launch. */
    hoursPlaceholder: true,
    hours: 'Sunday to Thursday, 9am to 6pm GST',
    linkedInPlaceholder: true,
    linkedIn: '#',
  },
} as const;
