'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Load Inter from Google Fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <title>Ava Roubanian | Artist & Photographer</title>
        <meta name="description" content="Portfolio of visual and audio works by Ava Roubanian." />
        <meta name="keywords" content="artist, photographer, musician, portfolio, artwork, photography, music" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ava Roubanian | Artist, Photographer, Musician" />
        <meta property="og:description" content="Portfolio of Ava Roubanian, featuring artwork, photography, and music projects." />
        <meta property="og:image" content="/images/og-image.jpg" />
      </head>
      <body className={`${inter.className} bg-background text-white`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
