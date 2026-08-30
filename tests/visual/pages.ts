import type { Page } from '@playwright/test';

/**
 * Where a page's baseline comes from.
 *
 * `legacy` — capture from the original document. The page is still a faithful
 *   port and must not drift from it.
 * `current` — capture from this build. The page has been deliberately
 *   redesigned, so the original is no longer the target; the baseline now
 *   guards against *regression* rather than proving fidelity.
 *
 * Move a page to `current` only after reviewing its diff and accepting the
 * change. That review is the point: it is what catches the layout you moved
 * by accident while editing a line of copy.
 */
export type BaselineSource = 'legacy' | 'current';

/** Every route, with the reference its baseline is captured from. */
export const PARITY_PAGES = [
  /*
   * Everything except the two legal pages now compares against the last
   * approved build rather than the original.
   *
   * Round 1 redesigned the home hero. Round 2 went site-wide: the footer sets
   * the logo where it used to set the words "Finer Things", and headlines are
   * one colour where each page used to tint its italic half with a different
   * accent. Both were asked for, and both mean these pages are deliberately no
   * longer the legacy documents.
   *
   * Privacy and Terms carry neither change, so they stay verified against the
   * original — see docs/FEEDBACK.md and PARITY.md.
   */
  { name: 'home', legacy: '/index.html', route: '/', settle: 7000, baseline: 'current' },
  { name: 'our-work', legacy: '/our-work.html', route: '/our-work', baseline: 'current' },
  { name: 'projects', legacy: '/projects.html', route: '/projects', baseline: 'current' },
  {
    name: 'marsa-al-arab',
    legacy: '/marsa-al-arab.html',
    route: '/projects/marsa-al-arab',
    baseline: 'current',
  },
  {
    name: 'waldorf-astoria-osaka',
    legacy: '/waldorf-astoria-osaka.html',
    route: '/projects/waldorf-astoria-osaka',
    baseline: 'current',
  },
  {
    name: 'bespoke-accessories',
    legacy: '/bespoke-accessories.html',
    route: '/services/bespoke-accessories',
    baseline: 'current',
  },
  {
    name: 'styling-curation',
    legacy: '/styling-curation.html',
    route: '/services/styling-curation',
    baseline: 'current',
  },
  {
    name: 'finer-living',
    legacy: '/finer-living.html',
    route: '/services/finer-living',
    baseline: 'current',
  },
  { name: 'about', legacy: '/about.html', route: '/about', baseline: 'current' },
  { name: 'contact', legacy: '/contact.html', route: '/contact', baseline: 'current' },
  { name: 'privacy', legacy: '/privacy.html', route: '/privacy' },
  { name: 'terms', legacy: '/terms.html', route: '/terms' },
] as const satisfies ReadonlyArray<{
  name: string;
  legacy: string;
  route: string;
  settle?: number;
  baseline?: BaselineSource;
}>;

export type ParityPage = (typeof PARITY_PAGES)[number];

/** Defaults to the original: a page has to opt out of being checked against it. */
export const baselineSourceFor = (page: ParityPage): BaselineSource =>
  'baseline' in page ? (page.baseline as BaselineSource) : 'legacy';

export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 860, height: 1100 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

/**
 * Brings a page to a stable, fully-revealed state.
 *
 * Both sites reveal content as it scrolls into view and lazily load imagery,
 * so a naive full-page screenshot would capture half-finished animations. This
 * walks the whole document to trigger every observer, returns to the top, and
 * waits for the motion to finish and for every image to decode.
 */
/**
 * The masthead is deliberately no longer identical to the original: every page
 * now carries the logo image, where the legacy inner pages set the words as
 * text (docs/adr/0007-one-logo.md). It is `position: fixed`, so hiding it
 * changes no layout — and hiding it in *both* the baseline and the comparison
 * keeps the rest of the page honestly measured against the original.
 *
 * The masthead itself is covered by tests/visual/masthead.spec.ts.
 */
const HIDE_MASTHEAD = '.head, .mobile-menu { visibility: hidden !important; }';

/**
 * The About page's artisan wall swaps one photograph every few seconds,
 * forever, at a random position. Left running it would make the gate flaky:
 * two captures of an unchanged page would differ by whichever tiles happened
 * to turn over between them.
 *
 * Freezing it here rather than in the component keeps the behaviour honest in
 * the browser and deterministic in the suite. The wall is covered by
 * tests/visual/artisan-wall.spec.ts instead, which asserts what it actually
 * does: that it changes, never shows a duplicate, and stops off screen.
 */
const FREEZE_WALL = `
  .artisan-wall { --frozen: 1; }
  .artisan-tile, .artisan-tile img { transition: none !important; opacity: 1 !important; }
`;

export async function settlePage(page: Page, settleMs = 2500) {
  await page.waitForLoadState('load');
  await page.addStyleTag({ content: HIDE_MASTHEAD });
  await page.addStyleTag({ content: FREEZE_WALL });

  // Let the intro sequence and any entry animations run.
  await page.waitForTimeout(settleMs);

  await page.evaluate(async () => {
    // Pace matters. IntersectionObserver decides in frames, so a walk that
    // jumps a full viewport every 60ms can pass an element without ever
    // reporting it as intersecting — and native lazy loading behaves the same
    // way. Measured: at 60ms steps 0 of 4 reveals fired and 2 of 11 images
    // loaded; at 200ms, 4 of 4 and 11 of 11.
    //
    // The walk is also time-bounded, because the home page's pinned filmstrip
    // grows the document while it is being scrolled.
    const BUDGET_MS = 30_000;
    const started = Date.now();
    const step = Math.round(window.innerHeight * 0.6);
    const height = document.body.scrollHeight;

    for (let y = 0; y <= height; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (Date.now() - started > BUDGET_MS) break;
    }

    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 600));
    window.scrollTo(0, 0);
  });

  // The fail-open watchdog reveals anything an observer missed after 2.2s.
  await page.waitForTimeout(2800);

  await page.evaluate(async () => {
    // Anything still lazy gets loaded explicitly: the legacy site uses plain
    // <img> and has everything by now, so leaving next/image's lazy ones
    // pending would compare a complete page against an incomplete one.
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager';
    });

    await Promise.all(
      [...document.images]
        .filter((image) => !image.complete)
        .map((image) => image.decode().catch(() => undefined)),
    );
    if (document.fonts) await document.fonts.ready;
  });

  await page.waitForTimeout(800);
}

export const snapshotName = (page: string, viewport: string) => `${page}-${viewport}.png`;
