/**
 * Regenerates every page stylesheet from `legacy/`, with the rules the shared
 * layers now own removed.
 *
 *   node tools/legacy-import/split-styles.mjs
 *
 * Why this exists: the shared layers (tokens / primitives / chrome) were
 * extracted by hand-rolled regex edits, and regexes cannot see CSS structure —
 * they flattened media queries and dropped duplicate selectors. This does the
 * same job from a parsed tree, so it is repeatable and cannot silently lose a
 * rule.
 *
 * The rules:
 *   - a rule whose selectors are all chrome is dropped (chrome.css owns it,
 *     including its responsive variants);
 *   - any other rule is dropped only when a shared layer provides the *same
 *     declarations*; a different value is a real override and is kept;
 *   - media blocks keep their structure, and duplicate selectors are preserved
 *     in source order.
 */
import { readFile, writeFile } from 'node:fs/promises';

import { transformStylesheet } from './css.mjs';

/** Parses into an ordered tree of rules and at-rule blocks. */
export function parse(css) {
  const out = [];
  let i = 0;
  let buf = '';

  while (i < css.length) {
    const ch = css[i];

    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const stop = end === -1 ? css.length : end + 2;
      if (!buf.trim()) out.push({ type: 'comment', text: css.slice(i, stop) });
      i = stop;
      continue;
    }

    if (ch === '{') {
      let depth = 0;
      let j = i;
      for (; j < css.length; j++) {
        if (css[j] === '{') depth += 1;
        else if (css[j] === '}') {
          depth -= 1;
          if (!depth) {
            j += 1;
            break;
          }
        }
      }
      const prelude = buf.trim();
      const body = css.slice(i + 1, j - 1);
      out.push(
        prelude.startsWith('@')
          ? { type: 'at', prelude, children: parse(body) }
          : { type: 'rule', prelude, body },
      );
      buf = '';
      i = j;
      continue;
    }

    buf += ch;
    i += 1;
  }

  return out;
}

const normSelector = (s) =>
  s
    // Trim first: in a selector list every entry after the first arrives with
    // leading whitespace, and without this the `.page ` prefix survives — so
    // `.links a, .menu-toggle` had its second half go unrecognised.
    .trim()
    .replace(/^\.page\s*/, '')
    .replace(/\[data-page[^\]]*\]\s*/g, '')
    .replace(/:global\(([^)]*)\)/g, '$1')
    .replace(/\s*>\s*/g, '>')
    .trim()
    .replace(/\s+/g, ' ');

/** Declarations, order-insensitive, with token aliases folded in. */
const normBody = (b) =>
  b
    .replace(/\s+/g, '')
    .replace(/'Jost',?(sans-serif)?/g, 'var(--font-body),sans-serif')
    .replace(/var\(--brass\)/g, 'var(--clay)')
    .replace(/var\(--red\)/g, 'var(--oxblood)')
    .replace(/var\(--ink-soft\)/g, 'var(--soft)')
    .replace(/var\(--paper-2\)/g, 'var(--stone)')
    .split(';')
    .filter(Boolean)
    .sort()
    .join(';');

/** Selectors owned outright by chrome.css — the layout renders this markup. */
const CHROME_SELECTORS = new Set([
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
  '.head .links a:hover',
  '.links a:hover',
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
  // See build-chrome.mjs: the footer uses .wrap, so it is emitted there.
  '.wrap',
]);

async function sharedDeclarations() {
  const map = new Map();
  // Keyed by at-rule context as well as selector: the same declarations under
  // a different breakpoint are a different rule. Ignoring the context silently
  // deleted the legal pages' 760px gutter because the shared layer happened to
  // say the same thing at 860px.
  const add = (node, context = '') => {
    if (node.type === 'at') {
      const inner = node.prelude.replace(/\s/g, '');
      return node.children.forEach((child) => add(child, inner));
    }
    if (node.type !== 'rule') return;
    for (const sel of node.prelude.split(',')) {
      const key = `${context}|${normSelector(sel)}`;
      if (!map.has(key)) map.set(key, new Set());
      map.get(key).add(normBody(node.body));
    }
  };
  for (const file of ['tokens.css', 'primitives.css', 'chrome.css', 'globals.css']) {
    // Note the wrapper: `forEach(add)` would pass the array index as the
    // context argument, keying every top-level rule "0|.wrap" instead of
    // "|.wrap" — which made the shared layer look empty and left a duplicate
    // of every base rule in each page stylesheet.
    parse(await readFile(`src/shared/styles/${file}`, 'utf8')).forEach((node) => add(node));
  }
  return map;
}

