import { useCallback, useState, useMemo } from 'react';
import { useApplicationServices } from '../providers/ApplicationServicesProvider';
import { useAuth } from '../../context/AuthContext';
import { Habit } from '../../domain/entities/Habit';
import { FilterKey } from '../../constants/HomeScreenConstants';

export function useHabitsController() {
  const { habitService, notificationService, quoteService } = useApplicationServices();
  const { authToken, isLoggedIn } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');
  const [predefinedHabits, setPredefinedHabits] = useState<any[]>([]);

  const today = useMemo(() => {
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    return current;
  }, []);

  const isSameDay = useCallback((a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate(),
  []);

  const rescheduleNotifications = useCallback(async (currentHabits: Habit[]) => {
    if (!notificationService) return;
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
    await notificationService.rescheduleForHabits(currentHabits, targetDate);
  }, [notificationService]);

  const fetchHabits = useCallback(async () => {
    if (!authToken || !isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await habitService.fetchHabits(authToken);
      setHabits(data);
      await rescheduleNotifications(data);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, habitService, isLoggedIn, rescheduleNotifications]);

  const fetchPredefinedHabits = useCallback(async () => {
    if (!authToken) {
      console.warn('fetchPredefinedHabits: no authToken');
      setPredefinedHabits([]);
      return [];
    }
    try {
      const data = await habitService.fetchPredefinedHabits(authToken);
      // Map backend fields (name) to UI shape (label)
      const mapped = (data || []).map((p: any) => ({
        id: p.id,
        label: p.name ?? p.label ?? '',
        description: p.description,
        frequency: p.frequency,
      }));
      setPredefinedHabits(mapped);
      return data || [];
    } catch (error) {
      console.error('fetchPredefinedHabits error', error);
      setPredefinedHabits([]);
      return [];
    }
  }, [habitService, authToken]);

  const saveHabit = useCallback(
    async (name: string, frequency: string, description?: string | null | undefined, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
      if (!authToken) throw new Error('Kein Auth-Token vorhanden');
      try {
        const updatedHabits = await habitService.saveHabit(authToken, name, frequency, description, startDate, time, weekDays, intervalDays);
        setHabits(updatedHabits);
        await rescheduleNotifications(updatedHabits);
        return updatedHabits;
      } catch (error) {
        throw error;
      }
    },
    [authToken, habitService, rescheduleNotifications]
  );

  const areAllDueForTodayCompleted = useCallback((list: Habit[]): boolean => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const dueToday = list
      .map(h => ({ h, entry: h.entries.find(e => isSameDay(new Date(e.date), t)) }))
      .filter(x => !!x.entry);
    if (dueToday.length === 0) return false;
    return dueToday.every(x => !!x.entry && x.entry.status === true);
  }, [isSameDay]);

  const toggleHabit = useCallback(async (id: number, dateIso?: string) => {
    if (!authToken) throw new Error('Kein Auth-Token vorhanden');
    const targetDateIso = dateIso ?? new Date().toISOString();
    try {
      const wasAllDone = areAllDueForTodayCompleted(habits);
      const updatedHabits = await habitService.toggleHabit(authToken, id, targetDateIso);
      setHabits(updatedHabits);
      await rescheduleNotifications(updatedHabits);
      // After update: if we transitioned into "all done today", show motivational notification
      const isAllDone = areAllDueForTodayCompleted(updatedHabits);
      if (!wasAllDone && isAllDone && notificationService && quoteService) {
        try {
          const q = await quoteService.fetchQuote();
          const title = 'Stark! Alle Gewohnheiten erledigt';
          const body = q?.quote ? q.quote : 'Großartig! Du hast heute alles geschafft.';
          await notificationService.showImmediate(title, body, { type: 'all-done-today' });
        } catch (e) {
          console.warn('could not send all-done notification', e);
        }
      }
      return updatedHabits;
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService, habits, areAllDueForTodayCompleted, rescheduleNotifications, notificationService, quoteService]);

  const deleteHabit = useCallback(async (id: number) => {
    if (!authToken) throw new Error('Kein Auth-Token vorhanden');
    try {
      const updatedHabits = await habitService.deleteHabit(authToken, id);
      setHabits(updatedHabits);
      await rescheduleNotifications(updatedHabits);
      return updatedHabits;
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService, rescheduleNotifications]);

  const updateHabit = useCallback(async (id: number, name: string, frequency: string, description?: string | null | undefined, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
    if (!authToken) throw new Error('Kein Auth-Token vorhanden');
    try {
      const updatedHabits = await habitService.updateHabit(authToken, id, name, frequency, description, startDate, time, weekDays, intervalDays);
      setHabits(updatedHabits);
      await rescheduleNotifications(updatedHabits);
      return updatedHabits;
    } catch (error) {
      console.error('[updateHabit] Error:', error);
      throw error;
    }
  }, [authToken, habitService, rescheduleNotifications]);

  /**
   * Filters habits based on selected filter
   */
  const filteredHabits = useMemo(() => {
    // filteredHabits recalculation
    const result = habits
      .map(habit => {
        const entryForToday = habit.entries.find(entry => 
          isSameDay(new Date(entry.date), today)
        );
        return {
          habit,
          entryForToday,
          checked: entryForToday?.status ?? false,
        };
      })
      .filter(({ entryForToday, habit }) => {
        // Only show habits that have an entry for today (Backend ensures this based on frequency)
        if (!entryForToday) return false;
        
        if (selectedFilter === 'alle') return true;
        return habit.name.toLowerCase().includes(selectedFilter);
      });
    // result computed
    return result;
  }, [habits, selectedFilter, isSameDay, today]);

  /**
   * Handler for habit creation
   */
  const handleSaveHabit = useCallback(
    async (name: string, frequency: string, description?: string | null | undefined, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
      try {
        await saveHabit(name, frequency, description, startDate, time, weekDays, intervalDays);
        return { success: true };
      } catch (error) {
        console.error('saveHabit error:', error);
        const message = (error as any)?.message || 'Unbekannter Fehler';
        return { success: false, error: message };
      }
    },
    [saveHabit]
  );

  /**
   * Handler for habit toggle
   */
  const handleToggleHabit = useCallback(async (id: number, dateIso?: string) => {
    try {
      await toggleHabit(id, dateIso);
      return { success: true };
    } catch (error) {
      console.error('toggleHabit failed', error);
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler beim Aktualisieren des Habits';
      return { success: false, error: message };
    }
  }, [toggleHabit]);

  const handleDeleteHabit = useCallback(async (id: number) => {
    try {
      await deleteHabit(id);
      return { success: true };
    } catch (error) {
      console.error('deleteHabit error', error);
      return { success: false, error };
    }
  }, [deleteHabit]);

  const handleUpdateHabit = useCallback(async (id: number, name: string, frequency: string, description?: string | null | undefined, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
    try {
      await updateHabit(id, name, frequency, description, startDate, time, weekDays, intervalDays);
      return { success: true };
    } catch (error) {
      console.error('updateHabit error', error);
      return { success: false, error };
    }
  }, [updateHabit]);

  const growHabit = useCallback(async (id: number) => {
    if (!authToken) throw new Error('Kein Auth-Token vorhanden');
    try {
      const updatedHabits = await habitService.growHabit(authToken, id);
      setHabits(updatedHabits);
      return updatedHabits;
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService]);

  const harvestHabit = useCallback(async (id: number) => {
    if (!authToken) throw new Error('Kein Auth-Token vorhanden');
    try {
      const updatedHabits = await habitService.harvestHabit(authToken, id);
      setHabits(updatedHabits);
      return updatedHabits;
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService]);

  const handleGrowHabit = useCallback(async (id: number) => {
    try {
      await growHabit(id);
      return { success: true };
    } catch (error) {
      console.error('growHabit error', error);
      return { success: false, error };
    }
  }, [growHabit]);

  const handleHarvestHabit = useCallback(async (id: number) => {
    try {
      await harvestHabit(id);
      return { success: true };
    } catch (error) {
      console.error('harvestHabit error', error);
      return { success: false, error };
    }
  }, [harvestHabit]);

  return {
    habits,
    filteredHabits,
    predefinedHabits,
    isLoading,
    selectedFilter,
    setSelectedFilter,
    fetchHabits,
    saveHabit,
    toggleHabit,
    deleteHabit,
    updateHabit,
    handleSaveHabit,
    handleToggleHabit,
    handleDeleteHabit,
    handleUpdateHabit,
    handleGrowHabit,
    handleHarvestHabit,
    fetchPredefinedHabits,
    today,
    isSameDay,
    setHabits,
  };
}

export default useHabitsController;
