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
  /*
   * The purpose section no longer pins. Client review asked for the words
   * without the scroll being taken away, so the two properties worth holding
   * on to are: the section is one screen, not two, and the sentence still
   * writes itself word by word when it arrives.
   */
  test('the Home purpose section does not hold the scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(NEXT_ORIGIN, { waitUntil: 'load' });
    await page.waitForTimeout(7000);

    const geometry = await page.locator('#purpose').evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      viewport: window.innerHeight,
      sticky: getComputedStyle(element.querySelector('.purpose-pin') as HTMLElement).position,
    }));

    // Nothing inside it sticks to the viewport, and the section is sized by
    // its own content and padding rather than reserving a whole screen.
    expect(geometry.sticky).not.toBe('sticky');
    expect(geometry.height).toBeLessThan(geometry.viewport);

    const heading = page.locator('#purpose-title');
    await expect(heading).not.toHaveClass(/scroll-reveal/);
  });

  test('the Home purpose statement writes itself in when it arrives', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(NEXT_ORIGIN, { waitUntil: 'load' });
    await page.waitForTimeout(7000);

    const heading = page.locator('#purpose-title');
    const words = heading.locator('.reveal-word');
    const wordCount = await words.count();
    expect(wordCount).toBeGreaterThan(10);

    const sectionTop = await page
      .locator('#purpose')
      .evaluate((element) => (element as HTMLElement).offsetTop);
    await page.evaluate(
      (top) => window.scrollTo(0, top - window.innerHeight * 0.2),
      sectionTop,
    );

    // The stagger is 45ms a word over a 0.8s travel, so the whole sentence is
    // written well inside two seconds of the section entering.
    await expect(heading).toHaveClass(/words-in/, { timeout: 4000 });
    await page.waitForTimeout(2000);
    await expect(words.last().locator('span')).toHaveCSS('opacity', '1');
  });

  test('the Home purpose statement does not animate with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(NEXT_ORIGIN, { waitUntil: 'load' });

    const heading = page.locator('#purpose-title');
    await expect(heading).not.toHaveClass(/scroll-reveal/);
    await expect(heading).toHaveClass(/words-in/);
    await expect(heading.locator('.reveal-word').first().locator('span')).toHaveCSS(
      'opacity',
      '1',
    );
  });

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
