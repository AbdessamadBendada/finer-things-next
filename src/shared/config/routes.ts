/**
 * Single source of truth for every route on the site.
 *
 * Used by: the router, navigation components, the sitemap, the legacy
 * `.html` redirects in `next.config.ts`, and the visual-parity test suite.
 * Adding a page means adding it here first.
 */

export const ROUTES = {
  home: '/',
  ourWork: '/our-work',
  projects: '/projects',
  /* The editorial index /projects used to be. Superseded by the gallery,
     kept reachable so the two can be compared, and excluded from the menu,
     the sitemap and search. */
  projectsEditorial: '/projects-editorial',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  project: (slug: string) => `/projects/${slug}`,
  service: (slug: string) => `/services/${slug}`,
} as const;

export const PROJECT_SLUGS = ['marsa-al-arab', 'waldorf-astoria-osaka'] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export const SERVICE_SLUGS = [
  'bespoke-accessories',
  'styling-curation',
  'finer-living',
] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Every static path, in sitemap order. */
export const ALL_ROUTES: readonly string[] = [
  ROUTES.home,
  ROUTES.ourWork,
  ROUTES.projects,
  ...PROJECT_SLUGS.map((slug) => ROUTES.project(slug)),
  ...SERVICE_SLUGS.map((slug) => ROUTES.service(slug)),
  ROUTES.about,
  ROUTES.contact,
  ROUTES.privacy,
  ROUTES.terms,
];

/**
 * Legacy static-site paths preserved as permanent redirects so no inbound
 * link or indexed URL breaks after the migration.
 */
export const LEGACY_REDIRECTS: ReadonlyArray<{ source: string; destination: string }> = [
  { source: '/index.html', destination: ROUTES.home },
  { source: '/our-work.html', destination: ROUTES.ourWork },
  { source: '/projects.html', destination: ROUTES.projects },
  { source: '/about.html', destination: ROUTES.about },
  { source: '/contact.html', destination: ROUTES.contact },
  { source: '/privacy.html', destination: ROUTES.privacy },
  { source: '/terms.html', destination: ROUTES.terms },
  { source: '/marsa-al-arab.html', destination: ROUTES.project('marsa-al-arab') },
  {
    source: '/waldorf-astoria-osaka.html',
    destination: ROUTES.project('waldorf-astoria-osaka'),
  },
  {
    source: '/bespoke-accessories.html',
    destination: ROUTES.service('bespoke-accessories'),
  },
  { source: '/styling-curation.html', destination: ROUTES.service('styling-curation') },
  { source: '/finer-living.html', destination: ROUTES.service('finer-living') },
];
