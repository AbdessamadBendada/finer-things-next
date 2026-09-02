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
  trailingSlash: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Widths matched to the site's real breakpoints; avoids generating
    // variants nothing ever requests.
    deviceSizes: [560, 860, 1080, 1368, 1920, 2560],
    /*
     * The small end, and the reason images were arriving far too large.
     *
     * next/image picks the first candidate at or above the width `sizes`
     * implies, and with no `imageSizes` the smallest available was 560. A
     * collage cell asking for 30vw of a 1440 viewport needs about 432px, so
     * it was served 1368 instead: roughly sixty times the pixels it could
     * show, and the reveal animation ran while the file was still arriving.
     *
     * These are the widths the grids and cells on this site actually occupy.
     */
    imageSizes: [128, 200, 280, 360, 440],
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
