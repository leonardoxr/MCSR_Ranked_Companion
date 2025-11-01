/**
 * Unit tests for color utility functions
 */

import {
  RANK_TIERS,
  getRankTier,
  getEloChangeColor,
  getPaceColor,
  MATCH_TYPE_COLORS,
  getMatchTypeColor,
} from '../../src/lib/utils/colors';

describe('colors', () => {
  describe('RANK_TIERS', () => {
    it('has correct tier definitions', () => {
      expect(RANK_TIERS).toHaveLength(6);
      expect(RANK_TIERS[0].name).toBe('Coal');
      expect(RANK_TIERS[5].name).toBe('Netherite');
    });

    it('has non-overlapping ranges', () => {
      for (let i = 0; i < RANK_TIERS.length - 1; i++) {
        expect(RANK_TIERS[i].max).toBeLessThan(RANK_TIERS[i + 1].min);
      }
    });
  });

  describe('getRankTier', () => {
    it('returns Coal tier for low ELO', () => {
      const tier = getRankTier(500);
      expect(tier.name).toBe('Coal');
    });

    it('returns Iron tier for iron range ELO', () => {
      const tier = getRankTier(700);
      expect(tier.name).toBe('Iron');
    });

    it('returns Gold tier for gold range ELO', () => {
      const tier = getRankTier(1000);
      expect(tier.name).toBe('Gold');
    });

    it('returns Emerald tier for emerald range ELO', () => {
      const tier = getRankTier(1300);
      expect(tier.name).toBe('Emerald');
    });

    it('returns Diamond tier for diamond range ELO', () => {
      const tier = getRankTier(1600);
      expect(tier.name).toBe('Diamond');
    });

    it('returns Netherite tier for high ELO', () => {
      const tier = getRankTier(2000);
      expect(tier.name).toBe('Netherite');
    });

    it('returns Coal tier for null ELO', () => {
      const tier = getRankTier(null);
      expect(tier.name).toBe('Coal');
    });

    it('returns correct tier at boundaries', () => {
      expect(getRankTier(600).name).toBe('Coal');
      expect(getRankTier(601).name).toBe('Iron');
      expect(getRankTier(900).name).toBe('Iron');
      expect(getRankTier(901).name).toBe('Gold');
    });
  });

  describe('getEloChangeColor', () => {
    it('returns green for positive change', () => {
      expect(getEloChangeColor(15)).toBe('#2ecc71');
    });

    it('returns red for negative change', () => {
      expect(getEloChangeColor(-15)).toBe('#e74c3c');
    });

    it('returns gray for zero change', () => {
      expect(getEloChangeColor(0)).toBe('#95a5a6');
    });
  });

  describe('getPaceColor', () => {
    it('returns green when ahead of pace', () => {
      const color = getPaceColor(10000, 12000);
      expect(color).toBe('rgba(128, 255, 128, 1)');
    });

    it('returns red when behind pace', () => {
      const color = getPaceColor(12000, 10000);
      expect(color).toBe('rgba(255, 128, 128, 1)');
    });

    it('returns white when on pace', () => {
      const color = getPaceColor(10000, 10500);
      expect(color).toBe('rgba(255, 255, 255, 0.8)');
    });

    it('uses 1 second threshold', () => {
      // Within threshold
      expect(getPaceColor(10000, 10900)).toBe('rgba(255, 255, 255, 0.8)');
      // Outside threshold
      expect(getPaceColor(10000, 11100)).toBe('rgba(255, 128, 128, 1)');
    });
  });

  describe('MATCH_TYPE_COLORS', () => {
    it('has colors for all match types', () => {
      expect(MATCH_TYPE_COLORS[1]).toBeDefined(); // Casual
      expect(MATCH_TYPE_COLORS[2]).toBeDefined(); // Ranked
      expect(MATCH_TYPE_COLORS[3]).toBeDefined(); // Private
      expect(MATCH_TYPE_COLORS[4]).toBeDefined(); // Event
    });
  });

  describe('getMatchTypeColor', () => {
    it('returns correct color for casual matches', () => {
      expect(getMatchTypeColor(1)).toBe('#95a5a6');
    });

    it('returns correct color for ranked matches', () => {
      expect(getMatchTypeColor(2)).toBe('#e74c3c');
    });

    it('returns correct color for private matches', () => {
      expect(getMatchTypeColor(3)).toBe('#9b59b6');
    });

    it('returns correct color for event matches', () => {
      expect(getMatchTypeColor(4)).toBe('#f39c12');
    });

    it('returns default color for unknown match type', () => {
      expect(getMatchTypeColor(999)).toBe('#95a5a6');
    });
  });
});

// Run tests if directly executed
if (typeof describe === 'undefined') {
  console.log('⚠️  This file needs to be run with a test runner like Vitest or Jest');
  console.log('Install Vitest: npm install -D vitest');
  console.log('Run tests: npx vitest tests/utils/colors.test.ts');
}
