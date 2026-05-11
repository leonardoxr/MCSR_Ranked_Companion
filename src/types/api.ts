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
  id: string | number | null;
  overworld: string | null; // API uses "overworld" not "overworldType"
  nether: string | null; // API uses "nether" not "bastionType"
  endTowers: number[]; // API uses "endTowers" not "endTowerHeights"; empty for unfiltered seeds
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
  change: number | null;
  eloRate: EloRate | null;
}

/**
 * Match rank information
 */
export interface MatchRank {
  season: number | null;
  allTime: number | null;
}

/**
 * VOD information
 */
export interface VodInfo {
  uuid: UUID;
  url: string;
  startsAt: Timestamp;
}

/**
 * Timeline event in a match
 */
export interface TimelineEvent {
  uuid: UUID;
  time: Milliseconds;
  type: string; // API uses "type" not "event"
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
  id: string | number; // API can return number
  type: MatchType;
  season: number;
  category: string;
  gameMode?: string; // API includes "gameMode" field
  date: Timestamp;
  players: UserProfile[];
  spectators: UserProfile[];
  result: MatchResult | { uuid: null; time: Milliseconds }; // Result can have null uuid for forfeits
  forfeited: boolean;
  decayed: boolean;
  rank: MatchRank | { season: null; allTime: null }; // Rank can be null
  changes: EloChange[];
  seed: MatchSeed | null;
  // Advanced fields (only in /matches/{id})
  completions?: Completion[];
  timelines?: TimelineEvent[];
  replayExist?: boolean;
  vod?: VodInfo[]; // API returns array of VOD info, not string
  tag?: string | null; // Match tag
  seedType?: string; // Duplicate of seed.overworld
  bastionType?: string; // Duplicate of seed.nether
  beginner?: boolean; // Beginner match flag
  botSource?: string | number | Record<string, unknown> | null; // Bot source if applicable
}

/**
 * Statistics value for ranked and casual modes
 */
interface StatValue<T> {
  ranked: T;
  casual: T;
}

/**
 * Complete user statistics structure (matches actual API response)
 */
export interface UserStatistics {
  season: {
    bestTime: StatValue<Milliseconds | null>;
    highestWinStreak: StatValue<number>;
    currentWinStreak: StatValue<number>;
    playedMatches: StatValue<number>;
    playtime: StatValue<Milliseconds>;
    completionTime: StatValue<Milliseconds>;
    forfeits: StatValue<number>;
    completions: StatValue<number>;
    wins: StatValue<number>;
    loses: StatValue<number>; // Note: API uses "loses" not "losses"
  };
  total: {
    bestTime: StatValue<Milliseconds | null>;
    highestWinStreak: StatValue<number>;
    currentWinStreak: StatValue<number>;
    playedMatches: StatValue<number>;
    playtime: StatValue<Milliseconds>;
    completionTime: StatValue<Milliseconds>;
    forfeits: StatValue<number>;
    completions: StatValue<number>;
    wins: StatValue<number>;
    loses: StatValue<number>; // Note: API uses "loses" not "losses"
  };
}

/**
 * Helper type for easier access to user statistics
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
 * Achievement data
 */
export interface Achievement {
  id: string; // Achievement type identifier (e.g., "seasonResult", "playoffsResult")
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
    phasePoint: number; // Note: API uses "phasePoint" not "phasePoints"
  };
  highest: EloRate;
  lowest: EloRate;
  phases: Array<{
    phase: number;
    eloRate: EloRate;
    eloRank: Rank;
    point: number; // Note: API uses "point" not "points"
  }>;
}

/**
 * Extended user information
 */
export interface UserInfo extends UserProfile {
  timestamp: {
    firstOnline: Timestamp;
    lastOnline: Timestamp;
    lastRanked: Timestamp;
    nextDecay: Timestamp | null;
  };
  statistics: UserStatistics;
  connections: UserConnections;
  achievements: {
    display: Achievement[];
    total: Achievement[];
  };
  seasonResult: SeasonResult | null;
  weeklyRaces: unknown[]; // Included in API response
}

