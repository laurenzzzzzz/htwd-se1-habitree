
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
      expect(habit.getStreak()).toBe(2);
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

  // ============================================
  // getStreak mit Backend-Wert (currentStreak)
  // ============================================
  describe('getStreak mit Backend currentStreak', () => {
    it('sollte Backend-Wert verwenden wenn currentStreak gesetzt ist', () => {
      const habit = new Habit({
        id: 1,
        name: 'Test',
        description: 'Test',
        frequency: 'daily',
        entries: [
          { id: 1, date: daysAgo(0), status: true, note: null },
          { id: 2, date: daysAgo(1), status: true, note: null }
        ],
        currentStreak: 15 // Backend sagt: Streak ist 15
      });

      // Sollte Backend-Wert verwenden, nicht selbst berechnen
      expect(habit.getStreak()).toBe(15);
    });

    it('sollte 0 zurückgeben wenn Backend currentStreak 0 ist', () => {
      const habit = new Habit({
        id: 1,
        name: 'Test',
        description: 'Test',
        frequency: 'daily',
        entries: [],
        currentStreak: 0
      });

      expect(habit.getStreak()).toBe(0);
    });
  });

  // ============================================
  // getEntryForDate - Entry für Datum finden
  // ============================================
  describe('getEntryForDate', () => {
    it('sollte Entry für gegebenes Datum zurückgeben', () => {
      const targetDate = new Date(2024, 5, 15);
      const habit = createHabit([
        { id: 1, date: '2024-06-15', status: true, note: 'Geschafft!' },
        { id: 2, date: '2024-06-16', status: false, note: null }
      ]);

      const entry = habit.getEntryForDate(targetDate);

      expect(entry).toBeDefined();
      expect(entry?.id).toBe(1);
      expect(entry?.status).toBe(true);
      expect(entry?.note).toBe('Geschafft!');
    });

    it('sollte undefined zurückgeben wenn kein Entry für Datum existiert', () => {
      const habit = createHabit([
        { id: 1, date: '2024-06-15', status: true, note: null }
      ]);

      const entry = habit.getEntryForDate(new Date(2024, 5, 20));

      expect(entry).toBeUndefined();
    });

    it('sollte auch bei mehreren Entries das richtige Datum finden', () => {
      const habit = createHabit([
        { id: 1, date: '2024-06-10', status: true, note: null },
        { id: 2, date: '2024-06-15', status: true, note: null },
        { id: 3, date: '2024-06-20', status: false, note: null }
      ]);

      const entry = habit.getEntryForDate(new Date(2024, 5, 20));

      expect(entry?.id).toBe(3);
      expect(entry?.status).toBe(false);
    });
  });

  // ============================================
  // isCompletedOn - Completion-Check für Datum
  // ============================================
  describe('isCompletedOn', () => {
    it('sollte true zurückgeben wenn Habit an dem Tag erledigt wurde', () => {
      const habit = createHabit([
        { id: 1, date: '2024-06-15', status: true, note: null }
      ]);

      expect(habit.isCompletedOn(new Date(2024, 5, 15))).toBe(true);
    });

    it('sollte false zurückgeben wenn Entry existiert aber status = false', () => {
      const habit = createHabit([
        { id: 1, date: '2024-06-15', status: false, note: null }
      ]);

      expect(habit.isCompletedOn(new Date(2024, 5, 15))).toBe(false);
    });

    it('sollte false zurückgeben wenn kein Entry für das Datum existiert', () => {
      const habit = createHabit([
        { id: 1, date: '2024-06-15', status: true, note: null }
      ]);

      expect(habit.isCompletedOn(new Date(2024, 5, 20))).toBe(false);
    });
  });

  // ============================================
  // matchesFilter - Filter-Logik
  // ============================================
  describe('matchesFilter', () => {
    it('sollte true zurückgeben für Filter "alle"', () => {
      const habit = new Habit({
        id: 1,
        name: 'Joggen',
        description: 'Test',
        frequency: 'daily',
        entries: []
      });

      expect(habit.matchesFilter('alle')).toBe(true);
      expect(habit.matchesFilter('Alle')).toBe(true);
      expect(habit.matchesFilter('ALLE')).toBe(true);
    });

    it('sollte true zurückgeben wenn Filter leer oder undefined ist', () => {
      const habit = new Habit({
        id: 1,
        name: 'Meditation',
        description: 'Test',
        frequency: 'daily',
        entries: []
      });

      expect(habit.matchesFilter('')).toBe(true);
      expect(habit.matchesFilter(null as any)).toBe(true);
      expect(habit.matchesFilter(undefined as any)).toBe(true);
    });

    it('sollte true zurückgeben wenn Name den Filter enthält (case-insensitive)', () => {
      const habit = new Habit({
        id: 1,
        name: 'Morgendliches Joggen',
        description: 'Test',
        frequency: 'daily',
        entries: []
      });

      expect(habit.matchesFilter('joggen')).toBe(true);
      expect(habit.matchesFilter('JOGGEN')).toBe(true);
      expect(habit.matchesFilter('Morgen')).toBe(true);
      expect(habit.matchesFilter('lich')).toBe(true);
    });

    it('sollte false zurückgeben wenn Name den Filter nicht enthält', () => {
      const habit = new Habit({
        id: 1,
        name: 'Meditation',
        description: 'Test',
        frequency: 'daily',
        entries: []
      });

      expect(habit.matchesFilter('Sport')).toBe(false);
      expect(habit.matchesFilter('Joggen')).toBe(false);
    });

    it('sollte mit Sonderzeichen und Leerzeichen umgehen können', () => {
      const habit = new Habit({
        id: 1,
        name: 'Bücher lesen',
        description: 'Test',
        frequency: 'daily',
        entries: []
      });

      expect(habit.matchesFilter('Bücher')).toBe(true);
      expect(habit.matchesFilter('lesen')).toBe(true);
      expect(habit.matchesFilter('Bücher lesen')).toBe(true);
    });
  });
});
