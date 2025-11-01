import { QueryClient } from '@tanstack/react-query';
import { playerKeys } from './hooks/usePlayer';
import { leaderboardKeys } from './hooks/useLeaderboard';
import { liveMatchKeys } from './hooks/useLiveMatches';
import { matchKeys } from './hooks/useMatches';
import { versusKeys } from './hooks/useVersus';

/**
 * Cache utility functions for manual cache management
 *
 * These utilities are useful for scenarios like:
 * - User updates their skin → invalidate player profile cache
 * - Match just completed → invalidate live matches and recent match history
 * - Force refresh specific data
 */

/**
 * Invalidates all cached data for a specific player
 * Use when player data might have changed (e.g., skin update, stats update)
 */
export function invalidatePlayerCache(queryClient: QueryClient, username: string) {
  // Invalidate player profile (includes skin/avatar)
  queryClient.invalidateQueries({ queryKey: playerKeys.profile(username) });

  // Invalidate player matches
  queryClient.invalidateQueries({ queryKey: playerKeys.matches(username) });

  // Invalidate player achievements
  queryClient.invalidateQueries({ queryKey: playerKeys.achievements(username) });

  // Invalidate any versus queries involving this player
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key[0] === 'versus' &&
        (key.includes(username))
      );
    },
  });
}

/**
 * Invalidates leaderboard cache
 * Use when you know leaderboard has been updated
 */
export function invalidateLeaderboardCache(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: leaderboardKeys.all });
}

/**
 * Invalidates live matches cache
 * Use to force refresh of currently active matches
 */
export function invalidateLiveMatchesCache(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: liveMatchKeys.all });
}

/**
 * Invalidates specific match details
 * Use when match data might have been updated
 */
export function invalidateMatchCache(queryClient: QueryClient, matchId: string) {
  queryClient.invalidateQueries({ queryKey: matchKeys.detail(matchId) });
}

/**
 * Invalidates all match-related caches
 * Use after a match completes to refresh match lists
 */
export function invalidateAllMatchCaches(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: matchKeys.all });
  queryClient.invalidateQueries({ queryKey: liveMatchKeys.all });
}

/**
 * Prefetches player data to warm up the cache
 * Useful when hovering over player links or navigating to player pages
 */
export async function prefetchPlayer(queryClient: QueryClient, username: string) {
  const { getUser } = await import('./endpoints');

  await queryClient.prefetchQuery({
    queryKey: playerKeys.profile(username),
    queryFn: () => getUser(username),
  });
}

/**
 * Prefetches match details to warm up the cache
 * Useful when hovering over match links
 */
export async function prefetchMatch(queryClient: QueryClient, matchId: string) {
  const { getMatch } = await import('./endpoints');

  await queryClient.prefetchQuery({
    queryKey: matchKeys.detail(matchId),
    queryFn: () => getMatch(matchId),
  });
}

/**
 * Clears all caches (nuclear option)
 * Use sparingly, mainly for debugging or when user explicitly requests a full refresh
 */
export function clearAllCaches(queryClient: QueryClient) {
  queryClient.clear();
}

/**
 * Gets cache stats for debugging
 */
export function getCacheStats(queryClient: QueryClient) {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  return {
    totalQueries: queries.length,
    byStatus: {
      fresh: queries.filter((q) => q.state.dataUpdatedAt > Date.now() - 60000).length,
      stale: queries.filter(
        (q) =>
          q.state.dataUpdatedAt <= Date.now() - 60000 && q.state.dataUpdatedAt > 0
      ).length,
      inactive: queries.filter((q) => q.getObserversCount() === 0).length,
    },
    byKey: queries.reduce(
      (acc, q) => {
        const key = q.queryKey[0] as string;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}
