import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

test('wide and tall project tiles align with their neighboring rows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${NEXT_ORIGIN}/projects`, { waitUntil: 'load' });
  await page.addStyleTag({
    content: '.wall-tile { clip-path: none !important; transform: none !important; }',
  });

  const differences = await page.locator('.wall-tile-wide').evaluateAll((wideTiles) =>
    wideTiles.flatMap((wideTile) => {
      const wideElement = wideTile as HTMLElement;
      const siblings = Array.from(wideTile.parentElement?.children ?? []);
      return siblings
        .filter(
          (sibling) =>
            sibling !== wideTile &&
            !sibling.classList.contains('wall-tile-wide') &&
            !sibling.classList.contains('wall-tile-tall'),
        )
        .map((sibling) => sibling as HTMLElement)
        .filter((sibling) => Math.abs(sibling.offsetTop - wideElement.offsetTop) <= 2)
        .map((sibling) =>
          Math.abs(
            sibling.offsetTop +
              sibling.offsetHeight -
              (wideElement.offsetTop + wideElement.offsetHeight),
          ),
        );
    }),
  );

  expect(differences.length).toBeGreaterThan(0);
  expect(Math.max(...differences)).toBeLessThanOrEqual(2);

  const tallDifferences = await page.locator('.wall-tile-tall').evaluateAll((tallTiles) =>
    tallTiles.map((tallTile) => {
      const tallElement = tallTile as HTMLElement;
      const tallBottom = tallElement.offsetTop + tallElement.offsetHeight;
      const siblings = Array.from(tallTile.parentElement?.children ?? []).filter(
        (sibling) => sibling !== tallTile && !sibling.classList.contains('wall-tile-tall'),
      ) as HTMLElement[];

      return Math.min(
        ...siblings.map((sibling) =>
          Math.abs(sibling.offsetTop + sibling.offsetHeight - tallBottom),
        ),
      );
    }),
  );

  expect(tallDifferences.length).toBeGreaterThan(0);
  expect(Math.max(...tallDifferences)).toBeLessThanOrEqual(2);
});
