import Image, { type ImageProps } from 'next/image';

import { imageSize, type RegisteredImage } from '@/shared/config/image-registry';

type MediaProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'alt'> & {
  /** Must exist in the generated registry — unknown paths fail the build. */
  src: RegisteredImage;
  alt: string;
};

/**
 * The single image primitive for the site.
 *
 * Intrinsic dimensions come from the generated registry rather than being
 * repeated at every call site, which keeps CLS at zero without asking authors
 * to look up pixel sizes. Layout is still governed entirely by the page
 * stylesheets (`img { width:100%; height:100%; object-fit:cover }`), so the
 * rendered result matches the legacy markup exactly.
 */
export function Media({ src, alt, sizes = '100vw', ...rest }: MediaProps) {
  const { width, height } = imageSize(src);
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} {...rest} />;
}
