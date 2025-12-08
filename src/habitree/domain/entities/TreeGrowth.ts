/**
 * TreeGrowth Domain Entity
 * Represents the growth progress of a user's tree based on habit completion
 */

export type TreeGrowthData = {
  userId: number;
  growthPercentage: number; // 0-100
  totalCompletedHabits: number;
  streakCount: number;
};

export type TreeGrowthUpdatePayload = {
  growthPercentage: number;
  totalCompletedHabits: number;
  streakCount: number;
};

export class TreeGrowth {
  readonly userId: number;
  readonly growthPercentage: number;
  readonly totalCompletedHabits: number;
  readonly streakCount: number;

  constructor(data: TreeGrowthData) {
    this.userId = data.userId;
    this.growthPercentage = data.growthPercentage;
    this.totalCompletedHabits = data.totalCompletedHabits;
    this.streakCount = data.streakCount;
  }

  /**
   * Get growth stage (Dummy: 1-5 stages)
   * //Dummy Hardcoded: In real implementation, would map to tree images/animations
   */
  getGrowthStage(): number {
    if (this.growthPercentage < 20) return 1;
    if (this.growthPercentage < 40) return 2;
    if (this.growthPercentage < 60) return 3;
    if (this.growthPercentage < 80) return 4;
    return 5;
  }

  /**
   * Get display text for growth
   */
  getGrowthText(): string {
    return `Baum-Wachstum: ${this.growthPercentage}%`;
  }

  /**
   * Check if tree is fully grown
   */
  isFullyGrown(): boolean {
    return this.growthPercentage >= 100;
  }
}

export default TreeGrowth;
