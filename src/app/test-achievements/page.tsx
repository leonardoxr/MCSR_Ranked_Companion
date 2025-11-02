'use client';

import { AchievementCard, AchievementIcon } from '@/components/features/AchievementIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { Achievement } from '@/types/api';

const testAchievements: Achievement[] = [
  // Progressive achievements
  {
    id: 'bestTime',
    date: 1234567890,
    data: [],
    level: 1,
    value: 100,
    goal: 200,
  },
  {
    id: 'bestTime',
    date: 1234567890,
    data: [],
    level: 5,
    value: 500,
    goal: 1000,
  },
  {
    id: 'highestWinStreak',
    date: 1234567890,
    data: [],
    level: 3,
    value: 10,
    goal: 15,
  },
  {
    id: 'wins',
    date: 1234567890,
    data: [],
    level: 8,
    value: 500,
    goal: 1000,
  },
  {
    id: 'playedMatches',
    date: 1234567890,
    data: [],
    level: 12,
    value: 1000,
    goal: 1000,
  },
  {
    id: 'playtime',
    date: 1234567890,
    data: [],
    level: 6,
    value: 50,
    goal: 100,
  },
  // One-time achievements
  {
    id: 'foodless',
    date: 1234567890,
    data: [],
    level: 1,
    value: null,
    goal: null,
  },
  {
    id: 'classicRun',
    date: 1234567890,
    data: [],
    level: 1,
    value: null,
    goal: null,
  },
  {
    id: 'armorless',
    date: 1234567890,
    data: [],
    level: 1,
    value: null,
    goal: null,
  },
  {
    id: 'ironPickless',
    date: 1234567890,
    data: [],
    level: 1,
    value: null,
    goal: null,
  },
  // Competitive achievements
  {
    id: 'playoffsResult',
    date: 1234567890,
    data: ['1', '5'],
    level: 1,
    value: null,
    goal: null,
  },
  {
    id: 'playoffsResult',
    date: 1234567890,
    data: ['2', '5'],
    level: 1,
    value: null,
    goal: null,
  },
  {
    id: 'seasonResult',
    date: 1234567890,
    data: ['10', '5'],
    level: 1,
    value: null,
    goal: null,
  },
  {
    id: 'weeklyRace',
    date: 1234567890,
    data: ['5'],
    level: 1,
    value: null,
    goal: null,
  },
];

export default function TestAchievementsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Achievement Image Test</h1>

      <Card variant="mc">
        <CardHeader>
          <CardTitle>Progressive Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testAchievements
              .filter(a => ['bestTime', 'highestWinStreak', 'wins', 'playedMatches', 'playtime'].includes(a.id))
              .map((achievement, index) => (
                <AchievementCard
                  key={`${achievement.id}-${achievement.level}-${index}`}
                  achievement={achievement}
                />
              ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="mc">
        <CardHeader>
          <CardTitle>One-Time Challenge Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testAchievements
              .filter(a => ['foodless', 'classicRun', 'armorless', 'ironPickless'].includes(a.id))
              .map((achievement, index) => (
                <AchievementCard
                  key={`${achievement.id}-${index}`}
                  achievement={achievement}
                />
              ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="mc">
        <CardHeader>
          <CardTitle>Competitive Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testAchievements
              .filter(a => ['playoffsResult', 'seasonResult', 'weeklyRace'].includes(a.id))
              .map((achievement, index) => (
                <AchievementCard
                  key={`${achievement.id}-${JSON.stringify(achievement.data)}-${index}`}
                  achievement={achievement}
                />
              ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="mc">
        <CardHeader>
          <CardTitle>Icon Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 items-center">
            <div>
              <p className="text-sm mb-2">32px</p>
              <AchievementIcon achievement={testAchievements[0]} size={32} />
            </div>
            <div>
              <p className="text-sm mb-2">48px</p>
              <AchievementIcon achievement={testAchievements[0]} size={48} />
            </div>
            <div>
              <p className="text-sm mb-2">64px (default)</p>
              <AchievementIcon achievement={testAchievements[0]} size={64} />
            </div>
            <div>
              <p className="text-sm mb-2">96px</p>
              <AchievementIcon achievement={testAchievements[0]} size={96} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
