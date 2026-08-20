import { chromium } from '@playwright/test';
const PAGES = [
  ['home', '/index.html', '/'],
  ['our-work', '/our-work.html', '/our-work'],
  ['projects', '/projects.html', '/projects'],
  ['marsa', '/marsa-al-arab.html', '/projects/marsa-al-arab'],
  ['waldorf', '/waldorf-astoria-osaka.html', '/projects/waldorf-astoria-osaka'],
  ['bespoke', '/bespoke-accessories.html', '/services/bespoke-accessories'],
  ['styling', '/styling-curation.html', '/services/styling-curation'],
  ['finer-living', '/finer-living.html', '/services/finer-living'],
  ['about', '/about.html', '/about'],
  ['contact', '/contact.html', '/contact'],
  ['privacy', '/privacy.html', '/privacy'],
  ['terms', '/terms.html', '/terms'],
];
const b = await chromium.launch();
async function h(url, w) {
  const p = await b.newPage();
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(w === 1440 ? 2000 : 1600);
  await p.evaluate(async () => {
    const s = Math.round(innerHeight * 0.9);
    const H = document.body.scrollHeight;
    for (let y = 0; y < H; y += s) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 45));
    }
    scrollTo(0, 0);
  });
  await p.waitForTimeout(2000);
  const d = await p.evaluate(() => document.body.scrollHeight);
  await p.close();
  return d;
}
const bad = [];
for (const w of [1440, 860, 390])
  for (const [n, l, x] of PAGES) {
    const L = await h('http://localhost:4321' + l, w),
      N = await h('http://localhost:3100' + x, w);
    if (Math.abs(L - N) > 1)
      bad.push(`${n}@${w}: ${L} vs ${N} (${N - L > 0 ? '+' : ''}${N - L})`);
  }
console.log(
  bad.length
    ? `${bad.length} mismatch(es):\n  ` + bad.join('\n  ')
    : '✓ all 36 page/viewport heights match legacy',
);
await b.close();
