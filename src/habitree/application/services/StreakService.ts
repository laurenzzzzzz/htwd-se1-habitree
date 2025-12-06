import { Streak } from '../../domain/entities/Streak';
import IStreakRepository from '../../domain/repositories/IStreakRepository';

export class StreakService {
  private repo: IStreakRepository;

  constructor(repo: IStreakRepository) {
    this.repo = repo;
  }

  async fetchStreak(authToken: string, userId: number): Promise<Streak> {
    return this.repo.fetchStreak(authToken, userId);
  }

  async updateStreak(authToken: string, userId: number): Promise<Streak> {
    return this.repo.updateStreak(authToken, userId);
  }
}

export default StreakService;
