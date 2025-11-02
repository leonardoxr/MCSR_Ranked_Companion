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
    if (!baseFileName) {
      console.warn(`[Achievement] Unknown achievement ID: ${achievement}`);
      return null;
    }

    // Return base image for one-time achievements
    if (!PROGRESSIVE_ACHIEVEMENTS.has(achievement)) {
      return `/achievements/${baseFileName}.png`;
    }

    // Default to level 1 for progressive achievements
    return `/achievements/${baseFileName}_level_1.png`;
  }

  const { id, level, data } = achievement;

  console.log(`[Achievement] Processing:`, { id, level, data });

  // Handle competitive achievements with placement data
  if (id === 'PlayoffsOutcome' && data && data.length > 0) {
    const placement = data[0]; // First data element is placement
    const placementMap: Record<string, string> = {
      '1': '1st',
      '2': '2nd',
      '3': '3rd',
    };
    const suffix = placementMap[placement] || 'participant';
    const imagePath = `/achievements/playoffs_${suffix}.png`;
    console.log(`[Achievement] Playoffs - Returning path:`, imagePath);
    return imagePath;
  }

  if (id === 'SeasonOutcome' && data && data.length > 0) {
    const placement = data[0]; // First data element is top X
    const imagePath = `/achievements/season_placement_top_${placement}.png`;
    console.log(`[Achievement] Season - Returning path:`, imagePath);
    return imagePath;
  }

  if (id === 'WeeklyRace' && data && data.length > 0) {
    const placement = data[0]; // First data element is top X
    const imagePath = `/achievements/weekly_race_top_${placement}.png`;
    console.log(`[Achievement] Weekly - Returning path:`, imagePath);
    return imagePath;
  }

  // Handle progressive achievements with levels
  if (PROGRESSIVE_ACHIEVEMENTS.has(id)) {
    const baseFileName = ACHIEVEMENT_FILE_MAPPING[id];
    if (!baseFileName) {
      console.warn(`[Achievement] Progressive achievement ${id} not found in mapping`);
      return null;
    }

    // Level is 1-indexed, max level is 12
    const clampedLevel = Math.max(1, Math.min(level, 12));
    const imagePath = `/achievements/${baseFileName}_level_${clampedLevel}.png`;
    console.log(`[Achievement] Progressive (${id}, level ${level}) - Returning path:`, imagePath);
    return imagePath;
  }

  // Handle one-time achievements
  const baseFileName = ACHIEVEMENT_FILE_MAPPING[id];
  if (!baseFileName) {
    console.warn(`[Achievement] Unknown achievement ID: ${id}`);
    return null;
  }

  const imagePath = `/achievements/${baseFileName}.png`;
  console.log(`[Achievement] Returning path:`, imagePath);
  return imagePath;
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

