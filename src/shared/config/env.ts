import { z } from 'zod';

/**
 * Environment parsed once, at module load, so a misconfigured deployment
 * fails loudly at boot instead of silently at the first form submission.
 *
 * Server-only values must never be read from a Client Component; the
 * `server-only` boundary is enforced by lint rules (see docs/SECURITY.md).
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  /** Which delivery adapter handles enquiries and subscriptions. */
  FORM_PROVIDER: z.enum(['log', 'noop']).default('log'),

  /** Bot protection. Deferred to Cloudflare — see docs/adr/0003-deferred-bot-protection.md */
  BOT_PROTECTION: z.enum(['noop']).default('noop'),
});

/*
 * The development origin, and deliberately not a plausible production domain.
 *
 * This used to default to `https://finerthings.com`, which nobody had
 * confirmed. A wrong-but-believable origin is the worst kind: canonicals,
 * `og:url`, the sitemap and JSON-LD would all have shipped pointing at a
 * domain we do not own, and nothing on the page would have looked broken.
 * localhost is obviously wrong the moment it reaches anything public, which
 * is the point. The real origin is SEO-01 in docs/SEO-LAUNCH-ACTION-PLAN.md.
 */
const DEV_SITE_URL = 'http://localhost:3000';

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default(DEV_SITE_URL),
  NEXT_PUBLIC_IMAGE_LOADER: z.enum(['default', 'cloudflare', 'unoptimized']).default('default'),
});

const parsedServer = serverSchema.safeParse(process.env);
if (!parsedServer.success) {
  throw new Error(`Invalid server environment:\n${z.prettifyError(parsedServer.error)}`);
}

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_IMAGE_LOADER: process.env.NEXT_PUBLIC_IMAGE_LOADER,
});
if (!parsedClient.success) {
  throw new Error(`Invalid public environment:\n${z.prettifyError(parsedClient.error)}`);
}

/*
 * Say so, loudly, if a production build has no real origin. This is a warning
 * rather than a throw so `pnpm build` and the test suite still run locally
 * without a `.env.local`; the launch gate is SEO-01, not this file.
 */
if (parsedServer.data.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    `\n[env] NEXT_PUBLIC_SITE_URL is not set. Falling back to ${DEV_SITE_URL}.\n` +
      '[env] Canonical URLs, og:url, the sitemap and JSON-LD will all point there.\n' +
      '[env] Set it to the confirmed production origin before deploying.\n',
  );
}

export const serverEnv = parsedServer.data;
export const clientEnv = parsedClient.data;
