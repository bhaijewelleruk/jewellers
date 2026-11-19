import type { Metadata, Viewport } from 'next';
import { Sora, Bodoni_Moda, Alex_Brush } from 'next/font/google';
import { SITE_CONFIG, SITE_URL } from '@/lib/constants';
import { getCanonicalUrl } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateOrganizationSchema, generateJewelryStoreSchema } from '@/lib/schema';
import { AppShell } from '@/components/shared';
import { ShopProvider } from '@/context/ShopContext';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#120e0b',
};

const soraFont = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
});

const bodoniFont = Bodoni_Moda({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const scriptFont = Alex_Brush({
  variable: '--font-script',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: SITE_CONFIG.titleTemplate,
  },
  description: SITE_CONFIG.defaultDescription,
  keywords: [...SITE_CONFIG.primaryKeywords],
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: getCanonicalUrl('/'),
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${soraFont.variable} ${bodoniFont.variable} ${scriptFont.variable} overflow-x-hidden`} suppressHydrationWarning>
      <body
        className="min-h-screen antialiased flex flex-col bg-[#120e0b] text-[#fbf8f5] selection:bg-[#d8bb93]/30 selection:text-[#fbf8f5] overflow-x-hidden w-full max-w-full"
        suppressHydrationWarning
      >
        {/* Global Structured Data: Organization & Local Store */}
        <JsonLd data={generateOrganizationSchema()} id="organization-schema" />
        <JsonLd data={generateJewelryStoreSchema()} id="store-schema" />
        <ShopProvider>
          <AppShell>
            {children}
          </AppShell>
        </ShopProvider>
      </body>
    </html>
  );
}
