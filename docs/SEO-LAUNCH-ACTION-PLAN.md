# SEO launch action plan

Audit date: **2026-08-31**. Regrouped **2026-09-02**.

This is the implementation queue for technical and on-page SEO before launch.
The audit inspected the production-rendered HTML for all routes as Googlebot,
plus `robots.txt`, `sitemap.xml`, the generated Open Graph image, legacy
redirects and the 404 response. It also reviewed the current Next.js 16.3.1
metadata guidance in `node_modules/next/dist/docs/`.

## How this list is organised

The original ordering was by SEO impact. It is now ordered by **what is
actually blocked**, because several of the highest-impact items cannot be
finished until the client supplies real information, and grouping them with
work that can start today made the queue unusable.

| Group                                                | Meaning                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| [A. Build now](#a-build-now)                         | Nothing external is needed. Start immediately.                                    |
| [B. Blocked on the client](#b-blocked-on-the-client) | Real work, but it needs information we do not have. **Must close before launch.** |
| [C. After deployment](#c-after-deployment)           | Can only be done against the live production origin.                              |

Item IDs (`SEO-01` …) are unchanged from the original audit so existing
references still resolve. They are no longer in priority order. Completed items
move to [Done](#done) rather than staying in place with a tick, so Group A
always reads as work that is still outstanding.

Group A is handed over in batches, because the items are not the same kind of
work. Mechanical fixes with objectively right answers go first; anything
needing an editorial judgement waits until that judgement is made.

- **Batch 1** — SEO-02, 05, 10, 14, 17. **Done**, see [Done](#done).
- **Batch 2** — SEO-03, SEO-08, and the unblocked half of SEO-09. **Done**, see [Done](#done). No decisions
  required. SEO-03 changes rendered headings, so its parity snapshots must be
  reviewed by eye rather than re-baselined.
- **Batch 3** — SEO-16 first, as a decision, then SEO-07 and SEO-11 which both
  follow from it.
- **Batch 4** — SEO-15 on its own, with before and after measurements.

**Placeholders are expected right now.** The site deliberately ships plausible
stand-in contact details and a `#` LinkedIn link so the build stays reviewable.
That is not a defect to fix today. It is a launch gate, and it lives in Group B.
The invented production domain was the one placeholder judged too dangerous to
keep, and was removed in Batch 1.

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

---

## A. Build now

No client input required. These are the items to hand over first.

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

### SEO-11: Strengthen contextual internal linking

- Add relevant in-copy links between services, project case studies and the
  Projects hub where they help a visitor continue the same topic.
- Keep the single burger navigation policy unchanged. See HANDOFF.md comment 6
  before adding anything that resembles a second navigation.
- Acceptance:
  - Every indexable detail page is reachable from at least one relevant hub.
  - Link text describes the destination rather than using generic wording.
  - No new navigation system is introduced.

### SEO-15: Address Core Web Vitals

Not covered by the original audit, and the largest unaddressed ranking factor
in the build. This is a motion-heavy site, which is exactly the risk profile.

- **Fix image over-fetch.** `shared/ui/Media.tsx` defaults every image to
  `sizes="100vw"`, so next/image serves a file sized for the whole viewport
  whatever the image actually occupies. Measured: 8x too wide on the home hero
  collage, 3.9x on the About portraits, 2.7x on the What we do service media.
  Already recorded in HANDOFF.md under "Known and unfixed" and reported by the
  client as "the animation takes so long". The fix is honest `sizes` values per
  call site.
- Confirm the LCP element on each route is the hero media and that it carries
  `priority`.
- Measure CLS caused by the reveal and mask animations, and by late-arriving
  webfonts.
- Confirm that content which starts hidden for animation is still present in
  the HTML and reaches a visible state if its observer never fires. The
  fail-open watchdog in `useFailOpenReveal.ts` is the mechanism; verify it
  holds for every animated block.
- Acceptance:
  - Lab LCP, CLS and INP measured per template on mobile and desktop, recorded
    in this document with before and after numbers.
  - No route serves an image more than ~1.5x the pixels it can display.
  - No text is permanently invisible if JavaScript fails.

### SEO-16: Resolve search-intent overlap between the work pages

- `/our-work`, `/projects` and the three `/services/*` pages all describe
  bespoke accessories, styling and curation for luxury hospitality. They can
  compete for the same queries, which splits authority and lets Google pick
  the wrong page.
- Assign each route one primary query target and make the on-page copy,
  headings and internal link text reflect that split.
- This is an editorial decision as much as a technical one; agree the split
  before rewriting anything in SEO-07.
- Acceptance:
  - Each indexable route has a documented primary query target.
  - No two routes target the same one.

---

## B. Blocked on the client

Real work that cannot be completed until the client supplies information.
**None of this is urgent today. All of it is a hard launch gate.** Do not
invent, infer or approximate any value in this group.

### SEO-01: Confirm the one production origin

- Confirm the client's exact canonical HTTPS domain, including the preferred
  `www` or apex form.
- Set `NEXT_PUBLIC_SITE_URL` explicitly in production. There is no longer a
  production default: `src/shared/config/env.ts` falls back to
  `http://localhost:3000` and a production build without the variable prints a
  loud `[env]` warning. The invented `https://finerthings.com` default was
  removed in Batch 1, because a silent, plausible-looking guess ships wrong
  canonicals, a wrong `og:url`, a wrong sitemap and wrong JSON-LD all at once,
  and nothing on the page looks broken.
- Redirect every alternate host and HTTP URL to the preferred HTTPS origin at
  the hosting edge.
- Work in:
  - deployment environment
  - `src/shared/config/env.ts`
  - `.env.example`
  - `docs/DEPLOYMENT.md`
- Acceptance:
  - Canonicals, `og:url`, sitemap entries, robots sitemap and JSON-LD all use
    the same live origin.
  - Alternate host and HTTP requests resolve in one permanent redirect.

### SEO-18: Replace placeholder business identity before launch

The single most consequential item in this document.

- `src/shared/config/site.ts` ships an invented email, phone number and Dubai
  street address under `contact`, flagged `placeholder: true`. They are
  deliberately plausible so the page is reviewable, which is also what makes
  them dangerous: nothing on the rendered page announces that they are fake.
- Launching with them publishes incorrect name, address and phone data. Once
  Google, Bing and any aggregator have ingested it, correcting it is slow and
  partly outside our control. This is materially harder to undo than a bad
  title or a missing description.
- The `placeholder: true` flag is the pre-launch check. Search
  `contact.placeholder` before shipping; it is a single object so replacing it
  is one edit.
- Do not publish `LocalBusiness`, `PostalAddress` or `telephone` structured
  data until the real values are in place. Structured data that contradicts
  reality is worse than no structured data.
- Acceptance:
  - `contact.placeholder` is `false` and every field under it is client-supplied.
  - No rendered page, and no JSON-LD, contains an invented business fact.

### SEO-06: Remove placeholder links

- Replace the site-wide LinkedIn `href="#"` with the real organization URL or
  remove the link until one is supplied.
- Do not invent an account URL.
- Work in `src/shared/config/site.ts` and `src/shared/config/navigation.ts`.
- Acceptance:
  - No rendered page contains an empty, `#` or JavaScript placeholder link.
  - External links use a valid absolute HTTPS URL.

### SEO-09: Improve structured data without inventing facts

Partly done. `WebSite` and `Service` shipped in Batch 2; the rest is still
blocked.

- [x] `WebSite` structured data site-wide, and `Service` on the three service
      pages, each with the Organization as its `provider`.
- [ ] Add real `sameAs`, contact details and business identity fields to the
      Organization **only** when the client supplies and approves them. Blocked
      by SEO-18. A test in `tests/seo/seo.spec.ts` asserts the Organization
      carries no `sameAs`, `contactPoint`, `address` or `telephone`, so this
      cannot be added by accident.
- Review whether `CreativeWork` remains the best type for project case studies.
- Acceptance:
  - JSON-LD validates in Schema.org and Google's Rich Results Test where the
    type is supported.
  - Structured data matches visible page content exactly.
  - No placeholder or inferred business fact is published.

### SEO-12: Finish icons and search appearance assets

- Confirm the existing square favicon is readable at small sizes.
- Add Next.js `icon` and `apple-icon` file conventions once approved assets are
  available. A web app manifest is optional unless installability is wanted.

### SEO-19: Local search presence

- The studio is Dubai-based, so local search is a real acquisition channel and
  is currently unaddressed.
- Once SEO-18 closes: claim and complete a Google Business Profile, and add
  `LocalBusiness` structured data whose name, address and phone match the
  profile and the rendered page exactly.
- Blocked entirely by SEO-18. Starting it earlier risks publishing the
  placeholder address to a platform that is much harder to correct than the
  site itself.

---

## C. After deployment

Only possible against the live production origin.

### SEO-13: Validate production search integrations

- Verify ownership in Google Search Console and Bing Webmaster Tools using a
  DNS record or another method that does not add an external runtime origin.
- Submit the production sitemap and inspect the Home, each service, Projects,
  both project stories and Contact.
- Validate live canonicals, rendered HTML, mobile usability and indexing
  status after deployment.
- Do not add analytics or third-party scripts: the repository CSP and launch
  policy forbid new external origins. Search Console is therefore the only
  measurement surface, so capture a baseline in the first week.

### SEO-20: Confirm the legacy redirects consolidate

- Twelve legacy `.html` URLs redirect permanently via `LEGACY_REDIRECTS` in
  `src/shared/config/routes.ts`. The redirects are verified as working, but
  whether Google actually transfers the old URLs' standing to the new ones is
  only observable after launch.
- In Search Console, watch the legacy URLs drop out of the index and their
  replacements enter it. Investigate any that stall in "Crawled, not indexed".

---

## Done

### Batch 2, completed 2026-09-02

**SEO-03: Crawlable heading text.** A real space text node now sits between the
decorative line wrappers in every multi-line H1. Crawled headings read `We turn
the ordinary into extraordinary`, `Values rooted in family`, `Perhaps it begins
with a place.` and `Jumeirah Marsa Al Arab`. `&nbsp;` was deliberately not
used. All 36 parity snapshots passed **with no baseline refresh**: `.hero-line`
and `.mask` are `display: block`, so whitespace between them collapses and
paints nothing, and `:nth-child` selectors are unaffected because text nodes
are not element children.

**SEO-08: Page-specific social imagery.** Both project pages and all three
service pages now carry an approved photograph with truthful dimensions and
alt text reused verbatim from the same image's existing use in the app. The
generated 1200x630 card remains the default everywhere else.

**SEO-09, in part.** See its entry in Group B.

**Test coverage.** `tests/seo/seo.spec.ts` now asserts exact H1 text per route,
that each social image resolves 200 as `image/webp` with matching declared
dimensions, that `WebSite` is present site-wide and `Service` only on service
routes, and that the Organization carries none of the client-blocked identity
fields.

**Portrait social cards, resolved by falling back.** Two routes were initially
given portrait 2:3 photographs — `/projects/marsa-al-arab` and
`/services/styling-curation`. Link previews crop to roughly 1.91:1, which would
have reduced both to a meaningless middle strip. Neither page has a landscape
alternative: every one of the 27 supplied Marsa Al Arab photographs is
portrait. Both routes now omit `image` and fall back to the generated 1200x630
card, which is on-brand and reads as deliberate. A test asserts any
page-specific card is landscape, so this cannot be reintroduced by accident.
Revisit if the client supplies a landscape frame, or if per-route generated
cards composing a photograph into 1200x630 are ever wanted.

### Batch 1, completed 2026-09-02

Implemented together and verified against a production build. Independently
re-checked: rendered HTML on seven routes, `robots.txt`, `sitemap.xml`,
trailing-slash redirects and 404s, plus `pnpm verify` green (typecheck, lint,
build, 8 form tests, 15 SEO tests, 36 of 36 parity snapshots with no baseline
refresh). The new regression test was confirmed to fail when the original title
bug was deliberately reintroduced.

**SEO-02: Placeholder and duplicated page titles.** `Luxury Motion Study` is
gone from every title. Route metadata now carries the page subject alone and
the root template appends the brand once; Home sets an absolute title. Rendered
results: `Finer Things`, `About | Finer Things`,
`Jumeirah Marsa Al Arab | Finer Things`.

**SEO-05: Legal-page `noindex` is reachable.** Privacy and Terms are no longer
disallowed in `robots.txt` and still emit `noindex, follow`. Neither appears in
the sitemap.

**SEO-10: Sitemap freshness.** `lastModified`, `changeFrequency` and `priority`
were removed rather than faked. Rebuilding unchanged content no longer claims a
new modification date. Real dates can be added later if a reliable source
appears.

**SEO-14: Regression coverage.** `tests/seo/seo.spec.ts` covers every route for
status, one H1, title, description, canonical, robots policy, social fields,
JSON-LD parsing, placeholder links and sitemap membership. It runs inside
`pnpm test`, and so inside `pnpm verify`, without calling external services.

**SEO-17: Metadata correctness.** Twitter images now carry alt text; the
Yandex-only `Host` directive is gone; `trailingSlash: false` is explicit and
covered by a redirect test. `canonicalUrl()` in `src/shared/seo/url.ts` is the
single spelling of a route, and strips the trailing slash including on the root
so the home canonical and its sitemap entry match character for character.

**Related, same batch:** the invented `https://finerthings.com` default was
removed from `src/shared/config/env.ts`. Development falls back to
`http://localhost:3000`, and a production build without `NEXT_PUBLIC_SITE_URL`
prints a loud warning naming exactly what will be wrong. A plausible-looking
wrong origin could ship silently; localhost cannot. The real origin remains
SEO-01.

### SEO-04: Duplicate gallery route

Resolved by deletion on 2026-09-02. The gallery was approved and now _is_
`/projects`; the editorial index and the temporary comparison route
(`/projects-editorial`, earlier `/project-new`) were removed along with their
robots and sitemap exclusions, the `CHROME_ALIAS` workaround that existed only
to give the temporary route a header, and its parity baselines. There is no
second gallery URL left to compete, and no temporary slug exposed publicly.

---

## Verification sequence

1. Run the SEO regression test (SEO-14) against a production build.
2. Inspect `robots.txt`, `sitemap.xml`, canonicals and redirects using the real
   production origin.
3. Validate JSON-LD and social cards.
4. Confirm `contact.placeholder` is `false` and no invented business fact ships.
5. Run `pnpm verify` and review any parity changes by eye, not just by pass or
   fail. See PARITY.md: the gate cannot see small changes.
6. After deployment, use Search Console URL Inspection and submit the sitemap.

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
- [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
