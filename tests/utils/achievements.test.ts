import { getAchievementImage } from '@/lib/utils/achievements';
import type { Achievement } from '@/types/api';

describe('getAchievementImage', () => {
  describe('Progressive Achievements', () => {
    it('should return correct path for BestTime level 1', () => {
      const achievement: Achievement = {
        id: 'BestTime',
        date: 1234567890,
        data: [],
        level: 1,
        value: 100,
        goal: 200,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/break_the_barrier_level_1.png');
    });

    it('should return correct path for BestTime level 12', () => {
      const achievement: Achievement = {
        id: 'BestTime',
        date: 1234567890,
        data: [],
        level: 12,
        value: 100,
        goal: 200,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/break_the_barrier_level_12.png');
    });

    it('should clamp levels above 12', () => {
      const achievement: Achievement = {
        id: 'BestTime',
        date: 1234567890,
        data: [],
        level: 99,
        value: 100,
        goal: 200,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/break_the_barrier_level_12.png');
    });

    it('should return correct path for HighestWinStreak', () => {
      const achievement: Achievement = {
        id: 'HighestWinStreak',
        date: 1234567890,
        data: [],
        level: 5,
        value: 10,
        goal: 15,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/consistent_wins_level_5.png');
    });

    it('should return correct path for Wins', () => {
      const achievement: Achievement = {
        id: 'Wins',
        date: 1234567890,
        data: [],
        level: 8,
        value: 500,
        goal: 1000,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/w_collector_level_8.png');
    });
  });

  describe('One-Time Achievements', () => {
    it('should return correct path for Foodless', () => {
      const achievement: Achievement = {
        id: 'Foodless',
        date: 1234567890,
        data: [],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/a_limited_diet.png');
    });

    it('should return correct path for ClassicRun', () => {
      const achievement: Achievement = {
        id: 'ClassicRun',
        date: 1234567890,
        data: [],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/classic.png');
    });

    it('should return correct path for SummonWither', () => {
      const achievement: Achievement = {
        id: 'SummonWither',
        date: 1234567890,
        data: [],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/wrong_category.png');
    });
  });

  describe('Competitive Achievements', () => {
    it('should return correct path for PlayoffsOutcome 1st place', () => {
      const achievement: Achievement = {
        id: 'PlayoffsOutcome',
        date: 1234567890,
        data: ['1', '5'], // placement, season
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/playoffs_1st.png');
    });

    it('should return correct path for PlayoffsOutcome 2nd place', () => {
      const achievement: Achievement = {
        id: 'PlayoffsOutcome',
        date: 1234567890,
        data: ['2', '5'],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/playoffs_2nd.png');
    });

    it('should return correct path for PlayoffsOutcome participant', () => {
      const achievement: Achievement = {
        id: 'PlayoffsOutcome',
        date: 1234567890,
        data: ['4', '5'], // 4th place = participant
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/playoffs_participant.png');
    });

    it('should return correct path for SeasonOutcome top 10', () => {
      const achievement: Achievement = {
        id: 'SeasonOutcome',
        date: 1234567890,
        data: ['10', '5'],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/season_placement_top_10.png');
    });

    it('should return correct path for WeeklyRace top 5', () => {
      const achievement: Achievement = {
        id: 'WeeklyRace',
        date: 1234567890,
        data: ['5'],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/weekly_race_top_5.png');
    });
  });

  describe('Legacy string-only calls', () => {
    it('should return level 1 for progressive achievement string', () => {
      expect(getAchievementImage('BestTime')).toBe('/achievements/break_the_barrier_level_1.png');
    });

    it('should return correct path for one-time achievement string', () => {
      expect(getAchievementImage('Foodless')).toBe('/achievements/a_limited_diet.png');
    });

    it('should return null for unknown achievement ID', () => {
      expect(getAchievementImage('UnknownAchievement')).toBeNull();
    });
  });
});
