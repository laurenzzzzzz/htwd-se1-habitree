import { useCallback, useState } from 'react';
import { habitService } from '../../infrastructure/di/ServiceContainer';
import { useAuth } from '../../context/AuthContext';
import { Habit } from '../../domain/entities/Habit';

export function useHabitsController() {
  const { authToken, isLoggedIn } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHabits = useCallback(async () => {
    if (!authToken || !isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await habitService.fetchHabits(authToken);
      setHabits(data);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, isLoggedIn]);

  const saveHabit = async (name: string, description: string, frequency: string) => {
    if (!authToken) return;
    try {
      await habitService.saveHabit(authToken, name, description, frequency);
      await fetchHabits();
    } catch (error) {
      throw error;
    }
  };

  const toggleHabit = async (id: number, dateIso: string) => {
    if (!authToken) return;
    try {
      await habitService.toggleHabit(authToken, id, dateIso);
      // optimistic re-fetch to keep data in sync
      await fetchHabits();
    } catch (error) {
      throw error;
    }
  };

  return { habits, isLoading, fetchHabits, saveHabit, toggleHabit, setHabits };
}

export default useHabitsController;
