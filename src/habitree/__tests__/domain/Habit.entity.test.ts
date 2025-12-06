/**
 * Unit Tests für Habit Entity
 * 
 * Testet: domain/entities/Habit.ts
 * 
 * Testmethoden:
 * - Äquivalenzklassen (gültige/ungültige Eingaben)
 * - Grenzwertanalyse (0, 1, max Tage)
 * - Negativtests (leere Arrays, fehlerhafte Daten)
 */

import { Habit, HabitData, HabitEntry } from '../../domain/entities/Habit';

describe('Habit Entity', () => {
  // Helper: Erstellt Test-Habit mit Entries
  const createHabit = (entries: HabitEntry[] = []): Habit => {
    return new Habit({
      id: 1,
      name: 'Test Habit',
      description: 'Test Description',
      frequency: 'daily',
      entries
    });
  };

  // Helper: Erstellt Datum relativ zu heute
  const daysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  // ============================================
  // getStreak() - Streak-Berechnung
  // ============================================
  describe('getStreak', () => {
    // Grenzwert: Leeres Array
    it('sollte 0 zurückgeben für Habit ohne Entries', () => {
      const habit = createHabit([]);
      expect(habit.getStreak()).toBe(0);
    });

    // Grenzwert: Ein Tag
    it('sollte 1 zurückgeben für heute erledigten Habit', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null }
      ]);
      expect(habit.getStreak()).toBe(1);
    });

    // Normalfall: Mehrere Tage
    it('sollte aufeinanderfolgende Tage zählen', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: true, note: null },
        { id: 3, date: daysAgo(2), status: true, note: null }
      ]);
      expect(habit.getStreak()).toBe(3);
    });

    // Lücke in der Mitte
    it('sollte bei Lücke stoppen', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: true, note: null },
        // Lücke bei daysAgo(2)
        { id: 3, date: daysAgo(3), status: true, note: null }
      ]);
      expect(habit.getStreak()).toBe(3);
    });

    // Status false unterbricht Streak
    it('sollte bei status: false stoppen', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: false, note: null },
        { id: 3, date: daysAgo(2), status: true, note: null }
      ]);
      expect(habit.getStreak()).toBe(1);
    });

    // Unsortierte Entries
    it('sollte auch mit unsortierten Entries funktionieren', () => {
      const habit = createHabit([
        { id: 3, date: daysAgo(2), status: true, note: null },
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: true, note: null }
      ]);
      expect(habit.getStreak()).toBe(3);
    });
  });

  // ============================================
  // isCompletedToday() - Heute erledigt?
  // ============================================
  describe('isCompletedToday', () => {
    it('sollte true zurückgeben wenn heute erledigt', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null }
      ]);
      expect(habit.isCompletedToday()).toBe(true);
    });

    it('sollte false zurückgeben wenn heute nicht erledigt', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(1), status: true, note: null }
      ]);
      expect(habit.isCompletedToday()).toBe(false);
    });

    it('sollte false zurückgeben wenn Eintrag existiert aber status=false', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: false, note: null }
      ]);
      expect(habit.isCompletedToday()).toBe(false);
    });

    it('sollte false zurückgeben für leere Entries', () => {
      const habit = createHabit([]);
      expect(habit.isCompletedToday()).toBe(false);
    });
  });

  // ============================================
  // getCompletionRate() - Erfolgsquote
  // ============================================
  describe('getCompletionRate', () => {
    // Grenzwert: Leer
    it('sollte 0 zurückgeben für leere Entries', () => {
      const habit = createHabit([]);
      expect(habit.getCompletionRate()).toBe(0);
    });

    // Grenzwert: 100%
    it('sollte 100 zurückgeben wenn alle erledigt', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: true, note: null }
      ]);
      expect(habit.getCompletionRate()).toBe(100);
    });

    // Grenzwert: 0%
    it('sollte 0 zurückgeben wenn keiner erledigt', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: false, note: null },
        { id: 2, date: daysAgo(1), status: false, note: null }
      ]);
      expect(habit.getCompletionRate()).toBe(0);
    });

    // Normalfall: 50%
    it('sollte korrekte Prozentzahl berechnen (50%)', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: false, note: null },
        { id: 3, date: daysAgo(2), status: true, note: null },
        { id: 4, date: daysAgo(3), status: false, note: null }
      ]);
      expect(habit.getCompletionRate()).toBe(50);
    });

    // Rundung testen
    it('sollte auf ganze Zahlen runden (33%)', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: false, note: null },
        { id: 3, date: daysAgo(2), status: false, note: null }
      ]);
      expect(habit.getCompletionRate()).toBe(33);
    });
  });

  // ============================================
  // hasMilestone() - Meilenstein erreicht?
  // ============================================
  describe('hasMilestone', () => {
    it('sollte true zurückgeben bei 7-Tage-Streak', () => {
      const entries: HabitEntry[] = [];
      for (let i = 0; i < 7; i++) {
        entries.push({ id: i + 1, date: daysAgo(i), status: true, note: null });
      }
      const habit = createHabit(entries);
      expect(habit.hasMilestone(7)).toBe(true);
    });

    it('sollte false zurückgeben wenn Streak zu kurz', () => {
      const habit = createHabit([
        { id: 1, date: daysAgo(0), status: true, note: null },
        { id: 2, date: daysAgo(1), status: true, note: null }
      ]);
      expect(habit.hasMilestone(7)).toBe(false);
    });

    it('sollte 30-Tage-Meilenstein erkennen', () => {
      const entries: HabitEntry[] = [];
      for (let i = 0; i < 30; i++) {
        entries.push({ id: i + 1, date: daysAgo(i), status: true, note: null });
      }
      const habit = createHabit(entries);
      expect(habit.hasMilestone(30)).toBe(true);
      expect(habit.hasMilestone(31)).toBe(false);
    });
  });

  // ============================================
  // Constructor - Entity erstellen
  // ============================================
  describe('Constructor', () => {
    it('sollte Habit mit allen Properties erstellen', () => {
      const data: HabitData = {
        id: 42,
        name: 'Meditation',
        description: 'Täglich 10 Min',
        frequency: 'daily',
        entries: []
      };
      const habit = new Habit(data);

      expect(habit.id).toBe(42);
      expect(habit.name).toBe('Meditation');
      expect(habit.description).toBe('Täglich 10 Min');
      expect(habit.frequency).toBe('daily');
      expect(habit.entries).toEqual([]);
    });

    it('sollte Entries mit Notes korrekt übernehmen', () => {
      const entries = [
        { id: 1, date: '2025-06-10', status: true, note: 'Gut gemacht!' }
      ];
      const habit = createHabit(entries);

      expect(habit.entries).toHaveLength(1);
      expect(habit.entries[0].note).toBe('Gut gemacht!');
    });
  });
});
