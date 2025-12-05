import { useCallback, useState, useEffect } from 'react';
import { useApplicationServices } from '../../application/providers/ApplicationServicesProvider';
import { useAuth } from '../../context/AuthContext';
import { Achievement } from '../../domain/entities/Achievement';

export function useAchievementController() {
  const { achievementService } = useApplicationServices();
  const { authToken, currentUser } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAchievements = useCallback(async () => {
    if (!authToken || !currentUser) return;
    setIsLoading(true);
    try {
      const data = await achievementService.fetchAchievements(authToken, currentUser.id);
      setAchievements(data);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, currentUser, achievementService]);

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
