'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
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
  const [tokens, setTokens] = React.useState<string[]>([]);
  const [value, setValue] = React.useState('');

  const addToken = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (!/^[A-Za-z0-9_]{1,16}$/.test(v)) return;
    setTokens((prev) => {
      if (prev.includes(v)) return prev;
      if (prev.length >= 2) return prev; // limit to two players
      return [...prev, v];
    });
    setValue('');
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addToken(value);
    } else if (e.key === 'Backspace' && value === '' && tokens.length) {
      setTokens((prev) => prev.slice(0, -1));
    }
  };

  const compare = () => {
    if (tokens.length < 2) return;
    const [p1, p2] = tokens;
    router.push(`/versus/${encodeURIComponent(p1)}/${encodeURIComponent(p2)}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-white/10 bg-white/5">
        {tokens.map((t) => (
          <span key={t} className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 text-sm">
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              className="text-white/60 hover:text-white"
              onClick={() => setTokens((prev) => prev.filter((x) => x !== t))}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add player (Enter)"
          className="flex-1 min-w-[180px] bg-transparent outline-none px-2 py-1 text-sm placeholder:text-white/50"
          disabled={tokens.length >= 2}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" className="ml-auto" disabled={tokens.length < 2} onClick={compare}>
          Compare
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      {tokens.length >= 2 && (
        <p className="text-xs text-white/60">Limit: two players per comparison.</p>
      )}
    </div>
  );
}