/**
 * Leaderboard user entry
 */
export interface LeaderboardUser extends UserProfile {
  seasonResult: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoint: number; // Note: API uses "phasePoint" not "phasePoints"
  };
}

/**
 * Leaderboard response structure
 */
export interface LeaderboardResponse {
  season: {
    startsAt: Timestamp;
    endsAt: Timestamp;
    number: number;
  };
  users: LeaderboardUser[];
}

/**
 * Weekly race information
 */
export interface WeeklyRaceInfo {
  id: number;
  seed: {
    overworld: string;
    nether: string;
    theEnd: string;
    rng: string;
    flags: unknown | null;
  };
  endsAt: Timestamp;
  leaderboard: Array<{
    rank: number;
    player: UserProfile;
    time: Milliseconds;
    replayExist: boolean;
  }>;
}

/**
 * Head-to-head results breakdown by match type
 * Keys are player UUIDs mapping to their win counts, plus a "total" key
 */
export interface VersusResultsByType {
  total: number;
  [uuid: string]: number;
}

/**
 * Head-to-head statistics between two players
 * Actual API response from GET /users/{user1}/versus/{user2}
 */
export interface VersusStats {
  players: [UserProfile, UserProfile];
  results: {
    ranked: VersusResultsByType;
    casual: VersusResultsByType;
  };
  changes: {
    [uuid: string]: number;
  };
}

// ============================================================================
// Record Leaderboard Types
// ============================================================================

/**
 * Entry in the record (fastest times) leaderboard
 */
export interface RecordLeaderboardEntry {
  rank: number;
  id: number;
  season: number;
  date: Timestamp;
  time: Milliseconds;
  user: UserProfile;
  seed: MatchSeed;
}

// ============================================================================
// Phase Leaderboard Types
// ============================================================================

/**
 * Phase information for the phase leaderboard
 */
export interface PhaseInfo {
  endsAt: Timestamp;
  number: number;
  season: number;
}

/**
 * User entry in the phase points leaderboard
 */
export interface PhaseLeaderboardUser extends UserProfile {
  predPhasePoint: number;
  seasonResult: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoint: number;
  };
}

/**
 * Phase leaderboard response
 */
export interface PhaseLeaderboardResponse {
  phase: PhaseInfo;
  users: PhaseLeaderboardUser[];
}

// ============================================================================
// Playoffs Types
// ============================================================================

/**
 * Player in the playoffs bracket
 */
export interface PlayoffPlayer {
  uuid: UUID;
  nickname: string;
  seasonEloRate: EloRate;
  seasonEloRank: Rank;
  seedNumber: number;
  personalBest: Milliseconds;
}

/**
 * A match in the playoffs bracket
 */
export interface PlayoffMatch {
  id: number;
  name: string;
  nextMatchId: number | null;
  maxRoundScore: number;
  startTime: Timestamp;
  state: string;
  participants: Array<{
    player: number;
    roundScore: number;
  }>;
  vod: string;
}

/**
 * Final placement result in playoffs
 */
export interface PlayoffResult {
  player: number;
  place: number;
  prize: number;
}

/**
 * Full playoffs bracket data
 */
export interface PlayoffsBracket {
  type: string;
  players: PlayoffPlayer[];
  matches: PlayoffMatch[];
  results: PlayoffResult[];
  season: number;
}

/**
 * Playoffs response with navigation
 */
export interface PlayoffsResponse {
  data: PlayoffsBracket;
  next: number | null;
  prev: number | null;
}

/**
 * Live match player data
 */
export interface LiveMatchPlayerData {
  liveUrl: string | null;
  timeline: {
    time: Milliseconds;
    type: string;
  } | null;
}

/**
 * Live match data
 */
export interface LiveMatch {
  currentTime: Milliseconds;
  players: UserProfile[];
  data: Record<UUID, LiveMatchPlayerData>;
}

/**
 * Live matches response
 */
export interface LiveMatchesResponse {
  players: number;
  liveMatches: LiveMatch[];
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
