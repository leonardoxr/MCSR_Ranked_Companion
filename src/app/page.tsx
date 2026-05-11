import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { HomePageClient } from '@/components/features/HomePageClient';

export const metadata: Metadata = {
  title: 'MCSR Ranked Leaderboard - Minecraft Speedrun Rankings & Statistics',
  description:
    'View the official MCSR Ranked leaderboard featuring top Minecraft speedrunners. Track player rankings, ELO ratings, win rates, and season statistics. Search for any player to see their complete speedrun history.',
  keywords: [
    'MCSR',
    'Minecraft Speedrun',
    'MCSR Ranked',
    'Minecraft Ranked',
    'Speedrun Leaderboard',
    'Minecraft Rankings',
    'Speedrun Statistics',
    'ELO Rating',
    'Minecraft Competition',
    'Speedrunning',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'MCSR Ranked Leaderboard - Minecraft Speedrun Rankings',
    description:
      'View the official MCSR Ranked leaderboard featuring top Minecraft speedrunners. Track player rankings, ELO ratings, and season statistics.',
    url: SITE_URL,
    siteName: 'MCSR Ranked Companion',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/icon.png`,
        width: 512,
        height: 512,
        alt: 'MCSR Ranked Companion Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCSR Ranked Leaderboard - Minecraft Speedrun Rankings',
    description:
      'View the official MCSR Ranked leaderboard featuring top Minecraft speedrunners. Track player rankings and statistics.',
    images: [`${SITE_URL}/icon.png`],
  },
};

// JSON-LD structured data for the leaderboard page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MCSR Ranked Companion',
  description:
    'Track statistics, view leaderboards, and watch live matches for MCSR (Minecraft Speedrun) Ranked players.',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/player/{search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'MCSR Ranked Community',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.png`,
    },
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
