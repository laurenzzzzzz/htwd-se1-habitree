import { useCallback, useState, useMemo } from 'react';
import { useApplicationServices } from '../providers/ApplicationServicesProvider';
import { useAuth } from '../../context/AuthContext';
import { Habit } from '../../domain/entities/Habit';
import { FilterKey } from '../../constants/HomeScreenConstants';

export function useHabitsController() {
  const { habitService } = useApplicationServices();
  const { authToken, isLoggedIn } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');

  const fetchHabits = useCallback(async () => {
    if (!authToken || !isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await habitService.fetchHabits(authToken);
      setHabits(data);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, habitService, isLoggedIn]);

  const saveHabit = useCallback(async (name: string, description: string, frequency: string) => {
    if (!authToken) return;
    try {
      const updatedHabits = await habitService.saveHabit(authToken, name, description, frequency);
      setHabits(updatedHabits);
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService]);

  const toggleHabit = useCallback(async (id: number, dateIso: string) => {
    if (!authToken) return;
    try {
      const updatedHabits = await habitService.toggleHabit(authToken, id, dateIso);
      setHabits(updatedHabits);
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService]);

  /**
   * Gets today's date for display/operations
   */
  const today = useMemo(() => new Date(), []);

  /**
   * Filters habits based on selected filter (delegated to habitService)
   */
  const filteredHabits = useMemo(() => {
    return habitService.buildDailyOverview(habits, { date: today, filter: selectedFilter });
  }, [habitService, habits, selectedFilter, today]);

  /**
   * Handler for habit creation
   */
  const handleSaveHabit = useCallback(async (name: string, description: string, frequency: string) => {
    try {
      await saveHabit(name, description, frequency);
      return { success: true };
    } catch (error) {
      console.error('saveHabit failed', error);
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler beim Speichern des Habits';
      return { success: false, errorMessage: message };
    }
  }, [saveHabit]);

  /**
   * Handler for habit toggle
   */
  const handleToggleHabit = useCallback(async (id: number, dateIso: string) => {
    try {
      await toggleHabit(id, dateIso);
      return { success: true };
    } catch (error) {
      console.error('toggleHabit failed', error);
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler beim Aktualisieren des Habits';
      return { success: false, errorMessage: message };
    }
  }, [toggleHabit]);

  return {
    habits,
    filteredHabits,
    isLoading,
    selectedFilter,
    setSelectedFilter,
    today,
    fetchHabits,
    saveHabit,
    toggleHabit,
    handleSaveHabit,
    handleToggleHabit,
    setHabits,
  };
}

export default useHabitsController;
