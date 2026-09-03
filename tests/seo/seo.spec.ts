import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';
import { ALL_ROUTES, ROUTES } from '../../src/shared/config/routes';
import { SITE } from '../../src/shared/config/site';
import { canonicalUrl } from '../../src/shared/seo/url';

const LEGAL_ROUTES = new Set<string>([ROUTES.privacy, ROUTES.terms]);
const INDEXABLE_ROUTES = ALL_ROUTES.filter((route) => !LEGAL_ROUTES.has(route));
const SERVICE_ROUTES = new Set<string>([
  ROUTES.service('bespoke-accessories'),
  ROUTES.service('styling-curation'),
  ROUTES.service('finer-living'),
]);
const EXPECTED_METADATA: Readonly<Record<string, { title: string; description: string }>> = {
  [ROUTES.home]: {
    title: 'Finer Things | Exclusive Design Boutique',
    description:
      "Finer Things helps the world's finest hotels and residences tell their story through bespoke accessories, thoughtful styling and distinctive designs.",
  },
  [ROUTES.ourWork]: {
    title: 'Full-service design boutique | Finer Things',
    description:
      'Full-service design boutique creating bespoke, one-of-a-kind accessories for the luxury hotels and residences behind a new level of experience.',
  },
  [ROUTES.about]: {
    title: 'Alex Lahmer, the Founder of Finer Things',
    description:
      "Alex Lahmer founded Finer Things to create distinctive bespoke accessories and designs for the world's finest hotels and residences.",
  },
  [ROUTES.projects]: {
    title: 'Selected Projects | Finer Things',
    description:
      "Selected work for the world's finest hotels and residences, photographed in place. Every image carries the property and the space it was made for.",
  },
  [ROUTES.project('marsa-al-arab')]: {
    title: 'Jumeirah Marsa Al Arab | Finer Things',
    description:
      'Bespoke accessories and styling at Jumeirah Marsa Al Arab in Dubai, from the lobby and guest suites through to The Bombay Club and Iliana.',
  },
  [ROUTES.project('waldorf-astoria-osaka')]: {
    title: 'Waldorf Astoria Osaka | Finer Things',
    description:
      'Guest room details for Waldorf Astoria Osaka, designed by André Fu. Lacquer, glass, brass and stone set against Art Deco form and warm timber.',
  },
  [ROUTES.service('bespoke-accessories')]: {
    title: 'Bespoke Accessories for Luxury Hotels | Finer Things',
    description:
      "Bespoke hotel accessories shaped around the identity of a place, translating a property's architecture, heritage and materials into every detail guests touch.",
  },
  [ROUTES.service('styling-curation')]: {
    title: 'Styling and Curation for Hospitality | Finer Things',
    description:
      'Books, objects, art and florals sourced and arranged together, so guest rooms, public spaces and restaurants feel like nowhere else.',
  },
  [ROUTES.service('finer-living')]: {
    title: 'Finer Living, the Ready-Made Collection | Finer Things',
    description:
      'The ready-made collection by Finer Things. Wood, marble and glass, each piece chosen for its weight, texture and presence. In stock and fast to ship.',
  },
  [ROUTES.contact]: {
    title: 'Contact | Finer Things',
    description:
      'Tell us what you are creating, where it is, and what you want people to remember. Finer Things works with hotels and residences worldwide.',
  },
};
const EXPECTED_CONTEXTUAL_LINKS: Readonly<
  Record<string, ReadonlyArray<{ href: string; label: string }>>
