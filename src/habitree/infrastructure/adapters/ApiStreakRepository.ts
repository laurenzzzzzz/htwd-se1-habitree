import axios from 'axios';
import { Streak, StreakData } from '../../domain/entities/Streak';
import IStreakRepository from '../../domain/repositories/IStreakRepository';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

export class ApiStreakRepository implements IStreakRepository {
  async fetchStreak(authToken: string, userId: number): Promise<Streak> {
    try {
      //Dummy Hardcoded: In real implementation would fetch from API
      // const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/streak`, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });

      //Dummy Hardcoded: Using dummy streak data for now
      const dummyData: StreakData = {
        userId,
        currentStreak: 14,
        longestStreak: 45,
        lastCompletionDate: new Date(),
      };

      return new Streak(dummyData);
    } catch (error) {
      console.error('Error fetching streak:', error);
      throw error;
    }
  }

  async updateStreak(authToken: string, userId: number): Promise<Streak> {
    try {
      //Dummy Hardcoded: In real implementation would send to API
      // const response = await axios.post(`${API_BASE_URL}/api/users/${userId}/streak/update`, {}, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });

      //Dummy Hardcoded: Return updated streak
      const dummyData: StreakData = {
        userId,
        currentStreak: 15, // Incremented
        longestStreak: 45,
        lastCompletionDate: new Date(),
      };

      return new Streak(dummyData);
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }
}

export default ApiStreakRepository;
