# home

The `/` route: the most complex page on the site.

Owns the intro cover sequence, the looping hero collage, the scroll-driven
filmstrip, the service row wipes, and its own footer — the only bespoke footer
on the site, since it carries the newsletter sign-up (rendered from the
`newsletter` feature and composed in by the route).

- `motion/useHomeMotion.ts` composes the page's choreography.
- `HeroCollage` server-renders the strip the legacy page built in JavaScript,
  so the LCP image starts downloading with the HTML.
- The shrinking wordmark that hands off to the masthead is **not** here: it is
  header behaviour and lives in `shared/motion/useWordmark.ts`, used by
  `SiteHeader`. It starts at 28% of the viewport and lands exactly on the
  masthead logo's position.

## The hero navigation

Settled: the **burger**, and it is no longer a home-page concern. It is the
site's only navigation, on every page and at every width — so it does not live
here either. See `shared/layout/SiteHeader.tsx`, `shared/config/navigation.ts`
(the single `SITE_MENU`), and the navigation block in `shared/styles/brand.css`.

The one part that is specific to this page: while the hero wordmark still
holds the logo's place, the masthead shows the burger over the photography
with no bar and no logo of its own — `.head.hero-nav`. Only one mark is ever
on screen. The `?nav=` experiment and `useHeroNav.ts` are deleted; see
docs/FEEDBACK.md for what was compared and why the burger won.
