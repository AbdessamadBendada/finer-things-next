import type { Metadata } from 'next';

import { SITE } from '@/shared/config/site';

export type PageSeo = {
  title: string;
  description: string;
  /** Route path, e.g. `/about`. Used for the canonical URL. */
  path: string;
  /** Social preview image; falls back to the site default. */
  image?: string;
  /** Legal placeholders and the like should stay out of the index. */
  noIndex?: boolean;
};

/**
 * The only place page metadata is constructed.
 *
 * Centralising it means canonicals, Open Graph and Twitter cards can never
 * drift apart per page, and a change to the social card format is one edit.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageSeo): Metadata {
  const url = new URL(path, SITE.url).toString();
  const ogImage = image ?? '/opengraph-image';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: SITE.ogLocale,
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
