import type { Metadata } from 'next';
import { WeeklyRaceClient } from '@/components/features/WeeklyRaceClient';

export const metadata: Metadata = {
  title: 'Weekly Race - MCSR Ranked Companion',
  description:
    'View the current MCSR Ranked weekly race standings, seed information, and leaderboard.',
};

export default function WeeklyRacePage() {
  return <WeeklyRaceClient />;
}
