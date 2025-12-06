export type HabitEntry = {
  id: number;
  date: string; // ISO date
  status: boolean;
  note: string | null;
};

export type HabitData = {
  id: number;
  name: string;
  description: string;
  frequency: string;
  time?: string | null;
  startDate?: string | Date | null;
  weekDays?: number[];
  intervalDays?: number | null;
  entries: HabitEntry[];
};

/**
 * Habit Domain Entity
 * Encapsulates habit business logic and invariants
 */
export class Habit {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly frequency: string;
  readonly time?: string | null;
  readonly startDate?: string | Date | null;
  readonly weekDays?: number[];
  readonly intervalDays?: number | null;
  readonly entries: HabitEntry[];

  constructor(data: HabitData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.frequency = data.frequency;
    this.time = data.time ?? null;
    this.startDate = data.startDate ?? null;
    this.weekDays = data.weekDays ?? [];
    this.intervalDays = data.intervalDays ?? null;
    this.entries = data.entries;
  }

  /**
   * Calculates the current streak (consecutive completed days)
   */
  getStreak(): number {
    if (this.entries.length === 0) return 0;

    const sortedEntries = [...this.entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      
      if (!this.isSameDay(currentDate, entryDate)) {
        currentDate.setDate(currentDate.getDate() - 1);
        if (!this.isSameDay(currentDate, entryDate)) {
          break;
        }
      }

      if (entry.status) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Checks if habit was completed today
   */
  isCompletedToday(): boolean {
    const today = new Date();
    return this.entries.some(entry => 
      entry.status && this.isSameDay(new Date(entry.date), today)
    );
  }

  /**
   * Gets completion rate as percentage (0-100)
   */
  getCompletionRate(): number {
    if (this.entries.length === 0) return 0;
    const completed = this.entries.filter(e => e.status).length;
    return Math.round((completed / this.entries.length) * 100);
  }

  /**
   * Checks if habit qualifies for a milestone (e.g., 7-day streak, 30-day streak)
   */
  hasMilestone(days: number): boolean {
    return this.getStreak() >= days;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}

export default Habit;
