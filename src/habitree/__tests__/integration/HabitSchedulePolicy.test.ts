import {
  buildHabitPersistenceRequest,
  shouldHabitOccurOnDate,
  formatDateForPersistence,
  formatTimeForPersistence,
  hasEntryForDate,
  findFirstValidDateForWeekdays,
  isSameDay,
  HabitScheduleLike,
} from '../../domain/policies/HabitSchedulePolicy';
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

    it('respects durationDays and returns false after duration ends', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Täglich',
        startDate: '01.01.2024',
        durationDays: 5,
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 1))).toBe(true); // Tag 0
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 3))).toBe(true); // Tag 2
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 5))).toBe(true); // Tag 4
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 6))).toBe(false); // Tag 5 - außerhalb
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 10))).toBe(false); // weit außerhalb
    });

    it('returns false for date before startDate', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Täglich',
        startDate: '10.01.2024',
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 9))).toBe(false);
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 10))).toBe(true);
    });

    it('returns false if startDate is invalid', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Täglich',
        startDate: undefined,
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 10))).toBe(false);
    });

    it('parses ISO date strings correctly', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Täglich',
        startDate: '2024-01-15', // ISO format
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 15))).toBe(true);
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 16))).toBe(true);
    });

    it('handles Date objects as startDate', () => {
      const habit = {
        ...baseHabit,
        frequency: 'Täglich',
        startDate: new Date(2024, 0, 20) as any,
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 20))).toBe(true);
      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 21))).toBe(true);
    });

    it('returns false for unknown frequency types', () => {
      const habit = {
        ...baseHabit,
        frequency: 'UnbekannteFrequenz',
        startDate: '01.01.2024',
      } as HabitScheduleLike;

      expect(shouldHabitOccurOnDate(habit, new Date(2024, 0, 5))).toBe(false);
    });
  });

  describe('hasEntryForDate', () => {
    it('returns true if habit has entry for given date', () => {
      const habit: HabitScheduleLike = {
        frequency: 'Täglich',
        startDate: '01.01.2024',
        time: '08:00',
        entries: [
          { id: 1, date: '2024-01-05', status: true, note: null },
          { id: 2, date: '2024-01-06', status: false, note: null },
        ],
      };

      expect(hasEntryForDate(habit, new Date(2024, 0, 5))).toBe(true);
      expect(hasEntryForDate(habit, new Date(2024, 0, 6))).toBe(true);
      expect(hasEntryForDate(habit, new Date(2024, 0, 7))).toBe(false);
    });

    it('returns false if no entries exist', () => {
      const habit: HabitScheduleLike = {
        frequency: 'Täglich',
        startDate: '01.01.2024',
        time: '08:00',
        entries: [],
      };

      expect(hasEntryForDate(habit, new Date(2024, 0, 5))).toBe(false);
    });

    it('returns false if entries field is undefined', () => {
      const habit: HabitScheduleLike = {
        frequency: 'Täglich',
        startDate: '01.01.2024',
        time: '08:00',
      };

      expect(hasEntryForDate(habit, new Date(2024, 0, 5))).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('returns true for same date', () => {
      const date1 = new Date(2024, 5, 15, 10, 30, 45);
      const date2 = new Date(2024, 5, 15, 23, 59, 59);

      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different dates', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 16);

      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for same day/month but different year', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2023, 5, 15);

      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('findFirstValidDateForWeekdays', () => {
    it('returns start date if it matches one of the weekdays', () => {
      // 01.01.2024 ist ein Montag (weekDay 0 in unserem System)
      const result = findFirstValidDateForWeekdays('01.01.2024', [0, 2, 4]);

      expect(result).toBe('01.01.2024');
    });

    it('finds next valid weekday if start date does not match', () => {
      // 01.01.2024 ist Montag (0), wir wollen nur Mittwoch (2)
      const result = findFirstValidDateForWeekdays('01.01.2024', [2]);

      expect(result).toBe('03.01.2024'); // Mittwoch
    });

    it('returns original string if weekDays is empty', () => {
      const result = findFirstValidDateForWeekdays('15.03.2024', []);

      expect(result).toBe('15.03.2024');
    });

    it('returns original string if weekDays is undefined', () => {
      const result = findFirstValidDateForWeekdays('15.03.2024', undefined as any);

      expect(result).toBe('15.03.2024');
    });

    it('returns original string if date format is invalid', () => {
      const result = findFirstValidDateForWeekdays('invalid-date', [1, 3]);

      expect(result).toBe('invalid-date');
    });

    it('handles month transitions correctly', () => {
      // 31.01.2024 ist Mittwoch (2), wir wollen Donnerstag (3)
      const result = findFirstValidDateForWeekdays('31.01.2024', [3]);

      expect(result).toBe('01.02.2024'); // nächster Donnerstag ist schon im Februar
    });

    it('cycles through week to find matching day', () => {
      // 01.01.2024 ist Montag (0), wir suchen Sonntag (6)
      const result = findFirstValidDateForWeekdays('01.01.2024', [6]);

      expect(result).toBe('07.01.2024'); // nächster Sonntag
    });
  });

  describe('buildHabitPersistenceRequest - edge cases', () => {
    it('handles empty string for intervalDays', () => {
      const payload: HabitPersistencePayload = {
        name: 'Test',
        description: 'Test',
        frequency: 'Benutzerdefiniert',
        intervalDays: '',
      };

      const result = buildHabitPersistenceRequest(payload);

      expect(result.intervalDays).toBeUndefined();
    });

    it('handles empty string for durationDays', () => {
      const payload: HabitPersistencePayload = {
        name: 'Test',
        description: 'Test',
        frequency: 'Täglich',
        durationDays: '  ',
      };

      const result = buildHabitPersistenceRequest(payload);

      expect(result.durationDays).toBeUndefined();
    });

    it('preserves provided startDate and time', () => {
      const payload: HabitPersistencePayload = {
        name: 'Gym',
        description: 'Krafttraining',
        frequency: 'Wöchentlich',
        startDate: '20.03.2024',
        time: '18:30',
      };

      const result = buildHabitPersistenceRequest(payload);

      expect(result.startDate).toBe('20.03.2024');
      expect(result.time).toBe('18:30');
    });

    it('trims whitespace from startDate and time', () => {
      const payload: HabitPersistencePayload = {
        name: 'Test',
        description: 'Test',
        frequency: 'Täglich',
        startDate: '  15.06.2024  ',
        time: '  09:15  ',
      };

      const result = buildHabitPersistenceRequest(payload);

      expect(result.startDate).toBe('15.06.2024');
      expect(result.time).toBe('09:15');
    });

    it('converts empty weekDays to empty array', () => {
      const payload: HabitPersistencePayload = {
        name: 'Test',
        description: 'Test',
        frequency: 'Wöchentlich',
        weekDays: [],
      };

      const result = buildHabitPersistenceRequest(payload);

      expect(result.weekDays).toEqual([]);
    });
  });
});
