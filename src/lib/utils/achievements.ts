/**
 * Achievement image mapping utility
 * Maps achievement IDs to their corresponding image paths
 */
export const ACHIEVEMENT_IMAGES: Record<string, string> = {
  // Progression Achievements
  BestTime: '/achievements/best-time.svg',
  HighestWinStreak: '/achievements/win-streak.svg',
  PlayedMatches: '/achievements/matches-played.svg',
  Playtime: '/achievements/playtime.svg',
  Wins: '/achievements/wins.svg',
  
  // Competitive Achievements
  SeasonOutcome: '/achievements/season-result.svg',
  PlayoffsOutcome: '/achievements/playoffs-result.svg',
  
  // Special Challenge Achievements
  SummonWither: '/achievements/summon-wither.svg',
  IronPickless: '/achievements/iron-pickless.svg',
  Oneshot: '/achievements/oneshot.svg',
  Overtake: '/achievements/overtake.svg',
  Foodless: '/achievements/foodless.svg',
  ClassicRun: '/achievements/classic-run.svg',
  Netherite: '/achievements/netherite.svg',
  Armorless: '/achievements/armorless.svg',
  HighLevel: '/achievements/high-level.svg',
  EgapHolder: '/achievements/egap-holder.svg',
  IronHoe: '/achievements/iron-hoe.svg',
  
  // Community Achievements
  WeeklyRace: '/achievements/weekly-race.svg',
  Secret: '/achievements/secret.svg',
};

/**
 * Get the image path for an achievement ID
 * @param achievementId - The achievement ID string
 * @returns The image path, or null if not found
 */
export function getAchievementImage(achievementId: string): string | null {
  return ACHIEVEMENT_IMAGES[achievementId] || null;
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

