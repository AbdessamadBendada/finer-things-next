/**
 * Generates src/shared/styles/chrome.css from the legacy documents.
 *
 *   node tools/legacy-import/build-chrome.mjs
 *
 * The masthead and footer are rendered once by the layout, so their styling
 * has to live in one stylesheet. Every legacy page carried its own copy, and
 * those copies agree most of the time but not always — the project stories
 * space their footer links a little tighter, Contact aligns its row to the
 * baseline, the home masthead hides itself until the wordmark hands off.
 *
 * Hand-porting that was tried and got it wrong at the breakpoints, so this
 * derives it instead:
 *
 *   - a rule identical on every page becomes `[data-page] …`;
 *   - anything else becomes `[data-page='<slug>'] …`;
 *   - at-rule context is part of the identity, so a 760px rule never collapses
 *     into an 860px one.
 *
 * Re-run it after changing which selectors count as chrome.
 */
import { readFile, writeFile } from 'node:fs/promises';

import { transformStylesheet } from './css.mjs';
import { parse } from './split-styles.mjs';

const PAGES = {
  home: 'index.html',
  'our-work': 'our-work.html',
  projects: 'projects.html',
  'marsa-al-arab': 'marsa-al-arab.html',
  'waldorf-astoria-osaka': 'waldorf-astoria-osaka.html',
  'bespoke-accessories': 'bespoke-accessories.html',
  'styling-curation': 'styling-curation.html',
  'finer-living': 'finer-living.html',
  about: 'about.html',
  contact: 'contact.html',
  privacy: 'privacy.html',
  terms: 'terms.html',
};

/**
 * Markup owned by the layout: SiteHeader and SiteFooter.
 *
 * `.wrap` is included even though it is a layout primitive rather than chrome:
 * the footer uses it, so a page that narrows its content column has to narrow
 * the footer's column too, and a rule scoped to `.page` cannot do that.
 */
const CHROME = new Set([
  '.head',
  '.head.scrolled',
  '.head.menu-active',
  '.head.show',
  '.logo',
  '.head .logo',
  '.head .logo img',
  '.links',
  '.head .links',
  '.links a',
  '.head .links a',
  '.links a:hover',
  '.head .links a:hover',
  '.menu-toggle',
  '.mobile-menu',
  '.mobile-menu.open',
  '.mobile-menu a',
  'footer',
  '.footer-top',
  '.footer-brand',
  '.footer-tag',
  '.footer-links',
  '.footer-links h3',
  '.footer-links a',
  '.footer-links a:hover',
  '.footer-bottom',
  '.footer-bottom em',
  '.footer-row',
  '.footer-row a',
  '.copyright',
  '.back',
  '.ft-top',
  '.ft-top .brand',
  '.ft-top .tag',
  '.ft-cols',
  '.ft-cols h4',
  '.ft-cols a',
  '.ft-cols a:hover',
  '.ft-btm',
  '.ft-btm .tagline',
  '.footer-newsletter',
  '.footer-newsletter h2',
  '.footer-newsletter p',
  '.wrap',
]);

const normSelector = (s) =>
  s
    // Trim first: in a selector list every entry after the first arrives with
    // leading whitespace, and without this the `.page ` prefix survives — so
    // `.links a, .menu-toggle` had its second half go unrecognised.
    .trim()
    .replace(/^\.page\s*/, '')
    .replace(/:global\(([^)]*)\)/g, '$1')
    .replace(/\s*>\s*/g, ' > ')
    .trim()
    .replace(/\s+/g, ' ');

const cleanBody = (b) =>
  b
    .replace(/'Jost',\s*sans-serif/g, 'var(--font-body), sans-serif')
    .replace(/'Jost'/g, 'var(--font-body)')
    .trim();

const bodyKey = (b) => cleanBody(b).replace(/\s/g, '');

/** Collects every chrome rule of one page, keyed by at-rule context. */
function collect(css) {
  const found = [];
  const walk = (nodes, context) => {
    for (const node of nodes) {
      if (node.type === 'at') {
        walk(node.children, node.prelude.replace(/\s+/g, ''));
        continue;
      }
      if (node.type !== 'rule') continue;
      // A rule may mix chrome and page selectors — `.meta, .footer-row` on the
      // legal pages. Take the chrome half here; split-styles keeps the rest.
      const selectors = node.prelude
        .split(',')
        .map(normSelector)
        .filter((s) => CHROME.has(s));
      if (!selectors.length) continue;
      found.push({ context, selectors, body: node.body });
    }
  };
  walk(parse(css), '');
  return found;
}

