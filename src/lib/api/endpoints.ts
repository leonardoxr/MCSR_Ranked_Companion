import { get } from './client';
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
  return get<VersusStats>(`/versus/${user1}/${user2}`);
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
  return get<MatchInfo[]>(`/versus/${user1}/${user2}/matches`, { params });
}

// ============================================================================
// Live Match Endpoints
// ============================================================================

/**
 * Get currently active matches
 */
export async function getLiveMatches(): Promise<LiveMatch[]> {
  const response = await get<LiveMatchesResponse>('/live');
  return response.liveMatches;
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
