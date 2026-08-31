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

  test('shows ten distinct workshops and keeps changing', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() =>
      document.querySelector('#artisans')?.scrollIntoView({ block: 'center' }),
    );
    await page.waitForTimeout(1500);

    const first = await tiles(page);
    // Ten, not twelve: two tiles run double width on a four-column grid, so
    // ten fills exactly three rows. See the comment in brand.css.
    expect(first).toHaveLength(10);

    // A repeated photograph on screen is the failure that would make the wall
    // look broken rather than alive.
    expect(new Set(first).size).toBe(10);

    await page.waitForTimeout(9000);
    const later = await tiles(page);

    const changed = first.filter((src, i) => src !== later[i]).length;
    expect(changed).toBeGreaterThan(0);
    expect(new Set(later).size).toBe(10);
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
    expect(before).toHaveLength(10);
    await page.waitForTimeout(7000);
    expect(await tiles(page)).toEqual(before);

    await context.close();
  });

  /**
   * The spans and the tile count have to agree, or the last row is short.
   *
   * Twelve tiles with three span-cells came to fifteen cells on a four-column
   * grid, which is three and three quarter rows, and left a visible hole. Ten
   * tiles with two double-width spans is twelve cells: exactly three rows.
   * Change either number and this catches it.
   */
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 1200 },
    { name: 'tablet', width: 900, height: 1000 },
    { name: 'phone', width: 390, height: 900 },
  ]) {
    test(`fills every row on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() =>
        document.querySelector('#artisans')?.scrollIntoView({ block: 'center' }),
      );
      await page.waitForTimeout(1200);

      const rows = await page.evaluate(() => {
        const wall = document.querySelector('.artisan-wall')!;
        const visible = [...wall.querySelectorAll('.artisan-tile')].filter(
          (tile) => getComputedStyle(tile).display !== 'none',
        );
        const columns = getComputedStyle(wall).gridTemplateColumns.split(' ').length;
        const unit = Math.min(...visible.map((t) => t.getBoundingClientRect().width));

        const byTop = new Map<number, number>();
        for (const tile of visible) {
          const box = tile.getBoundingClientRect();
          const top = Math.round(box.top);
          byTop.set(top, (byTop.get(top) ?? 0) + Math.round(box.width / unit));
        }
        return { columns, cells: [...byTop.values()] };
      });

      expect(rows.cells.length).toBeGreaterThan(0);
      for (const cells of rows.cells) expect(cells).toBe(rows.columns);
    });
  }
});
