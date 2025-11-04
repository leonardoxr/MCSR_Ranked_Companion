'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { PlayerNameInput } from '@/components/features/PlayerNameInput';
import { Swords, ArrowRight } from 'lucide-react';

export default function ComparePage() {
  const t = useTranslations();
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <Swords className="h-8 w-8 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('home.playerComparison.title')}</h1>
          <p className="text-muted-foreground">{t('home.playerComparison.description')}</p>
        </div>
      </div>

      <Card variant="mc" className="mc-card">
        <CardHeader>
          <CardTitle>{t('home.playerComparison.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <HeadToHeadLauncher />
        </CardContent>
      </Card>
    </div>
  );
}

function HeadToHeadLauncher() {
  const router = useRouter();
  const [player1, setPlayer1] = React.useState('');
  const [player2, setPlayer2] = React.useState('');

  const handlePlayer1Select = (username: string) => {
    setPlayer1(username);
  };

  const handlePlayer2Select = (username: string) => {
    setPlayer2(username);
  };

  const compare = () => {
    const p1 = player1.trim();
    const p2 = player2.trim();
    if (!p1 || !p2) return;
    if (!/^[A-Za-z0-9_]{1,16}$/.test(p1) || !/^[A-Za-z0-9_]{1,16}$/.test(p2)) return;
    router.push(`/versus/${encodeURIComponent(p1)}/${encodeURIComponent(p2)}`);
  };

  const canCompare = player1.trim() && player2.trim() && 
    /^[A-Za-z0-9_]{1,16}$/.test(player1.trim()) && 
    /^[A-Za-z0-9_]{1,16}$/.test(player2.trim());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="player1" className="text-sm font-medium text-white/80">
            Player 1
          </label>
          <PlayerNameInput
            value={player1}
            onChange={setPlayer1}
            onSelect={handlePlayer1Select}
            placeholder="Enter player 1 username..."
            showSuggestions={true}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="player2" className="text-sm font-medium text-white/80">
            Player 2
          </label>
          <PlayerNameInput
            value={player2}
            onChange={setPlayer2}
            onSelect={handlePlayer2Select}
            placeholder="Enter player 2 username..."
            showSuggestions={true}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          className="ml-auto" 
          disabled={!canCompare} 
          onClick={compare}
        >
          Compare
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
