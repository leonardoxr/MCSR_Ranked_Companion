'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { SearchBar } from '@/components/features/SearchBar';
import {
  Trophy,
  Radio,
  Swords,
  User,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (query: string) => {
    if (query) {
      router.push(`/player/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="space-y-14">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl mc-card p-8 md:p-12">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl bg-emerald-500/20" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full blur-3xl bg-cyan-400/20" />

        <div className="text-center relative">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-emerald-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent mc-title">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>

          <div className="max-w-2xl mx-auto mt-8">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              placeholder={t('home.searchPlaceholder')}
            />
            <p className="mt-3 text-xs text-white/50">
              Tip: Search any IGN to view profile and recent matches.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <Link href="/leaderboard">
            <Card variant="mc" className="mc-card h-full transition-all hover:border-primary cursor-pointer">
              <CardHeader>
                <div className="p-3 bg-yellow-500/10 rounded-lg w-fit mb-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <CardTitle>{t('home.leaderboard.title')}</CardTitle>
                <CardDescription>
                  {t('home.leaderboard.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  {t('home.leaderboard.button')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Live Matches */}
          <Link href="/live">
            <Card variant="mc" className="mc-card h-full transition-all hover:border-primary cursor-pointer">
              <CardHeader>
                <div className="p-3 bg-red-500/10 rounded-lg w-fit mb-2 relative">
                  <Radio className="h-8 w-8 text-red-500" />
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                <CardTitle>{t('home.liveMatches.title')}</CardTitle>
                <CardDescription>
                  {t('home.liveMatches.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between">
                  {t('home.liveMatches.button')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Player Comparison */}
          <Link href="/compare">
          <Card variant="mc" className="mc-card h-full transition-all hover:border-primary cursor-pointer">
            <CardHeader>
              <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-2">
                <Swords className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle>{t('home.playerComparison.title')}</CardTitle>
              <CardDescription>
                {t('home.playerComparison.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                {t('home.playerComparison.title')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          </Link>
        </div>
      </section>

      {/* Features Section removed per request */}

      {/* Built With section removed per request */}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="mc-card flex gap-4 p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
      <div className="p-2 bg-primary/10 rounded-lg h-fit text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1 text-white/90">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </div>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-center font-medium text-white/80">
      {name}
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
    // Allow MC-style names: letters, numbers, underscore, length 1-16
    if (!/^[A-Za-z0-9_]{1,16}$/.test(v)) return;
    setTokens((prev) => (prev.includes(v) ? prev : [...prev, v]));
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
    const [p1, p2, ...rest] = tokens;
    router.push(`/versus/${encodeURIComponent(p1)}/${encodeURIComponent(p2)}`);
    // Optionally, could pass extra names via query for future multi-compare
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
          className="flex-1 min-w-[140px] bg-transparent outline-none px-2 py-1 text-sm placeholder:text-white/50"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" className="ml-auto" disabled={tokens.length < 2} onClick={compare}>
          Compare
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      {tokens.length > 2 && (
        <p className="text-xs text-white/60">Currently compares the first two players.</p>
      )}
    </div>
  );
}
