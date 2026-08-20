/**
 * Compares computed styles between the legacy site and the migrated build.
 *
 *   node tools/diff-computed.mjs
 *
 * Reasoning about the cascade got the chrome wrong three times; measuring it
 * did not. This walks the chrome elements at every breakpoint and prints the
 * properties that actually differ.
 */
import { chromium } from '@playwright/test';

const PAGES = [
  ['home', '/index.html', '/'],
  ['our-work', '/our-work.html', '/our-work'],
  ['projects', '/projects.html', '/projects'],
  ['marsa-al-arab', '/marsa-al-arab.html', '/projects/marsa-al-arab'],
  ['waldorf', '/waldorf-astoria-osaka.html', '/projects/waldorf-astoria-osaka'],
  ['bespoke', '/bespoke-accessories.html', '/services/bespoke-accessories'],
  ['styling', '/styling-curation.html', '/services/styling-curation'],
  ['finer-living', '/finer-living.html', '/services/finer-living'],
  ['about', '/about.html', '/about'],
  ['contact', '/contact.html', '/contact'],
  ['privacy', '/privacy.html', '/privacy'],
  ['terms', '/terms.html', '/terms'],
];
const SELECTORS = [
  '.head',
  '.logo',
  '.links',
  '.menu-toggle',
  'footer',
  '.footer-top',
  '.footer-brand',
  '.footer-tag',
  '.footer-links',
  '.footer-bottom',
  '.footer-row',
  '.ft-top',
  '.ft-cols',
  '.footer-newsletter',
  '.ft-btm',
  '.copyright',
];
const PROPS = [
  'display',
  'position',
  'padding',
  'margin',
  'gap',
  'fontSize',
  'lineHeight',
  'fontFamily',
  'fontWeight',
  'gridTemplateColumns',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'color',
  'backgroundColor',
  'maxWidth',
  'flexWrap',
  'zIndex',
  'opacity',
];

const browser = await chromium.launch();

async function snapshot(url, width) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height: 900 });
  // `load` waits on the hero videos, which can stall for a full minute on the
  // legacy server. The styles we measure are ready long before that.
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  // Wait for fonts rather than `load`: `ch` units and line boxes depend on the
  // real face, but `load` also waits on the hero videos, which can stall for a
  // minute on the legacy server.
  await page.evaluate(() => document.fonts?.ready).catch(() => undefined);
  await page.waitForTimeout(1200);
  const data = await page.evaluate(
    ([selectors, props]) => {
      const out = {};
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const c = getComputedStyle(el);
        out[sel] = Object.fromEntries(props.map((p) => [p, c[p]]));
        out[sel].__h = Math.round(el.getBoundingClientRect().height);
      }
      out.__doc = document.body.scrollHeight;
      return out;
    },
    [SELECTORS, PROPS],
  );
  await page.close();
  return data;
}

let issues = 0;
for (const width of [1440, 860, 390]) {
  for (const [name, legacyPath, route] of PAGES) {
    let L;
    let N;
    try {
      L = await snapshot(`http://localhost:4321${legacyPath}`, width);
      N = await snapshot(`http://localhost:3100${route}`, width);
    } catch (error) {
      console.log(
        `\n=== ${name} @${width}: could not measure — ${String(error).split('\n')[0]}`,
      );
      continue;
    }
    const lines = [];

    if (L.__doc !== N.__doc) lines.push(`  document height ${L.__doc} -> ${N.__doc}`);

    for (const sel of SELECTORS) {
      if (!L[sel] && !N[sel]) continue;
      if (!L[sel] || !N[sel]) {
        lines.push(`  ${sel}: ${L[sel] ? 'missing in next' : 'extra in next'}`);
        continue;
      }
      for (const prop of [...PROPS, '__h']) {
        if (String(L[sel][prop]) !== String(N[sel][prop])) {
          lines.push(`  ${sel} ${prop}: ${L[sel][prop]} -> ${N[sel][prop]}`);
        }
      }
    }
    if (lines.length) {
      issues += lines.length;
      console.log(`\n=== ${name} @${width}`);
      console.log(lines.join('\n'));
    }
  }
}
console.log(issues ? `\n${issues} computed differences` : '\nno computed differences');
await browser.close();
