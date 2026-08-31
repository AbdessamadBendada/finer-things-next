# SEO launch action plan

Audit date: **2026-08-31**

This is the implementation queue for technical and on-page SEO before launch.
The audit inspected the production-rendered HTML for all 13 routes as
Googlebot, plus `robots.txt`, `sitemap.xml`, the generated Open Graph image,
legacy redirects and the 404 response. It also reviewed the current Next.js
16.3.1 metadata guidance in `node_modules/next/dist/docs/`.

## Current baseline

- All public routes return 200 and unknown routes return a real 404.
- Legacy `.html` URLs permanently redirect with 308 responses.
- Every route has one H1, a description, canonical URL, Open Graph fields and
  a Twitter large-image card.
- The Open Graph image renders successfully at 1200x630.
- Indexed routes are statically generated and crawlable without client-side
  rendering.
- `robots.txt` and `sitemap.xml` return the correct content types.
- All rendered images have an `alt` attribute.
- Organization, breadcrumb and project JSON-LD parse successfully.
- Privacy and Terms are excluded from the sitemap and currently carry
  `noindex, follow`.

## P0: resolve before the production domain is opened to crawlers

### SEO-01: Confirm the one production origin

- Confirm the client's exact canonical HTTPS domain, including the preferred
  `www` or apex form.
- Set `NEXT_PUBLIC_SITE_URL` explicitly in production. Do not rely on the
  current `https://finerthings.com` default unless ownership and deployment to
  that origin are confirmed.
- Redirect every alternate host and HTTP URL to the preferred HTTPS origin at
  the hosting edge.
- Work in:
  - deployment environment
  - `src/shared/config/env.ts`
  - `.env.example`
  - `docs/DEPLOYMENT.md`
- Acceptance:
  - Canonicals, `og:url`, sitemap entries, robots host/sitemap and JSON-LD all
    use the same live origin.
  - Alternate host and HTTP requests resolve in one permanent redirect.

### SEO-02: Replace placeholder and duplicated page titles

- Remove `Luxury Motion Study` from every production title.
- Stop passing already-branded titles into a root template that appends
  `Finer Things` again. The rendered Home title is currently
  `Finer Things | Luxury Motion Study | Finer Things`.
- Prefer page subjects in route metadata and let the root template append the
  brand once. Give Home an intentional absolute title if needed.
- Work in:
  - `src/app/layout.tsx`
  - `src/shared/seo/metadata.ts`
  - static page metadata
  - project and service registries
- Acceptance:
  - Every indexable route has a unique, descriptive title with `Finer Things`
    no more than once.
  - Open Graph and Twitter titles match the intended page title.
  - No production metadata contains `Luxury Motion Study`.

### SEO-03: Make crawlable heading text read correctly

- Add real whitespace between decorative heading spans. Rendered H1 text
  currently includes strings such as `ordinaryinto`, `witha`,
  `JumeirahMarsa`, `BespokeAccessories`, and `infamily` without spaces at span
  boundaries.
- Preserve line breaks visually with CSS; do not depend on block layout to
  create semantic whitespace.
- Work in the Our Work, Projects, project-story, service and About feature
  components.
- Acceptance:
  - `textContent` for every H1 reads as a normal sentence or proper name.
  - Each route still has exactly one H1.
  - Screen-reader output and visual line breaks are both correct.

### SEO-04: Decide the index status of `/project-new`

- The route is currently indexable with its own canonical, but it is absent
  from the sitemap and has no internal link. It also overlaps the intent of
  `/projects` while awaiting the client's verdict.
- Until the decision, add `noindex, follow` and keep it out of the sitemap.
- If it replaces `/projects`, move the approved experience to the durable URL
  and redirect the temporary route. If both remain, give them distinct search
  intent, internal links and sitemap entries.
- Acceptance:
  - No indexable route is orphaned.
  - `/projects` and `/project-new` cannot compete as duplicate gallery pages.
  - The temporary slug is not presented as a permanent public URL.

### SEO-05: Let crawlers see legal-page `noindex`

- Remove Privacy and Terms from the `robots.txt` disallow list while their
  page-level `noindex, follow` directives remain.
- A crawler blocked by `robots.txt` may not fetch the page and therefore may
  not see its `noindex` directive.
- Keep both routes out of the sitemap until final legal copy replaces the
  placeholders.