const PAGES = {
  home: ['index.html', 'src/features/home/styles/home.module.css'],
  'our-work': ['our-work.html', 'src/features/our-work/styles/our-work.module.css'],
  projects: ['projects.html', 'src/features/projects/styles/projects.module.css'],
  'marsa-al-arab': [
    'marsa-al-arab.html',
    'src/features/projects/styles/marsa-al-arab.module.css',
  ],
  'waldorf-astoria-osaka': [
    'waldorf-astoria-osaka.html',
    'src/features/projects/styles/waldorf-astoria-osaka.module.css',
  ],
  'bespoke-accessories': [
    'bespoke-accessories.html',
    'src/features/services/styles/bespoke-accessories.module.css',
  ],
  'styling-curation': [
    'styling-curation.html',
    'src/features/services/styles/styling-curation.module.css',
  ],
  'finer-living': ['finer-living.html', 'src/features/services/styles/finer-living.module.css'],
  about: ['about.html', 'src/features/about/styles/about.module.css'],
  contact: ['contact.html', 'src/features/contact/styles/contact.module.css'],
  privacy: ['privacy.html', 'src/features/legal/styles/privacy.module.css'],
  terms: ['terms.html', 'src/features/legal/styles/terms.module.css'],
};

const shared = await sharedDeclarations();

/**
 * Returns the selectors this page still needs to declare, or null when the
 * whole rule is covered. Chrome selectors are always dropped — chrome.css owns
 * them — but a rule that mixes chrome with page selectors keeps the rest.
 */
function remainingSelectors(node, context) {
  const original = node.prelude.split(',').map((s) => s.trim());
  const body = normBody(node.body);

  const keep = original.filter((raw) => {
    const s = normSelector(raw);
    if (CHROME_SELECTORS.has(s)) return false;
    return !shared.get(`${context}|${s}`)?.has(body);
  });

  return keep.length ? keep : null;
}

function render(nodes, indent = '', context = '') {
  const out = [];
  for (const node of nodes) {
    if (node.type === 'comment') continue;
    if (node.type === 'at') {
      const inner = render(node.children, `${indent}  `, node.prelude.replace(/\s/g, ''));
      if (inner.trim()) out.push(`${indent}${node.prelude} {\n${inner}\n${indent}}`);
      continue;
    }
    const keep = remainingSelectors(node, context);
    if (!keep) continue;
    out.push(`${indent}${keep.join(', ')} {${node.body.trim()}}`);
  }
  return out.join('\n');
}

let totalBefore = 0;
let totalAfter = 0;

for (const [slug, [legacyFile, target]] of Object.entries(PAGES)) {
  const html = await readFile(`legacy/${legacyFile}`, 'utf8');
  const raw = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const { css } = transformStylesheet(raw);

  const before = css.length;
  const body = render(parse(css));

  await writeFile(
    target,
    `/*
 * ${slug} — page-specific styling only.
 *
 * Regenerated from legacy/${legacyFile} by tools/legacy-import/split-styles.mjs.
 * Anything the shared layers provide (tokens, primitives, chrome) has been
 * removed; what remains either belongs to this page alone or deliberately
 * overrides a shared rule. Scoped under .page — see docs/ARCHITECTURE.md.
 */

${body}
`,
    'utf8',
  );

  totalBefore += before;
  totalAfter += body.length;
  console.log(
    `${slug.padEnd(24)} ${(before / 1024).toFixed(1).padStart(6)} KB -> ${(body.length / 1024).toFixed(1).padStart(6)} KB`,
  );
}

console.log(
  `\ntotal ${(totalBefore / 1024).toFixed(0)} KB -> ${(totalAfter / 1024).toFixed(0)} KB`,
);
