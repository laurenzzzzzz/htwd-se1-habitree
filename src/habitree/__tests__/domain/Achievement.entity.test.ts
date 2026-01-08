// Unit Tests für Achievement Entity

import { Achievement, AchievementData } from '../../domain/entities/Achievement';

describe('Achievement Entity', () => {
  const createAchievementData = (overrides: Partial<AchievementData> = {}): AchievementData => {
    const now = new Date();
    return {
      id: overrides.id ?? 1,
      userId: overrides.userId ?? 10,
      name: overrides.name ?? 'First Win',
      description: overrides.description ?? 'Unlocked first milestone',
      imageUrl: overrides.imageUrl ?? 'http://example.com/badge.png',
      unlockedAt: overrides.unlockedAt ?? now,
      habitId: overrides.habitId
    } as AchievementData;
  };

  const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };

  describe('Constructor', () => {
    it('should create Achievement with all properties', () => {
      const data = createAchievementData({ id: 42, userId: 7, name: 'Test', description: 'Desc', imageUrl: 'img', unlockedAt: new Date('2025-01-01'), habitId: 99 });
      const a = new Achievement(data);

      expect(a.id).toBe(42);
      expect(a.userId).toBe(7);
      expect(a.name).toBe('Test');
      expect(a.description).toBe('Desc');
      expect(a.imageUrl).toBe('img');
      expect(a.unlockedAt).toEqual(new Date('2025-01-01'));
      expect(a.habitId).toBe(99);
    });
  });

  describe('getDaysSinceUnlock', () => {
    it('returns 0 for achievement unlocked today', () => {
      const data = createAchievementData({ unlockedAt: new Date() });
      const a = new Achievement(data);
      expect(a.getDaysSinceUnlock()).toBe(0);
    });

    it('returns correct number of days for past date', () => {
      const d = daysAgo(3);
      const data = createAchievementData({ unlockedAt: d });
      const a = new Achievement(data);
      expect(a.getDaysSinceUnlock()).toBe(3);
    });
  });

  describe('isRecent', () => {
    it('is recent when within 7 days (boundary)', () => {
      const a = new Achievement(createAchievementData({ unlockedAt: daysAgo(7) }));
      expect(a.isRecent()).toBe(true);
    });

    it('is not recent when older than 7 days', () => {
      const a = new Achievement(createAchievementData({ unlockedAt: daysAgo(8) }));
      expect(a.isRecent()).toBe(false);
    });
  });

  describe('getFormattedUnlockDate', () => {
    it('returns localized german date string', () => {
      const d = new Date('2025-06-15T00:00:00Z');
      const a = new Achievement(createAchievementData({ unlockedAt: d }));
      // Compare with JS locale formatting to avoid environment differences
      expect(a.getFormattedUnlockDate()).toBe(d.toLocaleDateString('de-DE'));
    });
  });
});
