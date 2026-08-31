import { expect, test, type Locator } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

async function expectMinimumTarget(locator: Locator, minimum = 44) {
  const box = await locator.boundingBox();
  expect(box, 'target should be visible and measurable').not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(minimum);
  expect(box!.height).toBeGreaterThanOrEqual(minimum);
}

test.describe('mobile launch readiness', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('the Home newsletter avoids iOS focus zoom and exposes a usable target', async ({
    page,
  }) => {
    await page.goto(NEXT_ORIGIN, { waitUntil: 'domcontentloaded' });
    const newsletter = page.locator('#newsletterEmail');
    await newsletter.scrollIntoViewIfNeeded();
    await expect(newsletter).toHaveCSS('font-size', '16px');
    await expectMinimumTarget(newsletter);
  });

  test('site-wide and page-level primary targets meet the mobile minimum', async ({ page }) => {
    for (const route of ['/', '/about', '/contact', '/privacy', '/terms']) {
      await page.goto(`${NEXT_ORIGIN}${route}`, { waitUntil: 'domcontentloaded' });
      await expectMinimumTarget(page.locator('#menuToggle'));

      if (route !== '/') await expectMinimumTarget(page.locator('.head .logo'));
    }
  });

  test('Home prioritizes only the collage cells needed for first paint', async ({ page }) => {
    await page.goto(NEXT_ORIGIN, { waitUntil: 'domcontentloaded' });

    const initialPriority = await page.locator('.collage img:not([loading="lazy"])').count();
    expect(initialPriority).toBeLessThanOrEqual(4);
    await expect(page.locator('.svc-row .wipe img').first()).toHaveAttribute('loading', 'lazy');

    // The rest of the loop is deliberately warmed after the critical load,
    // long before the 65-second animation can bring those cells on screen.
    await page.waitForLoadState('load');
    await expect
      .poll(() => page.locator('.collage img:not([loading="lazy"])').count())
      .toBe(await page.locator('.collage img').count());
  });

  test('service images warm before their wipe can enter the viewport', async ({ page }) => {
    await page.goto(NEXT_ORIGIN, { waitUntil: 'load' });

    const row = page.locator('.svc-row').first();
    const image = row.locator('.wipe img');
    await page.locator('.svc-head').scrollIntoViewIfNeeded();

    await expect.poll(() => image.getAttribute('loading')).toBe('eager');
    await expect
      .poll(() => image.evaluate((node) => (node as HTMLImageElement).complete))
      .toBe(true);
  });

  test('the menu and hero remain usable in short landscape', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(`${NEXT_ORIGIN}/services/bespoke-accessories`, {
      waitUntil: 'domcontentloaded',
    });

    const toggle = page.locator('#menuToggle');
    await toggle.click();
    await expect(toggle).toBeInViewport();
    await expect(page.locator('#mobileMenu a').first()).toBeInViewport();

    const last = page.locator('#mobileMenu a').last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport();

    await page.keyboard.press('Escape');
    const heroHeight = await page
      .locator('.hero')
      .evaluate((node) => Math.round(node.getBoundingClientRect().height));
    expect(heroHeight).toBe(520);
  });
});
