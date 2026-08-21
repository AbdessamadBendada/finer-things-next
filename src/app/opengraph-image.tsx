import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { SITE } from '@/shared/config/site';

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The default social card, generated at build time in the brand's own
 * typography rather than shipped as a static export nobody can regenerate.
 */
export default async function OpengraphImage() {
  const display = await readFile(
    path.join(process.cwd(), 'public/assets/fonts/goudy-old-style.ttf'),
  );

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#29281F',
        color: '#F3F0EA',
        fontFamily: 'Goudy',
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#B56D43',
        }}
      >
        {SITE.name}
      </div>
      <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>
        Every place should tell a story.
      </div>
      <div style={{ fontSize: 28, color: 'rgba(243,240,234,.62)', maxWidth: 820 }}>
        {SITE.tagline}
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'Goudy', data: display, style: 'normal', weight: 400 }],
    },
  );
}
