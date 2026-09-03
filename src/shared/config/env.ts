import { z } from 'zod';

/**
 * Environment parsed once, at module load, so a misconfigured deployment
 * fails loudly at boot instead of silently at the first form submission.
 *
 * Server-only values must never be read from a Client Component; the
 * `server-only` boundary is enforced by lint rules (see docs/SECURITY.md).
 */
const serverSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    /** Which adapter handles contact enquiries. */
    FORM_PROVIDER: z.enum(['log', 'noop', 'resend']).default('log'),

    /** Bot protection. Deferred to Cloudflare — see docs/adr/0003-deferred-bot-protection.md */
    BOT_PROTECTION: z.enum(['noop']).default('noop'),

    /**
     * Which adapter handles newsletter subscriptions. Separate from
     * `FORM_PROVIDER` on purpose: an enquiry can go live as soon as a mailbox
     * exists, while a subscription cannot until consent and double opt-in do.
     * Tying both to one switch would mean turning on list collection as a side
     * effect of turning on the contact form.
     */
    NEWSLETTER_PROVIDER: z.enum(['log', 'noop', 'mailerlite']).default('log'),

    /** MailerLite credentials. Required only when `NEWSLETTER_PROVIDER=mailerlite`. */
    MAILERLITE_API_KEY: z.string().min(1).optional(),
    MAILERLITE_GROUP_ID: z.string().min(1).optional(),

    /** Resend API key. Required only when `FORM_PROVIDER=resend`. */
    RESEND_API_KEY: z.string().min(1).optional(),

    /** Where enquiries land. Required only when `FORM_PROVIDER=resend`. */
    ENQUIRY_TO: z.string().email().optional(),

    /**
     * The sender. `onboarding@resend.dev` is Resend's sandbox address: it works
     * with no DNS setup, but it will only deliver to the address the Resend
     * account was opened with. A real `studio@` sender needs the production
     * domain verified in Resend, which is SEO-01 and adr/0002 territory.
     */
    ENQUIRY_FROM: z.string().min(1).default('Finer Things <onboarding@resend.dev>'),
  })
  /*
   * A missing key is a boot failure rather than a silent non-delivery. An
   * enquiry that is accepted by the form and then quietly dropped is the worst
   * outcome this file can allow: nobody finds out until a client asks why they
   * were ignored.
   */
  .superRefine((env, ctx) => {
    if (env.FORM_PROVIDER !== 'resend') return;
    if (!env.RESEND_API_KEY) {
      ctx.addIssue({
        code: 'custom',
        path: ['RESEND_API_KEY'],
        message: 'FORM_PROVIDER=resend requires RESEND_API_KEY.',
      });
    }
    if (!env.ENQUIRY_TO) {
      ctx.addIssue({
        code: 'custom',
        path: ['ENQUIRY_TO'],
        message: 'FORM_PROVIDER=resend requires ENQUIRY_TO.',
      });
    }
  })
  .superRefine((env, ctx) => {
    if (env.NEWSLETTER_PROVIDER !== 'mailerlite') return;
    if (!env.MAILERLITE_API_KEY) {
      ctx.addIssue({
        code: 'custom',
        path: ['MAILERLITE_API_KEY'],
        message: 'NEWSLETTER_PROVIDER=mailerlite requires MAILERLITE_API_KEY.',
      });
    }
    if (!env.MAILERLITE_GROUP_ID) {
      ctx.addIssue({
        code: 'custom',
        path: ['MAILERLITE_GROUP_ID'],
        message: 'NEWSLETTER_PROVIDER=mailerlite requires MAILERLITE_GROUP_ID.',
      });
    }
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
