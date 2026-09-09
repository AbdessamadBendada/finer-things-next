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
 * why a change to the menu used to mean editing twelve files. The *data* now
 * lives here and the *markup* lives in SiteHeader / SiteFooter, so changing a
 * label or adding a page to the menu is a single edit.
 *
 * Navigation itself is now one set, not twelve: the burger menu is the only
 * way through the site, so it has to be complete and identical on every page.
 * The page you are on is marked with `aria-current` rather than dropped from
 * the list — omitting it would make the site's only navigation change shape as
 * you moved around it. Footers still vary, and those configs stay per page.
 */

const HOME: NavLink = { href: ROUTES.home, label: 'Home' };
const OUR_WORK: NavLink = { href: ROUTES.ourWork, label: 'What we do' };
/*
 * Labelled "Our craft" rather than "Our Craft" to match the sentence case the
 * rest of the menu uses. It sits directly after "What we do" in both the menu
 * and the footer because the two pages are halves of the same story: what we
 * make, then how it is made.
 */
const OUR_CRAFT: NavLink = { href: ROUTES.ourCraft, label: 'Our craft' };
/* Deliberately NOT in SITE_MENU. The burger already carries "What we do" for
   /our-work, and the two read as the same thing side by side; the naming is
   waiting on the client. The footer keeps the link so the page is reachable
   and not orphaned. */
const OUR_SERVICES: NavLink = { href: ROUTES.ourServices, label: 'Our services' };
const PROJECTS: NavLink = { href: ROUTES.projects, label: 'Projects' };
const ABOUT: NavLink = { href: ROUTES.about, label: 'About' };
const CONTACT: NavLink = { href: ROUTES.contact, label: 'Contact' };
const FINER_LIVING: NavLink = { href: ROUTES.service('finer-living'), label: 'Finer Living' };
const PRIVACY: NavLink = { href: ROUTES.privacy, label: 'Privacy' };
const TERMS: NavLink = { href: ROUTES.terms, label: 'Terms' };
const LINKEDIN: NavLink = { href: '#', label: 'LinkedIn' };
const INSTAGRAM: NavLink = { href: '#', label: 'Instagram' };
const IMPRINT: NavLink = { href: ROUTES.imprint, label: 'Imprint' };

/**
 * The site menu — the only navigation on the site.
 *
 * One list, every page, at every width. It is reached through the burger in
 * the masthead; there is no second, desktop-only set of links to keep in sync.
 */
/**
 * The footer's three columns.
 *
 * One footer on every page, so one group of link sets rather than the four
 * that had drifted apart across the variants.
 */
export const FOOTER_EXPLORE = [
  OUR_WORK,
  OUR_CRAFT,
  OUR_SERVICES,
  PROJECTS,
  ABOUT,
  FINER_LIVING,
] as const;
export const FOOTER_CONNECT = [LINKEDIN, INSTAGRAM, CONTACT] as const;
export const FOOTER_LEGAL = [PRIVACY, TERMS, IMPRINT] as const;

export const SITE_MENU = [
  HOME,
  OUR_WORK,
  OUR_CRAFT,
  PROJECTS,
  ABOUT,
  FINER_LIVING,
  CONTACT,
] as const satisfies readonly NavLink[];

export type ChromeConfig = {
  /** Fraction of viewport height after which the header takes its scrolled state. */
  scrollThreshold?: number;
};

/**
 * Route path -> its chrome.
 *
 * Only the scroll threshold now: navigation is `SITE_MENU` and the footer is
 * the same on every page, so neither is configured per route. A page absent
 * from this table simply takes the default threshold.
 */
export const CHROME: Record<string, ChromeConfig> = {
  [ROUTES.ourWork]: {
    scrollThreshold: 0.72,
  },

  [ROUTES.ourCraft]: {
    scrollThreshold: 0.72,
  },

  [ROUTES.ourServices]: {
    scrollThreshold: 0.72,
  },

  [ROUTES.projects]: {
    scrollThreshold: 0.72,
  },

  [ROUTES.project('marsa-al-arab')]: {
    scrollThreshold: 0.78,
  },

  [ROUTES.project('waldorf-astoria-osaka')]: {
    scrollThreshold: 0.78,
  },

  [ROUTES.service('bespoke-accessories')]: {
    scrollThreshold: 0.72,
  },

  [ROUTES.service('styling-curation')]: {
    scrollThreshold: 0.72,
  },

  [ROUTES.service('finer-living')]: {
    scrollThreshold: 0.72,
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
