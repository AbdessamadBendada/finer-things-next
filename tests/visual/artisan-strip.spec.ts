import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

/**
 * The artisan strip on /our-work.
 *
 * Three workshops, one turning over every two seconds. Excluded from the pixel
 * gate for the same reason as the About wall — a strip that rewrites itself can
 * never match a fixed screenshot — so the properties that actually matter are
 * asserted here instead.
 */
test.describe('artisan strip', () => {
  const shots = (page: import('@playwright/test').Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll('.artisan-strip img')].map(
        (img) =>
          decodeURIComponent((img as HTMLImageElement).currentSrc).match(
            /assets\/([^?&]+)/,
          )?.[1] ?? '',
      ),
    );

  const inView = async (page: import('@playwright/test').Page) => {
    await page.goto(`${NEXT_ORIGIN}/our-work`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() =>
      document.querySelector('#artisans')?.scrollIntoView({ block: 'center' }),
    );
    await page.waitForTimeout(1200);
  };

  test('shows three distinct workshops and keeps changing', async ({ page }) => {
    await inView(page);

    const first = await shots(page);
    expect(first).toHaveLength(3);

    // The same photograph twice at once is the failure that would make the
    // strip look broken rather than alive.
    expect(new Set(first).size).toBe(3);

    await page.waitForTimeout(5000);
    const later = await shots(page);
    expect(later).not.toEqual(first);
    expect(new Set(later).size).toBe(3);
  });

  test('opens on the reviewed set of three', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/our-work`, { waitUntil: 'domcontentloaded' });
    /*
     * The `src` attribute, not `currentSrc`: the strip sits far below the fold
     * and its images are lazy, so nothing has actually been fetched yet. What
     * is being asserted here is the server-rendered first paint anyway.
     */
    const rendered = await page.evaluate(() =>
      [...document.querySelectorAll('.artisan-strip img')].map(
        (img) =>
          decodeURIComponent(img.getAttribute('src') ?? '').match(/assets\/([^?&]+)/)?.[1] ??
          '',
      ),
    );
    expect(rendered).toEqual([
      'new-artisan-wood-01.webp',
      'new-artisan-ceramics-07.webp',
      'new-artisan-glass-06.webp',
    ]);
  });

  test('stops when scrolled out of view', async ({ page }) => {
    await inView(page);
    await page.waitForTimeout(2500);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const parked = await shots(page);
    await page.waitForTimeout(4000);
    expect(await shots(page)).toEqual(parked);
  });

  /*
   * The regression that shipped once already: the scroll reveal adds `in` to
   * `.rise` figures through classList, so if React also owns that className it
   * rewrites the attribute on every swap and strips `in` back off. The figures
   * dropped to opacity 0 and the strip emptied itself after the first
   * rotation. The changing classes live on an inner element for this reason.
   */
  test('stays visible after rotating', async ({ page }) => {
    await inView(page);
    await page.waitForTimeout(6000);

    const state = await page.evaluate(() =>
      [...document.querySelectorAll('.artisan-shot')].map((figure) => ({
        revealed: figure.classList.contains('in'),
        opacity: Number(getComputedStyle(figure).opacity),
      })),
    );

    expect(state).toHaveLength(3);
    for (const figure of state) {
      expect(figure.revealed).toBe(true);
      expect(figure.opacity).toBeGreaterThan(0.9);
    }
  });

  test('the visual gate can freeze it', async ({ page }) => {
    await inView(page);
    await page.addStyleTag({ content: '.artisan-strip { --frozen: 1; }' });

    const frozen = await shots(page);
    await page.waitForTimeout(5000);
    expect(await shots(page)).toEqual(frozen);
  });
});
