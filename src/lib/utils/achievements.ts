import type { Achievement } from '@/types/api';

/**
 * Maps achievement IDs (camelCase) to their base file names (snake_case)
 */
const ACHIEVEMENT_FILE_MAPPING: Record<string, string> = {
  // Progressive Achievements (have levels)
  BestTime: 'break_the_barrier',
  HighestWinStreak: 'consistent_wins',
  PlayedMatches: 'match_master',
  Playtime: 'practice_makes_perfect',
  Wins: 'w_collector',

  // One-Time Challenge Achievements (no levels)
  Foodless: 'a_limited_diet',
  ClassicRun: 'classic',
  IronHoe: 'farming_time',
  Armorless: 'gigachad',
  IronPickless: 'it_isnt_iron_pick',
  Overtake: 'never_give_up',
  Netherite: 'smithing_time',
  HighLevel: 'too_many_levels',
  EgapHolder: 'valuable_artifact',
  SummonWither: 'wrong_category',
  Oneshot: 'you_only_get_one_shot',
};

/**
 * Progressive achievements that have level-based images
 */
const PROGRESSIVE_ACHIEVEMENTS = new Set([
  'BestTime',
  'HighestWinStreak',
  'PlayedMatches',
  'Playtime',
  'Wins',
]);

/**
 * Get the image path for an achievement based on its ID, level, and data
 * @param achievement - The achievement object with id, level, and data
 * @returns The image path, or null if not found
 */
export function getAchievementImage(achievement: Achievement | string): string | null {
  // Handle legacy string-only calls (for backwards compatibility)
  if (typeof achievement === 'string') {
    const baseFileName = ACHIEVEMENT_FILE_MAPPING[achievement];
    if (!baseFileName) return null;

    // Return base image for one-time achievements
    if (!PROGRESSIVE_ACHIEVEMENTS.has(achievement)) {
      return `/achievements/${baseFileName}.png`;
    }

    // Default to level 1 for progressive achievements
    return `/achievements/${baseFileName}_level_1.png`;
  }

  const { id, level, data } = achievement;

  // Handle competitive achievements with placement data
  if (id === 'PlayoffsOutcome' && data && data.length > 0) {
    const placement = data[0]; // First data element is placement
    const placementMap: Record<string, string> = {
      '1': '1st',
      '2': '2nd',
      '3': '3rd',
    };
    const suffix = placementMap[placement] || 'participant';
    return `/achievements/playoffs_${suffix}.png`;
  }

  if (id === 'SeasonOutcome' && data && data.length > 0) {
    const placement = data[0]; // First data element is top X
    return `/achievements/season_placement_top_${placement}.png`;
  }

  if (id === 'WeeklyRace' && data && data.length > 0) {
    const placement = data[0]; // First data element is top X
    return `/achievements/weekly_race_top_${placement}.png`;
  }

  // Handle progressive achievements with levels
  if (PROGRESSIVE_ACHIEVEMENTS.has(id)) {
    const baseFileName = ACHIEVEMENT_FILE_MAPPING[id];
    if (!baseFileName) return null;

    // Level is 1-indexed, max level is 12
    const clampedLevel = Math.max(1, Math.min(level, 12));
    return `/achievements/${baseFileName}_level_${clampedLevel}.png`;
  }

  // Handle one-time achievements
  const baseFileName = ACHIEVEMENT_FILE_MAPPING[id];
  if (!baseFileName) return null;

  return `/achievements/${baseFileName}.png`;
}

/**
 * Get a formatted achievement name for display
 * @param achievementId - The achievement ID string
 * @returns Formatted achievement name
 */
export function getAchievementName(achievementId: string): string {
  // Convert camelCase to Title Case
  return achievementId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

