import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/live`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch top players from leaderboard for sitemap
  let playerPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch('https://api.mcsrranked.com/leaderboard?count=100', {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();
      const players = data.data?.users || data.users || [];

      playerPages = players.map((player: { nickname: string }) => ({
        url: `${SITE_URL}/player/${encodeURIComponent(player.nickname)}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch players for sitemap:', error);
  }

  // Fetch recent matches for sitemap
  let matchPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch('https://api.mcsrranked.com/matches?count=50', {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();
      const matches = data.data || data || [];

      matchPages = matches.map((match: { id: number; date: number }) => ({
        url: `${SITE_URL}/match/${match.id}`,
        lastModified: new Date(match.date * 1000),
        changeFrequency: 'never' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch matches for sitemap:', error);
  }

  return [...staticPages, ...playerPages, ...matchPages];
}
