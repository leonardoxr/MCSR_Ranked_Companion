/**
 * Smart cache configuration for MCSR Ranked API
 *
 * This file defines cache strategies for different types of data:
 * - STATIC: Data that never changes once created (historical matches, achievements)
 * - SEMI_STATIC: Data that changes occasionally (player profiles, skins)
 * - DYNAMIC: Data that changes regularly (recent matches, stats)
 * - REAL_TIME: Data that updates constantly (live matches, leaderboard)
 */

export const CACHE_TIMES = {
  /**
   * STATIC: 30 minutes stale, 1 hour in memory
   * Used for data that never changes once created
   */
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },

  /**
   * SEMI_STATIC: 10 minutes stale, 30 minutes in memory
   * Used for data that changes occasionally (player profiles, skins, achievements)
   */
  SEMI_STATIC: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },

  /**
   * DYNAMIC: 2 minutes stale, 10 minutes in memory
   * Used for data that changes regularly (recent matches, versus stats)
   */
  DYNAMIC: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },

  /**
   * REAL_TIME: 30 seconds stale, 5 minutes in memory
   * Used for frequently updating data (leaderboard)
   */
  REAL_TIME: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  },

  /**
   * LIVE: 15 seconds stale, 2 minutes in memory
   * Used for live/streaming data (active matches)
   */
  LIVE: {
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  },
} as const;

/**
 * Background refetch settings for important data
 * Enables stale-while-revalidate pattern
 */
export const BACKGROUND_REFETCH = {
  /**
   * Aggressive: Refetch frequently in background
   * Used for leaderboard and player profiles when viewing them
   */
  AGGRESSIVE: {
    refetchOnMount: 'always' as const,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  },

  /**
   * Moderate: Refetch occasionally in background
   * Used for match history and stats
   */
  MODERATE: {
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  },

  /**
   * Conservative: Only refetch on mount if stale
   * Used for historical/static data
   */
  CONSERVATIVE: {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  },
} as const;

/**
 * Cache presets combining stale times and refetch strategies
 */
export const CACHE_PRESETS = {
  /**
   * For completed match details (immutable historical data)
   */
  MATCH_DETAILS: {
    ...CACHE_TIMES.STATIC,
    ...BACKGROUND_REFETCH.CONSERVATIVE,
  },

  /**
   * For player achievements (rarely change)
   */
  ACHIEVEMENTS: {
    ...CACHE_TIMES.SEMI_STATIC,
    ...BACKGROUND_REFETCH.CONSERVATIVE,
  },

  /**
   * For player profiles and stats (includes skins/avatars)
   * Longer cache but will refetch on mount to catch skin changes
   */
  PLAYER_PROFILE: {
    ...CACHE_TIMES.SEMI_STATIC,
    ...BACKGROUND_REFETCH.MODERATE,
  },

  /**
   * For recent match history and versus stats
   */
  RECENT_MATCHES: {
    ...CACHE_TIMES.DYNAMIC,
    ...BACKGROUND_REFETCH.MODERATE,
  },

  /**
   * For leaderboard (updates frequently but not every second)
   */
  LEADERBOARD: {
    ...CACHE_TIMES.REAL_TIME,
    ...BACKGROUND_REFETCH.AGGRESSIVE,
  },

  /**
   * For live/active matches (most dynamic data)
   */
  LIVE_MATCHES: {
    ...CACHE_TIMES.LIVE,
    ...BACKGROUND_REFETCH.AGGRESSIVE,
  },
} as const;
