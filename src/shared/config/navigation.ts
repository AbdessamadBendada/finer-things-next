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
const PROJECTS: NavLink = { href: ROUTES.projects, label: 'Projects' };
const ABOUT: NavLink = { href: ROUTES.about, label: 'About' };
const CONTACT: NavLink = { href: ROUTES.contact, label: 'Contact' };
const FINER_LIVING: NavLink = { href: ROUTES.service('finer-living'), label: 'Finer Living' };
const PRIVACY: NavLink = { href: ROUTES.privacy, label: 'Privacy' };
const TERMS: NavLink = { href: ROUTES.terms, label: 'Terms' };
const LINKEDIN: NavLink = { href: '#', label: 'LinkedIn' };

/**
 * The site menu — the only navigation on the site.
 *
 * One list, every page, at every width. It is reached through the burger in
 * the masthead; there is no second, desktop-only set of links to keep in sync.
 */
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
  footer: FooterConfig;
};

export type FooterVariant = 'site' | 'contact' | 'minimal' | 'home';

export type FooterConfig =
  | { variant: 'full'; explore: readonly NavLink[]; connect: readonly NavLink[] }
  | { variant: 'row'; links: readonly NavLink[] }
  | { variant: 'minimal'; links: readonly NavLink[] }
  | { variant: 'home' };

const CONNECT = [LINKEDIN, CONTACT, PRIVACY, TERMS] as const;

/** Route path -> its chrome. Navigation is `SITE_MENU`; this is the rest. */
export const CHROME: Record<string, ChromeConfig> = {
  [ROUTES.home]: { footer: { variant: 'home' } },

  [ROUTES.ourWork]: {
    scrollThreshold: 0.72,
    footer: {
      variant: 'full',
      explore: [HOME, PROJECTS, ABOUT, FINER_LIVING],
      connect: CONNECT,
    },
  },

  [ROUTES.projects]: {
    scrollThreshold: 0.72,
    footer: { variant: 'full', explore: [HOME, OUR_WORK, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.projectNew]: {
    scrollThreshold: 0.72,
    footer: { variant: 'full', explore: [HOME, OUR_WORK, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.project('marsa-al-arab')]: {
    scrollThreshold: 0.78,
    footer: { variant: 'full', explore: [HOME, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.project('waldorf-astoria-osaka')]: {
    scrollThreshold: 0.78,
    footer: { variant: 'full', explore: [HOME, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.service('bespoke-accessories')]: {
    scrollThreshold: 0.72,
    footer: { variant: 'full', explore: [HOME, OUR_WORK, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.service('styling-curation')]: {
    scrollThreshold: 0.72,
    footer: { variant: 'full', explore: [HOME, OUR_WORK, PROJECTS, ABOUT], connect: CONNECT },
  },

  [ROUTES.service('finer-living')]: {
    scrollThreshold: 0.72,
    footer: { variant: 'full', explore: [HOME, OUR_WORK, FINER_LIVING], connect: CONNECT },
  },

  [ROUTES.about]: {
    footer: {
      variant: 'full',
      explore: [HOME, OUR_WORK, PROJECTS, FINER_LIVING],
      connect: CONNECT,
    },
  },

  [ROUTES.contact]: {
    footer: { variant: 'row', links: [HOME, OUR_WORK, PROJECTS, ABOUT] },
  },

  [ROUTES.privacy]: { footer: { variant: 'minimal', links: [PRIVACY, TERMS, CONTACT] } },

  [ROUTES.terms]: { footer: { variant: 'minimal', links: [PRIVACY, TERMS, CONTACT] } },
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

/**
 * Which page's chrome styling a route borrows.
 *
 * `chrome.css` carries a block of masthead and footer rules per page, keyed by
 * `[data-page='…']`, and it only knows the twelve pages that came from
 * `legacy/`. A thirteenth route would get no chrome styling at all and render
 * an unstyled header. Rather than copy twenty rules for a page that is still
 * under review, `/project-new` borrows the chrome of the page it may replace.
 *
 * Only the chrome is shared. The page's own look comes from its CSS module.
 */
export const CHROME_ALIAS: Record<string, string> = {
  [ROUTES.projectNew]: 'projects',
};
