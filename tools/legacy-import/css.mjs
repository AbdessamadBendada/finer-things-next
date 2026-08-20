/**
 * Legacy stylesheet -> CSS Module transformer.
 *
 * Strategy (see docs/adr/0001-css-modules.md):
 *   every legacy selector is nested under a module-scoped `.page` wrapper and
 *   wrapped in `:global(...)` so the original class names survive verbatim.
 *   The hashed `.page` class is what guarantees two pages can never collide,
 *   while the untouched inner names keep the markup byte-comparable with the
 *   legacy HTML — which is what makes 1:1 parity verifiable.
 *
 * Special cases:
 *   :root          -> `.page` (each legacy page ships its own token palette)
 *   body           -> `.page` (+ background recorded for the globals table)
 *   html / *       -> hoisted to globals.css (identical on every page)
 *   @keyframes     -> untouched; css-loader scopes name + references together
 */

const AT_RULES_WITH_NESTED_RULES = new Set(['media', 'supports', 'layer', 'container']);
const AT_RULES_PASSTHROUGH = new Set(['keyframes', '-webkit-keyframes', 'font-face', 'page']);

/** Splits a stylesheet into top-level nodes, respecting strings and comments. */
function parseNodes(css) {
  const nodes = [];
  let i = 0;
  let prelude = '';

  while (i < css.length) {
    const char = css[i];

    if (char === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const stop = end === -1 ? css.length : end + 2;
      const comment = css.slice(i, stop);
      if (prelude.trim() === '') nodes.push({ type: 'comment', text: comment });
      i = stop;
      continue;
    }

    if (char === '"' || char === "'") {
      const end = findStringEnd(css, i);
      prelude += css.slice(i, end);
      i = end;
      continue;
    }

    if (char === '{') {
      const end = findBlockEnd(css, i);
      nodes.push({ type: 'block', prelude: prelude.trim(), body: css.slice(i + 1, end - 1) });
      prelude = '';
      i = end;
      continue;
    }

    if (char === ';' && prelude.trim().startsWith('@')) {
      nodes.push({ type: 'statement', text: `${prelude.trim()};` });
      prelude = '';
      i += 1;
      continue;
    }

    prelude += char;
    i += 1;
  }

  if (prelude.trim()) nodes.push({ type: 'statement', text: prelude.trim() });
  return nodes;
}

function findStringEnd(css, start) {
  const quote = css[start];
  let i = start + 1;
  while (i < css.length) {
    if (css[i] === '\\') i += 2;
    else if (css[i] === quote) return i + 1;
    else i += 1;
  }
  return css.length;
}

