import type { NextConfig } from 'next';

import { LEGACY_REDIRECTS } from './src/shared/config/routes';
import { SECURITY_HEADERS } from './src/shared/config/security-headers';

/**
 * Host-portable configuration.
 *
 * Nothing here is Vercel-specific: `standalone` output runs on any Node host
 * or in a container, and the image pipeline is selected by environment so the
 * same build works on Vercel, Cloudflare or a self-hosted origin.
 * See docs/DEPLOYMENT.md.
 */
const imageLoader = process.env.NEXT_PUBLIC_IMAGE_LOADER ?? 'default';

const nextConfig: NextConfig = {
  // Opt-in: `standalone` produces a self-contained Node server for containers,
  // but it is incompatible with `next start`, which the parity harness uses.
  ...(process.env.BUILD_STANDALONE === '1' ? { output: 'standalone' as const } : {}),
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Widths matched to the site's real breakpoints; avoids generating
    // variants nothing ever requests.
    deviceSizes: [560, 860, 1080, 1368, 1920, 2560],
    unoptimized: imageLoader === 'unoptimized',
    ...(imageLoader === 'cloudflare'
      ? {
          loader: 'custom' as const,
          loaderFile: './src/shared/config/image-loader.cloudflare.ts',
        }
      : {}),
  },

  async redirects() {
    return LEGACY_REDIRECTS.map((redirect) => ({ ...redirect, permanent: true }));
  },

  async headers() {
    return [{ source: '/:path*', headers: [...SECURITY_HEADERS] }];
  },
};

export default nextConfig;
