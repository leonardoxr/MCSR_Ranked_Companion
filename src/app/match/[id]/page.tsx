import type { Metadata } from 'next';
import { MatchPageClient } from '@/components/features/MatchPageClient';

const BASE_URL = 'https://mcsr-ranked-companion.vercel.app';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Fetch match data for metadata generation
async function getMatchData(matchId: string) {
  try {
    const response = await fetch(
      `https://api.mcsrranked.com/matches/${encodeURIComponent(matchId)}`,
      { next: { revalidate: 3600 } } // Revalidate every hour (matches don't change)
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch {
    return null;
  }
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchData(id);

  if (!match) {
    return {
      title: `Match #${id} - Not Found`,
      description: `Match #${id} was not found on MCSR Ranked.`,
    };
  }

  const players = match.players || [];
  const playerNames = players.map((p: { nickname: string }) => p.nickname).join(' vs ');
  const winner = match.result;
  const winnerPlayer = winner?.uuid
    ? players.find((p: { uuid: string }) => p.uuid === winner.uuid)
    : null;

  const matchDate = new Date(match.date * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let description = `MCSR Ranked Match #${id}: ${playerNames}.`;

  if (winnerPlayer && winner?.time) {
    description += ` Winner: ${winnerPlayer.nickname} (${formatTime(winner.time)}).`;
  } else if (match.forfeited) {
    description += ' Match was forfeited.';
  }

  description += ` Season ${match.season}, ${match.category} category. Played on ${matchDate}.`;

  const matchUrl = `${BASE_URL}/match/${id}`;

  return {
    title: `Match #${id}: ${playerNames} - MCSR Ranked`,
    description,
    keywords: [
      'MCSR',
      'Minecraft Speedrun',
      'Match',
      'Ranked Match',
      ...players.map((p: { nickname: string }) => p.nickname),
    ],
    alternates: {
      canonical: matchUrl,
    },
    openGraph: {
      title: `Match #${id}: ${playerNames} | MCSR Ranked`,
      description,
      url: matchUrl,
      siteName: 'MCSR Ranked Companion',
      type: 'article',
      publishedTime: new Date(match.date * 1000).toISOString(),
    },
    twitter: {
      card: 'summary',
      title: `Match #${id}: ${playerNames} | MCSR Ranked`,
      description,
    },
  };
}

// Generate JSON-LD structured data for the match
function generateMatchJsonLd(matchId: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `MCSR Ranked Match #${matchId}`,
    url: `${BASE_URL}/match/${matchId}`,
    organizer: {
      '@type': 'Organization',
      name: 'MCSR Ranked',
    },
    sport: 'Minecraft Speedrunning',
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
          name: `Match #${matchId}`,
          item: `${BASE_URL}/match/${matchId}`,
        },
      ],
    },
  };
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const jsonLd = generateMatchJsonLd(id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MatchPageClient />
    </>
  );
}
