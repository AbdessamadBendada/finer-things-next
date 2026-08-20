import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * OpenNext adapter configuration.
 *
 * The site is entirely statically generated, so there is no incremental cache
 * to configure — the only server work is the two form Server Actions, which
 * run per request and cache nothing.
 *
 * If ISR or on-demand revalidation is ever added, this is where the R2 or KV
 * incremental cache would be wired in. See docs/DEPLOYMENT.md.
 */
export default defineCloudflareConfig();
