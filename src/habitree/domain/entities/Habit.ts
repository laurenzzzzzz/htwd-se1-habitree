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
  readonly entries: HabitEntry[];

  constructor(data: HabitData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.frequency = data.frequency;
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
/////////////////////////////////////////////////////////
  /**
   * Finds the entry for a specific calendar date (if any)
   */
  getEntryForDate(targetDate: Date): HabitEntry | undefined {
    return this.entries.find(entry => this.isSameDay(new Date(entry.date), targetDate));
  }

  /**
   * Determines whether the habit is completed on a given date
   */
  isCompletedOn(targetDate: Date): boolean {
    const entry = this.getEntryForDate(targetDate);
    return Boolean(entry && entry.status);
  }

  /**
   * Checks if habit should appear for a given filter value
   */
  matchesFilter(filter: string): boolean {
    if (!filter || filter.toLowerCase() === 'alle') {
      return true;
    }
    return this.name.toLowerCase().includes(filter.toLowerCase());
  }
/////////////////////////////////////////////////////
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
