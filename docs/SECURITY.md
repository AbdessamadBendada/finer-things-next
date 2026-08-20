# Security

The site is a static marketing brochure with two public form endpoints. That
shapes the threat model: there is no authentication, no session, no user
content rendered back to other visitors. The realistic risks are script
injection through a dependency and abuse of the form endpoints.

## Content Security Policy

Set as static headers from `next.config.ts`
(`src/shared/config/security-headers.ts`):

```
default-src 'self';
script-src  'self' 'unsafe-inline';
style-src   'self' 'unsafe-inline';
img-src     'self' data: blob:;
media-src   'self';
font-src    'self';
connect-src 'self';
form-action 'self';
frame-ancestors 'none';
frame-src   'none';
base-uri    'self';
object-src  'none';
upgrade-insecure-requests;
```

### Why not a nonce

A nonce-based policy with `strict-dynamic` was implemented first, and it broke
the site. Next serves the RSC payload as inline `<script>` tags; on a
statically generated page those are baked into the HTML at build time, so they
cannot carry a per-request nonce. With `strict-dynamic` in force, `'self'` is
ignored and **every script on the page was refused** — verified in Chromium:
11 CSP violations, no hydration, and zero of 26 reveal elements ever shown.

The only way to make a nonce work is to render every page per request, which
would convert twelve static pages into twelve dynamic ones and give up the
site's entire caching story for a marketing brochure with no user-specific
content.

So the trade-off was taken the other way: keep the pages static and allow
inline scripts. What that gives up is protection against an attacker who can
already inject markup into the page. What it keeps is everything else —
**no external script origin can load, `eval` is unavailable, no plugins, no
framing, no form posting off-origin.** For a site that renders no
user-supplied content, the residual risk is small and the caching benefit is
real.

If the calculus changes — an embed, a third-party script, anything that
renders user input — revisit this. The nonce implementation is straightforward
to restore; it just requires accepting dynamic rendering.

Every `*-src` directive is otherwise locked to `'self'`, which is possible
because **the site loads nothing from anywhere else**. Jost was previously
fetched from Google Fonts; it is now self-hosted alongside Goudy and Rodetta,
which removed the last external origin. There are no analytics, no tag
managers, no embeds.

`style-src` also allows `'unsafe-inline'`, because React writes inline `style`
attributes — the pages animate by setting CSS custom properties on elements —
and `style-src-attr` has no nonce mechanism either.

### JSON-LD

Structured data is emitted as `<script type="application/ld+json">`. CSP's
`script-src` does not apply to non-JavaScript data blocks, so no nonce is
needed. The serialised JSON escapes `<` to `<` regardless, and is built
from typed objects we construct — no user input reaches it.

## Other headers

| Header                                | Value                                          | Why                                                                   |
| ------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| `Strict-Transport-Security`           | `max-age=63072000; includeSubDomains; preload` | ignored by browsers over plain http, so it is safe to send everywhere |
| `X-Frame-Options` / `frame-ancestors` | `DENY` / `'none'`                              | no clickjacking surface                                               |
| `X-Content-Type-Options`              | `nosniff`                                      |                                                                       |
| `Referrer-Policy`                     | `strict-origin-when-cross-origin`              |                                                                       |
| `Permissions-Policy`                  | camera, microphone, geolocation denied         | the site needs none of them                                           |
| `Cross-Origin-Opener-Policy`          | `same-origin`                                  |                                                                       |

## Trust boundaries

**The Server Action is the boundary.** Client-side validation is UX. Every
action re-parses `FormData` with the same Zod schema before anything else
happens, and length caps in the schema are what bound the payload.

**Environment is validated at boot.** `shared/config/env.ts` parses
`process.env` with Zod, so a misconfigured deployment fails immediately and
loudly rather than at the first submission. Server-only values are never
importable from client code — `server-only` enforces it at build time.

**No PII in logs.** The logger takes an event name, a correlation id and a
`context` object, and the rule for `context` is that it must not contain
personal data. The enquiry adapter logs the selected service and the message
_length_; never the name, address or body. `createLoggingProvider` defaults to
logging nothing from the payload — a feature has to opt in explicitly.

Errors log `error.message` only, never a stack, since a stack can contain the
payload.

## Rate limiting

Deliberately not in application code — it lives at the CDN, where it costs
nothing per request and cannot be bypassed by hitting the origin. The rules to
configure are documented in [DEPLOYMENT.md](DEPLOYMENT.md) so they stay
version-controlled even though they are not code.

## Known gaps

These are decisions, not oversights, and each has an ADR:

1. **No consent checkbox** on the enquiry form
   ([adr/0002](adr/0002-deferred-compliance.md)). The passive notice inherited
   from the legacy site is not GDPR-defensible. **Must be resolved before a
   real provider is connected.**
2. **No newsletter double opt-in** (same ADR).
3. **No bot protection beyond the honeypot**
   ([adr/0003](adr/0003-deferred-bot-protection.md)). Turnstile drops into the
   existing `BotProtection` port when wanted.
4. **Legal pages are placeholder text.** They are `noindex` and excluded from
   the sitemap, and must be replaced by counsel before launch.
5. **`script-src` allows `'unsafe-inline'`** — the static-rendering trade-off
   described above ([adr/0005](adr/0005-static-csp.md)).

## Verifying the policy

`tools/check-csp.mjs` loads a built page in Chromium and reports CSP
violations, hydration state and how many reveal elements actually appeared.
Run it after any change to the headers:

```bash
pnpm build && pnpm start --port 3100 &
node tools/check-csp.mjs http://localhost:3100/about
```

It is what caught the nonce failure, and a policy change that silently breaks
scripts looks exactly like a page that renders fine until you scroll.

## Reporting

Anything found in this codebase should go to the maintainer directly rather
than into a public issue.
