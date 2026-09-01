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
   * Placeholders until the client supplies the real ones, and deliberately
   * plausible rather than obviously fake: the page has to be reviewable, and a
   * block reading "TBC" tells a visitor the site is unfinished.
   *
   * Everything here is in one object so replacing it is a single edit. Search
   * `contact.placeholder` before launch; the flag is what the pre-launch check
   * in docs/HANDOFF.md looks for.
   */
  contact: {
    placeholder: true,
    email: 'studio@finerthings.com',
    phone: '+971 4 000 0000',
    street: 'Unit 14, Alserkal Avenue',
    district: 'Al Quoz 1',
    city: 'Dubai',
    country: 'United Arab Emirates',
    hours: 'Sunday to Thursday, 9am to 6pm GST',
    linkedIn: '#',
  },
} as const;
