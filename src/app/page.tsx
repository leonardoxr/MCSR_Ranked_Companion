'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { SearchBar } from '@/components/features/SearchBar';
import { PlayerNameInput } from '@/components/features/PlayerNameInput';
import { BannerAd, InContentAd } from '@/components/features/AdUnit';
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
              autoSuggest
              fetchSuggestions={async (q) => {
                try {
                  const res = await fetch(`/api/search/player?q=${encodeURIComponent(q)}`);
                  if (!res.ok) return [];
                  const data = await res.json();
                  // Expecting array of { username, uuid }
                  return Array.isArray(data) ? data : [];
                } catch {
                  return [];
                }
              }}
              placeholder={t('home.searchPlaceholder')}
            />
            <p className="mt-3 text-xs text-white/50">
              Tip: Search any IGN to view profile and recent matches.
            </p>
          </div>
        </div>
      </section>

      {/* Banner Ad - Replace with your AdSense ad unit slot ID */}
      <BannerAd adSlot="1234567890/6789012345" />

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

      {/* In-Content Ad - Replace with your AdSense ad unit slot ID */}
      <InContentAd adSlot="1234567890/6789012345" />

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
