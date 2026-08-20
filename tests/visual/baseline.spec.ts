import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { test } from '@playwright/test';

import { LEGACY_ORIGIN } from '../../playwright.config';
import { PARITY_PAGES, VIEWPORTS, settlePage, snapshotName } from './pages';

const BASELINE_DIR = path.resolve('tests/visual/__baseline__');

/**
 * Captures the reference screenshots from the original static site.
 *
 *   pnpm parity:baseline
 *
 * Run this once against the untouched legacy site. The images it writes are
 * the definition of "correct" for the migration, so they should be committed
 * and only ever regenerated deliberately.
 */
test.describe('legacy baseline', () => {
  test.skip(!process.env.PARITY_BASELINE, 'Set PARITY_BASELINE=1 to regenerate baselines.');

  for (const page of PARITY_PAGES) {
    for (const viewport of VIEWPORTS) {
      test(`${page.name} @ ${viewport.name}`, async ({ page: browserPage }) => {
        await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
        await browserPage.goto(`${LEGACY_ORIGIN}${page.legacy}`, { waitUntil: 'load' });

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
