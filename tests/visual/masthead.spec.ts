import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';
import { PARITY_PAGES } from './pages';

/**
 * The masthead is excluded from the pixel gate because it deliberately differs
 * from the original — so it gets its own assertions instead of none.
 *
 * See docs/adr/0007-one-logo.md, and docs/FEEDBACK.md for the burger.
 */
test.describe('masthead', () => {
  for (const page of PARITY_PAGES) {
    test(`${page.name} shows the logo image`, async ({ page: browserPage }) => {
      await browserPage.goto(`${NEXT_ORIGIN}${page.route}`, { waitUntil: 'domcontentloaded' });

      /*
       * On home the masthead carries no logo until the oversized hero wordmark
       * has shrunk into it — the wordmark *is* the logo up to that point, and
       * two marks on one screen was the thing the hand-off exists to avoid.
       * Scroll past the hand-off before asking for it.
       */
      if (page.name === 'home') {
        await browserPage.evaluate(() => window.scrollTo(0, 900));
        await expect(browserPage.locator('.head')).toHaveClass(/show/);
      }

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

  /**
   * The burger is the site's only navigation, so "is it there?" is a real
   * gate on every page and at every width — desktop included, which is where
   * the link row used to be and where a stray `display: none` would hide it.
   */
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    for (const page of PARITY_PAGES) {
      test(`${page.name} offers the burger on ${viewport.name}`, async ({
        page: browserPage,
      }) => {
        await browserPage.setViewportSize(viewport);
        await browserPage.goto(`${NEXT_ORIGIN}${page.route}`, {
          waitUntil: 'domcontentloaded',
        });

        const toggle = browserPage.getByRole('button', { name: 'Open menu' });
        await expect(toggle).toBeVisible();

        // Three rules, not a text label.
        await expect(toggle.locator('.burger span')).toHaveCount(3);
      });
    }
  }

  test('the menu opens, navigates, and closes', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });

    // Located by id, not by name: the accessible name is the thing under
    // test here, and it changes to "Close menu" the moment the menu opens.
    const toggle = page.locator('#menuToggle');
    await expect(toggle).toHaveAccessibleName('Open menu');
    await toggle.click();

    const menu = page.locator('#mobileMenu');
    await expect(menu).toHaveClass(/open/);
    await expect(page.locator('body')).toHaveClass(/menu-open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName('Close menu');

    // The X closes it again.
    await toggle.click();
    await expect(menu).not.toHaveClass(/open/);
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // Following a link navigates and leaves the menu closed behind it.
    await toggle.click();
    await menu.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  });

  test('the menu is the same on every page, and marks the current one', async ({ page }) => {
    const labels = ['Home', 'Our Work', 'Projects', 'About', 'Finer Living', 'Contact'];

    for (const route of ['/', '/about', '/contact', '/privacy']) {
      await page.goto(`${NEXT_ORIGIN}${route}`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: 'Open menu' }).click();

      const links = page.locator('#mobileMenu a');
      await expect(links).toHaveText(labels);
    }

    // The page you are on is marked, not omitted.
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator('#mobileMenu a[aria-current="page"]')).toHaveText('About');
  });

  /**
   * Locking the page removes the scrollbar. Where that scrollbar occupies
   * layout, losing it widens the viewport and throws the burger outward at the
   * exact moment it becomes the X — so clicking one and then the other misses.
   *
   * This browser has overlay scrollbars and cannot be made to use classic
   * ones, so the published gap here is always 0 and "does it move?" would pass
   * no matter what. What is gated instead is the compensation itself: that the
   * measurement is published on open, that the rule spending it still outranks
   * the base `.menu-toggle` rule, and that it is spent on the icon rather than
   * on the boxes — which is the part a later edit can silently break.
   */
  test('opening the menu shifts neither the toggle nor the page edge', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });

    const toggle = page.locator('#menuToggle');
    const closedX = (await toggle.boundingBox())!.x;

    await toggle.click();
    await expect(page.locator('body')).toHaveClass(/menu-open/);

    // Measured before the lock, so it reflects a real scrollbar or none.
    const gap = await page.evaluate(() =>
      document.body.style.getPropertyValue('--scrollbar-gap'),
    );
    expect(gap).toMatch(/^\d+px$/);

    // With no scrollbar to lose, nothing moves.
    expect((await toggle.boundingBox())!.x).toBe(closedX);

    // Standing in for a platform whose scrollbar is 15px wide: the icon has to
    // come back in by exactly that much to cancel the widening.
    await page.evaluate(() => document.body.style.setProperty('--scrollbar-gap', '15px'));
    expect((await toggle.boundingBox())!.x).toBe(closedX - 15);

    /*
     * And the correction must not be paid for with a gap. Holding the burger
     * still by pulling `.head` and `.mobile-menu` in by the scrollbar width
     * works, but it un-covers a strip of the page exactly where the scrollbar
     * was — the panel is meant to be full bleed. Both stay edge to edge; only
     * the icon moves.
     */
    const viewport = page.viewportSize()!.width;
    for (const selector of ['.head', '.mobile-menu']) {
      const box = (await page.locator(selector).boundingBox())!;
      expect(box.x).toBe(0);
      expect(box.width).toBe(viewport);
    }
  });

  test('the menu is keyboard operable and traps focus', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'domcontentloaded' });

    const toggle = page.locator('#menuToggle');
    await toggle.click();

    // Opening moves focus into the menu rather than leaving it on the button.
    await expect(page.locator('#mobileMenu a').first()).toBeFocused();

    // Escape closes it and hands focus back.
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
    await expect(toggle).toBeFocused();

    // Closed, the menu's links are out of the tab order entirely.
    await expect(page.locator('#mobileMenu')).toBeHidden();
  });
});
