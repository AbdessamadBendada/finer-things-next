/**
 * Cloudflare Images loader.
 *
 * Only referenced when NEXT_PUBLIC_IMAGE_LOADER=cloudflare. Keeping the
 * loader in userland is what makes the image pipeline host-agnostic.
 */
type LoaderArgs = { src: string; width: number; quality?: number };

export default function cloudflareLoader({ src, width, quality }: LoaderArgs): string {
  const params = [`width=${width}`, `quality=${quality ?? 80}`, 'format=auto'];
  const normalized = src.startsWith('/') ? src.slice(1) : src;
  return `/cdn-cgi/image/${params.join(',')}/${normalized}`;
}
