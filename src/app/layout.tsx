import type { Metadata } from 'next';
import { Newsreader } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import SiteShell from '@/components/SiteShell';

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ava Roubanian | Artist & Photographer',
    template: '%s | Ava Roubanian',
  },
  description: 'Portfolio of visual and audio works by Ava Roubanian.',
  keywords: [
    'artist',
    'photographer',
    'musician',
    'portfolio',
    'artwork',
    'photography',
    'music',
  ],
  openGraph: {
    type: 'website',
    title: 'Ava Roubanian | Artist, Photographer, Musician',
    description:
      'Portfolio of Ava Roubanian, featuring artwork, photography, and music projects.',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${newsreader.className} min-h-screen bg-white text-neutral-950`}>
        <Suspense fallback={<div className="min-h-screen bg-white" aria-hidden />}>
          <SiteShell>{children}</SiteShell>
        </Suspense>
      </body>
    </html>
  );
}
