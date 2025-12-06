import { useCallback, useState, useEffect } from 'react';
import { useApplicationServices } from '../../application/providers/ApplicationServicesProvider';
import { useAuth } from '../../context/AuthContext';
import { Streak } from '../../domain/entities/Streak';

export function useStreakController() {
  const { streakService } = useApplicationServices();
  const { authToken, currentUser } = useAuth();
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStreak = useCallback(async () => {
    if (!authToken || !currentUser) return;
    setIsLoading(true);
    try {
      const data = await streakService.fetchStreak(authToken, currentUser.id);
      setStreak(data);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, currentUser, streakService]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return {
    streak,
    isLoading,
    fetchStreak,
  };
}

export default useStreakController;
