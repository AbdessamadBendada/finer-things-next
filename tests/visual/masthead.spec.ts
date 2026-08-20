import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';
import { PARITY_PAGES } from './pages';

/**
 * The masthead is excluded from the pixel gate because it deliberately differs
 * from the original — so it gets its own assertions instead of none.
 *
 * See docs/adr/0007-one-logo.md.
 */
test.describe('masthead', () => {
  for (const page of PARITY_PAGES) {
    test(`${page.name} shows the logo image`, async ({ page: browserPage }) => {
      await browserPage.goto(`${NEXT_ORIGIN}${page.route}`, { waitUntil: 'domcontentloaded' });

      const logo = browserPage.locator('.head .logo');
      await expect(logo).toHaveAttribute('href', '/');

      const image = logo.locator('img');
      await expect(image).toHaveCount(1);
      await expect(image).toHaveAttribute('src', /finer-things-logo|_next\/image/);

      // The optimizer serves a resized variant, so assert it decoded rather
      // than pinning an intrinsic width.
      await expect
        .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth))
        .toBeGreaterThan(0);

      // The mark must be a sensible size, not collapsed or full-bleed.
      const box = await logo.boundingBox();
      expect(box?.width).toBeGreaterThan(120);
      expect(box?.width).toBeLessThan(200);
    });
  }

  test('the mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });

    const toggle = page.getByRole('button', { name: 'Menu' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
    await expect(page.locator('body')).toHaveClass(/menu-open/);

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
  });
});
