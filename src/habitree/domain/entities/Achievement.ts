/**
 * Achievement Domain Entity
 * Represents a badge/achievement earned by user based on habit milestones
 */

export type AchievementData = {
  id: number;
  userId: number;
  name: string;
  description: string;
  imageUrl: string;
  unlockedAt: Date;
  habitId?: number; // Optional reference to which habit unlocked this
};

export class Achievement {
  readonly id: number;
  readonly userId: number;
  readonly name: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly unlockedAt: Date;
  readonly habitId?: number;

  constructor(data: AchievementData) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.unlockedAt = data.unlockedAt;
    this.habitId = data.habitId;
  }

  /**
   * Get days since achievement was unlocked
   */
  getDaysSinceUnlock(): number {
    const now = new Date();
    const diff = now.getTime() - this.unlockedAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if achievement was recently unlocked (within last 7 days)
   */
  isRecent(): boolean {
    return this.getDaysSinceUnlock() <= 7;
  }

  /**
   * Get formatted unlock date
   */
  getFormattedUnlockDate(): string {
    return this.unlockedAt.toLocaleDateString('de-DE');
  }
}

export default Achievement;
