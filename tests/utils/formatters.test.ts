/**
 * Unit tests for formatter utility functions
 */

import {
  formatTime,
  formatTimeDifference,
  timestampToDate,
  formatRelativeTime,
  formatDate,
  formatElo,
  formatRank,
  formatPercentage,
  calculateWinRate,
  formatWinRate,
  formatEloChange,
} from '../../src/lib/utils/formatters';

describe('formatters', () => {
  describe('formatTime', () => {
    it('formats milliseconds correctly without hours', () => {
      expect(formatTime(323456)).toBe('5:23.456');
    });

    it('formats milliseconds correctly with hours', () => {
      expect(formatTime(3723456)).toBe('1:02:03.456');
    });

    it('suppresses milliseconds when requested', () => {
      expect(formatTime(323456, true)).toBe('5:23');
    });

    it('handles zero time', () => {
      expect(formatTime(0)).toBe('0:00.000');
    });

    it('pads numbers correctly', () => {
      expect(formatTime(125)).toBe('0:00.125');
      expect(formatTime(65123)).toBe('1:05.123');
    });
  });

  describe('formatTimeDifference', () => {
    it('formats positive differences', () => {
      expect(formatTimeDifference(5000)).toBe('+0:05.000');
    });

    it('formats negative differences', () => {
      expect(formatTimeDifference(-5000)).toBe('-0:05.000');
    });

    it('formats zero difference', () => {
      expect(formatTimeDifference(0)).toBe('+0:00.000');
    });
  });

  describe('timestampToDate', () => {
    it('converts Unix timestamp to Date object', () => {
      const timestamp = 1640995200; // Jan 1, 2022 00:00:00 UTC
      const date = timestampToDate(timestamp);
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBe(timestamp * 1000);
    });
  });

  describe('formatElo', () => {
    it('formats ELO with commas', () => {
      expect(formatElo(1500)).toBe('1,500');
      expect(formatElo(15000)).toBe('15,000');
    });

    it('handles null ELO', () => {
      expect(formatElo(null)).toBe('Unranked');
    });

    it('handles zero ELO', () => {
      expect(formatElo(0)).toBe('0');
    });
  });

  describe('formatRank', () => {
    it('formats ranks with correct ordinal suffixes', () => {
      expect(formatRank(1)).toBe('1st');
      expect(formatRank(2)).toBe('2nd');
      expect(formatRank(3)).toBe('3rd');
      expect(formatRank(4)).toBe('4th');
      expect(formatRank(11)).toBe('11th');
      expect(formatRank(12)).toBe('12th');
      expect(formatRank(13)).toBe('13th');
      expect(formatRank(21)).toBe('21st');
      expect(formatRank(22)).toBe('22nd');
      expect(formatRank(23)).toBe('23rd');
      expect(formatRank(101)).toBe('101st');
    });

    it('handles null rank', () => {
      expect(formatRank(null)).toBe('Unranked');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage with default decimals', () => {
      expect(formatPercentage(50.5)).toBe('50.5%');
    });

    it('formats percentage with custom decimals', () => {
      expect(formatPercentage(50.5555, 2)).toBe('50.56%');
    });
  });

  describe('calculateWinRate', () => {
    it('calculates win rate correctly', () => {
      expect(calculateWinRate(50, 50)).toBe(50);
      expect(calculateWinRate(75, 25)).toBe(75);
      expect(calculateWinRate(33, 67)).toBeCloseTo(33, 0);
    });

    it('handles zero total matches', () => {
      expect(calculateWinRate(0, 0)).toBe(0);
    });

    it('handles 100% win rate', () => {
      expect(calculateWinRate(100, 0)).toBe(100);
    });

    it('handles 0% win rate', () => {
      expect(calculateWinRate(0, 100)).toBe(0);
    });
  });

  describe('formatWinRate', () => {
    it('formats win rate with default decimals', () => {
      expect(formatWinRate(50, 50)).toBe('50.0');
    });

    it('formats win rate with custom decimals', () => {
      expect(formatWinRate(33, 67, 2)).toMatch(/33\.\d{2}/);
    });
  });

  describe('formatEloChange', () => {
    it('formats positive ELO change with plus sign', () => {
      expect(formatEloChange(15)).toBe('+15');
    });

    it('formats negative ELO change with minus sign', () => {
      expect(formatEloChange(-15)).toBe('-15');
    });

    it('formats zero change with plus sign', () => {
      expect(formatEloChange(0)).toBe('+0');
    });
  });
});

// Run tests if directly executed
if (typeof describe === 'undefined') {
  console.log('⚠️  This file needs to be run with a test runner like Vitest or Jest');
  console.log('Install Vitest: npm install -D vitest');
  console.log('Run tests: npx vitest tests/utils/formatters.test.ts');
}
