import { Achievement } from '../../domain/entities/Achievement';
import IAchievementRepository from '../../domain/repositories/IAchievementRepository';

export class AchievementService {
  private repo: IAchievementRepository;

  constructor(repo: IAchievementRepository) {
    this.repo = repo;
  }

  async fetchAchievements(authToken: string, userId: number): Promise<Achievement[]> {
    return this.repo.fetchAchievements(authToken, userId);
  }

  async unlockAchievement(authToken: string, userId: number, achievementId: number): Promise<Achievement[]> {
    await this.repo.unlockAchievement(authToken, userId, achievementId);
    return this.repo.fetchAchievements(authToken, userId);
  }
}

export default AchievementService;