/** `start` points at `{`; returns the index just past the matching `}`. */
function findBlockEnd(css, start) {
  let depth = 0;
  let i = start;
  while (i < css.length) {
    const char = css[i];
    if (char === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }
    if (char === '"' || char === "'") {
      i = findStringEnd(css, i);
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
    i += 1;
  }
  return css.length;
}

/** Splits a selector list on top-level commas only. */
function splitSelectors(selector) {
  const out = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < selector.length; i += 1) {
    const char = selector[i];
    if (char === '(' || char === '[') depth += 1;
    else if (char === ')' || char === ']') depth -= 1;
    if (char === ',' && depth === 0) {
      out.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

const needsGlobal = (selector) => /[.#]/.test(selector);

/**
 * Declarations that only do their job on the document element. Moving these
 * onto the `.page` wrapper would change behaviour rather than preserve it:
 * `overflow-x` would turn the wrapper into a scroll container and break every
 * `position: sticky` descendant, and `scroll-behavior` would stop applying at
 * all. They are hoisted to globals.css instead.
 */
const DOCUMENT_PROPERTIES = new Set([
  'overflow',
  'overflow-x',
  'overflow-y',
  'overscroll-behavior',
  'scroll-behavior',
  'scroll-padding',
  'scroll-padding-top',
  'background',
  'background-color',
  'background-image',
  'height',
  'min-height',
]);

/** Splits a `body { … }` block into document-level and inheritable halves. */
function splitBodyDeclarations(body) {
  const document = [];
  const inherited = [];
  for (const decl of body.split(';')) {
    if (!decl.trim()) continue;
    const property = decl.slice(0, decl.indexOf(':')).trim().toLowerCase();
    (DOCUMENT_PROPERTIES.has(property) ? document : inherited).push(decl.trim());
  }
  return {
    document: document.length ? `${document.join(';')}` : null,
    inherited: inherited.length ? `${inherited.join(';')}` : null,
  };
}

/**
 * Rewrites one legacy selector into its page-scoped module equivalent.
 * Returns null when the rule belongs in globals.css instead.
 */
function scopeSelector(selector, scope) {
  const trimmed = selector.trim();

  if (trimmed === ':root') return `.${scope}`;
  if (trimmed === 'html' || trimmed === 'body') return null;
  if (trimmed === '*' || trimmed.startsWith('*,')) return null;

  // `body.menu-open .head` -> `:global(body.menu-open) .page :global(.head)`
  const rootPrefix = trimmed.match(/^(html|body)((?:[.#:][\w-]+(?:\([^)]*\))?)*)\s+(.+)$/);
  if (rootPrefix) {
    const [, element, modifiers, rest] = rootPrefix;
    const root = modifiers ? `:global(${element}${modifiers})` : element;
    return `${root} .${scope} ${needsGlobal(rest) ? `:global(${rest})` : rest}`;
  }

  if (/^(html|body)\b/.test(trimmed)) return null;

  return `.${scope} ${needsGlobal(trimmed) ? `:global(${trimmed})` : trimmed}`;
}

const fixAssetUrls = (css) => css.replace(/url\((['"]?)assets\//g, 'url($1/assets/');

function transformNodes(nodes, scope, globals, indent = '', context = null) {
  const out = [];

  for (const node of nodes) {
    if (node.type === 'comment') {
      out.push(`${indent}${node.text}`);
      continue;
    }

    if (node.type === 'statement') {
      globals.statements.push(node.text);
      continue;
    }

    const { prelude, body } = node;

    if (prelude.startsWith('@')) {
      const name = prelude.slice(1).split(/[\s(]/)[0].toLowerCase();

      if (AT_RULES_WITH_NESTED_RULES.has(name)) {
        const inner = transformNodes(parseNodes(body), scope, globals, `${indent}  `, prelude);
        if (inner.trim()) out.push(`${indent}${prelude} {\n${inner}\n${indent}}`);
        continue;
      }

      if (AT_RULES_PASSTHROUGH.has(name)) {
        out.push(`${indent}${prelude} {${fixAssetUrls(body)}}`);
        continue;
      }

      out.push(`${indent}${prelude} {${fixAssetUrls(body)}}`);
      continue;
    }

    if (prelude.trim() === 'body') {
      const parts = splitBodyDeclarations(fixAssetUrls(body));
      if (parts.document)
        globals.rules.push({ selector: 'body', body: parts.document, context });
      if (parts.inherited) out.push(`${indent}.${scope} {${parts.inherited}}`);
      continue;
    }

    const scoped = [];
    for (const selector of splitSelectors(prelude)) {
      const next = scopeSelector(selector, scope);
      if (next === null) globals.rules.push({ selector, body: fixAssetUrls(body), context });
      else scoped.push(next);
    }

    if (scoped.length) {
      out.push(`${indent}${scoped.join(',\n' + indent)} {${fixAssetUrls(body)}}`);
    }
  }

  return out.join('\n');
}

/**
 * @param css    concatenated legacy <style> blocks for one page
 * @param scope  the module class every rule is nested under (always `page`)
 */
export function transformStylesheet(css, scope = 'page') {
  const globals = { rules: [], statements: [] };
  const nodes = parseNodes(css);
  const output = transformNodes(nodes, scope, globals);
  return { css: output, globals };
}

/** Pulls a single declaration value out of a raw declaration block. */
export function readDeclaration(body, property) {
  const match = body.match(new RegExp(`(?:^|[;{\\s])${property}\\s*:\\s*([^;}]+)`, 'i'));
  return match ? match[1].trim() : null;
}

/** Collects `--token: value` pairs from a `:root` block. */
export function readTokens(css) {
  const tokens = {};
  for (const node of parseNodes(css)) {
    if (node.type !== 'block' || node.prelude.trim() !== ':root') continue;
    for (const decl of node.body.split(';')) {
      const [name, ...rest] = decl.split(':');
      if (!name?.trim().startsWith('--')) continue;
      tokens[name.trim()] = rest.join(':').trim();
    }
  }
  return tokens;
}

/** Resolves `var(--x)` chains against a token map. */
export function resolveVar(value, tokens, depth = 0) {
  if (!value || depth > 8) return value;
  const match = value.match(/^var\((--[\w-]+)(?:\s*,\s*(.+))?\)$/);
  if (!match) return value;
  const resolved = tokens[match[1]] ?? match[2];
  return resolveVar(resolved?.trim(), tokens, depth + 1);
}
