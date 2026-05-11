import type { Metadata } from 'next';
import { RecordLeaderboardClient } from '@/components/features/RecordLeaderboardClient';

export const metadata: Metadata = {
  title: 'Record Times - MCSR Ranked Companion',
  description:
    'View the fastest completion times in MCSR Ranked history. Top 100 record runs with seed info and match details.',
};

export default function RecordsPage() {
  return <RecordLeaderboardClient />;
}
