import { useCallback, useState, useMemo } from 'react';
import { useApplicationServices } from '../../application/providers/ApplicationServicesProvider';
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
   * Filters habits based on selected filter
   */
  const filteredHabits = useMemo(() => {
    const today = new Date();
    const isSameDay = (a: Date, b: Date) => 
      a.getFullYear() === b.getFullYear() && 
      a.getMonth() === b.getMonth() && 
      a.getDate() === b.getDate();

    return habits
      .map(habit => {
        const entryForToday = habit.entries.find(entry => 
          isSameDay(new Date(entry.date), today)
        );
        return {
          habit,
          checked: entryForToday?.status ?? false,
        };
      })
      .filter(({ habit }) => {
        if (selectedFilter === 'alle') return true;
        return habit.name.toLowerCase().includes(selectedFilter);
      });
  }, [habits, selectedFilter]);

  /**
   * Gets today's date for display/operations
   */
  const today = useMemo(() => new Date(), []);

  /**
   * Helper: check if two dates are the same day
   */
  const isSameDay = useCallback((a: Date, b: Date) => 
    a.getFullYear() === b.getFullYear() && 
    a.getMonth() === b.getMonth() && 
    a.getDate() === b.getDate(), 
  []);

  /**
   * Handler for habit creation
   */
  const handleSaveHabit = useCallback(async (name: string, description: string, frequency: string) => {
    try {
      await saveHabit(name, description, frequency);
      return { success: true };
    } catch (error) {
      return { success: false, error };
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
      return { success: false, error };
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
    isSameDay,
    setHabits,
  };
}

export default useHabitsController;
