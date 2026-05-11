import { getAchievementImage } from '@/lib/utils/achievements';
import type { Achievement } from '@/types/api';

describe('getAchievementImage', () => {
  describe('Progressive Achievements', () => {
    it('should return correct path for bestTime level 1', () => {
      const achievement: Achievement = {
        id: 'bestTime',
        date: 1234567890,
        data: [],
        level: 1,
        value: 100,
        goal: 200,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/break_the_barrier_level_1.png');
    });

    it('should return correct path for bestTime level 12', () => {
      const achievement: Achievement = {
        id: 'bestTime',
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
        id: 'bestTime',
        date: 1234567890,
        data: [],
        level: 99,
        value: 100,
        goal: 200,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/break_the_barrier_level_12.png');
    });

    it('should return correct path for highestWinStreak', () => {
      const achievement: Achievement = {
        id: 'highestWinStreak',
        date: 1234567890,
        data: [],
        level: 5,
        value: 10,
        goal: 15,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/consistent_wins_level_5.png');
    });

    it('should return correct path for wins', () => {
      const achievement: Achievement = {
        id: 'wins',
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
    it('should return correct path for foodless', () => {
      const achievement: Achievement = {
        id: 'foodless',
        date: 1234567890,
        data: [],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/a_limited_diet.png');
    });

    it('should return correct path for classicRun', () => {
      const achievement: Achievement = {
        id: 'classicRun',
        date: 1234567890,
        data: [],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/classic.png');
    });

    it('should return correct path for summonWither', () => {
      const achievement: Achievement = {
        id: 'summonWither',
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
    it('should return correct path for playoffsResult 1st place', () => {
      const achievement: Achievement = {
        id: 'playoffsResult',
        date: 1234567890,
        data: ['1', '5'], // placement, season
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/playoffs_1st.png');
    });

    it('should return correct path for playoffsResult 2nd place', () => {
      const achievement: Achievement = {
        id: 'playoffsResult',
        date: 1234567890,
        data: ['2', '5'],
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/playoffs_2nd.png');
    });

    it('should return correct path for playoffsResult participant', () => {
      const achievement: Achievement = {
        id: 'playoffsResult',
        date: 1234567890,
        data: ['4', '5'], // 4th place = participant
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/playoffs_participant.png');
    });

    it('should return correct path for seasonResult rank 10 (top 10 bracket)', () => {
      const achievement: Achievement = {
        id: 'seasonResult',
        date: 1234567890,
        data: ['5', '10'], // season 5, placement 10
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/season_placement_top_10.png');
    });

    it('should return correct path for seasonResult rank 20 (top 50 bracket)', () => {
      const achievement: Achievement = {
        id: 'seasonResult',
        date: 1234567890,
        data: ['5', '20'], // season 5, placement 20
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/season_placement_top_50.png');
    });

    it('should return correct path for seasonResult rank 1 (top 1 bracket)', () => {
      const achievement: Achievement = {
        id: 'seasonResult',
        date: 1234567890,
        data: ['5', '1'], // season 5, placement 1
        level: 1,
        value: null,
        goal: null,
      };
      expect(getAchievementImage(achievement)).toBe('/achievements/season_placement_top_1.png');
    });

    it('should return correct path for weeklyRace top 5', () => {
      const achievement: Achievement = {
        id: 'weeklyRace',
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
      expect(getAchievementImage('bestTime')).toBe('/achievements/break_the_barrier_level_1.png');
    });

    it('should return correct path for one-time achievement string', () => {
      expect(getAchievementImage('foodless')).toBe('/achievements/a_limited_diet.png');
    });

    it('should return null for unknown achievement ID', () => {
      expect(getAchievementImage('UnknownAchievement')).toBeNull();
    });
  });
});
