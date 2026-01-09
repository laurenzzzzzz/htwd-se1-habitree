export type HabitEntry = {
  id: number;
  date: string; // ISO date
  status: boolean;
  note: string | null;
};

export type HabitData = {
  id: number;
  name: string;
  description?: string | null;
  frequency: string;
  time?: string | null;
  startDate?: string | Date | null;
  weekDays?: number[];
  intervalDays?: number | null;
  durationDays?: number | null;
  entries: HabitEntry[];
  currentStreak?: number | null;
  maxStreak?: number | null;
  isHarvested?: number; // 0 = normal, 1 = tree8, 2 = geerntet
  createdAt?: string | Date; // Timestamp when habit was created
};

/**
 * Habit Domain Entity
 * Encapsulates habit business logic and invariants
 */
export class Habit {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly frequency: string;
  readonly time?: string | null;
  readonly startDate?: string | Date | null;
  readonly weekDays?: number[];
  readonly intervalDays?: number | null;
  readonly durationDays?: number | null;
  readonly entries: HabitEntry[];
  readonly currentStreak: number | null;
  readonly maxStreak: number | null;
  readonly isHarvested: number;
  readonly createdAt?: string | Date;

  constructor(data: HabitData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description ?? null;
    this.frequency = data.frequency;
    this.time = data.time ?? null;
    this.startDate = data.startDate ?? null;
    this.weekDays = data.weekDays ?? [];
    this.intervalDays = data.intervalDays ?? null;
    this.durationDays = data.durationDays ?? null;
    this.entries = data.entries;
    this.currentStreak = data.currentStreak ?? null;
    this.maxStreak = data.maxStreak ?? null;
    this.isHarvested = data.isHarvested ?? 0;
    this.createdAt = data.createdAt ?? undefined;
  }

  /**
   * Calculates the current streak (consecutive completed days)
   */
  getStreak(): number {
    // Prefer backend-provided streak (already korrekt gerechnet, excl. heute)
    if (this.currentStreak !== null && this.currentStreak !== undefined) {
      return this.currentStreak;
    }

    if (this.entries.length === 0) return 0;

    const sortedEntries = [...this.entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let checkDate = new Date(today);
    
    // Helper to check status on a specific date
    const isDoneOnDate = (d: Date): boolean => {
         const entry = sortedEntries.find(e => this.isSameDay(new Date(e.date), d));
         return !!(entry && entry.status);
    };

    // 1. Check Today
    if (isDoneOnDate(checkDate)) {
        streak++;
    } 
    
    // Move to yesterday to continue checking
    checkDate.setDate(checkDate.getDate() - 1);
    
    // 2. Loop backwards
    while(true) {
         // Optimization: since entries are sorted, we can search more efficiently, 
         // but find() is sufficient for typical streak lengths.
         const entry = sortedEntries.find(e => this.isSameDay(new Date(e.date), checkDate));
         
         if (entry) {
             if (entry.status) {
                 streak++;
                 checkDate.setDate(checkDate.getDate() - 1);
             } else {
                 // Explicit false/failure breaks streak
                 break;
             }
         } else {
             // Entry missing implies not done. Break streak.
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
