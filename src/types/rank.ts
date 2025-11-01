// Rank-related types for ELO sprite system

export type RankName =
  | 'Unrated'
  | 'Coal'
  | 'Iron'
  | 'Gold'
  | 'Emerald'
  | 'Diamond'
  | 'Netherite';

export type RankLevel = '' | 'I' | 'II' | 'III';

export interface RankTier {
  name: RankName;
  level: RankLevel;
  color: string; // Hex color for text styling
  // Only valid indices used by the sprite sheet (2 is intentionally unused)
  spriteIndex: 0 | 1 | 3 | 4 | 5 | 6 | 7;
}

