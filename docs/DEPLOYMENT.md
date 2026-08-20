# Deployment

The build is deliberately host-agnostic. There are no `@vercel/*` packages —
a lint rule blocks them — and no platform-specific APIs. Changing target is a
configuration change, never a code change.

## Environment

Copy `.env.example` to `.env.local`. Every value has a working default; all of
them are parsed by `src/shared/config/env.ts` at boot, which fails loudly if
anything is wrong.

| Variable                   | Values                                     | Effect                          |
| -------------------------- | ------------------------------------------ | ------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | URL                                        | canonicals, Open Graph, sitemap |
| `NEXT_PUBLIC_IMAGE_LOADER` | `default` \| `cloudflare` \| `unoptimized` | image pipeline                  |
| `FORM_PROVIDER`            | `log` \| `noop`                            | where submissions go            |
| `BOT_PROTECTION`           | `noop`                                     | abuse control strategy          |

## Vercel

```
Build:  pnpm build
Env:    NEXT_PUBLIC_SITE_URL=https://…
        NEXT_PUBLIC_IMAGE_LOADER=default
```

Everything works as shipped. The image optimizer and Server Actions are
standard Next features, and the security headers are static so there is no
edge function to configure.

## Cloudflare Workers

Already configured: `wrangler.jsonc`, `open-next.config.ts` and the
`cf:*` scripts are committed.

**Dashboard settings** — the defaults Cloudflare detects are wrong for this
project and will fail:

| Setting                | Value                                    |
| ---------------------- | ---------------------------------------- |
| Build command          | `pnpm run cf:build`                      |
| Deploy command         | `pnpm run cf:deploy`                     |
| Build output directory | _(leave empty — wrangler.jsonc decides)_ |

Locally:

```bash
pnpm cf:build      # next build + the OpenNext worker bundle
pnpm cf:preview    # run the worker locally on workerd
pnpm cf:deploy     # push it to Cloudflare
```

Images route through `/cdn-cgi/image/` via
`src/shared/config/image-loader.cloudflare.ts`, since the Next optimizer does
not run on Workers — `NEXT_PUBLIC_IMAGE_LOADER=cloudflare` is set in
`wrangler.jsonc`. **Enable Images on the zone**, or images 404.

### Two things that will bite you

**1. pnpm's `allowBuilds`.** pnpm 10+ refuses to run a dependency's install
scripts unless it is listed in `pnpm-workspace.yaml`, and it writes literal
placeholders on first install:

```yaml
allowBuilds:
  esbuild: set this to true or false # unanswered = ignored
  workerd: set this to true or false
```

Left unanswered, `workerd` never downloads its binary, wrangler cannot start,
and the deploy fails _after_ a green build with
`ERR_PNPM_IGNORED_BUILDS`. They are answered in the committed file; if you add
a dependency with install scripts, answer it there too.

**2. `dynamicParams = false`.** Setting it on the `[slug]` routes makes the
worker return 404 for the prerendered project and service pages. The routes
call `notFound()` for unknown slugs anyway, so the flag is deliberately absent.

### Verifying before you deploy

```bash
pnpm cf:build && pnpm cf:preview
```

Then check a dynamic route, a redirect and a form — those are the three things
that behave differently on Workers than in `next start`:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8788/projects/marsa-al-arab  # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8788/about.html              # 308
```

## Self-hosted (Node or Docker)

```
BUILD_STANDALONE=1 pnpm build
node .next/standalone/server.js
```

`standalone` is opt-in because it is incompatible with `next start`, which the
parity harness uses. Copy `public/` and `.next/static/` next to the server
output as usual, and install `sharp` for image optimization.

## Rate limiting (do this at the CDN)

Not in application code by design — see
[adr/0003](adr/0003-deferred-bot-protection.md). Configure these rules on
whichever edge sits in front of the site:

| Path                  | Limit | Window | Action                    |
| --------------------- | ----- | ------ | ------------------------- |
| `POST /contact`       | 5     | 10 min | block, per IP             |
| `POST /` (newsletter) | 3     | 10 min | block, per IP             |
| any `POST`            | 30    | 1 min  | managed challenge, per IP |

These numbers are recorded here so they stay version-controlled even though
they are configured outside the repo. On Cloudflare, add Turnstile at the same
time and implement the `BotProtection` port.

## Caching

All twelve pages are statically generated. Immutable assets under
`/_next/static` and `/assets` should be served with a long `max-age`; HTML
should be revalidated. Most hosts do this correctly by default.

## Before the first production deploy

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] Legal pages replaced with reviewed text
- [ ] Consent checkbox implemented ([adr/0002](adr/0002-deferred-compliance.md))
- [ ] A real `FORM_PROVIDER` connected and a test enquiry received
- [ ] Edge rate-limit rules applied
- [ ] `pnpm verify` green