> = {
  [ROUTES.ourWork]: [
    { href: ROUTES.service('bespoke-accessories'), label: 'Bespoke Accessories' },
    { href: ROUTES.service('styling-curation'), label: 'Styling & Curation' },
    { href: ROUTES.service('finer-living'), label: 'Finer Living' },
  ],
  [ROUTES.projects]: [
    { href: ROUTES.project('marsa-al-arab'), label: 'Jumeirah Marsa Al Arab' },
    { href: ROUTES.project('waldorf-astoria-osaka'), label: 'Waldorf Astoria Osaka' },
  ],
  [ROUTES.project('marsa-al-arab')]: [
    { href: ROUTES.projects, label: 'Selected project' },
    { href: ROUTES.project('waldorf-astoria-osaka'), label: 'Waldorf Astoria Osaka' },
  ],
  [ROUTES.project('waldorf-astoria-osaka')]: [
    { href: ROUTES.projects, label: 'Selected project' },
    { href: ROUTES.project('marsa-al-arab'), label: 'Jumeirah Marsa Al Arab' },
  ],
  [ROUTES.service('bespoke-accessories')]: [
    { href: ROUTES.ourWork, label: 'What we do / 01' },
    { href: ROUTES.project('marsa-al-arab'), label: 'Marsa Al Arab' },
  ],
  [ROUTES.service('styling-curation')]: [
    { href: ROUTES.ourWork, label: 'What we do / 02' },
    { href: ROUTES.project('waldorf-astoria-osaka'), label: 'Waldorf Astoria Osaka' },
  ],
  [ROUTES.service('finer-living')]: [{ href: ROUTES.ourWork, label: 'What we do / 03' }],
};
const EXPECTED_H1: Readonly<Record<string, string>> = {
  [ROUTES.home]: 'Every place should tell a story.',
  [ROUTES.ourWork]: 'We turn the ordinary into extraordinary',
  [ROUTES.projects]: 'Every detail, in its place.',
  [ROUTES.project('marsa-al-arab')]: 'Jumeirah Marsa Al Arab',
  [ROUTES.project('waldorf-astoria-osaka')]: 'Waldorf Astoria Osaka',
  [ROUTES.service('bespoke-accessories')]: 'Bespoke Accessories',
  [ROUTES.service('styling-curation')]: 'Styling & Curation',
  [ROUTES.service('finer-living')]: 'Finer Living',
  [ROUTES.about]: 'Values rooted in family',
  [ROUTES.contact]: 'Perhaps it begins with a place.',
  [ROUTES.privacy]: 'Privacy Policy',
  [ROUTES.terms]: 'Terms & Conditions',
};
const EXPECTED_SOCIAL_IMAGES: Readonly<
  Record<string, { src: string; alt: string; width: string; height: string }>
> = {
  [ROUTES.project('waldorf-astoria-osaka')]: {
    src: '/assets/0686_Waldorf_Astoria_Osaka_16_948b5f8c.webp',
    alt: 'Decorative guest-room detail at Waldorf Astoria Osaka',
    width: '2560',
    height: '1707',
  },
  [ROUTES.service('bespoke-accessories')]: {
    src: '/assets/new-cover-bespoke-accessories.webp',
    alt: 'A stitched leather tray on a walnut table',
    width: '2560',
    height: '1707',
  },
  [ROUTES.service('finer-living')]: {
    src: '/assets/new-cover-finer-living.webp',
    alt: 'An oak and brass footed bowl from the Finer Living collection',
    width: '2048',
    height: '1365',
  },
};

const canonicalFor = (route: string) => canonicalUrl(route);

