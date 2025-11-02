'use client';

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
  const insights = generateInsights(player);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card variant="mc">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Personalized Insights & Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
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
        return 'Strength';
      case 'improvement':
        return 'Area to Improve';
      case 'milestone':
        return 'Milestone';
      default:
        return 'Tip';
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

function generateInsights(player: UserInfo): Insight[] {
  const insights: Insight[] = [];

  const seasonStats = player.statistics?.season;
  const totalStats = player.statistics?.total;

  if (!seasonStats || !totalStats) {
    return insights;
  }

  const seasonWins = seasonStats.wins.ranked;
  const seasonLosses = seasonStats.loses.ranked;
  const seasonMatches = seasonStats.playedMatches.ranked;
  const seasonWinRate = seasonMatches > 0 ? (seasonWins / seasonMatches) * 100 : 0;

  const totalWins = totalStats.wins.ranked;
  const totalLosses = totalStats.loses.ranked;
  const totalMatches = totalStats.playedMatches.ranked;
  const totalWinRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;

  const completions = totalStats.completions.ranked;
  const forfeits = totalStats.forfeits.ranked;
  const completionRate = (completions + forfeits) > 0 ? (completions / (completions + forfeits)) * 100 : 0;

  const currentStreak = seasonStats.currentWinStreak.ranked;
  const highestStreak = totalStats.highestWinStreak.ranked;

  const avgCompletionTime = completions > 0 ? totalStats.completionTime.ranked / completions : 0;
  const bestTime = totalStats.bestTime.ranked;

  // Win Rate Insights
  if (seasonWinRate >= 60) {
    insights.push({
      type: 'strength',
      title: 'Excellent Win Rate',
      description: `You have a ${seasonWinRate.toFixed(1)}% win rate this season! You're performing above average and should consider pushing for higher ranks.`,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  } else if (seasonWinRate >= 45 && seasonWinRate < 60) {
    insights.push({
      type: 'tip',
      title: 'Solid Performance',
      description: `Your ${seasonWinRate.toFixed(1)}% win rate is decent. Focus on consistency and learning from losses to push towards 60%+.`,
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    });
  } else if (seasonMatches >= 10) {
    insights.push({
      type: 'improvement',
      title: 'Win Rate Needs Work',
      description: `Your ${seasonWinRate.toFixed(1)}% win rate suggests room for improvement. Focus on practicing specific routes and decision-making.`,
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
    });
  }

  // Completion Rate Insights
  if (completionRate < 50 && (completions + forfeits) >= 10) {
    insights.push({
      type: 'improvement',
      title: 'High Forfeit Rate',
      description: `You forfeit ${(100 - completionRate).toFixed(1)}% of your matches. Consider finishing more games to improve your skills and gain experience in all phases.`,
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
    });
  } else if (completionRate >= 80) {
    insights.push({
      type: 'strength',
      title: 'Great Persistence',
      description: `You complete ${completionRate.toFixed(1)}% of your matches. This persistence helps you learn and improve even in difficult situations.`,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  }

  // Streak Insights
  if (currentStreak >= 5) {
    insights.push({
      type: 'milestone',
      title: `${currentStreak} Win Streak!`,
      description: `You're on fire! Keep up the momentum and maintain your focus. Your best streak is ${highestStreak} wins.`,
      icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
    });
  }

  if (highestStreak >= 10) {
    insights.push({
      type: 'strength',
      title: 'Proven Consistency',
      description: `Your highest win streak of ${highestStreak} shows you can maintain high-level performance over multiple games.`,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  }

  // Performance Time Insights
  if (bestTime && bestTime < 600000) { // Under 10 minutes
    const minutes = Math.floor(bestTime / 60000);
    const seconds = Math.floor((bestTime % 60000) / 1000);
    insights.push({
      type: 'strength',
      title: 'Fast Finisher',
      description: `Your best time of ${minutes}:${seconds.toString().padStart(2, '0')} is impressive! This shows strong mechanical skill and route knowledge.`,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  }

  if (avgCompletionTime && bestTime && avgCompletionTime > bestTime * 1.5) {
    insights.push({
      type: 'tip',
      title: 'Consistency Opportunity',
      description: `Your average completion time is significantly higher than your best. Focus on applying your best strategies more consistently.`,
      icon: <Target className="h-5 w-5 text-blue-500" />,
    });
  }

  // General Tips
  if (totalMatches < 50) {
    insights.push({
      type: 'tip',
      title: 'Keep Playing',
      description: `You've played ${totalMatches} ranked matches. The more you play, the better you'll understand your strengths and weaknesses.`,
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
    });
  }

  // Elo-based insights
  if (player.eloRate) {
    if (player.eloRate >= 1800) {
      insights.push({
        type: 'milestone',
        title: 'High ELO Achievement',
        description: `At ${Math.round(player.eloRate)} ELO, you're in the top tier of players. Consider sharing your knowledge with the community!`,
        icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
      });
    } else if (player.eloRate >= 1400 && player.eloRate < 1800) {
      insights.push({
        type: 'tip',
        title: 'Pushing for Higher Ranks',
        description: `You're at ${Math.round(player.eloRate)} ELO. Focus on advanced techniques and consistent execution to break into the elite tier.`,
        icon: <Target className="h-5 w-5 text-blue-500" />,
      });
    }
  }

  return insights;
}
