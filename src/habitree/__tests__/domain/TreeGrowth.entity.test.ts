// Unit Tests für TreeGrowth Entity

import { TreeGrowth } from '../../domain/entities/TreeGrowth';

describe('TreeGrowth Entity', () => {
  const create = (overrides: Partial<{ userId: number; growthPercentage: number; totalCompletedHabits: number; streakCount: number }> = {}) => {
    const data = {
      userId: overrides.userId ?? 1,
      growthPercentage: overrides.growthPercentage ?? 0,
      totalCompletedHabits: overrides.totalCompletedHabits ?? 0,
      streakCount: overrides.streakCount ?? 0
    };
    return new TreeGrowth(data);
  };

  describe('getGrowthStage', () => {
    it('returns stage 1 for <20%', () => {
      const t = create({ growthPercentage: 0 });
      expect(t.getGrowthStage()).toBe(1);
      const t2 = create({ growthPercentage: 19 });
      expect(t2.getGrowthStage()).toBe(1);
    });

    it('returns stage 2 for 20-39%', () => {
      const t = create({ growthPercentage: 20 });
      expect(t.getGrowthStage()).toBe(2);
      const t2 = create({ growthPercentage: 39 });
      expect(t2.getGrowthStage()).toBe(2);
    });

    it('returns stage 3 for 40-59%', () => {
      expect(create({ growthPercentage: 40 }).getGrowthStage()).toBe(3);
      expect(create({ growthPercentage: 59 }).getGrowthStage()).toBe(3);
    });

    it('returns stage 4 for 60-79%', () => {
      expect(create({ growthPercentage: 60 }).getGrowthStage()).toBe(4);
      expect(create({ growthPercentage: 79 }).getGrowthStage()).toBe(4);
    });

    it('returns stage 5 for >=80%', () => {
      expect(create({ growthPercentage: 80 }).getGrowthStage()).toBe(5);
      expect(create({ growthPercentage: 100 }).getGrowthStage()).toBe(5);
    });
  });

  describe('getGrowthText', () => {
    it('returns formatted growth text', () => {
      const t = create({ growthPercentage: 42 });
      expect(t.getGrowthText()).toBe('Baum-Wachstum: 42%');
    });
  });

  describe('isFullyGrown', () => {
    it('is true at 100%', () => {
      expect(create({ growthPercentage: 100 }).isFullyGrown()).toBe(true);
    });

    it('is false below 100%', () => {
      expect(create({ growthPercentage: 99 }).isFullyGrown()).toBe(false);
    });
  });
});
