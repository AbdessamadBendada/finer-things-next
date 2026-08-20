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
} as const;
