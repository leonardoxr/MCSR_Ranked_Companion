import type { EloRate } from '@/types/api';

/**
 * Rank tier definitions
 */
export interface RankTier {
  name: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    name: 'Coal',
    min: 0,
    max: 599,
    color: '#3d3d3d',
    bgColor: 'rgba(61, 61, 61, 0.1)',
  },
  {
    name: 'Iron',
    min: 600,
    max: 899,
    color: '#d8d8d8',
    bgColor: 'rgba(216, 216, 216, 0.1)',
  },
  {
    name: 'Gold',
    min: 900,
    max: 1199,
    color: '#f4d03f',
    bgColor: 'rgba(244, 208, 63, 0.1)',
  },
  {
    name: 'Emerald',
    min: 1200,
    max: 1499,
    color: '#2ecc71',
    bgColor: 'rgba(46, 204, 113, 0.1)',
  },
  {
    name: 'Diamond',
    min: 1500,
    max: 1999,
    color: '#4fc3f7',
    bgColor: 'rgba(79, 195, 247, 0.1)',
  },
  {
    name: 'Netherite',
    min: 2000,
    max: 99999,
    color: '#8b4789',
    bgColor: 'rgba(139, 71, 137, 0.1)',
  },
];

/**
 * Get rank tier for an ELO rating
 */
export function getRankTier(eloRate: EloRate | null): RankTier {
  if (eloRate === null) {
    return RANK_TIERS[0]; // Default to Coal
  }

  return (
    RANK_TIERS.find((tier) => eloRate >= tier.min && eloRate <= tier.max) ||
    RANK_TIERS[RANK_TIERS.length - 1]
  );
}

/**
 * Get color for ELO change
 */
export function getEloChangeColor(change: number): string {
  if (change > 0) return '#2ecc71'; // Green
  if (change < 0) return '#e74c3c'; // Red
  return '#95a5a6'; // Gray
}

/**
 * Get color for pace status
 */
export function getPaceColor(currentTime: number, pbTime: number): string {
  const diff = currentTime - pbTime;
  const threshold = 1000; // 1 second

  if (diff < -threshold) return 'rgba(128, 255, 128, 1)'; // Ahead (green)
  if (diff > threshold) return 'rgba(255, 128, 128, 1)'; // Behind (red)
  return 'rgba(255, 255, 255, 0.8)'; // Even (white)
}

/**
 * Match type colors
 */
export const MATCH_TYPE_COLORS = {
  1: '#95a5a6', // Casual - Gray
  2: '#e74c3c', // Ranked - Red
  3: '#9b59b6', // Private - Purple
  4: '#f39c12', // Event - Orange
} as const;

/**
 * Get color for match type
 */
export function getMatchTypeColor(type: number): string {
  return MATCH_TYPE_COLORS[type as keyof typeof MATCH_TYPE_COLORS] || '#95a5a6';
}