test.describe('SEO metadata', () => {
  test('indexable titles are unique and match the approved set', async ({ page }) => {
    const titles: string[] = [];

    for (const route of INDEXABLE_ROUTES) {
      const response = await page.goto(`${NEXT_ORIGIN}${route}`);
      expect(response?.status(), `${route} status`).toBe(200);

      const title = await page.title();
      titles.push(title);

      expect(title, `${route} title`).toBe(EXPECTED_METADATA[route]?.title);

      /*
       * Kept alongside the exact match, not replaced by it. The exact match
       * only proves the rendered title equals whatever this file expects, so
       * on its own it cannot catch a bad title being agreed and pinned. These
       * two say what a title may never be, whatever the approved set says.
       *
       * Both have caught a real regression. `Luxury Motion Study` was a
       * placeholder that reached production metadata, and the brand count is
       * how the original `Finer Things | Luxury Motion Study | Finer Things`
       * was found. About re-created the duplication in Batch 3, because its
       * approved title already ends in the brand and the root template
       * appended it a second time; that route is absolute for this reason.
       */
      expect(title, `${route} title`).not.toContain('Luxury Motion Study');
      expect(
        title.match(/Finer Things/g)?.length ?? 0,
        `${route} brand count`,
      ).toBeLessThanOrEqual(1);
    }

    expect(new Set(titles).size, 'unique indexable titles').toBe(titles.length);
  });

  for (const route of ALL_ROUTES) {
    test(`${route} exposes complete crawl metadata`, async ({ page }) => {
      const response = await page.goto(`${NEXT_ORIGIN}${route}`);
      expect(response?.status()).toBe(200);
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(EXPECTED_H1[route] ?? '');

      const title = await page.title();
      const description = page.locator('meta[name="description"]');
      const descriptionContent = await description.getAttribute('content');
      const canonical = page.locator('link[rel="canonical"]');
      const canonicalHref = await canonical.getAttribute('href');
      const robots = await page.evaluate(
        () => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
      );

      const expectedMetadata = EXPECTED_METADATA[route];
      if (expectedMetadata) {
        expect(title, `${route} title`).toBe(expectedMetadata.title);
        expect(descriptionContent, `${route} description`).toBe(expectedMetadata.description);
      } else {
        expect(descriptionContent).toMatch(/\S/);
      }
      const expectedDescription = descriptionContent ?? '';
      // Compared literally, not through `new URL()`: normalising both sides
      // hides a canonical and a sitemap entry that spell the same page
      // differently, which is precisely what SEO-17 asks us to catch.
      expect(canonicalHref, `${route} canonical`).toBe(canonicalFor(route));

      if (LEGAL_ROUTES.has(route)) {
        expect(robots).toContain('noindex');
        expect(robots).toContain('follow');
      } else {
        expect(robots).not.toContain('noindex');
      }

      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
        'content',
        title,
      );
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        'content',
        expectedDescription,
      );
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
        'content',
        expectedDescription,
      );
      const openGraphUrl = await page
        .locator('meta[property="og:url"]')
        .getAttribute('content');
      expect(openGraphUrl, `${route} og:url`).toBe(canonicalFor(route));
      /*
       * Absolute and on the configured origin, rather than a hardcoded
       * `https:`. The origin is environment-driven and is localhost until the
       * client confirms a domain (SEO-01), so pinning the scheme here would
       * only assert which machine ran the test.
       */
      const openGraphImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute('content');
      expect(openGraphImage, `${route} og:image`).toMatch(/^https?:\/\//);
      expect(openGraphImage?.startsWith(SITE.url), `${route} og:image origin`).toBe(true);
      const twitterImage = await page
        .locator('meta[name="twitter:image"]')
        .getAttribute('content');
      expect(twitterImage, `${route} twitter:image`).toMatch(/^https?:\/\//);
      expect(twitterImage?.startsWith(SITE.url), `${route} twitter:image origin`).toBe(true);
      const expectedSocialImage = EXPECTED_SOCIAL_IMAGES[route];
      if (expectedSocialImage) {
        const expectedImageUrl = new URL(expectedSocialImage.src, SITE.url).toString();
        expect(openGraphImage).toBe(expectedImageUrl);
        expect(twitterImage).toBe(expectedImageUrl);
        await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
          'content',
          expectedSocialImage.alt,
        );
        await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
          'content',
          expectedSocialImage.alt,
        );
        await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
          'content',
          expectedSocialImage.width,
        );
        await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
          'content',
          expectedSocialImage.height,
        );

        /*
         * A page-specific card must be landscape. Link previews crop to
         * roughly 1.91:1, so a portrait photograph is reduced to a middle
         * strip. Pages whose only approved photography is portrait leave
         * `image` unset and fall back to the generated 1200x630 card, which
         * is why this rule can be absolute rather than a warning.
         */
        const ratio = Number(expectedSocialImage.width) / Number(expectedSocialImage.height);
        expect(ratio, `${route} social image must be landscape`).toBeGreaterThan(1.3);

        const imageResponse = await page.request.get(
          new URL(expectedSocialImage.src, NEXT_ORIGIN).toString(),
        );
        expect(imageResponse.status(), `${route} social image status`).toBe(200);
        expect(imageResponse.headers()['content-type']).toContain('image/webp');
      } else {
        await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
          'content',
          title,
        );
        await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
          'content',
          title,
        );
      }

      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(jsonLd.length).toBeGreaterThan(0);
      for (const source of jsonLd) {
        expect(() => JSON.parse(source)).not.toThrow();
      }
      const structuredData = jsonLd.map(
        (source) => JSON.parse(source) as Record<string, unknown>,
      );
      expect(structuredData).toContainEqual({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: canonicalFor(ROUTES.home),
      });

      const organization = structuredData.find((data) => data['@type'] === 'Organization');
      expect(organization).toBeDefined();
      for (const blockedField of ['sameAs', 'contactPoint', 'address', 'telephone']) {
        expect(organization).not.toHaveProperty(blockedField);
      }

      const service = structuredData.find((data) => data['@type'] === 'Service');
      if (SERVICE_ROUTES.has(route)) {
        expect(service).toMatchObject({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: EXPECTED_H1[route],
          description: expectedDescription,
          url: canonicalFor(route),
        });
      } else {
        expect(service).toBeUndefined();
      }

      const placeholderLinks = await page.locator('a').evaluateAll((links) =>
        links
          .map((link) => ({
            href: link.getAttribute('href') ?? '',
            label: link.getAttribute('aria-label') ?? link.textContent?.trim() ?? '',
          }))
          .filter(({ href }) => href === '' || href === '#' || href.startsWith('javascript:')),
      );

      /*
       * The LinkedIn `#` is the one known placeholder, blocked on the client
       * supplying a real URL (SEO-06). Anything else is a new one and should
       * fail here. Asserting the LinkedIn link still exists would instead make
       * this test fail on the day SEO-06 is fixed, which is backwards.
       */
      expect(placeholderLinks.filter((link) => link.label !== 'LinkedIn')).toEqual([]);
    });
  }
});

