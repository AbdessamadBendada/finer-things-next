/**
 * One-shot legacy importer.
 *
 *   pnpm migrate:pages
 *
 * Reads the twelve static documents in legacy/ and emits, per page, a scoped
 * CSS Module plus a JSX component. The output is a faithful starting point,
 * not the finished feature: motion scripts are extracted to
 * tools/legacy-import/extracted/ for hand-porting into hooks, and structured
 * content is lifted into typed content modules afterwards.
 *
 * ⚠️  THIS HAS ALREADY RUN. The files it produced are now hand-maintained
 * source: motion has been ported into hooks, forms replaced with real
 * components, and the masthead extracted into <SiteHeader />. Re-running it
 * would overwrite all of that.
 *
 * It is kept for reference — it documents exactly how the port was derived,
 * and makes the transformation reproducible from the legacy documents if that
 * is ever needed. See docs/adr/0001-css-modules.md.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { parseBody, createTransformer } from './html.mjs';
import { transformStylesheet, readTokens, readDeclaration, resolveVar } from './css.mjs';

const LEGACY_DIR = path.resolve('legacy');
const SRC_DIR = path.resolve('src');
const EXTRACTED_DIR = path.resolve('tools/legacy-import/extracted');

/** file -> where it lands in the feature tree. */
const PAGES = [
  {
    file: 'index.html',
    feature: 'home',
    component: 'HomePage',
    slug: 'home',
    route: '/',
    header: 'HomeHeader',
  },
  {
    file: 'our-work.html',
    feature: 'our-work',
    component: 'OurWorkPage',
    slug: 'our-work',
    route: '/our-work',
  },
  {
    file: 'projects.html',
    feature: 'projects',
    component: 'ProjectsPage',
    slug: 'projects',
    route: '/projects',
  },
  {
    file: 'marsa-al-arab.html',
    feature: 'projects',
    component: 'MarsaAlArabPage',
    slug: 'marsa-al-arab',
    route: '/projects/marsa-al-arab',
  },
  {
    file: 'waldorf-astoria-osaka.html',
    feature: 'projects',
    component: 'WaldorfAstoriaOsakaPage',
    slug: 'waldorf-astoria-osaka',
    route: '/projects/waldorf-astoria-osaka',
  },
  {
    file: 'bespoke-accessories.html',
    feature: 'services',
    component: 'BespokeAccessoriesPage',
    slug: 'bespoke-accessories',
    route: '/services/bespoke-accessories',
  },
  {
    file: 'styling-curation.html',
    feature: 'services',
    component: 'StylingCurationPage',
    slug: 'styling-curation',
    route: '/services/styling-curation',
  },
  {
    file: 'finer-living.html',
    feature: 'services',
    component: 'FinerLivingPage',
    slug: 'finer-living',
    route: '/services/finer-living',
  },
  {
    file: 'about.html',
    feature: 'about',
    component: 'AboutPage',
    slug: 'about',
    route: '/about',
  },
  {
    file: 'contact.html',
    feature: 'contact',
    component: 'ContactPage',
    slug: 'contact',
    route: '/contact',
  },
  {
    file: 'privacy.html',
    feature: 'legal',
    component: 'PrivacyPage',
    slug: 'privacy',
    route: '/privacy',
  },
  {
    file: 'terms.html',
    feature: 'legal',
    component: 'TermsPage',
    slug: 'terms',
    route: '/terms',
  },
];

const HREF_MAP = Object.fromEntries(
  PAGES.map((page) => [page.file, page.route]).concat([['index.html', '/']]),
);

const registryModule = await readFile(
  path.join(SRC_DIR, 'shared/config/image-registry.ts'),
  'utf8',
);
const IMAGE_SIZES = Object.fromEntries(
  [...registryModule.matchAll(/'(\/assets\/[^']+)':\s*\{ width: (\d+), height: (\d+) \}/g)].map(
    (m) => [m[1], { width: Number(m[2]), height: Number(m[3]) }],
  ),
);

function rewriteHref(href) {
  if (!href) return href;
  const [file, hash = ''] = href.split('#');
  const suffix = hash ? `#${hash}` : '';
  if (HREF_MAP[file]) return `${HREF_MAP[file]}${suffix}`;
  if (file === '' && hash) return href;
  return href;
}

const isInternalLink = (href) => Boolean(href) && Boolean(HREF_MAP[href.split('#')[0]]);

