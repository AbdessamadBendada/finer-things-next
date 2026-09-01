import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

test.describe('shared closing CTA', () => {
  test('the unchanged supporting copy forms two balanced desktop lines', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 700 });
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'load' });

    const copy = page.locator('.closing p');
    await copy.scrollIntoViewIfNeeded();
    await expect(copy).toHaveText(
      'Tell us about the property, its character and the details you have in mind.',
    );

    const lineWidths = await copy.evaluate((element) => {
      const node = element.firstChild;
      if (!(node instanceof Text)) return [];

      const lines = new Map<number, { left: number; right: number }>();
      for (const match of node.data.matchAll(/\S+/g)) {
        const range = document.createRange();
        const start = match.index;
        range.setStart(node, start);
        range.setEnd(node, start + match[0].length);
        const rect = range.getBoundingClientRect();
        const top = Math.round(rect.top);
        const line = lines.get(top);
        lines.set(top, {
          left: Math.min(line?.left ?? rect.left, rect.left),
          right: Math.max(line?.right ?? rect.right, rect.right),
        });
      }

      return [...lines.values()].map(({ left, right }) => right - left);
    });

    expect(lineWidths).toHaveLength(2);
    expect(Math.min(...lineWidths) / Math.max(...lineWidths)).toBeGreaterThan(0.65);
  });

  test('the CTA remains within the mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${NEXT_ORIGIN}/about`, { waitUntil: 'load' });
    await page.locator('.closing').scrollIntoViewIfNeeded();

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);
  });
});
