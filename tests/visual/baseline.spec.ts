import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { test } from '@playwright/test';

import { LEGACY_ORIGIN, NEXT_ORIGIN } from '../../playwright.config';
import { PARITY_PAGES, VIEWPORTS, baselineSourceFor, settlePage, snapshotName } from './pages';

const BASELINE_DIR = path.resolve('tests/visual/__baseline__');

/**
 * Captures the reference screenshots.
 *
 *   pnpm parity:baseline
 *
 * Most pages are captured from the original documents: they are faithful
 * ports and must not drift. A page marked `baseline: 'current'` is captured
 * from this build instead, because it has been deliberately redesigned and
 * the original is no longer what it should look like.
 *
 * Regenerating is always a deliberate act — the images it writes become the
 * definition of "correct" until someone changes them again.
 */
test.describe('legacy baseline', () => {
  test.skip(!process.env.PARITY_BASELINE, 'Set PARITY_BASELINE=1 to regenerate baselines.');

  for (const page of PARITY_PAGES) {
    for (const viewport of VIEWPORTS) {
      test(`${page.name} @ ${viewport.name}`, async ({ page: browserPage }) => {
        const source = baselineSourceFor(page);
        const url =
          source === 'legacy'
            ? `${LEGACY_ORIGIN}${page.legacy}`
            : `${NEXT_ORIGIN}${page.route}`;

        await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
        await browserPage.goto(url, { waitUntil: 'load' });

        await settlePage(browserPage, 'settle' in page ? page.settle : undefined);

        const screenshot = await browserPage.screenshot({
          fullPage: true,
          animations: 'disabled',
          caret: 'hide',
        });

        await mkdir(BASELINE_DIR, { recursive: true });
        await writeFile(
          path.join(BASELINE_DIR, snapshotName(page.name, viewport.name)),
          screenshot,
        );
      });
    }
  }
});
