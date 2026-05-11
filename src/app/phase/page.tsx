import type { Metadata } from 'next';
import { PhaseLeaderboardClient } from '@/components/features/PhaseLeaderboardClient';

export const metadata: Metadata = {
  title: 'Phase Standings - MCSR Ranked Companion',
  description:
    'View the current MCSR Ranked phase points leaderboard with predicted standings.',
};

export default function PhasePage() {
  return <PhaseLeaderboardClient />;
}
