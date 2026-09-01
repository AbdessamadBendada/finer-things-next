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
    const gridGeometry = await sections.evaluateAll((founderSections) =>
      founderSections.map((section) => {
        const grid = section.querySelector('.experience-grid');
        const image = grid?.querySelector('.experience-image');
        const copy = grid?.querySelector('.experience-copy');
        if (!grid || !image || !copy) return null;

        const gridRect = grid.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        const copyRect = copy.getBoundingClientRect();
        const imageIsLeft = imageRect.left <= copyRect.left;
        const left = imageIsLeft ? imageRect : copyRect;
        const right = imageIsLeft ? copyRect : imageRect;

        return {
          gridLeft: Math.round(gridRect.left),
          gridWidth: Math.round(gridRect.width),
          imageWidth: Math.round(imageRect.width),
          copyWidth: Math.round(copyRect.width),
          gap: Math.round(right.left - left.right),
        };
      }),
    );
    expect(gridGeometry[0]).toEqual(gridGeometry[1]);
    expect(gridGeometry[0]?.imageWidth).toBe(gridGeometry[0]?.copyWidth);
    await expect(sections.nth(0).locator('h2')).toContainText('Alex Lahmer');
    const malikaHeading = sections.nth(1).locator('h2');
    await expect(malikaHeading).toContainText('Malika Lahmer');
    await expect(page.locator('.hero-caption')).toHaveText('Malika and Alex');
    await expect(sections.nth(0).locator('.experience-image .experience-fact')).toBeVisible();
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

    const headingLines = await malikaHeading.evaluate((heading) => {
      const words: Array<{ text: string; top: number }> = [];
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();

      while (node) {
        const text = node.textContent ?? '';
        for (const match of text.matchAll(/\S+/g)) {
          const range = document.createRange();
          const start = match.index ?? 0;
          range.setStart(node, start);
          range.setEnd(node, start + match[0].length);
          words.push({ text: match[0], top: Math.round(range.getBoundingClientRect().top) });
        }
        node = walker.nextNode();
      }

      return Array.from(Map.groupBy(words, ({ top }) => top).values()).map((line) =>
        line.map(({ text }) => text).join(' '),
      );
    });
    expect(headingLines).toEqual(['Malika Lahmer']);
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
