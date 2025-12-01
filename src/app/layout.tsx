import '../styles/globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';

const BASE_URL = 'https://mcsr-ranked-companion.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MCSR Ranked Companion - Minecraft Speedrun Rankings & Statistics',
    template: '%s | MCSR Ranked Companion',
  },
  description:
    'Track statistics, view leaderboards, and watch live matches for MCSR (Minecraft Speedrun) Ranked players. Search for players, view ELO ratings, match history, and more.',
  keywords: [
    'MCSR',
    'Minecraft Speedrunning',
    'Ranked',
    'Statistics',
    'Leaderboard',
    'Speedrun',
    'Minecraft',
    'ELO Rating',
    'Match History',
    'Live Matches',
    'Speedrun Rankings',
  ],
  authors: [{ name: 'MCSR Ranked Community' }],
  creator: 'MCSR Ranked Community',
  publisher: 'MCSR Ranked Community',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: 'MCSR Ranked Companion - Minecraft Speedrun Rankings',
    description:
      'Track statistics, view leaderboards, and watch live matches for MCSR (Minecraft Speedrun) Ranked players.',
    siteName: 'MCSR Ranked Companion',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'MCSR Ranked Companion Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCSR Ranked Companion - Minecraft Speedrun Rankings',
    description:
      'Track statistics, view leaderboards, and watch live matches for MCSR (Minecraft Speedrun) Ranked players.',
    images: ['/icon.png'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: BASE_URL,
  },
  category: 'gaming',
  classification: 'Minecraft Speedrunning Statistics',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/icons/icons-minecraft-229.css" />
      </head>
      <body className={cn('font-mono antialiased bg-obsidian')}>
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4130479240951623"
          crossOrigin="anonymous"
        />
        <Providers>
          <div className="relative min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
              {children}
            </main>
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