test('contextual links connect service and project hubs to their detail pages', async ({
  page,
}) => {
  for (const [route, expectedLinks] of Object.entries(EXPECTED_CONTEXTUAL_LINKS)) {
    const response = await page.goto(`${NEXT_ORIGIN}${route}`);
    expect(response?.status(), `${route} status`).toBe(200);

    for (const { href, label } of expectedLinks) {
      const matchingLinks = page.locator(`main a[href="${href}"]`).filter({ hasText: label });
      expect(await matchingLinks.count(), `${route} -> ${href} (${label})`).toBeGreaterThan(0);
    }
  }
});

test('robots and sitemap advertise exactly the indexable canonical routes', async ({
  request,
}) => {
  const robotsResponse = await request.get(`${NEXT_ORIGIN}/robots.txt`);
  expect(robotsResponse.status()).toBe(200);
  const robots = await robotsResponse.text();
  expect(robots).not.toContain(`Disallow: ${ROUTES.privacy}`);
  expect(robots).not.toContain(`Disallow: ${ROUTES.terms}`);
  expect(robots).not.toMatch(/^Host:/m);

  const sitemapResponse = await request.get(`${NEXT_ORIGIN}/sitemap.xml`);
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  expect(locations).toEqual(INDEXABLE_ROUTES.map(canonicalFor));
  expect(sitemap).not.toContain('<lastmod>');
});

test('non-root trailing slashes redirect to the canonical path', async ({ request }) => {
  for (const route of INDEXABLE_ROUTES.filter((candidate) => candidate !== ROUTES.home)) {
    const response = await request.get(`${NEXT_ORIGIN}${route}/`, { maxRedirects: 0 });
    expect(response.status(), route).toBe(308);
    expect(response.headers().location, route).toBe(route);
  }
});
