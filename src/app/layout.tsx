import type { Metadata, Viewport } from 'next';

/* Keep the global foundation before feature CSS Modules. Reversing these
   imports changes the Contact/footer cascade and adds height to that route. */
import '@/shared/styles/globals.css';

import { NewsletterPopup } from '@/features/newsletter';
import { SITE } from '@/shared/config/site';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/shared/seo/JsonLd';
import { TITLE_TEMPLATE } from '@/shared/seo/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: TITLE_TEMPLATE,
  },
  description: SITE.description,
  icons: { icon: SITE.favicon },
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F3F0EA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.locale}>
      <head>
        {/* The body face is on the critical path for every page; the display
            faces are only used below the masthead and can load normally. */}
        <link
          rel="preload"
          href="/assets/fonts/jost-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* The chrome is rendered by each route group's layout, so a page
            gets its masthead and footer from where it lives in app/.
            See docs/ARCHITECTURE.md. */}
        {children}
        <NewsletterPopup />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
