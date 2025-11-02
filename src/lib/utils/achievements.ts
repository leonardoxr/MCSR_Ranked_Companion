import type { Achievement } from '@/types/api';

/**
 * Maps achievement IDs (from API) to their base file names (snake_case)
 * API uses camelCase with lowercase first letter (e.g., "bestTime", "playedMatches")
 */
const ACHIEVEMENT_FILE_MAPPING: Record<string, string> = {
  // Progressive Achievements (have levels)
  bestTime: 'break_the_barrier',
  highestWinStreak: 'consistent_wins',
  playedMatches: 'match_master',
  playtime: 'practice_makes_perfect',
  wins: 'w_collector',

  // One-Time Challenge Achievements (no levels)
  foodless: 'a_limited_diet',
  classicRun: 'classic',
  ironHoe: 'farming_time',
  armorless: 'gigachad',
  ironPickless: 'it_isnt_iron_pick',
  overtake: 'never_give_up',
  netherite: 'smithing_time',
  highLevel: 'too_many_levels',
  egapHolder: 'valuable_artifact',
  summonWither: 'wrong_category',
  oneshot: 'you_only_get_one_shot',
};

/**
 * Progressive achievements that have level-based images
 */
const PROGRESSIVE_ACHIEVEMENTS = new Set([
  'bestTime',
  'highestWinStreak',
  'playedMatches',
  'playtime',
  'wins',
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
  // Reference: https://github.com/MCSR-Ranked/Wiki/blob/main/docs/gameplay/achievements.md
  // API uses "playoffsResult" and "seasonResult" (not "PlayoffsOutcome" or "SeasonOutcome")
  
  // Playoffs Achievements
  // Wiki: Winner (1st), 2nd Place (2nd), 3rd Place (3rd), Participant (all others)
  // Image determined by level value (level = placement that determines the image)
  // data[0] = season number (for display only)
  if (id === 'playoffsResult') {
    // level = placement value that determines the image (1, 2, 3, or any other number = participant)
    const placement = String(level);
    const placementMap: Record<string, string> = {
      '1': '1st',   // level 1 → playoffs_1st.png
      '2': '2nd',   // level 2 → playoffs_2nd.png
      '3': '3rd',   // level 3 → playoffs_3rd.png
    };
    const suffix = placementMap[placement] || 'participant'; // any other level value → playoffs_participant.png
    return `/achievements/playoffs_${suffix}.png`;
  }

  // Season Placement Achievements
  // Wiki: Top 1, Top 5, Top 10, Top 50, Top 100, Top 500, Top 1,000
  // Image determined by placement value from data[1] (data[0] is season number)
  if (id === 'seasonResult' && data && data.length > 0) {
    // seasonResult: data[0] = season number, data[1] = placement (determines image bracket)
    // Level indicates how many times this bracket was achieved
    let bracket: number;
    
    // Use data[1] (placement) to determine the bracket image
    if (data.length >= 2) {
      const placement = parseInt(data[1], 10);
      if (!isNaN(placement)) {
        // Map placement value to the appropriate bracket (wiki: Top 1, 5, 10, 50, 100, 500, 1000)
        if (placement === 1) {
          bracket = 1; // Top 1
        } else if (placement <= 5) {
          bracket = 5; // Top 5
        } else if (placement <= 10) {
          bracket = 10; // Top 10
        } else if (placement <= 50) {
          bracket = 50; // Top 50
        } else if (placement <= 100) {
          bracket = 100; // Top 100
        } else if (placement <= 500) {
          bracket = 500; // Top 500
        } else {
          bracket = 1000; // Top 1,000
        }
        return `/achievements/season_placement_top_${bracket}.png`;
      }
    }
    
    return null; // Invalid data - need data[1] (placement) to determine bracket
  }

  // Weekly Race Achievements
  // Wiki: Top 1, Top 5, Top 10, Top 15
  // Image determined by placement value in data[0]
  if (id === 'weeklyRace' && data && data.length > 0) {
    // weeklyRace: data[0] = placement (top 1, 5, 10, or 15)
    // Level indicates count of times achieved, but image is based on placement value
    const placement = data[0]; // First data element is top X
    // Validate placement is one of the valid values
    const validPlacements = ['1', '5', '10', '15'];
    if (!validPlacements.includes(placement)) {
      return null; // Invalid placement
    }
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
 * Maps API achievement IDs (camelCase) to translation keys (PascalCase)
 */
const ACHIEVEMENT_ID_TO_TRANSLATION_KEY: Record<string, string> = {
  // Progressive Achievements
  bestTime: 'BestTime',
  highestWinStreak: 'HighestWinStreak',
  playedMatches: 'PlayedMatches',
  playtime: 'Playtime',
  wins: 'Wins',
  
  // One-time Achievements
  foodless: 'Foodless',
  classicRun: 'ClassicRun',
  ironHoe: 'IronHoe',
  armorless: 'Armorless',
  ironPickless: 'IronPickless',
  overtake: 'Overtake',
  netherite: 'Netherite',
  highLevel: 'HighLevel',
  egapHolder: 'EgapHolder',
  summonWither: 'SummonWither',
  oneshot: 'Oneshot',
  
  // Competitive Achievements
  seasonResult: 'SeasonOutcome',
  playoffsResult: 'PlayoffsOutcome',
  weeklyRace: 'WeeklyRace',
};

/**
 * Get a formatted achievement name for display
 * @param achievementId - The achievement ID string
 * @returns Formatted achievement name
 */
export function getAchievementName(achievementId: string): string {
  // Convert camelCase to Title Case as fallback
  return achievementId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Get translation key for an achievement ID
 * @param achievementId - The achievement ID string from API
 * @returns Translation key for the achievement
 */
export function getAchievementTranslationKey(achievementId: string): string {
  return ACHIEVEMENT_ID_TO_TRANSLATION_KEY[achievementId] || achievementId;
}

/**
 * Get the time label for Break the Barrier achievement based on level
 * Based on wiki: https://github.com/MCSR-Ranked/Wiki/blob/main/docs/gameplay/achievements.md
 * @param level - The achievement level (1-12)
 * @returns The time label (e.g., "Sub6", "Sub9", etc.) or null for level 1
 */
export function getBestTimeLabel(level: number): string | null {
  const timeLabels: Record<number, string> = {
    2: 'Sub30',
    3: 'Sub20',
    4: 'Sub15',
    5: 'Sub13',
    6: 'Sub12',
    7: 'Sub11',
    8: 'Sub10',
    9: 'Sub9',
    10: 'Sub8',
    11: 'Sub7',
    12: 'Sub6',
  };
  
  return timeLabels[level] || null;
}

