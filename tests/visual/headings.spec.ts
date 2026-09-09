import { expect, test, type Page } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';
import { ALL_ROUTES } from '../../src/shared/config/routes';
import { VIEWPORTS } from './pages';

/**
 * Headings run to two lines at most.
 *
 * A client review asked for this directly: the display type is large enough
 * that a heading breaking to three or more lines reads as a paragraph set in a
 * display face, and it pushes the section below it off the screen. Two lines is
 * the ceiling at every width.
 *
 * The ceiling is a property of the rendered page, not of the copy, which is why
 * this is measured in a browser rather than by counting characters. The same
 * sentence is one line on a desktop and three on a phone. It is also often not
 * the copy that is at fault: these headings are capped with `max-width` in
 * `ch`, and a cap slightly narrower than the words needs is what turns a
 * two-line heading into a four-line one while the column beside it sits empty.
 * Check the cap before rewriting anyone's words.
 */
const MAX_LINES = 2;

/**
 * The headings that break the rule today, by route.
 *
 * A backlog, not a set of permanent exemptions. Every entry was already on the
 * site when the rule was agreed. Fixing one means either widening its cap or
 * shortening the copy, and the copy is the client's, so none of that is done
 * here.
 *
 * The value is the worst line count across the three viewports, recorded so a
 * heading getting *longer* is still caught. Delete an entry when its heading is
 * fixed; `no stale exemptions` below fails if you forget, so this list can only
 * shrink.
 */
const KNOWN_LONG: Readonly<Record<string, Readonly<Record<string, number>>>> = {
  '/our-work': {
    'At Finer Things we believe that an utmost attention to quality is paramount': 3,
  },
  '/projects/marsa-al-arab': {
    'Jumeirah Marsa Al Arab': 3,
    'Four settings, each with a character of its own.': 3,
    'The atmosphere lives in the smallest frame.': 3,
  },
  '/projects/waldorf-astoria-osaka': {
    'Waldorf Astoria Osaka': 3,
    'Art Deco geometry meets the precision of Japanese craft.': 3,
    'Precision is felt in the quietest moments.': 3,
  },
  '/services/bespoke-accessories': {
    'The smallest object can carry the whole story.': 3,
    'From narrative to final placement.': 3,
  },
  '/services/styling-curation': {
    'Styling & Curation': 3,
    'A space becomes memorable when every detail feels connected.': 3,
  },
  '/services/finer-living': {
    'Objects with a story, made for the rituals of daily life.': 3,
    'Chosen for more than appearance.': 3,
    'From first sketch to final unique design.': 3,
  },
};

type Heading = { text: string; lines: number };

/**
 * Puts every reveal in its finished state so headings can be measured.
 *
 * This is not optional, and getting it wrong is not obvious. Headings marked
 * `data-word-reveal` are split into one inline-block per word, each held at
 * `translateY(108%)` until the reveal fires. Measured before that, the words of
 * one line sit at several different offsets and a two-line heading reports as
 * three or four — and only below the fold, so the same heading "passes" on
 * desktop and "fails" on mobile.
 *
 * The first version of this scrolled the page and waited for the animations,
 * which worked but made the result depend on wall-clock timing: under CPU load
 * the reveals had not finished when the measurement ran, and
 * `/services/styling-curation @ tablet` failed once and then passed three times
 * in isolation. A flaky ruler is worse than no ruler.
 *
 * Forcing the end state in CSS removes the timing question entirely, and makes
 * the whole spec several minutes faster. Nothing in the application sets these
 * declarations, so the behaviour stays honest in the browser; what the reveals
 * actually do is covered by tests/visual/reveal.spec.ts.
 */
const FORCE_REVEALED = `
  .rise, .word-mask > span, .hero-line > span, .hero-foot,
  .service-top, .service h2, .service-bottom {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
  }
`;

