/**
 * Legacy HTML -> JSX transformer.
 *
 * Uses a real HTML parser rather than regexes: the legacy documents contain
 * minified markup, boolean attributes and unclosed void elements, all of which
 * a regex port would silently corrupt. Class names are deliberately left as
 * plain strings — the CSS Modules strategy keeps them literal (see css.mjs).
 */
import * as parse5 from 'parse5';

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/** HTML attribute -> JSX property. Anything absent passes through unchanged. */
const ATTRIBUTE_MAP = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  srcset: 'srcSet',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  playsinline: 'playsInline',
  novalidate: 'noValidate',
  enctype: 'encType',
  formaction: 'formAction',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  usemap: 'useMap',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  viewbox: 'viewBox',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'stop-color': 'stopColor',
};

/** Valueless in HTML, `true` in JSX. */
const BOOLEAN_ATTRIBUTES = new Set([
  'required',
  'disabled',
  'checked',
  'readonly',
  'hidden',
  'muted',
  'loop',
  'controls',
  'autoplay',
  'playsinline',
  'autofocus',
  'novalidate',
  'multiple',
  'selected',
  'defer',
  'async',
  'reversed',
  'open',
  'inert',
]);

/** Attributes React expects as numbers rather than strings. */
const NUMERIC_ATTRIBUTES = new Set([
  'tabindex',
  'colspan',
  'rowspan',
  'span',
  'start',
  'rows',
  'cols',
  'size',
  'maxlength',
  'minlength',
  'width',
  'height',
]);

/** Attribute values that point at a bundled asset and need an absolute path. */
const ASSET_ATTRIBUTES = new Set(['src', 'poster', 'data-src', 'data-poster']);

const absoluteAsset = (value) =>
  value.startsWith('assets/') || value.startsWith('./assets/')
    ? `/${value.replace(/^\.\//, '')}`
    : value;

const kebabToCamel = (value) => value.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/** `style="a:b;--c:d"` -> a JSX style object literal. */
function styleToObject(value) {
  const entries = value
    .split(';')
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => {
      const index = decl.indexOf(':');
      if (index === -1) return null;
      const property = decl.slice(0, index).trim();
      const raw = decl.slice(index + 1).trim();
      const key = property.startsWith('--') ? `'${property}'` : kebabToCamel(property);
      return `${key}: '${raw.replace(/'/g, "\\'")}'`;
    })
    .filter(Boolean);
  const hasCustomProperty = entries.some((entry) => entry.startsWith("'--"));
  const object = `{ ${entries.join(', ')} }`;
  return hasCustomProperty ? `{${object} as CSSProperties}` : `{${object}}`;
}

const escapeText = (text) =>
  text.replace(/[{}]/g, (char) => `{'${char}'}`).replace(/</g, '&lt;');

const escapeAttribute = (value) => value.replace(/"/g, '&quot;');

export function createTransformer(options) {
  const {
    rewriteHref = (href) => href,
    isInternalLink = () => false,
    resolveImage = null,
    componentImports = new Set(),
  } = options ?? {};

  function attributesToJsx(node) {
    const parts = [];

    for (const attribute of node.attrs ?? []) {
      const name = attribute.name;
      const value = attribute.value;

      if (name === 'style') {
        const serialized = styleToObject(value);
        if (serialized.includes('as CSSProperties')) componentImports.add('CSSProperties');
        parts.push(`style=${serialized}`);
        continue;
      }

      if (ASSET_ATTRIBUTES.has(name)) {
        parts.push(`${ATTRIBUTE_MAP[name] ?? name}="${escapeAttribute(absoluteAsset(value))}"`);
        continue;
      }

      if (NUMERIC_ATTRIBUTES.has(name) && /^-?\d+$/.test(value.trim())) {
        parts.push(`${ATTRIBUTE_MAP[name] ?? name}={${value.trim()}}`);
        continue;
      }

      if (BOOLEAN_ATTRIBUTES.has(name) && (value === '' || value === name)) {
        parts.push(`${ATTRIBUTE_MAP[name] ?? name}`);
        continue;
      }

      const jsxName =
        name.startsWith('data-') || name.startsWith('aria-')
          ? name
          : (ATTRIBUTE_MAP[name] ?? name);

      if (name === 'href') {
        parts.push(`href="${escapeAttribute(rewriteHref(value))}"`);
        continue;
      }

      parts.push(`${jsxName}="${escapeAttribute(value)}"`);
    }

    return parts;
  }

  function serializeNode(node, depth, parent = null) {
    const pad = '  '.repeat(depth);

    if (node.nodeName === '#text') {
      const text = node.value;
      if (!text.trim()) return '';

      // In mixed content (`<strong>x</strong> y`), JSX's own whitespace rules
      // would either drop or invent a space between the element and the text.
      // Emitting an explicit string literal preserves exactly what the HTML
      // parser saw, which is what keeps inline typography 1:1.
      const siblings = parent?.childNodes ?? [];
      const isMixedContent = siblings.some(
        (sibling) => sibling !== node && sibling.nodeName !== '#text',
      );

      if (isMixedContent) {
        const collapsed = text.replace(/\s+/g, ' ');
        return `${pad}{${JSON.stringify(collapsed)}}`;
      }

      return `${pad}${escapeText(text.trim())}`;
    }

    if (node.nodeName === '#comment') {
      const text = node.data.trim();
      return text ? `${pad}{/* ${text.replace(/\*\//g, '*\\/')} */}` : '';
    }

    if (node.nodeName === 'script' || node.nodeName === 'style') return '';

    let tag = node.tagName;
    const attrs = attributesToJsx(node);

    // Internal navigation becomes <Link>: same rendered <a>, client-side routing.
    if (tag === 'a') {
      const href = node.attrs?.find((a) => a.name === 'href')?.value;
      if (href && isInternalLink(href)) {
        tag = 'Link';
        componentImports.add('Link');
      }
    }

    // <img> becomes the shared <Media> wrapper, which supplies intrinsic
    // dimensions from the generated registry.
    if (tag === 'img' && resolveImage) {
      const src = node.attrs?.find((a) => a.name === 'src')?.value;
      const replacement = resolveImage(src, attrs);
      if (replacement) {
        componentImports.add('Media');
        return `${pad}${replacement}`;
      }
    }

    const attrString = attrs.length ? ` ${attrs.join(' ')}` : '';
    const children = (node.childNodes ?? [])
      .map((child) => serializeNode(child, depth + 1, node))
      .filter(Boolean);

    if (VOID_ELEMENTS.has(tag) || (!children.length && tag !== 'textarea')) {
      return `${pad}<${tag}${attrString} />`;
    }

    return `${pad}<${tag}${attrString}>\n${children.join('\n')}\n${pad}</${tag}>`;
  }

  return {
    /** Serializes a list of parsed nodes into JSX source. */
    toJsx(nodes, depth = 0) {
      return nodes
        .map((node) => serializeNode(node, depth, null))
        .filter(Boolean)
        .join('\n');
    },
  };
}

/** Returns the parsed <body> child nodes of a legacy document. */
export function parseBody(html) {
  const document = parse5.parse(html);
  const htmlNode = document.childNodes.find((n) => n.nodeName === 'html');
  const body = htmlNode.childNodes.find((n) => n.nodeName === 'body');
  return body.childNodes;
}
