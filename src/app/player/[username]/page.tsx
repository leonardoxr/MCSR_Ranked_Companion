import type { Metadata } from 'next';
import { PlayerPageClient } from '@/components/features/PlayerPageClient';

const BASE_URL = 'https://mcsr-ranked-companion.vercel.app';

interface PageProps {
  params: Promise<{ username: string }>;
}

// Fetch player data for metadata generation
async function getPlayerData(username: string) {
  try {
    const response = await fetch(
      `https://api.mcsrranked.com/users/${encodeURIComponent(username)}`,
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const player = await getPlayerData(username);

  if (!player) {
    return {
      title: `${username} - Player Not Found`,
      description: `The player "${username}" was not found on MCSR Ranked.`,
    };
  }

  const eloRate = player.eloRate ?? player.elo_rate;
  const eloRank = player.eloRank ?? player.elo_rank;
  const seasonWins = player.statistics?.season?.wins?.ranked ?? 0;
  const seasonLosses = player.statistics?.season?.loses?.ranked ?? 0;
  const totalMatches = seasonWins + seasonLosses;
  const winRate = totalMatches > 0 ? ((seasonWins / totalMatches) * 100).toFixed(1) : '0';

  const description = eloRate
    ? `${player.nickname}'s MCSR Ranked stats: ${eloRate} ELO${eloRank ? ` (Rank #${eloRank})` : ''}, ${seasonWins}W/${seasonLosses}L (${winRate}% win rate). View match history, ELO progression, and achievements.`
    : `View ${player.nickname}'s MCSR Ranked profile. Check match history, statistics, and achievements on MCSR Ranked Companion.`;

  const playerUrl = `${BASE_URL}/player/${encodeURIComponent(username)}`;
  const avatarUrl = `https://crafatar.com/avatars/${player.uuid}?size=256&overlay`;

  return {
    title: `${player.nickname}${eloRate ? ` - ${eloRate} ELO` : ''} - MCSR Ranked Stats`,
    description,
    keywords: [
      player.nickname,
      'MCSR',
      'Minecraft Speedrun',
      'Speedrunner Stats',
      'ELO Rating',
      'Match History',
      'MCSR Ranked',
    ],
    alternates: {
      canonical: playerUrl,
    },
    openGraph: {
      title: `${player.nickname}${eloRate ? ` - ${eloRate} ELO` : ''} | MCSR Ranked`,
      description,
      url: playerUrl,
      siteName: 'MCSR Ranked Companion',
      type: 'profile',
      images: [
        {
          url: avatarUrl,
          width: 256,
          height: 256,
          alt: `${player.nickname}'s Minecraft avatar`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${player.nickname}${eloRate ? ` - ${eloRate} ELO` : ''} | MCSR Ranked`,
      description,
      images: [avatarUrl],
    },
  };
}

// Generate JSON-LD structured data for the player
function generatePlayerJsonLd(username: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: username,
      url: `${BASE_URL}/player/${encodeURIComponent(username)}`,
    },
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
          name: username,
          item: `${BASE_URL}/player/${encodeURIComponent(username)}`,
        },
      ],
    },
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { username } = await params;
  const jsonLd = generatePlayerJsonLd(username);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlayerPageClient />
    </>
  );
}
