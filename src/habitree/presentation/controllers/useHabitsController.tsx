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
      // Optimistic update: update local state immediately to avoid UI jump
      const toggleDate = new Date(dateIso);
      const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
      setHabits(prev => prev.map(h => {
        if (h.id !== id) return h;
        const entries = h.entries.map(e => {
          try {
            const d = new Date(e.date);
            if (isSameDay(d, toggleDate)) return { ...e, status: !e.status };
          } catch (_){ }
          return e;
        });
        return { ...h, entries };
      }));

      // send request in background; if it fails, revert by refetching
      await habitService.toggleHabit(authToken, id, dateIso);
    } catch (error) {
      // revert local state by refetching from server
      try {
        await fetchHabits();
      } catch (e) {
        // swallow secondary error and rethrow original
      }
      throw error;
    }
  };

  return { habits, isLoading, fetchHabits, saveHabit, toggleHabit, setHabits };
}

export default useHabitsController;
