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
  `SiteHeader`.
