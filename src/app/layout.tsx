import '../styles/globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: {
    default: 'MCSR Ranked Companion',
    template: '%s | MCSR Ranked Companion',
  },
  description: 'Track statistics, view leaderboards, and watch live matches for MCSR (Minecraft Speedrun) Ranked players.',
  keywords: ['MCSR', 'Minecraft Speedrunning', 'Ranked', 'Statistics', 'Leaderboard', 'Speedrun'],
  authors: [{ name: 'MCSR Ranked Community' }],
  creator: 'MCSR Ranked Community',
  openGraph: {
    type: 'website',
    title: 'MCSR Ranked Companion',
    description: 'Track statistics, view leaderboards, and watch live matches for MCSR (Minecraft Speedrun) Ranked players.',
    siteName: 'MCSR Ranked Companion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCSR Ranked Companion',
    description: 'Track statistics, view leaderboards, and watch live matches for MCSR (Minecraft Speedrun) Ranked players.',
  },
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
      <body className={cn('font-mono antialiased bg-cave')}>
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
      </body>
    </html>
  );
}
