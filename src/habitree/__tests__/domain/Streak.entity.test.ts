import { Streak } from '../../domain/entities/Streak';

describe('Streak Entity', () => {
  const createStreak = (overrides: Partial<{ userId: number; currentStreak: number; longestStreak: number; lastCompletionDate: Date }> = {}) => {
    const now = new Date();
    const data = {
      userId: overrides.userId ?? 1,
      currentStreak: overrides.currentStreak ?? 0,
      longestStreak: overrides.longestStreak ?? 0,
      lastCompletionDate: overrides.lastCompletionDate ?? now
    };
    return new Streak(data);
  };

  const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };

  describe('isActive', () => {
    it('should be active when lastCompletionDate is today', () => {
      const s = createStreak({ currentStreak: 3, lastCompletionDate: new Date() });
      expect(s.isActive()).toBe(true);
    });

    it('should not be active when lastCompletionDate is yesterday', () => {
      const s = createStreak({ currentStreak: 2, lastCompletionDate: daysAgo(1) });
      expect(s.isActive()).toBe(false);
    });
  });

  describe('getMilestoneMessage', () => {
    it('returns simple days text for streaks < 7', () => {
      const s = createStreak({ currentStreak: 3 });
      expect(s.getMilestoneMessage()).toBe('3 Tage');
    });

    it('returns week message for 7 day streak', () => {
      const s = createStreak({ currentStreak: 7 });
      expect(s.getMilestoneMessage()).toBe('7 Tage - Eine Woche! ');
    });

    it('returns month message for 30 day streak', () => {
      const s = createStreak({ currentStreak: 30 });
      expect(s.getMilestoneMessage()).toBe('30 Tage - Ein Monat! ');
    });

    it('returns legend message for large streaks', () => {
      const s = createStreak({ currentStreak: 150 });
      expect(s.getMilestoneMessage()).toBe('150 Tage - Legende! ');
    });
  });

  describe('getDisplayText', () => {
    it('returns current streak as string', () => {
      const s = createStreak({ currentStreak: 5 });
      expect(s.getDisplayText()).toBe('5');
    });
  });
});