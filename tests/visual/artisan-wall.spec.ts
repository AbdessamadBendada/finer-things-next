import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

/**
 * The artisan wall on /about.
 *
 * Excluded from the pixel gate, because a grid that rearranges itself can
 * never match a fixed screenshot. These are the properties that actually
 * matter, asserted directly.
 */
test.describe('artisan wall', () => {
  const tiles = (page: import('@playwright/test').Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll('.artisan-tile img')].map(
        (img) =>
          decodeURIComponent((img as HTMLImageElement).currentSrc).match(
            /assets\/([^?&]+)/,
          )?.[1] ?? '',
      ),
    );

  test('shows twelve distinct workshops and keeps changing', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() =>
      document.querySelector('#artisans')?.scrollIntoView({ block: 'center' }),
    );
    await page.waitForTimeout(1500);

    const first = await tiles(page);
    expect(first).toHaveLength(12);

    // A repeated photograph on screen is the failure that would make the wall
    // look broken rather than alive.
    expect(new Set(first).size).toBe(12);

    await page.waitForTimeout(9000);
    const later = await tiles(page);

    const changed = first.filter((src, i) => src !== later[i]).length;
    expect(changed).toBeGreaterThan(0);
    expect(new Set(later).size).toBe(12);
  });

  test('stops while it is off screen', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() =>
      document.querySelector('#artisans')?.scrollIntoView({ block: 'center' }),
    );
    await page.waitForTimeout(1200);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);

    const before = await tiles(page);
    await page.waitForTimeout(7000);
    expect(await tiles(page)).toEqual(before);
  });

  test('does not animate under reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() =>
      document.querySelector('#artisans')?.scrollIntoView({ block: 'center' }),
    );
    await page.waitForTimeout(1500);

    const before = await tiles(page);
    expect(before).toHaveLength(12);
    await page.waitForTimeout(7000);
    expect(await tiles(page)).toEqual(before);

    await context.close();
  });
});
