import { useCallback, useState, useEffect } from 'react';
import { StreakService } from '../../application/services/StreakService';
import { useAuth } from '../../context/AuthContext';
import { Streak } from '../../domain/entities/Streak';

export function useStreakController(streakService: StreakService) {
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
