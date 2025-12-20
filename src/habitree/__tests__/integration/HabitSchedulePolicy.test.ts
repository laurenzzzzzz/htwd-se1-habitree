import {
  buildHabitPersistenceRequest,
  shouldHabitOccurOnDate,
  formatDateForPersistence,
  formatTimeForPersistence,
  HabitScheduleLike,
} from '../../domain/services/HabitSchedulePolicy';
import { HabitPersistencePayload } from '../../domain/repositories/IHabitsRepository';

describe('HabitSchedulePolicy', () => {
  describe('buildHabitPersistenceRequest', () => {
    it('fills missing startDate and time with reference defaults', () => {
      const payload: HabitPersistencePayload = {
        name: 'Lesen',
        description: 'Abends 10 Minuten',
        frequency: 'Täglich',
      };
      const reference = new Date(2024, 0, 15, 10, 30, 0);

      const result = buildHabitPersistenceRequest(payload, reference);

      expect(result.startDate).toBe('15.01.2024');
      expect(result.time).toBe('10:30');
      expect(result.weekDays).toEqual([]);
      expect(result.intervalDays).toBeUndefined();
    });

    it('trims and converts intervalDays to number', () => {
      const payload: HabitPersistencePayload = {
        name: 'Workout',
        description: 'Alle zwei Tage',
        frequency: 'Intervalles',
        intervalDays: ' 3 ',
      };
      const reference = new Date(2024, 5, 1, 8, 15, 0);

      const result = buildHabitPersistenceRequest(payload, reference);

      expect(result.intervalDays).toBe(3);
      expect(result.startDate).toBe(formatDateForPersistence(reference));
      expect(result.time).toBe(formatTimeForPersistence(reference));
    });
  });

  describe('shouldHabitOccurOnDate', () => {
    const baseHabit: Partial<HabitScheduleLike> = {
      time: '08:00',
    };

    it('returns true for daily habits after start date', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Täglich',
        startDate: '01.01.2024',
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 2))).toBe(true);
    });

    it('respects weekly schedules and weekday mapping', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Wöchentlich',
        startDate: '01.01.2024',
        weekDays: [0, 2, 4], // Monday, Wednesday, Friday (0-indexed UI mapping)
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 3))).toBe(true); // Wednesday
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 4))).toBe(false); // Thursday
    });

    it('handles custom interval habits using days difference', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Benutzerdefiniert',
        startDate: '01.01.2024',
        intervalDays: 2,
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 3))).toBe(true); // 2 days later
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 4))).toBe(false);
    });

    it('supports legacy interval frequency values', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Intervalles',
        startDate: '01.01.2024',
        intervalDays: 3,
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 4))).toBe(true);
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 5))).toBe(false);
    });

    it('handles monthly schedules based on start day', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Monatlich',
        startDate: '31.01.2024',
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 1, 29))).toBe(true); // Feb (leap year)
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 2, 31))).toBe(true); // March 31
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 2, 30))).toBe(false);
    });
  });
});
