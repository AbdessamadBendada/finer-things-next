import { ROUTES } from './routes';
import { SITE } from './site';

export type NavLink = {
  href: string;
  label: string;
  /** Rendered as `aria-current="page"`. Computed, not hand-written. */
  current?: boolean;
};

/**
 * Every navigation set on the site, in one file.
 *
 * The legacy documents each hand-wrote their own header and footer, which is
 * why a change to the menu used to mean editing twelve files. The link sets
 * still differ per page — that was a real editorial decision, each page
 * pointing at what matters next — but the *data* now lives here and the
 * *markup* lives in SiteHeader / SiteFooter. Changing a label, adding a page
 * to the menu, or restyling the header is a single edit.
 */

const HOME: NavLink = { href: ROUTES.home, label: 'Home' };
const OUR_WORK: NavLink = { href: ROUTES.ourWork, label: 'Our Work' };
const PROJECTS: NavLink = { href: ROUTES.projects, label: 'Projects' };
const ABOUT: NavLink = { href: ROUTES.about, label: 'About' };
const CONTACT: NavLink = { href: ROUTES.contact, label: 'Contact' };
const FINER_LIVING: NavLink = { href: ROUTES.service('finer-living'), label: 'Finer Living' };
const PRIVACY: NavLink = { href: ROUTES.privacy, label: 'Privacy' };
const TERMS: NavLink = { href: ROUTES.terms, label: 'Terms' };
const LINKEDIN: NavLink = { href: '#', label: 'LinkedIn' };

export type ChromeConfig = {
  /** Desktop header links. */
  header: readonly NavLink[];
  /** Full-screen menu below 860px. Omitted where the page has no menu. */
  menu?: readonly NavLink[];
  /** Fraction of viewport height after which the header takes its scrolled state. */
  scrollThreshold?: number;
  logo?: 'wordmark' | 'mark';
  footer: FooterConfig;
};

export type FooterVariant = 'site' | 'contact' | 'minimal' | 'home';

export type FooterConfig =
  | { variant: 'full'; explore: readonly NavLink[]; connect: readonly NavLink[] }
  | { variant: 'row'; links: readonly NavLink[] }
  | { variant: 'minimal'; links: readonly NavLink[] }
  | { variant: 'home' };

const CONNECT = [LINKEDIN, CONTACT, PRIVACY, TERMS] as const;

/** Route path -> its chrome. */
export const CHROME: Record<string, ChromeConfig> = {
  [ROUTES.home]: {
    header: [OUR_WORK, PROJECTS, ABOUT, CONTACT],
    menu: [HOME, OUR_WORK, PROJECTS, ABOUT, FINER_LIVING, CONTACT],
    logo: 'wordmark',
    footer: { variant: 'home' },
  },

  [ROUTES.ourWork]: {
    header: [{ href: '#services', label: 'Our Work' }, PROJECTS, ABOUT, CONTACT],
    menu: [
      HOME,
      { href: '#services', label: 'Our Work' },
      PROJECTS,
      ABOUT,
      FINER_LIVING,
      CONTACT,
    ],
    scrollThreshold: 0.72,
    logo: 'wordmark',
    footer: {
      variant: 'full',
      explore: [HOME, PROJECTS, ABOUT, FINER_LIVING],
      connect: CONNECT,
    },
  },

  [ROUTES.projects]: {
    header: [OUR_WORK, PROJECTS, ABOUT, CONTACT],
    menu: [HOME, OUR_WORK, PROJECTS, ABOUT, FINER_LIVING, CONTACT],
    scrollThreshold: 0.72,
    logo: 'wordmark',
    footer: { variant: 'full', explore: [HOME, OUR_WORK, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.project('marsa-al-arab')]: {
    header: [PROJECTS, OUR_WORK, CONTACT],
    menu: [HOME, PROJECTS, OUR_WORK, ABOUT, CONTACT],
    scrollThreshold: 0.78,
    logo: 'wordmark',
    footer: { variant: 'full', explore: [HOME, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.project('waldorf-astoria-osaka')]: {
    header: [PROJECTS, OUR_WORK, CONTACT],
    menu: [HOME, PROJECTS, OUR_WORK, ABOUT, CONTACT],
    scrollThreshold: 0.78,
    logo: 'wordmark',
    footer: { variant: 'full', explore: [HOME, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.service('bespoke-accessories')]: {
    header: [OUR_WORK, FINER_LIVING, CONTACT],
    menu: [HOME, OUR_WORK, PROJECTS, ABOUT, FINER_LIVING, CONTACT],
    scrollThreshold: 0.72,
    logo: 'wordmark',
    footer: { variant: 'full', explore: [HOME, OUR_WORK, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.service('styling-curation')]: {
    header: [OUR_WORK, FINER_LIVING, CONTACT],
    menu: [HOME, OUR_WORK, PROJECTS, ABOUT, FINER_LIVING, CONTACT],
    scrollThreshold: 0.72,
    logo: 'wordmark',
    footer: { variant: 'full', explore: [HOME, OUR_WORK, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.service('finer-living')]: {
    header: [OUR_WORK, FINER_LIVING, CONTACT],
    menu: [HOME, OUR_WORK, PROJECTS, ABOUT, CONTACT],
    scrollThreshold: 0.72,
    logo: 'wordmark',
    footer: { variant: 'full', explore: [HOME, OUR_WORK, FINER_LIVING], connect: CONNECT },
  },

  [ROUTES.about]: {
    header: [OUR_WORK, PROJECTS, ABOUT, CONTACT],
    menu: [HOME, OUR_WORK, PROJECTS, FINER_LIVING, CONTACT],
    logo: 'wordmark',
    footer: {
      variant: 'full',
      explore: [HOME, OUR_WORK, PROJECTS, FINER_LIVING],
      connect: CONNECT,
    },
  },

  [ROUTES.contact]: {
    header: [OUR_WORK, PROJECTS, ABOUT, CONTACT],
    menu: [HOME, OUR_WORK, PROJECTS, ABOUT, FINER_LIVING, CONTACT],
    logo: 'wordmark',
    footer: { variant: 'row', links: [HOME, OUR_WORK, PROJECTS, ABOUT] },
  },

  [ROUTES.privacy]: {
    header: [],
    logo: 'wordmark',
    footer: { variant: 'minimal', links: [PRIVACY, TERMS, CONTACT] },
  },

  [ROUTES.terms]: {
    header: [],
    logo: 'wordmark',
    footer: { variant: 'minimal', links: [PRIVACY, TERMS, CONTACT] },
  },
};

export const FOOTER_COPY = {
  brand: SITE.name,
  tagline: SITE.tagline,
  copyright: `© ${SITE.copyrightYear} ${SITE.name}. Family owned.`,
  sign_off: 'Every place should tell a story. So should yours.',
} as const;

/** Marks the link matching the current route, so `aria-current` is never stale. */
export const withCurrent = (links: readonly NavLink[], pathname: string): NavLink[] =>
  links.map((link) => (link.href === pathname ? { ...link, current: true } : link));

export const chromeFor = (pathname: string): ChromeConfig | undefined => CHROME[pathname];
