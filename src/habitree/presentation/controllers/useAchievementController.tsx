import { useCallback, useState, useEffect } from 'react';
import { useApplicationServices } from '../providers/ApplicationServicesProvider';
import { useAuth } from '../../context/AuthContext';
import { Achievement } from '../../domain/entities/Achievement';
import { Habit } from '../../domain/entities/Habit';

export function useAchievementController() {
  const { achievementService, habitService } = useApplicationServices();
  const { authToken, currentUser } = useAuth();
  const [achievements, setAchievements] = useState<(Achievement | Habit)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAchievements = useCallback(async () => {
    if (!authToken || !currentUser) return;
    setIsLoading(true);
    try {
      // Fetch both achievements and harvested habits
      const [achievementData, harvestedHabits] = await Promise.all([
        achievementService.fetchAchievements(authToken, currentUser.id),
        habitService.fetchHarvestedHabits(authToken),
      ]);
      // Combine both into one array
      setAchievements([...achievementData, ...harvestedHabits]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, currentUser, achievementService, habitService]);

  const unlockAchievement = useCallback(
    async (achievementId: number) => {
      if (!authToken || !currentUser) return;
      try {
        const updatedAchievements = await achievementService.unlockAchievement(authToken, currentUser.id, achievementId);
        setAchievements(updatedAchievements);
      } catch (error) {
        console.error('Error unlocking achievement:', error);
        throw error;
      }
    },
    [authToken, currentUser, achievementService]
  );

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return {
    achievements,
    isLoading,
    fetchAchievements,
    unlockAchievement,
  };
}

export default useAchievementController;
