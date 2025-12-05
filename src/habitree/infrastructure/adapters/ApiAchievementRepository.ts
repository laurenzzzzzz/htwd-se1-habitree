import axios from 'axios';
import { Achievement, AchievementData } from '../../domain/entities/Achievement';
import IAchievementRepository from '../../domain/repositories/IAchievementRepository';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

export class ApiAchievementRepository implements IAchievementRepository {
  async fetchAchievements(authToken: string, userId: number): Promise<Achievement[]> {
    try {
      //Dummy Hardcoded: In real implementation would fetch from API
      // const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/achievements`, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });

      //Dummy Hardcoded: Using dummy achievements for now
      const dummyAchievements: AchievementData[] = [
        {
          id: 1,
          userId,
          name: 'Erste Schritte',
          description: 'Dein erstes Habit angelegt',
          imageUrl: require('@/assets/images/abzeichen1.png'),
          unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: 2,
          userId,
          name: 'Eine Woche durchgehalten',
          description: '7 Tage in Folge aktiv',
          imageUrl: require('@/assets/images/abzeichen2.png'),
          unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
        {
          id: 3,
          userId,
          name: 'Gewohnheit verfestigt',
          description: '30 Tage am Stück ein Habit erfüllt',
          imageUrl: require('@/assets/images/abzeichen3.png'),
          unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          id: 4,
          userId,
          name: 'Multi-Tasking Master',
          description: '5 Habits gleichzeitig aktiv',
          imageUrl: require('@/assets/images/abzeichen4.png'),
          unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: 5,
          userId,
          name: 'Rauchen abgelegt',
          description: 'Starke Leistung! Du hast erfolgreich das Rauchen aufgegeben',
          imageUrl: require('@/assets/images/abzeichen5.png'),
          unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          habitId: 1,
        },
        {
          id: 6,
          userId,
          name: 'Täglicher Sport',
          description: '66 Tage am Stück täglich eine Stunde Sport getrieben',
          imageUrl: require('@/assets/images/abzeichen6.png'),
          unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          habitId: 2,
        },
      ];

      return dummyAchievements.map(
        (data) => new Achievement(data)
      );
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }

  async unlockAchievement(authToken: string, userId: number, achievementId: number): Promise<void> {
    try {
      //Dummy Hardcoded: In real implementation would send to API
      // await axios.post(`${API_BASE_URL}/api/users/${userId}/achievements/${achievementId}/unlock`, {}, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });
      console.log('Achievement unlocked (dummy):', achievementId);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }
}

export default ApiAchievementRepository;
