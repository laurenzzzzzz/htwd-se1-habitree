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

// Platzhalter-Daten bis der Achievements-Endpunkt bereitsteht
const FALLBACK_ACHIEVEMENTS: AchievementResponse[] = [
  {
    id: 1,
    userId: 0,
    name: 'Erste Schritte',
    description: 'Dein erstes Habit angelegt',
    imageUrl: 'https://dummyimage.com/120x120/199189/ffffff&text=HS',
    unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    userId: 0,
    name: 'Eine Woche durchgehalten',
    description: '7 Tage in Folge aktiv',
    imageUrl: 'https://dummyimage.com/120x120/2a9d8f/ffffff&text=7',
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    userId: 0,
    name: 'Multi-Tasking Master',
    description: '5 Habits gleichzeitig aktiv',
    imageUrl: 'https://dummyimage.com/120x120/e76f51/ffffff&text=5',
    unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
        console.warn('Achievements endpoint not available (404). Falling back to placeholder achievements.');
        return FALLBACK_ACHIEVEMENTS.map((item) =>
          new Achievement({
            ...item,
            userId,
            unlockedAt: new Date(item.unlockedAt),
          })
        );
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
