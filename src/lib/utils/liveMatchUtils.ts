import type { LiveMatch, LiveMatchPlayerData, UserProfile } from '@/types/api';

/**
 * Timeline event priority order (higher = further in the run)
 * Used to determine which player is ahead when they're at different events
 */
export const TIMELINE_EVENT_PRIORITY: Record<string, number> = {
  // Overworld phase
  'root': 0,
  'overworld': 0,
  'story.mine_stone': 1,
  'story.upgrade_tools': 2,
  'story.smelt_iron': 3,
  'story.iron_tools': 4,
  'story.mine_diamond': 5,
  'story.obtain_armor': 6,
  'story.lava_bucket': 7,

  // Nether phase
  'enter_nether': 10,
  'story.enter_the_nether': 10,
  'enter_the_nether': 10,
  'nether.enter_the_nether': 10,

  // Bastion
  'enter_bastion': 15,
  'projectelo.timeline.enter_bastion': 15,

  // Fortress
  'enter_fortress': 20,
  'projectelo.timeline.enter_fortress': 20,
  'nether.find_fortress': 20,

  // Blind/First portal
  'blind_travel': 25,
  'projectelo.timeline.blind_travel': 25,
  'first_portal': 28,
  'projectelo.timeline.first_portal': 28,

  // Second portal / exit nether
  'second_portal': 30,
  'projectelo.timeline.second_portal': 30,

  // Stronghold
  'enter_stronghold': 35,
  'projectelo.timeline.enter_stronghold': 35,
  'follow_ender_eye': 35,
  'adventure.follow_ender_eye': 35,

  // End
  'enter_end': 40,
  'story.enter_the_end': 40,
  'enter_the_end': 40,

  // Finish
  'finish': 50,
  'projectelo.timeline.finish': 50,
};

/**
 * Get the priority of a timeline event
 */
export function getEventPriority(eventType: string): number {
  // Try exact match first
  if (eventType in TIMELINE_EVENT_PRIORITY) {
    return TIMELINE_EVENT_PRIORITY[eventType];
  }

  // Try with common prefixes removed
  const cleanType = eventType
    .replace('projectelo.timeline.', '')
    .replace('story.', '')
    .replace('nether.', '')
    .replace('adventure.', '')
    .replace('husbandry.', '');

  if (cleanType in TIMELINE_EVENT_PRIORITY) {
    return TIMELINE_EVENT_PRIORITY[cleanType];
  }

  // Check for partial matches
  if (cleanType.includes('nether') || cleanType.includes('enter_the_nether')) return 10;
  if (cleanType.includes('bastion')) return 15;
  if (cleanType.includes('fortress')) return 20;
  if (cleanType.includes('blind')) return 25;
  if (cleanType.includes('first_portal')) return 28;
  if (cleanType.includes('second_portal')) return 30;
  if (cleanType.includes('stronghold')) return 35;
  if (cleanType.includes('end') && !cleanType.includes('ender')) return 40;
  if (cleanType.includes('finish')) return 50;

  // Default to low priority for unknown events
  return 0;
}

/**
 * Get player's current phase name
 */
export function getPlayerPhase(eventType: string | undefined): string {
  if (!eventType) return 'Starting';

  const priority = getEventPriority(eventType);

  if (priority >= 50) return 'Finished';
  if (priority >= 40) return 'The End';
  if (priority >= 35) return 'Stronghold';
  if (priority >= 25) return 'Exiting Nether';
  if (priority >= 20) return 'Fortress';
  if (priority >= 15) return 'Bastion';
  if (priority >= 10) return 'Nether';
  return 'Overworld';
}

export interface PlayerPaceInfo {
  player: UserProfile;
  playerData: LiveMatchPlayerData | null;
  eventPriority: number;
  currentPhase: string;
  splitTime: number | null;
}

export interface PaceComparison {
  player1: PlayerPaceInfo;
  player2: PlayerPaceInfo;
  leader: UserProfile | null;
  gapMilliseconds: number | null;
  gapType: 'time' | 'progress' | 'unknown';
  isCompetitive: boolean;
}

/**
 * Compare pace between two players in a live match
 *
 * Gap calculation logic:
 * 1. If both players are at the SAME phase: gap = difference in split times
 *    - Lower split time = faster = leading
 * 2. If players are at DIFFERENT phases:
 *    - The player at the higher phase is leading
 *    - Gap estimate: We use the match's currentTime to calculate real-time gap
 *    - Real gap = (matchTime - trailerSplitTime) - (matchTime - leaderSplitTime)
 *    - Simplified: leaderSplitTime - trailerSplitTime (when leader is ahead in phases)
 *    - But more accurately: estimate how far behind the trailer is
 */