const pages = {};
for (const [slug, file] of Object.entries(PAGES)) {
  const html = await readFile(`legacy/${file}`, 'utf8');
  const raw = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  pages[slug] = collect(transformStylesheet(raw).css);
}

const slugs = Object.keys(PAGES);

/** identity -> { slug -> body } */
const byRule = new Map();
for (const slug of slugs) {
  for (const rule of pages[slug]) {
    for (const selector of rule.selectors) {
      const id = `${rule.context}||${selector}`;
      if (!byRule.has(id))
        byRule.set(id, { context: rule.context, selector, bodies: new Map() });
      // Later declarations win within a page, matching the cascade.
      const entry = byRule.get(id);
      entry.bodies.set(
        slug,
        entry.bodies.has(slug) ? `${entry.bodies.get(slug)};${rule.body}` : rule.body,
      );
    }
  }
}

const universal = new Map();
const perPage = new Map();

for (const { context, selector, bodies } of byRule.values()) {
  const values = [...bodies.values()].map(bodyKey);
  // Promote to an unscoped `[data-page]` rule only when every page declares it
  // and agrees. Anything less stays scoped to the pages that asked for it:
  // an unscoped rule reaches all twelve, and a rule six pages declared would
  // silently change the other six. Pages sharing a value are still grouped
  // into one selector list, so this does not reintroduce duplication.
  const everyPageAgrees = bodies.size === slugs.length && new Set(values).size === 1;

  if (everyPageAgrees) {
    const bucket = universal.get(context) ?? [];
    bucket.push({ selector, body: [...bodies.values()][0] });
    universal.set(context, bucket);
    continue;
  }

  // Group the pages that share a value so near-identical pages stay together.
  const groups = new Map();
  for (const [slug, body] of bodies) {
    const key = bodyKey(body);
    if (!groups.has(key)) groups.set(key, { body, slugs: [] });
    groups.get(key).slugs.push(slug);
  }
  for (const { body, slugs: group } of groups.values()) {
    const bucket = perPage.get(context) ?? [];
    bucket.push({ selector, body, slugs: group });
    perPage.set(context, bucket);
  }
}

const renderRule = (selector, body, scopes) => `${scopes.join(',\n')} {${cleanBody(body)}}`;

const contexts = [...new Set([...universal.keys(), ...perPage.keys()])].sort((a, b) =>
  a === '' ? -1 : b === '' ? 1 : b.localeCompare(a),
);

const out = [
  `/* ================================================================
   SITE CHROME — masthead, mobile menu, footer

   GENERATED by tools/legacy-import/build-chrome.mjs. Do not hand-edit;
   change the generator or the legacy source and re-run it.

   The masthead and footer are rendered once, by the layout, so their
   styling cannot live in a page stylesheet — a rule scoped to \`.page\`
   would never reach them.

   \`[data-page]\` rules are the ones every page agreed on.
   \`[data-page='slug']\` rules are where a page genuinely differs: the
   home masthead hides itself until the wordmark hands off, Contact
   aligns its footer row to the baseline, the project stories space
   their links a little tighter.
   ================================================================ */`,
];

for (const context of contexts) {
  const body = [];

  for (const rule of universal.get(context) ?? []) {
    body.push(renderRule(rule.selector, rule.body, [`[data-page] ${rule.selector}`]));
  }
  for (const rule of perPage.get(context) ?? []) {
    body.push(
      renderRule(
        rule.selector,
        rule.body,
        rule.slugs.map((slug) => `[data-page='${slug}'] ${rule.selector}`),
      ),
    );
  }

  if (!body.length) continue;

  if (context) {
    const pretty = context.replace(/^@media\(/, '@media (').replace(/:/g, ': ');
    out.push(`${pretty} {\n${body.map((r) => `  ${r.replace(/\n/g, '\n  ')}`).join('\n')}\n}`);
  } else {
    out.push(body.join('\n'));
  }
}

await writeFile('src/shared/styles/chrome.css', `${out.join('\n\n')}\n`, 'utf8');

const universalCount = [...universal.values()].reduce((n, r) => n + r.length, 0);
const variantCount = [...perPage.values()].reduce((n, r) => n + r.length, 0);
console.log(`chrome.css: ${universalCount} shared rules, ${variantCount} per-page variants`);
