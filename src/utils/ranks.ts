import type { RankTier } from '@/types/rank';

// Map ELO to rank tier with sprite index, following provided spec.
export function getRankTier(elo: number | null): RankTier {
  if (elo === null || elo < 0) {
    return { name: 'Unrated', level: '', color: '#808080', spriteIndex: 0 };
  }

  // Sprite indices: 0=Unrated, 1=Coal, 2=SKIP, 3=Iron, 4=Gold, 5=Emerald, 6=Diamond, 7=Netherite
  if (elo >= 2000) {
    return { name: 'Netherite', level: '', color: '#5E4FA2', spriteIndex: 7 };
  } else if (elo >= 1850) {
    return { name: 'Diamond', level: 'III', color: '#00FFFF', spriteIndex: 6 };
  } else if (elo >= 1650) {
    return { name: 'Diamond', level: 'II', color: '#00FFFF', spriteIndex: 6 };
  } else if (elo >= 1500) {
    return { name: 'Diamond', level: 'I', color: '#00FFFF', spriteIndex: 6 };
  } else if (elo >= 1400) {
    return { name: 'Emerald', level: 'III', color: '#00FF00', spriteIndex: 5 };
  } else if (elo >= 1300) {
    return { name: 'Emerald', level: 'II', color: '#00FF00', spriteIndex: 5 };
  } else if (elo >= 1200) {
    return { name: 'Emerald', level: 'I', color: '#00FF00', spriteIndex: 5 };
  } else if (elo >= 1100) {
    return { name: 'Gold', level: 'III', color: '#FFD700', spriteIndex: 4 };
  } else if (elo >= 1000) {
    return { name: 'Gold', level: 'II', color: '#FFD700', spriteIndex: 4 };
  } else if (elo >= 900) {
    return { name: 'Gold', level: 'I', color: '#FFD700', spriteIndex: 4 };
  } else if (elo >= 800) {
    return { name: 'Iron', level: 'III', color: '#C0C0C0', spriteIndex: 3 };
  } else if (elo >= 700) {
    return { name: 'Iron', level: 'II', color: '#C0C0C0', spriteIndex: 3 };
  } else if (elo >= 600) {
    return { name: 'Iron', level: 'I', color: '#C0C0C0', spriteIndex: 3 };
  } else if (elo >= 500) {
    return { name: 'Coal', level: 'III', color: '#4A4A4A', spriteIndex: 1 };
  } else if (elo >= 400) {
    return { name: 'Coal', level: 'II', color: '#4A4A4A', spriteIndex: 1 };
  } else {
    return { name: 'Coal', level: 'I', color: '#4A4A4A', spriteIndex: 1 };
  }
}

