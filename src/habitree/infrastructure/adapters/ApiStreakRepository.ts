import axios from 'axios';
import { Streak, StreakData } from '../../domain/entities/Streak';
import IStreakRepository from '../../domain/repositories/IStreakRepository';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

export class ApiStreakRepository implements IStreakRepository {
  async fetchStreak(authToken: string, userId: number): Promise<Streak> {
    try {
      // Fetch streak data from backend API (userId wird aus JWT extrahiert, daher nicht nötig im Path)
      const response = await axios.get(`${API_BASE_URL}/user/streak`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = response.data;
      const streakData: StreakData = {
        userId: data.userId || userId,
        currentStreak: data.currentStreak || 0,
        longestStreak: data.maxStreak || data.longestStreak || 0,
        lastCompletionDate: data.lastCompletionDate ? new Date(data.lastCompletionDate) : new Date(),
      };

      return new Streak(streakData);
    } catch (error) {
      console.error('Error fetching streak:', error);
      // Fallback to default streak if API fails
      const defaultData: StreakData = {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletionDate: new Date(),
      };
      return new Streak(defaultData);
    }
  }

  async updateStreak(authToken: string, userId: number): Promise<Streak> {
    try {
      // Trigger streak update on backend (for manual refresh if needed)
      const response = await axios.post(`${API_BASE_URL}/user/streak/update`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = response.data;
      const streakData: StreakData = {
        userId: data.userId || userId,
        currentStreak: data.currentStreak || 0,
        longestStreak: data.maxStreak || data.longestStreak || 0,
        lastCompletionDate: data.lastCompletionDate ? new Date(data.lastCompletionDate) : new Date(),
      };

      return new Streak(streakData);
    } catch (error) {
      console.error('Error updating streak:', error);
      // Fallback: fetch current streak instead
      return this.fetchStreak(authToken, userId);
    }
  }
}

export default ApiStreakRepository;
