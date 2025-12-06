/**
 * Streak Domain Entity
 * Represents a user's streak statistics
 */

export type StreakData = {
  userId: number;
  currentStreak: number; // Days
  longestStreak: number; // Days
  lastCompletionDate: Date;
};

export class Streak {
  readonly userId: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly lastCompletionDate: Date;

  constructor(data: StreakData) {
    this.userId = data.userId;
    this.currentStreak = data.currentStreak;
    this.longestStreak = data.longestStreak;
    this.lastCompletionDate = data.lastCompletionDate;
  }

  /**
   * Check if streak is active (completed today)
   */
  isActive(): boolean {
    const today = new Date();
    const lastDate = new Date(this.lastCompletionDate);
    return (
      today.getFullYear() === lastDate.getFullYear() &&
      today.getMonth() === lastDate.getMonth() &&
      today.getDate() === lastDate.getDate()
    );
  }

  /**
   * Get streak milestone message
   */
  getMilestoneMessage(): string {
    if (this.currentStreak < 7) return `${this.currentStreak} Tage`;
    if (this.currentStreak < 30) return `${this.currentStreak} Tage - Eine Woche! 🎉`;
    if (this.currentStreak < 100) return `${this.currentStreak} Tage - Ein Monat! 🚀`;
    return `${this.currentStreak} Tage - Legende! 👑`;
  }

  /**
   * Get display text
   */
  getDisplayText(): string {
    return this.currentStreak.toString();
  }
}

export default Streak;
