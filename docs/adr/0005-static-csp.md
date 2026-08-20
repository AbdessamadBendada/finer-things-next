# 0005 — Static security headers instead of a nonce

**Status:** accepted · **Date:** 2026-08-19

## Context

The plan called for a strict, nonce-based Content Security Policy applied in
middleware. That was implemented first: `script-src 'self' 'nonce-{random}'
'strict-dynamic'`, with the nonce generated per request and set on both the
request and response headers, which is the documented Next approach.

It broke the site.

## What actually happened

Next serves the RSC payload as inline `<script>` tags. On a statically
generated page those are written into the HTML at build time, so they cannot
carry a per-request nonce. `strict-dynamic` causes `'self'` to be ignored for
scripts, so with no nonce present **every script on the page was refused**.

Verified in Chromium against the built site:

```
CSP violations: 11
body.ready: false | revealed: 0 / 26
```

The page rendered its above-the-fold markup and was completely inert below it
— the failure mode that is easiest to miss in review, because the top of the
page looks perfect.

The only way to make the nonce work is to read it at render time, which opts
every route into dynamic rendering: twelve static pages become twelve
per-request renders, discarding the site's entire caching story.

## Decision

Serve the security headers as static headers from `next.config.ts`, and allow
`'unsafe-inline'` in `script-src`. Delete the middleware.

## Why this is acceptable here

The site renders no user-supplied content. There is no authentication, no
session, and nothing an attacker can persist into a page another visitor
loads. `'unsafe-inline'` protects against an attacker who can already inject
markup — a capability that would require a separate vulnerability this site
does not have.

Everything else in the policy stays strict, and remains meaningful:
no external script origin can load, `eval` is unavailable, `object-src` and
`frame-src` are `'none'`, `frame-ancestors` is `'none'`, and `form-action` is
same-origin.

## Consequences

- The pages stay static, and headers cost nothing per request — which also
  removes an edge function from the Cloudflare and Vercel deployments.
- `script-src` is weaker than planned. Recorded as a known gap in SECURITY.md.
- **This must be revisited if the site ever renders user input, embeds a
  third party, or adds an analytics tag.** At that point the nonce approach
  should return, and dynamic rendering becomes the price.
- `tools/check-csp.mjs` exists so this class of failure is caught by running a
  command rather than by a visitor noticing the page does not animate.
