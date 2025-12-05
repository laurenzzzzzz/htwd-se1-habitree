import { Streak } from '../entities/Streak';

export interface IStreakRepository {
  /**
   * Fetch user's streak data
   */
  fetchStreak(authToken: string, userId: number): Promise<Streak>;

  /**
   * Update streak based on habit completion
   */
  updateStreak(authToken: string, userId: number): Promise<Streak>;
}

export default IStreakRepository;