async function settleReveals(page: Page) {
  await page.addStyleTag({ content: FORCE_REVEALED });
  // Font metrics decide where lines break, so measuring before the display
  // face has loaded counts the fallback's line breaks, not the real ones.
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
  });
  await page.waitForTimeout(300);
}

/**
 * How many lines a heading actually occupies.
 *
 * Measured from the client rects of the heading's **text nodes**, clustered by
 * vertical position. Two simpler methods were tried first and both lie:
 *
 * - Height over line-height over-counts, because `.hero-line` and `.word-mask`
 *   carry `padding: .16em .07em .2em` to stop descenders being clipped by the
 *   reveal mask. That inflates a two-line hero to 2.6 line-heights, which
 *   rounds to three.
 * - Rects of a Range over the whole element over-counts too, because an `<em>`
 *   or a per-word span produces its own rect on a line that already has one.
 *
 * Text-node rects are the real line boxes: they ignore padding on the wrappers,
 * and clustering at half a line-height merges the several rects that share a
 * line. Verified against `.hero h1` (2), `.intro h2` (1 desktop, 2 mobile) and
 * `.service h2` (2), each confirmed by screenshot or exact box height.
 */
async function measureHeadings(page: Page): Promise<Heading[]> {
  return page.evaluate(() => {
    const found: { text: string; lines: number }[] = [];

    for (const el of document.querySelectorAll<HTMLElement>('main h1, main h2')) {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ');
      if (!text) continue;

      let lineHeight = parseFloat(style.lineHeight);
      if (!Number.isFinite(lineHeight)) lineHeight = parseFloat(style.fontSize) * 1.2;

      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const tops: number[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (!node.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width > 1 && rect.height > 1) tops.push(rect.top);
        }
      }
      tops.sort((a, b) => a - b);

      // A new line only when the top jumps by more than half a line.
      let lines = 0;
      let previous = -Infinity;
      for (const top of tops) {
        if (top - previous > lineHeight * 0.55) {
          lines += 1;
          previous = top;
        }
      }

      found.push({ text, lines });
    }

    return found;
  });
}

test.describe('headings run to two lines at most', () => {
  for (const viewport of VIEWPORTS) {
    for (const route of ALL_ROUTES) {
      test(`${route} @ ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`${NEXT_ORIGIN}${route}`, { waitUntil: 'load' });
        await settleReveals(page);

        const known = KNOWN_LONG[route] ?? {};

        for (const heading of await measureHeadings(page)) {
          const allowed = known[heading.text];

          if (allowed === undefined) {
            expect(heading.lines, `"${heading.text}" on ${route}`).toBeLessThanOrEqual(
              MAX_LINES,
            );
            continue;
          }

          // Already on the backlog. It may not get any worse than it is.
          expect(
            heading.lines,
            `"${heading.text}" on ${route} grew past its recorded ${allowed} lines`,
          ).toBeLessThanOrEqual(allowed);
        }
      });
    }
  }

  /**
   * Stops the backlog rotting into a list of permanent exemptions: once a
   * heading is fixed, its entry has to go, or this fails and says which.
   */
  test('no stale exemptions', async ({ page }) => {
    const stale: string[] = [];

    for (const [route, headings] of Object.entries(KNOWN_LONG)) {
      const worst = new Map<string, number>();

      for (const viewport of VIEWPORTS) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`${NEXT_ORIGIN}${route}`, { waitUntil: 'load' });
        await settleReveals(page);

        for (const heading of await measureHeadings(page)) {
          worst.set(heading.text, Math.max(worst.get(heading.text) ?? 0, heading.lines));
        }
      }

      for (const text of Object.keys(headings)) {
        const measured = worst.get(text);
        if (measured === undefined) {
          stale.push(`${route}: "${text}" is no longer on the page`);
        } else if (measured <= MAX_LINES) {
          stale.push(`${route}: "${text}" now fits in ${measured} lines`);
        }
      }
    }

    expect(stale, `remove these from KNOWN_LONG:\n${stale.join('\n')}`).toEqual([]);
  });
});
