import { Achievement } from '../entities/Achievement';

export interface IAchievementRepository {
  /**
   * Fetch all achievements for a user
   */
  fetchAchievements(authToken: string, userId: number): Promise<Achievement[]>;

  /**
   * Unlock a new achievement
   */
  unlockAchievement(authToken: string, userId: number, achievementId: number): Promise<void>;
}

export default IAchievementRepository;
