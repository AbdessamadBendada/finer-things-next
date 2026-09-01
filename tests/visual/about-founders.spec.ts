import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

test.describe('About founders', () => {
  test('names both founders and renders Malika’s supplied content and image', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'load' });

    const sections = page.locator('.experience');
    await expect(sections).toHaveCount(2);
    await expect(sections.nth(0).locator('h2')).toContainText('Alex Lahmer');
    await expect(sections.nth(1).locator('h2')).toContainText('Malika Lahmer');
    await expect(sections.nth(1)).toContainText('While Alex builds the pieces');
    await expect(sections.nth(1)).toContainText('from Jumeirah to private residences');
    await expect(page.locator('[data-placeholder="true"]')).toHaveCount(0);
    await expect(page.getByText('Portrait to follow')).toHaveCount(0);

    const portrait = sections.nth(1).getByRole('img', {
      name: 'Malika Lahmer with Alex Lahmer, founders of Finer Things',
    });
    await expect(portrait).toBeVisible();
    await expect
      .poll(() =>
        portrait.evaluate((image) => {
          const element = image as HTMLImageElement;
          return element.complete && element.naturalWidth > 0;
        }),
      )
      .toBe(true);
  });

  test('the founder sections remain overflow-free on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'load' });
    await page.locator('.experience').nth(1).scrollIntoViewIfNeeded();

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);
  });
});