function resolveImage(src, attrs) {
  if (!src) return null;
  const normalized = src.startsWith('/') ? src : `/${src.replace(/^\.\//, '')}`;
  const size = IMAGE_SIZES[normalized];
  if (!size) return null;
  const rest = attrs.filter((attr) => !attr.startsWith('src=') && !attr.startsWith('loading='));
  const withSrc = rest.map((attr) => attr).join(' ');
  return `<Media src="${normalized}" ${withSrc} />`;
}

const attr = (node, name) => node.attrs?.find((a) => a.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/).includes(name);
const textOf = (node) =>
  (node.childNodes ?? [])
    .map((child) => (child.nodeName === '#text' ? child.value : textOf(child)))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

const findNode = (nodes, predicate) => {
  for (const node of nodes) {
    if (predicate(node)) return node;
    const found = findNode(node.childNodes ?? [], predicate);
    if (found) return found;
  }
  return null;
};

function collectAnchors(node, found = []) {
  for (const child of node.childNodes ?? []) {
    if (child.tagName === 'a') found.push(child);
    collectAnchors(child, found);
  }
  return found;
}

const serializeLinks = (links, indent) =>
  `[\n${links
    .map(
      (link) =>
        `${indent}  { href: '${link.href}', label: ${JSON.stringify(link.label)}${link.current ? ', current: true' : ''} },`,
    )
    .join('\n')}\n${indent}]`;

/** Replaces the legacy masthead markup with the shared <SiteHeader />. */
function extractChrome(bodyNodes, page) {
  const header = bodyNodes.find((node) => node.tagName === 'header' && hasClass(node, 'head'));
  const menu = bodyNodes.find(
    (node) => node.tagName === 'nav' && hasClass(node, 'mobile-menu'),
  );
  if (!header) return { nodes: bodyNodes, jsx: null };

  const linkList = findNode(
    [header],
    (node) => node.tagName === 'ul' && hasClass(node, 'links'),
  );
  const backLink = findNode([header], (node) => node.tagName === 'a' && hasClass(node, 'back'));
  const logo = findNode([header], (node) => node.tagName === 'img') ? 'wordmark' : 'mark';
  const threshold = attr(header, 'data-scroll-threshold');

  const props = [];
  const links = linkList
    ? collectAnchors(linkList).map((anchor) => ({
        href: rewriteHref(attr(anchor, 'href')),
        label: textOf(anchor),
        ...(attr(anchor, 'aria-current') ? { current: true } : {}),
      }))
    : [];
  const menuLinks = menu
    ? collectAnchors(menu).map((anchor) => ({
        href: rewriteHref(attr(anchor, 'href')),
        label: textOf(anchor),
        ...(attr(anchor, 'aria-current') ? { current: true } : {}),
      }))
    : [];

  const pad = '      ';
  if (links.length) props.push(`links={${serializeLinks(links, pad)}}`);
  if (menuLinks.length) props.push(`menu={${serializeLinks(menuLinks, pad)}}`);
  if (logo === 'wordmark') props.push(`logo="wordmark"`);
  if (threshold) props.push(`scrollThreshold={${Number(threshold)}}`);
  if (backLink) {
    props.push(
      `trailing={<Link className="back" href="${rewriteHref(attr(backLink, 'href'))}">${textOf(backLink)}</Link>}`,
    );
  }

  const tag = page.header ?? 'SiteHeader';
  const jsx = `${pad.slice(2)}<${tag}\n${props.map((prop) => `${pad}${prop}`).join('\n')}\n${pad.slice(2)}/>`;

  const removed = new Set([header, menu].filter(Boolean));
  return {
    nodes: bodyNodes.filter((node) => !removed.has(node)),
    jsx,
    tag,
    usesLink: Boolean(backLink),
  };
}

const extractBlocks = (html, tag, exclude) =>
  [
    ...html.matchAll(new RegExp(`<${tag}(?![^>]*${exclude})[^>]*>([\\s\\S]*?)</${tag}>`, 'g')),
  ].map((match) => match[1]);

await mkdir(EXTRACTED_DIR, { recursive: true });

const globalReport = { rules: new Map(), statements: new Set() };
const backgrounds = [];

