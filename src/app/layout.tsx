import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'MCSR Ranked Companion',
    template: '%s | MCSR Ranked Companion',
  },
  description: 'Track your Minecraft Speedrun Ranked statistics, matches, and performance',
  keywords: ['minecraft', 'speedrun', 'mcsr', 'ranked', 'statistics'],
  authors: [{ name: 'MCSR Ranked Community' }],
  creator: 'MCSR Ranked Community',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'MCSR Ranked Companion',
    description: 'Track your Minecraft Speedrun Ranked statistics',
    siteName: 'MCSR Ranked Companion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCSR Ranked Companion',
    description: 'Track your Minecraft Speedrun Ranked statistics',
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
        <Providers>
          <div className="relative min-h-screen bg-background">
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
