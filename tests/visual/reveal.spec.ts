import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

/**
 * Scroll-triggered reveals must fire from scrolling.
 *
 * Several of them start at `clip-path: inset(0 50%)`, which is how they wipe
 * open. A clipped element has no visible area, so IntersectionObserver
 * reported it as never intersecting and the reveal could not fire at all: the
 * 2.2s fail-open watchdog was rescuing every one of them. The symptom was an
 * image sitting on screen for two seconds before appearing, which reads as a
 * trigger that has not fired.
 *
 * `observeOnce` now watches an unclipped ancestor. These assert the property
 * that matters: the reveal happens while the element is still on its way in,
 * not once it has been scrolled past.
 */
const CASES = [
  { route: '/', selector: '.family-editorial-portrait', settle: 7000 },
  { route: '/about', selector: '.experience-image', settle: 2500 },
  { route: '/about', selector: '.world-image', settle: 2500 },
];

test.describe('scroll reveals', () => {
  for (const { route, selector, settle } of CASES) {
    test(`${selector} reveals as it enters, on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${NEXT_ORIGIN}${route}`, { waitUntil: 'load' });
      await page.waitForTimeout(settle);

      const box = await page.locator(selector).first().boundingBox();
      expect(box).not.toBeNull();

      // Park well above the element, then scroll down as a reader would.
      await page.evaluate(
        ([y]) => window.scrollTo(0, window.scrollY + (y as number) - 1200),
        [box!.y],
      );
      await page.waitForTimeout(400);

      let revealedAtTop: number | null = null;
      for (let i = 0; i < 60; i += 1) {
        await page.mouse.wheel(0, 120);
        await page.waitForTimeout(55);
        const state = await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          if (!element) return null;
          return {
            revealed: element.classList.contains('in'),
            top: Math.round(element.getBoundingClientRect().top),
          };
        }, selector);
        if (state?.revealed) {
          revealedAtTop = state.top;
          break;
        }
      }

      expect(revealedAtTop).not.toBeNull();

      /*
       * The number that matters. Before the fix this was around -879: the
       * element had been scrolled entirely past before anything happened.
       * Anything at or near the fold means the reveal is doing its job.
       */
      expect(revealedAtTop!).toBeGreaterThan(-100);
    });
  }
});
