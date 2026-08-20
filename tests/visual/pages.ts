import type { Page } from '@playwright/test';

/** Every route, paired with the legacy document it must match. */
export const PARITY_PAGES = [
  { name: 'home', legacy: '/index.html', route: '/', settle: 7000 },
  { name: 'our-work', legacy: '/our-work.html', route: '/our-work' },
  { name: 'projects', legacy: '/projects.html', route: '/projects' },
  { name: 'marsa-al-arab', legacy: '/marsa-al-arab.html', route: '/projects/marsa-al-arab' },
  {
    name: 'waldorf-astoria-osaka',
    legacy: '/waldorf-astoria-osaka.html',
    route: '/projects/waldorf-astoria-osaka',
  },
  {
    name: 'bespoke-accessories',
    legacy: '/bespoke-accessories.html',
    route: '/services/bespoke-accessories',
  },
  {
    name: 'styling-curation',
    legacy: '/styling-curation.html',
    route: '/services/styling-curation',
  },
  { name: 'finer-living', legacy: '/finer-living.html', route: '/services/finer-living' },
  { name: 'about', legacy: '/about.html', route: '/about' },
  { name: 'contact', legacy: '/contact.html', route: '/contact' },
  { name: 'privacy', legacy: '/privacy.html', route: '/privacy' },
  { name: 'terms', legacy: '/terms.html', route: '/terms' },
] as const;

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

export async function settlePage(page: Page, settleMs = 2500) {
  await page.waitForLoadState('load');
  await page.addStyleTag({ content: HIDE_MASTHEAD });

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
