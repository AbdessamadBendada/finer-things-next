/**
 * Security headers, applied to every response by next.config.ts.
 *
 * These are static rather than middleware-generated, and that is a deliberate
 * decision with a trade-off behind it — see docs/SECURITY.md, "Why not a
 * nonce". The short version: Next renders the RSC payload as inline
 * `<script>` tags, so a nonce-based policy requires per-request rendering,
 * which would turn twelve statically generated pages into twelve dynamic
 * ones. Static headers keep the site static and cost nothing per request.
 */

const CSP_DIRECTIVES = [
  `default-src 'self'`,

  // 'unsafe-inline' covers Next's inline RSC payload scripts. It is the one
  // relaxation in this policy; external script origins remain forbidden, so
  // an injected <script src> from another host is still blocked, as is eval.
  `script-src 'self' 'unsafe-inline'`,

  // React writes inline style attributes (the pages animate through CSS
  // custom properties) and style-src-attr has no nonce mechanism.
  `style-src 'self' 'unsafe-inline'`,

  // data: for blur placeholders, blob: for the image optimizer.
  `img-src 'self' data: blob:`,
  `media-src 'self'`,
  `font-src 'self'`,
  `connect-src 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `frame-src 'none'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
];

export const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP_DIRECTIVES.join('; ') },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
] as const;
