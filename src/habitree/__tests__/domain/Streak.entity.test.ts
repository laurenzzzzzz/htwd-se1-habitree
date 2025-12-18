import { Streak } from '../../domain/entities/Streak';

describe('Streak Entity', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-12-16T09:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('isActive should return true when lastCompletionDate is today', () => {
    const today = new Date('2025-12-16T00:00:00Z');
    const s = new Streak({ userId: 1, currentStreak: 3, longestStreak: 5, lastCompletionDate: today });
    expect(s.isActive()).toBe(true);
  });

  it('isActive should return false when lastCompletionDate is not today', () => {
    const yesterday = new Date('2025-12-15T23:59:59Z');
    const s = new Streak({ userId: 1, currentStreak: 3, longestStreak: 5, lastCompletionDate: yesterday });
    expect(s.isActive()).toBe(false);
  });

  describe('getMilestoneMessage', () => {
    it('returns simple days message for streak < 7', () => {
      const s = new Streak({ userId: 1, currentStreak: 3, longestStreak: 10, lastCompletionDate: new Date() });
      expect(s.getMilestoneMessage()).toBe('3 Tage');
    });

    it('returns week message for streak between 7 and 29', () => {
      const s = new Streak({ userId: 1, currentStreak: 10, longestStreak: 12, lastCompletionDate: new Date() });
      expect(s.getMilestoneMessage()).toBe('10 Tage - Eine Woche! 🎉');
    });

    it('returns month message for streak between 30 and 99', () => {
      const s = new Streak({ userId: 1, currentStreak: 45, longestStreak: 50, lastCompletionDate: new Date() });
      expect(s.getMilestoneMessage()).toBe('45 Tage - Ein Monat! 🚀');
    });

    it('returns legend message for streak >= 100', () => {
      const s = new Streak({ userId: 1, currentStreak: 120, longestStreak: 150, lastCompletionDate: new Date() });
      expect(s.getMilestoneMessage()).toBe('120 Tage - Legende! 👑');
    });
  });

  it('getDisplayText should return currentStreak as string', () => {
    const s = new Streak({ userId: 2, currentStreak: 7, longestStreak: 7, lastCompletionDate: new Date() });
    expect(s.getDisplayText()).toBe('7');
  });
});
