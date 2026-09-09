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
 * Neither of these is in SITE_MENU: the burger is back to the seven it had
 * before this round, on the client's instruction, until the naming is settled.
 * "What we do" (/our-work), "Our craft" and "Our services" all read as the same
 * promise when they sit side by side in one short list, and which of them gets
 * renamed is not a call to make here.
 *
 * Both keep their footer link, so neither page is orphaned at a URL nobody can
 * find. Labelled in sentence case to match the rest of the list, for whenever
 * they go back in.
 */
const OUR_CRAFT: NavLink = { href: ROUTES.ourCraft, label: 'Our craft' };
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
