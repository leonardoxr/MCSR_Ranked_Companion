/**
 * Achievement image mapping utility
 * Maps achievement IDs to their corresponding image paths
 */
export const ACHIEVEMENT_IMAGES: Record<string, string> = {
  // Progression Achievements
  BestTime: '/achievements/best-time.png',
  HighestWinStreak: '/achievements/win-streak.png',
  PlayedMatches: '/achievements/matches-played.png',
  Playtime: '/achievements/playtime.png',
  Wins: '/achievements/wins.png',
  
  // Competitive Achievements
  SeasonOutcome: '/achievements/season-result.png',
  PlayoffsOutcome: '/achievements/playoffs-result.png',
  
  // Special Challenge Achievements
  SummonWither: '/achievements/summon-wither.png',
  IronPickless: '/achievements/iron-pickless.png',
  Oneshot: '/achievements/oneshot.png',
  Overtake: '/achievements/overtake.png',
  Foodless: '/achievements/foodless.png',
  ClassicRun: '/achievements/classic-run.png',
  Netherite: '/achievements/netherite.png',
  Armorless: '/achievements/armorless.png',
  HighLevel: '/achievements/high-level.png',
  EgapHolder: '/achievements/egap-holder.png',
  IronHoe: '/achievements/iron-hoe.png',
  
  // Community Achievements
  WeeklyRace: '/achievements/weekly-race.png',
  Secret: '/achievements/secret.png',
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

