import type { Metadata } from 'next';
import { LivePageClient } from '@/components/features/LivePageClient';

const BASE_URL = 'https://mcsr-ranked-companion.vercel.app';

export const metadata: Metadata = {
  title: 'Live Matches - Watch MCSR Ranked Speedruns in Real-Time',
  description:
    'Watch live Minecraft speedrun matches happening right now on MCSR Ranked. See real-time progress, player streams, and match statistics as top speedrunners compete.',
  keywords: [
    'MCSR Live',
    'Minecraft Speedrun Live',
    'Live Matches',
    'Speedrun Streams',
    'MCSR Ranked',
    'Real-Time Speedruns',
    'Watch Speedruns',
  ],
  alternates: {
    canonical: `${BASE_URL}/live`,
  },
  openGraph: {
    title: 'Live Matches - Watch MCSR Ranked Speedruns',
    description:
      'Watch live Minecraft speedrun matches happening right now on MCSR Ranked. Real-time progress and player streams.',
    url: `${BASE_URL}/live`,
    siteName: 'MCSR Ranked Companion',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Live Matches - MCSR Ranked',
    description: 'Watch live Minecraft speedrun matches happening right now on MCSR Ranked.',
  },
};

// JSON-LD structured data for live matches
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'MCSR Ranked Live Matches',
  description: 'Watch live Minecraft speedrun matches happening right now.',
  url: `${BASE_URL}/live`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Leaderboard',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Live Matches',
        item: `${BASE_URL}/live`,
      },
    ],
  },
};

export default function LiveMatchesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LivePageClient />
    </>
  );
}