export function comparePace(match: LiveMatch): PaceComparison | null {
  if (match.players.length !== 2) {
    return null;
  }

  const [p1, p2] = match.players;
  const p1Data = match.data[p1.uuid] || null;
  const p2Data = match.data[p2.uuid] || null;

  const p1Priority = p1Data?.timeline ? getEventPriority(p1Data.timeline.type) : 0;
  const p2Priority = p2Data?.timeline ? getEventPriority(p2Data.timeline.type) : 0;

  const player1Info: PlayerPaceInfo = {
    player: p1,
    playerData: p1Data,
    eventPriority: p1Priority,
    currentPhase: getPlayerPhase(p1Data?.timeline?.type),
    splitTime: p1Data?.timeline?.time ?? null,
  };

  const player2Info: PlayerPaceInfo = {
    player: p2,
    playerData: p2Data,
    eventPriority: p2Priority,
    currentPhase: getPlayerPhase(p2Data?.timeline?.type),
    splitTime: p2Data?.timeline?.time ?? null,
  };

  // Determine leader and gap
  let leader: UserProfile | null = null;
  let gapMilliseconds: number | null = null;
  let gapType: 'time' | 'progress' | 'unknown' = 'unknown';

  // If players are at different events, the one at a higher priority event is leading
  if (p1Priority !== p2Priority) {
    const leaderInfo = p1Priority > p2Priority ? player1Info : player2Info;
    const trailerInfo = p1Priority > p2Priority ? player2Info : player1Info;
    leader = leaderInfo.player;
    gapType = 'progress';

    // Calculate the real-time gap estimate
    // The leader hit their current split at leaderSplitTime
    // The trailer is still working towards a lower phase
    // Real-time gap = how much time the trailer needs to catch up

    if (leaderInfo.splitTime !== null && trailerInfo.splitTime !== null) {
      // Both have split times - calculate based on current match time
      // The leader reached their current phase at leaderSplitTime
      // The trailer is at their phase, which they reached at trailerSplitTime
      //
      // Time since leader hit their split: matchTime - leaderSplitTime
      // Time since trailer hit their split: matchTime - trailerSplitTime
      //
      // But to estimate the gap, we consider:
      // - Leader is at phase X (higher), trailer is at phase Y (lower)
      // - The gap is approximately how long until trailer reaches leader's phase
      // - Conservative estimate: (matchTime - trailerSplitTime) = time trailer has been at their phase
      //   They still need to progress through the phases between them
      // - Simple estimate: matchTime - leaderSplitTime (time since leader reached current phase)

      // Best approximation: the trailer needs to cover the same ground the leader did
      // If leader reached nether at 3:00, and trailer is at overworld (split at 2:00),
      // the trailer is ~1:00 behind in reaching nether (plus whatever time since then)

      // Using match.currentTime as reference point:
      // Gap = (currentTime - trailerSplitTime) - (currentTime - leaderSplitTime)
      //     = leaderSplitTime - trailerSplitTime (if trailer is behind)
      // But we also add the progression difference

      const timeDiff = leaderInfo.splitTime - trailerInfo.splitTime;

      if (timeDiff > 0) {
        // Leader hit their split AFTER trailer hit theirs
        // But leader is at a higher phase, so they're faster
        // Gap estimate: how long ago did the trailer hit their split + phase progression time
        gapMilliseconds = match.currentTime - trailerInfo.splitTime;
      } else {
        // Leader hit their split BEFORE trailer hit theirs AND is at a higher phase
        // The trailer is significantly behind
        gapMilliseconds = Math.abs(timeDiff) + (match.currentTime - leaderInfo.splitTime);
      }

      // Cap the gap at a reasonable value (15 minutes max)
      gapMilliseconds = Math.min(gapMilliseconds, 15 * 60 * 1000);
    } else if (leaderInfo.splitTime !== null) {
      // Only leader has split time - estimate based on match time
      gapMilliseconds = match.currentTime - leaderInfo.splitTime;
    }
  }
  // If at the same event, compare split times (lower time = faster = leading)
  else if (player1Info.splitTime !== null && player2Info.splitTime !== null) {
    gapType = 'time';
    const timeDiff = player1Info.splitTime - player2Info.splitTime;
    gapMilliseconds = Math.abs(timeDiff);

    // Lower split time = faster = leading
    if (timeDiff !== 0) {
      leader = timeDiff < 0 ? p1 : p2;
    }
  }

  // Determine if match is competitive (gap < 30 seconds or same phase)
  const isCompetitive =
    gapMilliseconds === null ||
    gapMilliseconds < 30000 ||
    player1Info.currentPhase === player2Info.currentPhase;

  return {
    player1: player1Info,
    player2: player2Info,
    leader,
    gapMilliseconds,
    gapType,
    isCompetitive,
  };
}

/**
 * Format milliseconds to a readable time string
 */
export function formatTimeGap(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

/**
 * Get the trailing player and format a gap message
 */
export function getGapMessage(comparison: PaceComparison): string | null {
  if (!comparison.leader || comparison.gapMilliseconds === null) {
    return null;
  }

  const trailer = comparison.leader === comparison.player1.player
    ? comparison.player2.player
    : comparison.player1.player;

  const gap = formatTimeGap(comparison.gapMilliseconds);

  if (comparison.gapType === 'progress') {
    return `${comparison.leader.nickname} ahead (${gap} split gap)`;
  }

  return `${comparison.leader.nickname} leads by ${gap}`;
}

/**
 * Get progress percentage for a player (0-100)
 */
export function getProgressPercentage(eventType: string | undefined): number {
  if (!eventType) return 0;

  const priority = getEventPriority(eventType);
  // Max priority is 50 (finish)
  return Math.min((priority / 50) * 100, 100);
}

/**
 * Get both players' progress info for visualization
 */
export function getMatchProgress(match: LiveMatch): {
  players: Array<{
    player: UserProfile;
    progress: number;
    phase: string;
    isStreaming: boolean;
    splitTime: number | null;
  }>;
} {
  return {
    players: match.players.map(player => {
      const data = match.data[player.uuid];
      return {
        player,
        progress: getProgressPercentage(data?.timeline?.type),
        phase: getPlayerPhase(data?.timeline?.type),
        isStreaming: !!data?.liveUrl,
        splitTime: data?.timeline?.time ?? null,
      };
    }),
  };
}