for (const page of PAGES) {
  const html = await readFile(path.join(LEGACY_DIR, page.file), 'utf8');

  // ---- stylesheet ----------------------------------------------------
  const styleBlocks = extractBlocks(html, 'style', 'data-keep');
  const rawCss = styleBlocks.join('\n');
  const tokens = readTokens(rawCss);
  const { css, globals } = transformStylesheet(rawCss);

  for (const rule of globals.rules) {
    const key = `${rule.context ?? ''}|${rule.selector}|${rule.body}`;
    const entry = globalReport.rules.get(key) ?? { ...rule, pages: [] };
    entry.pages.push(page.slug);
    globalReport.rules.set(key, entry);
  }
  globals.statements.forEach((statement) => globalReport.statements.add(statement));

  const bodyRule = globals.rules.find((rule) => rule.selector.trim() === 'body');
  const bodyBackground = resolveVar(
    readDeclaration(rawCss.match(/(?:^|\})\s*body\s*\{([^}]*)\}/)?.[1] ?? '', 'background') ??
      readDeclaration(bodyRule?.body ?? '', 'background'),
    tokens,
  );
  if (bodyBackground) backgrounds.push({ slug: page.slug, background: bodyBackground });

  const stylesDir = path.join(SRC_DIR, 'features', page.feature, 'styles');
  await mkdir(stylesDir, { recursive: true });
  await writeFile(
    path.join(stylesDir, `${page.slug}.module.css`),
    `/*\n * ${page.route} — ported verbatim from legacy/${page.file}.\n * Every rule is scoped under .page; legacy class names are intentionally\n * preserved so this file stays diffable against the original document.\n */\n\n.page {\n  min-height: 100vh;\n}\n\n${css}\n`,
    'utf8',
  );

  // ---- markup --------------------------------------------------------
  const componentImports = new Set();
  const transformer = createTransformer({
    rewriteHref,
    isInternalLink,
    resolveImage,
    componentImports,
  });
  const chrome = extractChrome(parseBody(html), page);
  if (chrome.usesLink) componentImports.add('Link');
  const jsx = [chrome.jsx, transformer.toJsx(chrome.nodes, 3)].filter(Boolean).join('\n');

  const shell = `${page.component.replace(/Page$/, '')}Shell`;
  const imports = [`import { ${shell} } from './${shell}';`];
  if (chrome.tag) {
    imports.unshift(
      chrome.tag === 'SiteHeader'
        ? "import { SiteHeader } from '@/shared/layout/SiteHeader';"
        : `import { ${chrome.tag} } from './${chrome.tag}';`,
    );
  }
  if (componentImports.has('Link')) imports.unshift("import Link from 'next/link';");
  if (componentImports.has('CSSProperties')) {
    imports.unshift("import type { CSSProperties } from 'react';");
  }
  if (componentImports.has('Media')) {
    imports.splice(
      componentImports.has('Link') ? 1 : 0,
      0,
      "import { Media } from '@/shared/ui/Media';",
    );
  }

  const uiDir = path.join(SRC_DIR, 'features', page.feature, 'ui');
  await mkdir(uiDir, { recursive: true });
  await writeFile(
    path.join(uiDir, `${page.component}.tsx`),
    `${imports.join('\n')}\n\nexport function ${page.component}() {\n  return (\n    <${shell}>\n${jsx}\n    </${shell}>\n  );\n}\n`,
    'utf8',
  );

  // ---- page-specific motion (hand-ported into hooks) -----------------
  const scripts = extractBlocks(html, 'script', 'src=').filter((script) => script.trim());
  if (scripts.length) {
    await writeFile(
      path.join(EXTRACTED_DIR, `${page.slug}.js`),
      `/* Extracted from legacy/${page.file}. Reference only — port into hooks. */\n${scripts.join('\n\n')}\n`,
      'utf8',
    );
  }

  console.log(
    `${page.route.padEnd(34)} css ${String(css.length).padStart(6)}b  jsx ${String(jsx.length).padStart(6)}b  scripts ${scripts.length}`,
  );
}

// ---- report ----------------------------------------------------------
await writeFile(
  path.join(EXTRACTED_DIR, 'globals-report.txt'),
  [
    '# Rules hoisted out of page stylesheets (html / body / * selectors).',
    '# Reconcile these by hand into src/shared/styles/globals.css.',
    '',
    ...[...globalReport.rules.values()].map(
      (rule) =>
        `${rule.context ? rule.context + ' { ' : ''}${rule.selector} {${rule.body}}${rule.context ? ' }' : ''}\n    pages: ${rule.pages.join(', ')}\n`,
    ),
    '',
    '# Body backgrounds (drive the body:has() table in globals.css):',
    ...backgrounds.map((entry) => `  ${entry.slug}: ${entry.background}`),
  ].join('\n'),
  'utf8',
);

console.log(
  `\nGlobal-candidate rules: ${globalReport.rules.size} (see extracted/globals-report.txt)`,
);
