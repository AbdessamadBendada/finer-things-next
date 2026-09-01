import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

test.describe('Home story CTA', () => {
  test('uses the Home button language and links to About', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(NEXT_ORIGIN, { waitUntil: 'load' });
    await page.waitForTimeout(7000);

    const storyButton = page.locator('#story .story-cta');
    await storyButton.scrollIntoViewIfNeeded();
    await expect(storyButton).toBeVisible();
    await expect(storyButton).toHaveAttribute('href', '/about');
    await expect(storyButton).toHaveCSS('text-transform', 'uppercase');
    await expect(storyButton).toHaveCSS('background-color', 'rgb(41, 40, 31)');

    const box = await storyButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);

    await storyButton.click();
    await expect(page).toHaveURL(`${NEXT_ORIGIN}/about`);
  });

  test('aligns with the story copy on mobile without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(NEXT_ORIGIN, { waitUntil: 'load' });

    const story = page.locator('#story .story');
    const storyButton = page.locator('#story .story-cta');
    await storyButton.scrollIntoViewIfNeeded();

    const [storyBox, buttonBox] = await Promise.all([
      story.boundingBox(),
      storyButton.boundingBox(),
    ]);
    expect(storyBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(Math.abs(storyBox!.x - buttonBox!.x)).toBeLessThanOrEqual(1);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);
  });
});
