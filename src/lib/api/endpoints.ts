import { get, McsrApiError } from './client';
import type {
  UserInfo,
  MatchInfo,
  Achievement,
  LeaderboardUser,
  LeaderboardResponse,
  VersusStats,
  LiveMatch,
  LiveMatchesResponse,
  WeeklyRaceInfo,
  MatchFilterParams,
  PaginationParams,
} from '@/types/api';

/**
 * User identification type
 * Can be UUID, nickname, or Discord ID
 */
export type UserIdentifier = string;

/**
 * Format UUID (add or remove dashes)
 */
export function formatUuid(uuid: string, withDashes: boolean = false): string {
  const clean = uuid.replace(/-/g, '');

  if (withDashes && clean.length === 32) {
    return clean.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      '$1-$2-$3-$4-$5'
    );
  }

  return clean;
}

// ============================================================================
// User Endpoints
// ============================================================================

/**
 * Get user profile with full statistics
 * @param user - UUID, nickname, or Discord ID
 */
export async function getUser(user: UserIdentifier): Promise<UserInfo> {
  return get<UserInfo>(`/users/${user}`);
}

/**
 * Get user match history
 * @param user - UUID, nickname, or Discord ID
 * @param params - Filter and pagination parameters
 */
export async function getUserMatches(
  user: UserIdentifier,
  params?: MatchFilterParams
): Promise<MatchInfo[]> {
  return get<MatchInfo[]>(`/users/${user}/matches`, { params });
}

/**
 * Get user achievements
 * @param user - UUID, nickname, or Discord ID
 */
export async function getUserAchievements(user: UserIdentifier): Promise<Achievement[]> {
  return get<Achievement[]>(`/users/${user}/achievements`);
}

/**
 * Get user's live match data
 * @param user - UUID, nickname, or Discord ID
 * @param privateKey - Optional private key for live match data access
 */
export async function getUserLiveMatch(
  user: UserIdentifier,
  privateKey?: string
): Promise<LiveMatch | null> {
  try {
    return await get<LiveMatch>(`/users/${user}/live`, {
      userApiKey: privateKey,
    });
  } catch (error) {
    // Check if this is the specific error about not being in private room or not host/co-host
    if (error instanceof McsrApiError) {
      const errorMessage = error.data.error || error.message;
      if (
        errorMessage.includes('Player is not in private room') ||
        errorMessage.includes('not host/co-host')
      ) {
        // Rethrow this specific error so it can be handled with a user-friendly message
        throw error;
      }
    }
    
    // For other errors (user not in a live match, 400 or 404), return null
    return null;
  }
}

// ============================================================================
// Match Endpoints
// ============================================================================

/**
 * Get all matches with optional filters
 * @param params - Filter and pagination parameters
 */
export async function getMatches(params?: MatchFilterParams): Promise<MatchInfo[]> {
  return get<MatchInfo[]>('/matches', { params });
}

/**
 * Get detailed match information
 * @param matchId - Match identifier
 */
export async function getMatch(matchId: string): Promise<MatchInfo> {
  return get<MatchInfo>(`/matches/${matchId}`);
}

// ============================================================================
// Leaderboard Endpoints
// ============================================================================

/**
 * Get global leaderboard
 * @param params - Pagination parameters and optional season filter
 */
export async function getLeaderboard(
  params?: PaginationParams & { season?: number }
): Promise<LeaderboardUser[]> {
  const response = await get<LeaderboardResponse>('/leaderboard', { params });
  return response.users;
}

/**
 * Get leaderboard response with season information
 * @param params - Pagination parameters and optional season filter
 */
export async function getLeaderboardWithSeason(
  params?: PaginationParams & { season?: number }
): Promise<LeaderboardResponse> {
  return get<LeaderboardResponse>('/leaderboard', { params });
}

// ============================================================================
// Versus Endpoints
// ============================================================================

/**
 * Get head-to-head statistics between two players
 * @param user1 - First player identifier
 * @param user2 - Second player identifier
 */
export async function getVersusStats(
  user1: UserIdentifier,
  user2: UserIdentifier
): Promise<VersusStats> {
  return get<VersusStats>(`/users/${user1}/versus/${user2}`);
}

/**
 * Get match history between two players
 * @param user1 - First player identifier
 * @param user2 - Second player identifier
 * @param params - Filter and pagination parameters
 */
export async function getVersusMatches(
  user1: UserIdentifier,
  user2: UserIdentifier,
  params?: MatchFilterParams
): Promise<MatchInfo[]> {
  return get<MatchInfo[]>(`/users/${user1}/versus/${user2}/matches`, { params });
}

// ============================================================================
// Live Match Endpoints
// ============================================================================

/**
 * Populate missing non-streaming users in live matches.
 * The API returns player timeline data in match.data by UUID, but match.players
 * may not contain all players (especially non-streaming ones).
 * This function fetches missing player information.
 */
async function populateNonStreamingUsers(matches: LiveMatch[]): Promise<LiveMatch[]> {
  const populatedMatches = await Promise.all(
    matches.map(async (match) => {
      // Get UUIDs that exist in match.players
      const knownUuids = new Set(match.players.map((p) => p.uuid));

      // Find UUIDs in match.data that aren't in match.players
      const missingUuids = Object.keys(match.data).filter(
        (uuid) => !knownUuids.has(uuid)
      );

      if (missingUuids.length === 0) {
        return match;
      }

      // Fetch user data for missing players
      const missingPlayers = await Promise.all(
        missingUuids.map(async (uuid) => {
          try {
            const userData = await get<UserInfo>(`/users/${uuid}`);
            return {
              uuid: userData.uuid,
              nickname: userData.nickname,
              roleType: userData.roleType,
              eloRate: userData.eloRate,
              eloRank: userData.eloRank,
              country: userData.country,
            };
          } catch {
            // If we can't fetch user data, create a minimal profile
            return {
              uuid,
              nickname: 'Unknown',
              roleType: 0 as const,
              eloRate: null,
              eloRank: null,
              country: null,
            };
          }
        })
      );

      // Return match with all players populated
      return {
        ...match,
        players: [...match.players, ...missingPlayers],
      };
    })
  );

  return populatedMatches;
}

/**
 * Get currently active matches with all players populated
 */
export async function getLiveMatches(): Promise<LiveMatch[]> {
  const response = await get<LiveMatchesResponse>('/live');
  // Populate any missing non-streaming users
  return populateNonStreamingUsers(response.liveMatches);
}

// ============================================================================
// Weekly Race Endpoints
// ============================================================================

/**
 * Get weekly race information
 * @param params - Optional week and season filters
 */
export async function getWeeklyRace(params?: {
  week?: number;
  season?: number;
}): Promise<WeeklyRaceInfo> {
  return get<WeeklyRaceInfo>('/weekly-race', { params });
}
