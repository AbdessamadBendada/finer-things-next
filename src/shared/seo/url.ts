import { SITE } from '@/shared/config/site';

/**
 * The one canonical spelling of a route, used by canonicals, `og:url` and the
 * sitemap so the three can never disagree.
 *
 * The trailing slash is stripped, including on the site root. `next.config.ts`
 * sets `trailingSlash: false`, and Next renders the root canonical as
 * `https://example.com` with no slash; `new URL('/', origin)` produces
 * `https://example.com/` with one. Left alone, the sitemap advertises a
 * different string for the home page than the page's own canonical claims.
 * Both forms resolve to the same document, so this is tidiness rather than a
 * bug, but SEO-17 asks the two to match character for character.
 */
export function canonicalUrl(path: string): string {
  return new URL(path, SITE.url).toString().replace(/\/$/, '');
}
