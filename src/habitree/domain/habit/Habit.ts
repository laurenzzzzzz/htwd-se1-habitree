/**
 * Domain Entity: Habit
 * 
 * Nach DDD-Prinzipien enthält die Entity ihre eigene Business-Logik.
 * Die Logik ist hier gekapselt und damit gut testbar.
 */

export interface HabitEntry {
  id: number;
  date: string;
  status: boolean;
  note: string | null;
}

// Value Object für Validierungsergebnis
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

// Domain Entity
export interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
  entries: HabitEntry[];
}

/**
 * Domain Service: HabitService
 * Enthält die Business-Logik für Habits
 */
export class HabitService {
  /**
   * Prüft ob zwei Dates am selben Kalendertag sind
´   */
  static isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  /**
   * Berechnet die aktuelle Streak (aufeinanderfolgende Tage)
   * 
   * Business Rules:
   * - Nur Einträge mit status: true zählen
   * - Streak muss aktuell sein (heute oder gestern letzter Eintrag)
   * - Duplikate am selben Tag werden ignoriert
   * - Lücke = Streak-Ende
   * 
   * @param entries - Array von HabitEntry-Objekten
   * @param referenceDate - Referenzdatum (default: heute) - wichtig für Tests!
   * @returns Anzahl der aufeinanderfolgenden Tage
   */
  static calculateStreak(
    entries: HabitEntry[],
    referenceDate: Date = new Date()
  ): number {
    if (!entries || entries.length === 0) {
      return 0;
    }

    // Nur abgeschlossene Einträge
    const completedEntries = entries.filter((entry) => entry.status === true);

    if (completedEntries.length === 0) {
      return 0;
    }

    // Nach Datum sortieren (neueste zuerst)
    const sortedDates = completedEntries
      .map((entry) => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime());

    // Referenzdatum normalisieren
    const today = new Date(referenceDate);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecentDate = new Date(sortedDates[0]);
    mostRecentDate.setHours(0, 0, 0, 0);

    // Streak nur zählen wenn letzter Eintrag heute oder gestern war
    if (!this.isSameDay(mostRecentDate, today) && !this.isSameDay(mostRecentDate, yesterday)) {
      return 0;
    }

    // Streak zählen
    let streak = 1;
    let currentDate = mostRecentDate;

    for (let i = 1; i < sortedDates.length; i++) {
      const entryDate = new Date(sortedDates[i]);
      entryDate.setHours(0, 0, 0, 0);

      const expectedPreviousDay = new Date(currentDate);
      expectedPreviousDay.setDate(expectedPreviousDay.getDate() - 1);

      if (this.isSameDay(entryDate, expectedPreviousDay)) {
        streak++;
        currentDate = entryDate;
      } else if (!this.isSameDay(entryDate, currentDate)) {
        // Lücke gefunden - Streak unterbrochen
        break;
      }
    }

    return streak;
  }

  /**
   * Berechnet die Gesamt-Streak über alle Habits
   * Ein Tag zählt nur wenn ALLE Habits erledigt wurden
   */
  static calculateTotalStreak(
    habits: Habit[],
    referenceDate: Date = new Date()
  ): number {
    if (!habits || habits.length === 0) {
      return 0;
    }

    const today = new Date(referenceDate);
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    // Maximal 365 Tage zurück prüfen
    for (let i = 0; i < 365; i++) {
      const allHabitsCompleted = habits.every((habit) => {
        return habit.entries.some((entry) => {
          const entryDate = new Date(entry.date);
          return this.isSameDay(entryDate, checkDate) && entry.status === true;
        });
      });

      if (allHabitsCompleted) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Heute nicht erledigt - prüfe gestern
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Validiert einen neuen Habit
   * 
   * - Name: nicht leer, 2-50 Zeichen
   * - Beschreibung: nicht leer
   */
  static validateHabit(
    name: string,
    description: string
  ): ValidationResult {
    if (!name || name.trim() === '') {
      return { isValid: false, errorMessage: 'Name darf nicht leer sein' };
    }

    if (name.trim().length < 2) {
      return { isValid: false, errorMessage: 'Name muss mindestens 2 Zeichen haben' };
    }

    if (name.trim().length > 50) {
      return { isValid: false, errorMessage: 'Name darf maximal 50 Zeichen haben' };
    }

    if (!description || description.trim() === '') {
      return { isValid: false, errorMessage: 'Beschreibung darf nicht leer sein' };
    }

    return { isValid: true, errorMessage: null };
  }

  /**
   * Prüft ob ein Habit heute bereits erledigt wurde
   */
  static isHabitCompletedToday(
    habit: Habit,
    referenceDate: Date = new Date()
  ): boolean {
    return habit.entries.some(
      (entry) => this.isSameDay(new Date(entry.date), referenceDate) && entry.status === true
    );
  }

  /**
   * Filtert Habits nach Suchbegriff
   */
  static filterHabits(habits: Habit[], filter: string): Habit[] {
    if (!filter || filter === 'alle') {
      return habits;
    }

    return habits.filter((habit) =>
      habit.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
}
