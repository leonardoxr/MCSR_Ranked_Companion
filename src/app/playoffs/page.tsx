import type { Metadata } from 'next';
import { PlayoffsClient } from '@/components/features/PlayoffsClient';

export const metadata: Metadata = {
  title: 'Playoffs - MCSR Ranked Companion',
  description:
    'View the MCSR Ranked playoffs bracket, match results, VODs, and prize standings.',
};

export default function PlayoffsPage() {
  return <PlayoffsClient />;
}
