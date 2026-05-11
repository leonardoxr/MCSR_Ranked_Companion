'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';
import type { UserInfo } from '@/types/api';

interface PlayerInsightsProps {
  player: UserInfo;
}

interface Insight {
  type: 'tip' | 'strength' | 'improvement' | 'milestone';
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function PlayerInsights({ player }: PlayerInsightsProps) {
  const t = useTranslations();
  const insights = generateInsights(player, t);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card variant="mc">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          {t('player.insights.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} t={t} />
        ))}
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight, t }: { insight: Insight; t: ReturnType<typeof useTranslations> }) {
  const getBadgeVariant = (type: Insight['type']): 'default' | 'secondary' | 'emerald' | 'gold' | 'diamond' => {
    switch (type) {
      case 'strength':
        return 'emerald';
      case 'improvement':
        return 'gold';
      case 'milestone':
        return 'diamond';
      default:
        return 'secondary';
    }
  };

  const getTypeLabel = (type: Insight['type']) => {
    switch (type) {
      case 'strength':
        return t('player.insights.strength');
      case 'improvement':
        return t('player.insights.improvement');
      case 'milestone':
        return t('player.insights.milestone');
      default:
        return t('player.insights.tip');
    }
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex-shrink-0 mt-1">{insight.icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">{insight.title}</h4>
          <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
            {getTypeLabel(insight.type)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{insight.description}</p>
      </div>
    </div>
  );
}

function generateInsights(player: UserInfo, t: ReturnType<typeof useTranslations>): Insight[] {
  const insights: Insight[] = [];

  const seasonStats = player.statistics?.season;
  const totalStats = player.statistics?.total;

  if (!seasonStats || !totalStats) {
    return insights;
  }

  const seasonWins = seasonStats.wins.ranked;
  const seasonMatches = seasonStats.playedMatches.ranked;
  const seasonWinRate = seasonMatches > 0 ? (seasonWins / seasonMatches) * 100 : 0;

  const totalMatches = totalStats.playedMatches.ranked;

  const completions = totalStats.completions.ranked;
  const forfeits = totalStats.forfeits.ranked;
  const completionRate = (completions + forfeits) > 0 ? (completions / (completions + forfeits)) * 100 : 0;

  const highestStreak = totalStats.highestWinStreak.ranked;

  const avgCompletionTime = completions > 0 ? totalStats.completionTime.ranked / completions : 0;
  const bestTime = totalStats.bestTime.ranked;

  // Helper to format time
  const formatTimeStr = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Completion Rate Insights
  if (completionRate >= 80) {
    insights.push({
      type: 'strength',
      title: t('player.stats.completions'),
      description: t('player.insights.completionMaster', { rate: completionRate.toFixed(1) }),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  } else if (completionRate < 50 && (completions + forfeits) >= 10) {
    insights.push({
      type: 'improvement',
      title: t('player.stats.completions'),
      description: t('player.insights.needMoreCompletions', { rate: completionRate.toFixed(1) }),
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
    });
  }

  // Streak Insights
  if (highestStreak >= 10) {
    insights.push({
      type: 'strength',
      title: t('player.stats.highestStreak'),
      description: t('player.insights.streakChampion', { streak: highestStreak }),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  } else if (highestStreak < 5 && totalMatches >= 20) {
    insights.push({
      type: 'improvement',
      title: t('player.stats.highestStreak'),
      description: t('player.insights.buildMomentum', { streak: highestStreak }),
      icon: <Target className="h-5 w-5 text-blue-500" />,
    });
  }

  // Performance Time Insights
  if (bestTime && bestTime < 600000) { // Under 10 minutes
    insights.push({
      type: 'strength',
      title: t('player.stats.bestTime'),
      description: t('player.insights.speedDemon', { time: formatTimeStr(bestTime) }),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  } else if (bestTime) {
    insights.push({
      type: 'tip',
      title: t('player.stats.bestTime'),
      description: t('player.insights.practiceSpeed', { time: formatTimeStr(bestTime) }),
      icon: <Target className="h-5 w-5 text-blue-500" />,
    });
  }

  // Experience Insights
  if (totalMatches >= 500) {
    insights.push({
      type: 'milestone',
      title: t('player.stats.totalMatches'),
      description: t('player.insights.veteranPlayer', { matches: totalMatches }),
      icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
    });
  } else if (totalMatches < 50) {
    insights.push({
      type: 'tip',
      title: t('player.stats.totalMatches'),
      description: t('player.insights.keepPlaying', { matches: totalMatches }),
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
    });
  }

  // Rank insights
  if (player.eloRank) {
    const totalPlayers = 50000; // Approximate active player base
    const percentile = ((totalPlayers - player.eloRank) / totalPlayers) * 100;
    if (percentile >= 95) {
      insights.push({
        type: 'milestone',
        title: t('player.rank'),
        description: t('player.insights.eliteRank', { percent: percentile.toFixed(1) }),
        icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
      });
    } else if (percentile >= 50) {
      insights.push({
        type: 'strength',
        title: t('player.rank'),
        description: t('player.insights.risingPlayer', { percent: percentile.toFixed(0) }),
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    }
  }

  // Win Rate Insights
  if (seasonWinRate >= 60 && seasonMatches >= 10) {
    insights.push({
      type: 'strength',
      title: t('player.stats.winRate'),
      description: t('player.insights.consistentWinner', { rate: seasonWinRate.toFixed(1) }),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  } else if (seasonWinRate < 45 && seasonMatches >= 10) {
    insights.push({
      type: 'improvement',
      title: t('player.stats.winRate'),
      description: t('player.insights.improveWinRate', { rate: seasonWinRate.toFixed(1) }),
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
    });
  }

  // Season win milestones
  const winMilestones = [10, 25, 50, 100, 250, 500];
  const nextMilestone = winMilestones.find(m => seasonWins < m);
  if (nextMilestone) {
    const remaining = nextMilestone - seasonWins;
    if (remaining <= 5) {
      insights.push({
        type: 'milestone',
        title: t('player.stats.wins'),
        description: t('player.insights.reachMilestone', { remaining, target: nextMilestone }),
        icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
      });
    } else if (seasonWins >= 10) {
      insights.push({
        type: 'tip',
        title: t('player.stats.wins'),
        description: t('player.insights.seasonStrong', { wins: seasonWins }),
        icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
      });
    }
  } else if (seasonWins >= 500) {
    insights.push({
      type: 'milestone',
      title: t('player.stats.wins'),
      description: t('player.insights.reachedMilestone', { wins: seasonWins }),
      icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
    });
  } else if (seasonWins === 0) {
    insights.push({
      type: 'tip',
      title: t('player.stats.wins'),
      description: t('player.insights.firstMilestone'),
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
    });
  }

  // Consistency check between best and average time
  if (avgCompletionTime && bestTime && avgCompletionTime > bestTime * 1.3) {
    const diff = formatTimeStr(avgCompletionTime - bestTime);
    insights.push({
      type: 'tip',
      title: t('player.stats.avgCompletion'),
      description: t('player.insights.workOnConsistency', { avg: formatTimeStr(avgCompletionTime), best: formatTimeStr(bestTime) }),
      icon: <Target className="h-5 w-5 text-blue-500" />,
    });
  } else if (avgCompletionTime && bestTime && avgCompletionTime <= bestTime * 1.15) {
    const diff = formatTimeStr(avgCompletionTime - bestTime);
    insights.push({
      type: 'strength',
      title: t('player.stats.avgCompletion'),
      description: t('player.insights.fasterThanAverage', { best: formatTimeStr(bestTime), diff }),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  }

  // ELO progression tips
  if (player.eloRate) {
    const elo = player.eloRate;
    if (elo >= 2000) {
      insights.push({
        type: 'milestone',
        title: t('player.stats.eloRating'),
        description: t('player.insights.netheriteElite'),
        icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
      });
    } else if (elo >= 1600) {
      insights.push({
        type: 'tip',
        title: t('player.stats.eloRating'),
        description: t('player.insights.diamondPush', { points: 2000 - elo }),
        icon: <Target className="h-5 w-5 text-blue-500" />,
      });
    } else if (elo >= 1250) {
      insights.push({
        type: 'tip',
        title: t('player.stats.eloRating'),
        description: t('player.insights.emeraldClimb', { points: 1600 - elo }),
        icon: <Target className="h-5 w-5 text-blue-500" />,
      });
    } else if (elo >= 950) {
      insights.push({
        type: 'tip',
        title: t('player.stats.eloRating'),
        description: t('player.insights.goldProgress', { points: 1250 - elo }),
        icon: <Target className="h-5 w-5 text-blue-500" />,
      });
    } else if (elo >= 700) {
      insights.push({
        type: 'tip',
        title: t('player.stats.eloRating'),
        description: t('player.insights.ironJourney', { points: 950 - elo }),
        icon: <Target className="h-5 w-5 text-blue-500" />,
      });
    } else {
      insights.push({
        type: 'tip',
        title: t('player.stats.eloRating'),
        description: t('player.insights.coalClimb', { points: 700 - elo }),
        icon: <Target className="h-5 w-5 text-blue-500" />,
      });
    }
  }

  // Limit to top 5 insights to not overwhelm
  return insights.slice(0, 5);
}
