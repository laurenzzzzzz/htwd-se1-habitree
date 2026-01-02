import axios from 'axios';
import { Achievement } from '../../domain/entities/Achievement';
import IAchievementRepository from '../../domain/repositories/IAchievementRepository';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

type AchievementResponse = {
  id: number;
  userId: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  unlockedAt: string;
  habitId?: number;
};

export class ApiAchievementRepository implements IAchievementRepository {
  async fetchAchievements(authToken: string, userId: number): Promise<Achievement[]> {
    try {
      const response = await axios.get<AchievementResponse[]>(`${API_BASE_URL}/api/users/${userId}/achievements`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      return response.data.map((item) =>
        new Achievement({
          ...item,
          imageUrl: item.imageUrl ?? '',
          unlockedAt: new Date(item.unlockedAt),
        })
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn('Achievements endpoint not available (404). Returning empty array.');
        return [];
      }
      throw error;
    }
  }

  async unlockAchievement(authToken: string, userId: number, achievementId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/users/${userId}/achievements/${achievementId}/unlock`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn('Unlock achievement endpoint not available (404). Skipping network call and pretending success.');
        return;
      }
      throw error;
    }
  }
}

export default ApiAchievementRepository;
