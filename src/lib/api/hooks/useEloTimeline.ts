import { useQueries } from '@tanstack/react-query';
import { getUserMatches } from '../endpoints';
import { useLeaderboard } from './useLeaderboard';
import { MatchType } from '@/types/api';
import type { MatchInfo, LeaderboardUser } from '@/types/api';
import type { McsrApiError } from '../client';
import { BACKGROUND_REFETCH } from '../cache-config';

export interface EloTimelineDataPoint {
  date: number; // timestamp
  elo: number;
  matchId: string;
  change: number;
}

export interface PlayerEloTimeline {
  uuid: string;
  nickname: string;
  eloRate: number;
  color: string;
  data: EloTimelineDataPoint[];
}

// Vibrant colors for the chart lines
const PLAYER_COLORS = [
  '#00E5FF', // Cyan (minecraft diamond)
  '#FF6B6B', // Coral red
  '#4ECB71', // Green
  '#FFD93D', // Yellow/gold
  '#A855F7', // Purple
  '#FF8C42', // Orange
  '#00D4AA', // Teal
  '#F472B6', // Pink
  '#60A5FA', // Blue
  '#34D399', // Emerald
  '#FBBF24', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Fuchsia
  '#14B8A6', // Teal darker
  '#F97316', // Orange darker
  '#84CC16', // Lime
  '#06B6D4', // Cyan darker
  '#D946EF', // Magenta
  '#22D3EE', // Sky
];

export const eloTimelineKeys = {
  all: ['elo-timeline'] as const,
  playerMatches: (uuid: string, season?: number) =>
    [...eloTimelineKeys.all, 'player-matches', uuid, season] as const,
};

/**
 * Cache preset for ELO timeline data (historical, doesn't change)
 */
const ELO_TIMELINE_CACHE = {
  staleTime: 10 * 60 * 1000, // 10 minutes - historical data rarely changes
  gcTime: 30 * 60 * 1000, // 30 minutes
  ...BACKGROUND_REFETCH.CONSERVATIVE,
};

/**
 * Extract ELO timeline data from a player's match history
 */
function extractEloTimeline(
  matches: MatchInfo[],
  playerUuid: string
): EloTimelineDataPoint[] {
  // Sort matches by date (oldest first for proper timeline)
  const sortedMatches = [...matches].sort((a, b) => a.date - b.date);

  return sortedMatches
    .filter((match) => match.type === MatchType.Ranked)
    .map((match) => {
      const change = match.changes?.find(
        (c) => c.uuid.replace(/-/g, '').toLowerCase() === playerUuid.replace(/-/g, '').toLowerCase()
      );
      if (!change) return null;

      return {
        date: match.date * 1000, // Convert to milliseconds
        elo: change.eloRate,
        matchId: String(match.id),
        change: change.change,
      };
    })
    .filter((point): point is EloTimelineDataPoint => point !== null);
}

interface UseEloTimelineOptions {
  playerCount?: number;
  season?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch ELO timeline data for top leaderboard players
 * Uses parallel fetching with staggered requests to avoid rate limiting
 */
export function useEloTimeline(options: UseEloTimelineOptions = {}) {
  const { playerCount = 10, season, enabled = true } = options;

  // Fetch leaderboard
  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
  } = useLeaderboard(
    { count: Math.min(playerCount, 50), season },
    { enabled }
  );

  // Get the top players from leaderboard
  const topPlayers = leaderboard?.slice(0, playerCount) || [];

  // Fetch match history for each player in parallel
  const matchQueries = useQueries({
    queries: topPlayers.map((player, index) => ({
      queryKey: eloTimelineKeys.playerMatches(player.uuid, season),
      queryFn: async () => {
        // Stagger requests slightly to avoid rate limiting
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, index * 100));
        }
        return getUserMatches(player.uuid, {
          type: MatchType.Ranked,
          count: 100, // Get last 100 ranked matches
          season,
        });
      },
      enabled: enabled && topPlayers.length > 0,
      ...ELO_TIMELINE_CACHE,
    })),
  });

  // Combine leaderboard and match data into timeline format
  const playerTimelines: PlayerEloTimeline[] = topPlayers.map((player, index) => {
    const matchQuery = matchQueries[index];
    const matches = matchQuery?.data || [];
    const timeline = extractEloTimeline(matches, player.uuid);

    return {
      uuid: player.uuid,
      nickname: player.nickname,
      eloRate: player.eloRate || 0,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      data: timeline,
    };
  });

  // Calculate loading state
  const isLoadingMatches = matchQueries.some((q) => q.isLoading);
  const isLoading = isLoadingLeaderboard || isLoadingMatches;

  // Calculate errors
  const matchErrors = matchQueries
    .filter((q) => q.error)
    .map((q) => q.error as McsrApiError);

  return {
    playerTimelines,
    topPlayers,
    isLoading,
    isLoadingLeaderboard,
    isLoadingMatches,
    leaderboardError,
    matchErrors,
    matchQueries,
  };
}

/**
 * Hook to fetch ELO timeline for a specific set of players
 */
export function usePlayersEloTimeline(
  players: Array<{ uuid: string; nickname: string; eloRate?: number | null }>,
  options: { season?: number; enabled?: boolean } = {}
) {
  const { season, enabled = true } = options;

  const matchQueries = useQueries({
    queries: players.map((player, index) => ({
      queryKey: eloTimelineKeys.playerMatches(player.uuid, season),
      queryFn: async () => {
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, index * 100));
        }
        return getUserMatches(player.uuid, {
          type: MatchType.Ranked,
          count: 100,
          season,
        });
      },
      enabled: enabled && players.length > 0,
      ...ELO_TIMELINE_CACHE,
    })),
  });

  const playerTimelines: PlayerEloTimeline[] = players.map((player, index) => {
    const matchQuery = matchQueries[index];
    const matches = matchQuery?.data || [];
    const timeline = extractEloTimeline(matches, player.uuid);

    return {
      uuid: player.uuid,
      nickname: player.nickname,
      eloRate: player.eloRate || 0,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      data: timeline,
    };
  });

  const isLoading = matchQueries.some((q) => q.isLoading);
  const errors = matchQueries
    .filter((q) => q.error)
    .map((q) => q.error as McsrApiError);

  return {
    playerTimelines,
    isLoading,
    errors,
    matchQueries,
  };
}
