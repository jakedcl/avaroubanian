import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsreader',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === 'production'
    ? 'https://avaroubanian.com'
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

const SITE_TITLE = 'Ava Roubanian | Artist & Photographer';
const SITE_DESCRIPTION = 'Photography and artwork by Ava Roubanian.';
const OG_IMAGE =
  'https://cdn.sanity.io/images/z85vvbbq/production/a75e8539fd06cc1558c5c48c5efc0014195d0cd2-1346x1088.png?w=1200&h=630&fit=crop&fm=jpg&q=80';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: '%s | Ava Roubanian',
  },
  description: SITE_DESCRIPTION,
  keywords: ['artist', 'photographer', 'portfolio', 'artwork', 'photography', 'film photography', 'drawings'],
  openGraph: {
    type: 'website',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'Ava Roubanian',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Ava Roubanian' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className={`${newsreader.className} min-h-screen bg-white text-neutral-950`}>
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
