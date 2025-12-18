import { TreeGrowth } from '../../domain/entities/TreeGrowth';

describe('TreeGrowth Entity', () => {
  it('should construct with all properties', () => {
    const data = { userId: 1, growthPercentage: 35, totalCompletedHabits: 12, streakCount: 5 } as const;
    const t = new TreeGrowth(data as any);

    expect(t.userId).toBe(1);
    expect(t.growthPercentage).toBe(35);
    expect(t.totalCompletedHabits).toBe(12);
    expect(t.streakCount).toBe(5);
  });

  describe('getGrowthStage', () => {
    it('returns stage 1 for <20%', () => {
      expect(new TreeGrowth({ userId: 1, growthPercentage: 0, totalCompletedHabits: 0, streakCount: 0 }).getGrowthStage()).toBe(1);
    });

    it('returns stage 2 for 20-39%', () => {
      expect(new TreeGrowth({ userId: 1, growthPercentage: 25, totalCompletedHabits: 0, streakCount: 0 }).getGrowthStage()).toBe(2);
    });

    it('returns stage 3 for 40-59%', () => {
      expect(new TreeGrowth({ userId: 1, growthPercentage: 50, totalCompletedHabits: 0, streakCount: 0 }).getGrowthStage()).toBe(3);
    });

    it('returns stage 4 for 60-79%', () => {
      expect(new TreeGrowth({ userId: 1, growthPercentage: 75, totalCompletedHabits: 0, streakCount: 0 }).getGrowthStage()).toBe(4);
    });

    it('returns stage 5 for >=80%', () => {
      expect(new TreeGrowth({ userId: 1, growthPercentage: 80, totalCompletedHabits: 0, streakCount: 0 }).getGrowthStage()).toBe(5);
      expect(new TreeGrowth({ userId: 1, growthPercentage: 100, totalCompletedHabits: 0, streakCount: 0 }).getGrowthStage()).toBe(5);
    });
  });

  it('getGrowthText should include percentage', () => {
    const t = new TreeGrowth({ userId: 2, growthPercentage: 42, totalCompletedHabits: 3, streakCount: 1 });
    expect(t.getGrowthText()).toBe('Baum-Wachstum: 42%');
  });

  it('isFullyGrown should be true for 100% and false otherwise', () => {
    expect(new TreeGrowth({ userId: 1, growthPercentage: 99, totalCompletedHabits: 0, streakCount: 0 }).isFullyGrown()).toBe(false);
    expect(new TreeGrowth({ userId: 1, growthPercentage: 100, totalCompletedHabits: 0, streakCount: 0 }).isFullyGrown()).toBe(true);
    expect(new TreeGrowth({ userId: 1, growthPercentage: 150, totalCompletedHabits: 0, streakCount: 0 }).isFullyGrown()).toBe(true);
  });
});
