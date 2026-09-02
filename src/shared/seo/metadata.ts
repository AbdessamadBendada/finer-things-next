import type { Metadata } from 'next';

import { imageSize, type RegisteredImage } from '@/shared/config/image-registry';
import { SITE } from '@/shared/config/site';

import { canonicalUrl } from './url';

/**
 * How a page title is branded, in one place.
 *
 * The root layout hands this to Next as `title.template`, and `buildMetadata`
 * applies it by hand for the Open Graph and Twitter titles, which do not
 * inherit the template. Spelling it twice is how those quietly drift apart.
 */
export const TITLE_TEMPLATE = `%s | ${SITE.name}`;

const brandTitle = (title: string) => TITLE_TEMPLATE.replace('%s', title);

export type PageSeo = {
  title: string;
  description: string;
  /** Route path, e.g. `/about`. Used for the canonical URL. */
  path: string;
  /** Approved social preview image; falls back to the generated site card. */
  image?: { src: RegisteredImage; alt: string };
  /** Legal placeholders and the like should stay out of the index. */
  noIndex?: boolean;
  /** Home can use the brand alone without inheriting the root title template. */
  absoluteTitle?: boolean;
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
  absoluteTitle = false,
}: PageSeo): Metadata {
  const url = canonicalUrl(path);
  const resolvedTitle = absoluteTitle ? title : brandTitle(title);
  const socialImage = image
    ? { url: image.src, alt: image.alt, ...imageSize(image.src) }
    : { url: '/opengraph-image', alt: resolvedTitle, width: 1200, height: 630 };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: SITE.ogLocale,
      title: resolvedTitle,
      description,
      url,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [{ url: socialImage.url, alt: socialImage.alt }],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