- Work in `src/app/robots.ts`.
- Acceptance:
  - Both pages are crawlable but emit `noindex, follow`.
  - Neither page appears in `sitemap.xml`.

### SEO-06: Remove placeholder links

- Replace the site-wide LinkedIn `href="#"` with the real organization URL or
  remove the link until one is supplied.
- Do not invent an account URL.
- Work in `src/shared/config/navigation.ts` and the Home footer content.
- Acceptance:
  - No rendered page contains an empty, `#` or JavaScript placeholder link.
  - External links use a valid absolute HTTPS URL.

## P1: high-value optimization after P0

### SEO-07: Rewrite titles and descriptions around real search intent

- Give every indexable page a unique title and useful description grounded in
  its actual service, project, location and audience.
- Current descriptions for Contact, Projects, What We Do and the project
  stories are only 64 to 80 characters and are generic.
- Write for humans and accurate snippets; do not stuff keywords or chase a
  rigid character count.
- Acceptance:
  - No two routes share substantially identical titles or descriptions.
  - Each description accurately summarizes content visible on its page.
  - Priority terms appear naturally in headings and body copy, not only meta.

### SEO-08: Add page-specific social imagery

- Use the strongest approved project/service photograph for project and
  service Open Graph/Twitter previews instead of the same generic card on
  every route.
- Keep the generated 1200x630 site card as the default.
- Acceptance:
  - Project and service metadata resolve to absolute, crawlable image URLs.
  - Every selected image has meaningful social alt text and previews cleanly
    at 1200x630.

### SEO-09: Improve structured data without inventing facts

- Add `WebSite` structured data and `Service` data for the three service pages.
- Add real `sameAs`, contact details and business identity fields to the
  Organization only when the client supplies and approves them.
- Review whether `CreativeWork` remains the best type for project case studies.
- Acceptance:
  - JSON-LD validates in Schema.org and Google's Rich Results Test where the
    type is supported.
  - Structured data matches visible page content exactly.
  - No placeholder or inferred business fact is published.

### SEO-10: Make sitemap freshness truthful

- `sitemap.ts` currently sets every route's `lastModified` to the build time,
  making unchanged pages appear newly updated after every deployment.
- Supply real content modification dates or omit `lastModified` until a
  reliable source exists.
- Review `changeFrequency` and `priority`; keep them only if they express a
  maintained policy.
- Acceptance:
  - Rebuilding unchanged content does not change its modification date.
  - The sitemap includes every and only canonical, indexable route.

### SEO-11: Strengthen contextual internal linking

- Add relevant in-copy links between services, project case studies and the
  Projects hub where they help a visitor continue the same topic.
- Keep the single burger navigation policy unchanged.
- Acceptance:
  - Every indexable detail page is reachable from at least one relevant hub.
  - Link text describes the destination rather than using generic wording.
  - No new navigation system is introduced.

## P2: launch follow-through

### SEO-12: Finish icons and search appearance assets

- Confirm the existing square favicon is readable at small sizes.
- Add Next.js `icon` and `apple-icon` file conventions if approved assets are
  available. A web app manifest is optional unless installability is wanted.

### SEO-13: Validate production search integrations

- Verify ownership in Google Search Console and Bing Webmaster Tools using a
  DNS record or another method that does not add an external runtime origin.
- Submit the production sitemap and inspect the Home, each service, Projects,
  both project stories and Contact.
- Validate live canonicals, rendered HTML, mobile usability and indexing
  status after deployment.
- Do not add analytics or third-party scripts: the repository CSP and launch
  policy forbid new external origins.

### SEO-14: Add regression coverage

- Add a lightweight SEO test over all routes covering status, one H1, title,
  description, canonical, robots policy, social fields, JSON-LD parsing,
  placeholder links and sitemap membership.
- Acceptance:
  - The test fails on the title duplication and heading concatenation found by
    this audit.
  - It runs in `pnpm verify` without calling external services.

## Verification sequence

1. Run the SEO regression test against a production build.
2. Inspect `robots.txt`, `sitemap.xml`, canonicals and redirects using the real
   production origin.
3. Validate JSON-LD and social cards.
4. Run `pnpm verify` and review any parity changes.
5. After deployment, use Search Console URL Inspection and submit the sitemap.

## Primary references

- [Next.js metadata and Open Graph images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js generateMetadata reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google robots meta guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google structured-data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
