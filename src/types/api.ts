// ============================================================================
// MCSR Ranked API Type Definitions
// Auto-generated from API documentation
// ============================================================================

/**
 * User's UUID format (32 hex characters without dashes)
 */
export type UUID = string;

/**
 * Unix timestamp in seconds
 */
export type Timestamp = number;

/**
 * Time duration in milliseconds
 */
export type Milliseconds = number;

/**
 * ISO 3166-1 alpha-2 country code
 */
export type CountryCode = string;

/**
 * ELO rating (0-65535)
 */
export type EloRate = number;

/**
 * Rank position (1-based)
 */
export type Rank = number;

/**
 * Match type identifier
 */
export enum MatchType {
  Casual = 1,
  Ranked = 2,
  Private = 3,
  Event = 4,
}

/**
 * Supporter tier level
 */
export enum RoleType {
  None = 0,
  Stone = 1,
  Iron = 2,
  Diamond = 3,
}

/**
 * User profile information
 */
export interface UserProfile {
  uuid: UUID;
  nickname: string;
  roleType: RoleType;
  eloRate: EloRate | null;
  eloRank: Rank | null;
  country: CountryCode | null;
}

/**
 * Match seed characteristics
 */
export interface MatchSeed {
  id: string | number;
  overworldType: string;
  bastionType: 'housing' | 'treasure' | 'bridge' | 'stables';
  endTowerHeights: [number, number, number, number];
  variations: string[];
}

/**
 * Match result information
 */
export interface MatchResult {
  uuid: UUID;
  time: Milliseconds;
}

/**
 * ELO change for a player
 */
export interface EloChange {
  uuid: UUID;
  change: number;
  eloRate: EloRate;
}

/**
 * Match rank information
 */
export interface MatchRank {
  season: number;
  allTime: number;
}

/**
 * Timeline event in a match
 */
export interface TimelineEvent {
  event: string;
  time: Milliseconds;
  uuid?: UUID;
}

/**
 * Completion data
 */
export interface Completion {
  uuid: UUID;
  time: Milliseconds;
}

/**
 * Comprehensive match information
 */
export interface MatchInfo {
  id: string;
  type: MatchType;
  season: number;
  category: string;
  date: Timestamp;
  players: UserProfile[];
  spectators: UserProfile[];
  result: MatchResult;
  forfeited: boolean;
  decayed: boolean;
  rank: MatchRank;
  changes: EloChange[];
  seed: MatchSeed;
  // Advanced fields (only in /matches/{id})
  completions?: Completion[];
  timelines?: TimelineEvent[];
  replayExist?: boolean;
  vod?: string | null;
}

/**
 * User statistics for a specific mode
 */
export interface UserStats {
  bestTime: Milliseconds | null;
  highestWinStreak: number;
  currentWinStreak: number;
  playedMatches: number;
  playtime: Milliseconds;
  completionTime: Milliseconds;
  forfeits: number;
  completions: number;
  wins: number;
  losses: number;
}

/**
 * Complete user statistics structure
 */
export interface UserStatistics {
  season: {
    ranked: UserStats;
    casual: UserStats;
  };
  total: {
    ranked: UserStats;
    casual: UserStats;
  };
}

/**
 * Achievement data
 */
export interface Achievement {
  id: number;
  date: Timestamp;
  data: string[];
  level: number;
  value: number | null;
  goal: number | null;
}

/**
 * Social platform connection
 */
export interface SocialConnection {
  id: string;
  name: string;
}

/**
 * User connections (social platforms)
 */
export interface UserConnections {
  discord: SocialConnection | null;
  twitch: SocialConnection | null;
  youtube: SocialConnection | null;
}

/**
 * Season result information
 */
export interface SeasonResult {
  last: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoints: number;
  };
  highest: EloRate;
  lowest: EloRate;
  phaseInfos: Array<{
    phase: number;
    points: number;
    rank: Rank;
  }>;
}

/**
 * Extended user information
 */
export interface UserInfo extends UserProfile {
  firstOnline: Timestamp;
  lastOnline: Timestamp;
  lastRanked: Timestamp;
  nextDecay: Timestamp | null;
  statistics: UserStatistics;
  connections: UserConnections;
  achievements: {
    display: Achievement[];
    total: Achievement[];
  };
  seasonResult: SeasonResult | null;
}

/**
 * Leaderboard user entry
 */
export interface LeaderboardUser extends UserProfile {
  seasonResult: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoints: number;
  };
}

/**
 * Weekly race information
 */
export interface WeeklyRaceInfo {
  id: number;
  seed: {
    overworld: string;
    nether: string;
    the_end: string;
    rng: string;
  };
  endsAt: Timestamp;
  leaderboard: Array<{
    rank: number;
    player: UserProfile;
    time: Milliseconds;
    replayExists: boolean;
  }>;
}

/**
 * Head-to-head statistics
 */
export interface VersusStats {
  player1: UserProfile;
  player2: UserProfile;
  player1Wins: number;
  player2Wins: number;
  totalMatches: number;
  recentMatches: MatchInfo[];
}

/**
 * Live match data
 */
export interface LiveMatch {
  id: string;
  players: UserProfile[];
  spectators: UserProfile[];
  type: MatchType;
  category: string;
  seed: MatchSeed;
  startTime: Timestamp;
}

/**
 * API Error response
 */
export interface ApiError {
  error: string;
  status: number;
  timestamp?: Timestamp;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  count?: number;
}

/**
 * Match filter parameters
 */
export interface MatchFilterParams extends PaginationParams {
  filter?: MatchType;
  type?: MatchType;
  season?: number;
}
