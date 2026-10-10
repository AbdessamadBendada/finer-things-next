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

  /*
   * Production only, and that exception is load-bearing.
   *
   * The directive rewrites every http subresource URL to https before the
   * request is made. In production the site is https and nothing is affected.
   * The dev server is plain http, so the rewrite points every stylesheet,
   * script, font and image at https://localhost:3000, where no TLS listener
   * exists; all of them fail and the page renders as unstyled HTML.
   *
   * It looked like a Safari-only bug because Chrome exempts localhost from
   * the upgrade and WebKit does not. Both are following the spec: the
   * exemption is a Chrome courtesy, not a requirement. Reproduce with
   * Playwright's webkit if this ever comes back.
   */
  ...(process.env.NODE_ENV === 'production' ? [`upgrade-insecure-requests`] : []),
] as const;

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP_DIRECTIVES.join('; ') },

  /*
   * Production only, for the same reason as upgrade-insecure-requests above,
   * but with a longer tail: this one persists in the browser.
   *
   * A two-year HSTS entry for `localhost` makes the browser rewrite every
   * later http://localhost request to https itself, for every project on the
   * machine, long after this header stops being sent. Removing the header
   * does not clear an entry already stored; that has to be done in the
   * browser. The spec says a UA should ignore HSTS over an insecure
   * transport, but not every UA does, and the cost of being wrong is two
   * years of a broken dev server.
   */
  ...(IS_PRODUCTION
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
] as const;
