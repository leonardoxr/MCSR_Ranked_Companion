'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { SearchBar } from '@/components/features/SearchBar';
import type { Locale } from '@/i18n/config';
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
  const params = useParams();
  const locale = params.locale as Locale;
  const t = useTranslations();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (query: string) => {
    if (query) {
      router.push(`/${locale}/player/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-minecraft-diamond to-minecraft-emerald bg-clip-text text-transparent mc-title">
          {t('home.title')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('home.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder={t('home.searchPlaceholder')}
          />
        </div>
      </section>

      {/* Quick Navigation */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">{t('nav.home')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <Link href={`/${locale}/leaderboard`}>
            <Card variant="mc" className="h-full transition-all hover:border-primary cursor-pointer">
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
          <Link href={`/${locale}/live`}>
            <Card variant="mc" className="h-full transition-all hover:border-primary cursor-pointer">
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
          <Card variant="mc" className="h-full transition-all">
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
              <p className="text-sm text-muted-foreground">
                {t('home.playerComparison.searchPrompt')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{t('home.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<User className="h-6 w-6" />}
            title={t('home.features.playerProfiles.title')}
            description={t('home.features.playerProfiles.description')}
          />
          <FeatureCard
            icon={<Trophy className="h-6 w-6" />}
            title={t('home.features.leaderboardRankings.title')}
            description={t('home.features.leaderboardRankings.description')}
          />
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title={t('home.features.matchDetails.title')}
            description={t('home.features.matchDetails.description')}
          />
          <FeatureCard
            icon={<Radio className="h-6 w-6" />}
            title={t('home.features.liveMatches.title')}
            description={t('home.features.liveMatches.description')}
          />
          <FeatureCard
            icon={<Swords className="h-6 w-6" />}
            title={t('home.features.headToHead.title')}
            description={t('home.features.headToHead.description')}
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title={t('home.features.performanceCharts.title')}
            description={t('home.features.performanceCharts.description')}
          />
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-2xl mx-auto">
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t('home.builtWith')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <TechBadge name={t('home.techStack.nextjs')} />
              <TechBadge name={t('home.techStack.react')} />
              <TechBadge name={t('home.techStack.typescript')} />
              <TechBadge name={t('home.techStack.tanstack')} />
              <TechBadge name={t('home.techStack.tailwind')} />
              <TechBadge name={t('home.techStack.framer')} />
            </div>
          </CardContent>
        </Card>
      </section>
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
    <div className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="p-2 bg-primary/10 rounded-lg h-fit text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <div className="px-3 py-2 bg-muted rounded-lg text-center font-medium">
      {name}
    </div>
  );
}
