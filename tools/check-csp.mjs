/**
 * Loads a built page in a real browser and reports whether the Content
 * Security Policy is quietly breaking it.
 *
 *   node tools/check-csp.mjs http://localhost:3100/about
 *
 * A CSP that blocks scripts produces a page that still looks correct at the
 * top and is completely inert below the fold, which is easy to miss in review.
 * This makes that failure loud: it prints violations, whether hydration ran,
 * and how many reveal elements actually appeared.
 */
import { chromium } from '@playwright/test';

const target = process.argv[2] ?? 'http://localhost:3100/about';

const browser = await chromium.launch();
const page = await browser.newPage();
const violations = [];
const errors = [];
page.on('console', (m) => {
  const t = m.text();
  if (/Content Security Policy|Refused to/i.test(t)) violations.push(t);
});
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(target, { waitUntil: 'load' });
await page.waitForTimeout(2000);

// Reveal elements sit below the fold, so the page has to be scrolled before
// "did the motion run" is a meaningful question.
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.9);
  for (let y = 0; y < document.body.scrollHeight && y < step * 15; y += step) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});
await page.waitForTimeout(1500);

const state = await page.evaluate(() => ({
  ready: document.body.classList.contains('ready'),
  hydrated: Boolean(document.querySelector('[data-page]')),
  revealed: document.querySelectorAll('.rise.in').length,
  totalRise: document.querySelectorAll('.rise').length,
}));

console.log('CSP violations:', violations.length);
violations.slice(0, 3).forEach((v) => console.log('  -', v.slice(0, 160)));
console.log('page errors:', errors.length);
errors.slice(0, 3).forEach((e) => console.log('  -', e.slice(0, 160)));
console.log('body.ready:', state.ready, '| revealed:', state.revealed, '/', state.totalRise);
await browser.close();

const broken = violations.length > 0 || (state.totalRise > 0 && state.revealed === 0);
if (broken) {
  console.error('\nFAIL: the page is not running its scripts.');
  process.exit(1);
}
console.log('\nOK: no CSP violations and the page hydrated.');
