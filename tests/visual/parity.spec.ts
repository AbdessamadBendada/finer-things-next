import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';
import { PARITY_PAGES, VIEWPORTS, settlePage, snapshotName } from './pages';

/**
 * The migration's acceptance criteria.
 *
 * Each route is rendered from the Next build and compared against the
 * screenshot captured from the original static site. This is what turns
 * "looks the same" into a pass/fail gate, and it keeps protecting the design
 * long after the migration — any future change that moves a pixel has to be
 * acknowledged by regenerating a baseline on purpose.
 */
test.describe('visual parity with the legacy site', () => {
  test.skip(Boolean(process.env.PARITY_BASELINE), 'Baseline capture run.');

  for (const page of PARITY_PAGES) {
    for (const viewport of VIEWPORTS) {
      test(`${page.name} @ ${viewport.name}`, async ({ page: browserPage }) => {
        await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
        await browserPage.goto(`${NEXT_ORIGIN}${page.route}`, { waitUntil: 'load' });

        await settlePage(browserPage, 'settle' in page ? page.settle : undefined);

        const screenshot = await browserPage.screenshot({
          fullPage: true,
          animations: 'disabled',
          caret: 'hide',
        });

        expect(screenshot).toMatchSnapshot(snapshotName(page.name, viewport.name));
      });
    }
  }
});
