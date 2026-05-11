import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { EloTimelinePageClient } from '@/components/features/EloTimelinePageClient';

export const metadata: Metadata = {
  title: 'ELO Timeline - Top Player Rankings Over Time | MCSR Ranked',
  description:
    'Visualize the ELO progression of top MCSR Ranked players over time. Track how the best Minecraft speedrunners climb the leaderboard with interactive charts.',
  keywords: [
    'MCSR',
    'Minecraft Speedrun',
    'ELO Timeline',
    'ELO History',
    'Ranking Chart',
    'Leaderboard History',
    'Player Progression',
    'Speedrun Statistics',
  ],
  alternates: {
    canonical: `${SITE_URL}/elo-timeline`,
  },
  openGraph: {
    title: 'ELO Timeline - Top Player Rankings Over Time',
    description:
      'Visualize the ELO progression of top MCSR Ranked players over time with interactive charts.',
    url: `${SITE_URL}/elo-timeline`,
    siteName: 'MCSR Ranked Companion',
    type: 'website',
    locale: 'en_US',
  },
};

export default function EloTimelinePage() {
  return <EloTimelinePageClient />;
}
