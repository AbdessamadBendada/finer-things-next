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
 *
 * `sizes` is how next/image decides which file to send, and it has to describe
 * the space the image actually occupies. The default here used to be `100vw`,
 * which told the optimizer every image filled the viewport: a 163px collage
 * cell was served a 1279px file, roughly sixty times the pixels it could show,
 * and the reveal animation ran while the picture was still arriving.
 *
 * The default is now a conservative half-viewport, and call sites that differ
 * pass their own. Anything genuinely full-bleed must say so explicitly.
 */
export function Media({
  src,
  alt,
  sizes = '(max-width: 860px) 100vw, 50vw',
  ...rest
}: MediaProps) {
  const { width, height } = imageSize(src);
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} {...rest} />;
}
