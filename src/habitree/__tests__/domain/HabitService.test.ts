/**
 * Unit Tests für HabitService
 * 
 * Diese Tests prüfen die Business-Logik isoliert nach dem FIRST-Prinzip:
 * - Fast (schnell)
 * - Isolated (unabhängig)
 * - Repeatable (wiederholbar)
 * - Self-validating (selbstprüfend)
 * - Timely (rechtzeitig)
 */

import { HabitService, Habit, HabitEntry } from '../../domain/habit';

describe('HabitService', () => {
  // ============================================
  // isSameDay - Datumsvergleich
  // ============================================
  describe('isSameDay', () => {
    it('sollte true zurückgeben für identische Tage', () => {
      const date1 = new Date('2025-06-10');
      const date2 = new Date('2025-06-10');
      expect(HabitService.isSameDay(date1, date2)).toBe(true);
    });

    it('sollte true zurückgeben trotz unterschiedlicher Uhrzeiten', () => {
      const date1 = new Date('2025-06-10T08:00:00');
      const date2 = new Date('2025-06-10T23:59:59');
      expect(HabitService.isSameDay(date1, date2)).toBe(true);
    });

    it('sollte false zurückgeben für unterschiedliche Tage', () => {
      const date1 = new Date('2025-06-10');
      const date2 = new Date('2025-06-11');
      expect(HabitService.isSameDay(date1, date2)).toBe(false);
    });

    // Grenzwertanalyse: Mitternacht
    it('sollte Mitternacht-Grenzfall korrekt behandeln (23:59 vs 00:01)', () => {
      const beforeMidnight = new Date('2025-06-10T23:59:59');
      const afterMidnight = new Date('2025-06-11T00:01:00');
      expect(HabitService.isSameDay(beforeMidnight, afterMidnight)).toBe(false);
    });

    it('sollte false zurückgeben für unterschiedliche Jahre', () => {
      const date1 = new Date('2024-06-10');
      const date2 = new Date('2025-06-10');
      expect(HabitService.isSameDay(date1, date2)).toBe(false);
    });

    it('sollte false zurückgeben für unterschiedliche Monate', () => {
      const date1 = new Date('2025-05-10');
      const date2 = new Date('2025-06-10');
      expect(HabitService.isSameDay(date1, date2)).toBe(false);
    });
  });

  // ============================================
  // calculateStreak - Streak-Berechnung
  // ============================================
  describe('calculateStreak', () => {
    const today = new Date('2025-06-10');

    // Grenzwert: Leeres Array
    it('sollte 0 zurückgeben für leeres Array', () => {
      expect(HabitService.calculateStreak([], today)).toBe(0);
    });

    // Grenzwert: null/undefined
    it('sollte 0 zurückgeben für null', () => {
      expect(HabitService.calculateStreak(null as any, today)).toBe(0);
    });

    // Grenzwert: Nur nicht-erledigte Einträge
    it('sollte 0 zurückgeben wenn keine Einträge erledigt sind', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-10', status: false, note: null },
        { id: 2, date: '2025-06-09', status: false, note: null },
      ];
      expect(HabitService.calculateStreak(entries, today)).toBe(0);
    });

    // Einfacher Fall: Ein Tag
    it('sollte 1 zurückgeben für einen erledigten Tag heute', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-10', status: true, note: null },
      ];
      expect(HabitService.calculateStreak(entries, today)).toBe(1);
    });

    // Standard: Mehrere aufeinanderfolgende Tage
    it('sollte korrekte Streak für aufeinanderfolgende Tage berechnen', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-10', status: true, note: null },
        { id: 2, date: '2025-06-09', status: true, note: null },
        { id: 3, date: '2025-06-08', status: true, note: null },
      ];
      expect(HabitService.calculateStreak(entries, today)).toBe(3);
    });

    // Lücke in der Mitte
    it('sollte Streak bei Lücke stoppen', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-10', status: true, note: null },
        { id: 2, date: '2025-06-09', status: true, note: null },
        // Lücke am 08.06.
        { id: 3, date: '2025-06-07', status: true, note: null },
      ];
      expect(HabitService.calculateStreak(entries, today)).toBe(2);
    });

    // Streak beginnt gestern
    it('sollte Streak zählen wenn letzter Eintrag gestern war', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-09', status: true, note: null },
        { id: 2, date: '2025-06-08', status: true, note: null },
      ];
      expect(HabitService.calculateStreak(entries, today)).toBe(2);
    });

    // Alte Daten (keine aktuelle Streak)
    it('sollte 0 zurückgeben wenn letzter Eintrag älter als gestern', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-05', status: true, note: null },
        { id: 2, date: '2025-06-04', status: true, note: null },
      ];
      expect(HabitService.calculateStreak(entries, today)).toBe(0);
    });

    // Duplikate am selben Tag
    it('sollte Duplikate am selben Tag ignorieren', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-10', status: true, note: null },
        { id: 2, date: '2025-06-10', status: true, note: 'Duplikat' },
        { id: 3, date: '2025-06-09', status: true, note: null },
      ];
      expect(HabitService.calculateStreak(entries, today)).toBe(2);
    });

    // Gemischte status-Werte
    it('sollte nur erledigte Einträge zählen', () => {
      const entries: HabitEntry[] = [
        { id: 1, date: '2025-06-10', status: true, note: null },
        { id: 2, date: '2025-06-09', status: false, note: null }, // nicht erledigt!
        { id: 3, date: '2025-06-08', status: true, note: null },
      ];
      // Streak = 1, weil 09.06. nicht erledigt wurde
      expect(HabitService.calculateStreak(entries, today)).toBe(1);
    });
  });

  // ============================================
  // validateHabit - Eingabevalidierung
  // ============================================
  describe('validateHabit', () => {
    // Äquivalenzklasse: Gültige Eingabe
    it('sollte gültigen Habit akzeptieren', () => {
      const result = HabitService.validateHabit('Sport', 'Täglich 30 Min');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    // Äquivalenzklasse: Leerer Name
    it('sollte leeren Namen ablehnen', () => {
      const result = HabitService.validateHabit('', 'Beschreibung');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Name darf nicht leer sein');
    });

    // Äquivalenzklasse: Nur Whitespace
    it('sollte Whitespace-only Namen ablehnen', () => {
      const result = HabitService.validateHabit('   ', 'Beschreibung');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Name darf nicht leer sein');
    });

    // Grenzwert: Minimale Länge (2 Zeichen)
    it('sollte Namen mit weniger als 2 Zeichen ablehnen', () => {
      const result = HabitService.validateHabit('A', 'Beschreibung');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Name muss mindestens 2 Zeichen haben');
    });

    it('sollte Namen mit genau 2 Zeichen akzeptieren', () => {
      const result = HabitService.validateHabit('AB', 'Beschreibung');
      expect(result.isValid).toBe(true);
    });

    // Grenzwert: Maximale Länge (50 Zeichen)
    it('sollte Namen mit mehr als 50 Zeichen ablehnen', () => {
      const longName = 'A'.repeat(51);
      const result = HabitService.validateHabit(longName, 'Beschreibung');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Name darf maximal 50 Zeichen haben');
    });

    it('sollte Namen mit genau 50 Zeichen akzeptieren', () => {
      const exactName = 'A'.repeat(50);
      const result = HabitService.validateHabit(exactName, 'Beschreibung');
      expect(result.isValid).toBe(true);
    });

    // Äquivalenzklasse: Leere Beschreibung
    it('sollte leere Beschreibung ablehnen', () => {
      const result = HabitService.validateHabit('Sport', '');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Beschreibung darf nicht leer sein');
    });
  });

  // ============================================
  // isHabitCompletedToday - Prüfung ob heute erledigt
  // ============================================
  describe('isHabitCompletedToday', () => {
    const today = new Date('2025-06-10');

    it('sollte true zurückgeben wenn Habit heute erledigt', () => {
      const habit: Habit = {
        id: 1,
        name: 'Sport',
        description: 'Test',
        frequency: 'daily',
        entries: [{ id: 1, date: '2025-06-10', status: true, note: null }],
      };
      expect(HabitService.isHabitCompletedToday(habit, today)).toBe(true);
    });

    it('sollte false zurückgeben wenn Habit heute nicht erledigt', () => {
      const habit: Habit = {
        id: 1,
        name: 'Sport',
        description: 'Test',
        frequency: 'daily',
        entries: [{ id: 1, date: '2025-06-09', status: true, note: null }],
      };
      expect(HabitService.isHabitCompletedToday(habit, today)).toBe(false);
    });

    it('sollte false zurückgeben wenn Habit heute existiert aber nicht erledigt', () => {
      const habit: Habit = {
        id: 1,
        name: 'Sport',
        description: 'Test',
        frequency: 'daily',
        entries: [{ id: 1, date: '2025-06-10', status: false, note: null }],
      };
      expect(HabitService.isHabitCompletedToday(habit, today)).toBe(false);
    });

    it('sollte false zurückgeben für Habit ohne Einträge', () => {
      const habit: Habit = {
        id: 1,
        name: 'Sport',
        description: 'Test',
        frequency: 'daily',
        entries: [],
      };
      expect(HabitService.isHabitCompletedToday(habit, today)).toBe(false);
    });
  });

  // ============================================
  // filterHabits - Filter-Funktion
  // ============================================
  describe('filterHabits', () => {
    const testHabits: Habit[] = [
      { id: 1, name: 'Sport', description: 'Täglich', frequency: 'daily', entries: [] },
      { id: 2, name: 'Lesen', description: 'Abends', frequency: 'daily', entries: [] },
      { id: 3, name: 'Meditation', description: 'Morgens', frequency: 'daily', entries: [] },
    ];

    it('sollte alle Habits zurückgeben bei leerem Filter', () => {
      expect(HabitService.filterHabits(testHabits, '')).toHaveLength(3);
    });

    it('sollte alle Habits zurückgeben bei Filter "alle"', () => {
      expect(HabitService.filterHabits(testHabits, 'alle')).toHaveLength(3);
    });

    it('sollte Habits nach Namen filtern (case-insensitive)', () => {
      const result = HabitService.filterHabits(testHabits, 'sport');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Sport');
    });

    it('sollte Teilübereinstimmungen finden', () => {
      const result = HabitService.filterHabits(testHabits, 'me');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Meditation');
    });

    it('sollte leeres Array für nicht-gefundenen Filter zurückgeben', () => {
      expect(HabitService.filterHabits(testHabits, 'xyz')).toHaveLength(0);
    });

    it('sollte mit leerem Habits-Array umgehen', () => {
      expect(HabitService.filterHabits([], 'sport')).toHaveLength(0);
    });
  });

  // ============================================
  // calculateTotalStreak - Gesamt-Streak über alle Habits
  // ============================================
  describe('calculateTotalStreak', () => {
    const today = new Date('2025-06-10');

    it('sollte 0 zurückgeben für leeres Habits-Array', () => {
      expect(HabitService.calculateTotalStreak([], today)).toBe(0);
    });

    it('sollte Streak zählen wenn alle Habits an einem Tag erledigt', () => {
      const habits: Habit[] = [
        {
          id: 1, name: 'Sport', description: '', frequency: 'daily',
          entries: [{ id: 1, date: '2025-06-10', status: true, note: null }]
        },
        {
          id: 2, name: 'Lesen', description: '', frequency: 'daily',
          entries: [{ id: 2, date: '2025-06-10', status: true, note: null }]
        },
      ];
      expect(HabitService.calculateTotalStreak(habits, today)).toBe(1);
    });

    it('sollte 0 zurückgeben wenn nicht alle Habits erledigt', () => {
      const habits: Habit[] = [
        {
          id: 1, name: 'Sport', description: '', frequency: 'daily',
          entries: [{ id: 1, date: '2025-06-10', status: true, note: null }]
        },
        {
          id: 2, name: 'Lesen', description: '', frequency: 'daily',
          entries: [{ id: 2, date: '2025-06-09', status: true, note: null }] // gestern, nicht heute
        },
      ];
      // Gestern haben beide erledigt? Nein, Sport hat nur heute
      expect(HabitService.calculateTotalStreak(habits, today)).toBe(0);
    });
  });
});
