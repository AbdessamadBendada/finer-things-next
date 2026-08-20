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

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://finerthings.com'),
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

export const serverEnv = parsedServer.data;
export const clientEnv = parsedClient.data;
