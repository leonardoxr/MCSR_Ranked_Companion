import { useMemo } from 'react';
import { getRankTier } from '@/utils/ranks';

export function useRankTier(elo: number | null) {
  return useMemo(() => getRankTier(elo), [elo]);
}

