import { useCallback, useState, useMemo } from 'react';
import { useApplicationServices } from '../../application/providers/ApplicationServicesProvider';
import { useAuth } from '../../context/AuthContext';
import { Habit } from '../../domain/entities/Habit';
import { FilterKey } from '../../constants/HomeScreenConstants';
import { initLocalNotifications, scheduleRemindersForHabits } from '../../application/services/LocalNotificationService';

export function useHabitsController() {
  const { habitService } = useApplicationServices();
  const { authToken, isLoggedIn } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');
  const [predefinedHabits, setPredefinedHabits] = useState<any[]>([]);

  const fetchHabits = useCallback(async () => {
    if (!authToken || !isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await habitService.fetchHabits(authToken);
      setHabits(data);
      // initialize notifications and schedule reminders for today's entries
      try {
        const ok = await initLocalNotifications();
        if (ok) {
          // schedule reminders for the habits we just fetched
            // only schedule for habits that include today's entries
            const today = new Date();
            today.setHours(0,0,0,0);
            const habitsWithTodayEntries = data.filter((h: any) => {
              return Array.isArray(h.entries) && h.entries.some((e: any) => {
                const d = new Date(e.date);
                d.setHours(0,0,0,0);
                return d.getTime() === today.getTime();
              });
            });
            // scheduled reminders after fetch (silent in production)
            await scheduleRemindersForHabits(habitsWithTodayEntries);
        }
      } catch (e) {
        console.warn('Notification scheduling failed', e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [authToken, habitService, isLoggedIn]);

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
    async (name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
      if (!authToken) throw new Error('Kein Auth-Token vorhanden');
      try {
        const updatedHabits = await habitService.saveHabit(authToken, name, description, frequency, startDate, time, weekDays, intervalDays);
        setHabits(updatedHabits);
        // schedule notifications immediately for newly created/updated habits
        try {
          const ok = await initLocalNotifications();
          if (ok) {
            const today = new Date();
            today.setHours(0,0,0,0);
            const habitsWithTodayEntries = updatedHabits.filter((h: any) => {
              return Array.isArray(h.entries) && h.entries.some((e: any) => {
                const d = new Date(e.date);
                d.setHours(0,0,0,0);
                return d.getTime() === today.getTime();
              });
            });
            // scheduled reminders after save (silent in production)
            await scheduleRemindersForHabits(habitsWithTodayEntries);
          } else {
            console.warn('Notifications init returned false; skipping scheduling after save');
          }
        } catch (e) {
          console.warn('Scheduling notifications after save failed', e);
        }
      } catch (error) {
        throw error;
      }
    },
    [authToken, habitService]
  );

  const toggleHabit = useCallback(async (id: number, dateIso: string) => {
    if (!authToken) return;
    try {
      const updatedHabits = await habitService.toggleHabit(authToken, id, dateIso);
      setHabits(updatedHabits);
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService]);

  const deleteHabit = useCallback(async (id: number) => {
    if (!authToken) throw new Error('Kein Auth-Token vorhanden');
    try {
      const updatedHabits = await habitService.deleteHabit(authToken, id);
      setHabits(updatedHabits);
    } catch (error) {
      throw error;
    }
  }, [authToken, habitService]);

  const updateHabit = useCallback(async (id: number, name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
    if (!authToken) throw new Error('Kein Auth-Token vorhanden');
    try {
      const updatedHabits = await habitService.updateHabit(authToken, id, name, description, frequency, startDate, time, weekDays, intervalDays);
      setHabits(updatedHabits);
    } catch (error) {
      console.error('[updateHabit] Error:', error);
      throw error;
    }
  }, [authToken, habitService]);

  /**
   * Filters habits based on selected filter
   */
  const filteredHabits = useMemo(() => {
    // filteredHabits recalculation
    const today = new Date();
    const isSameDay = (a: Date, b: Date) => 
      a.getFullYear() === b.getFullYear() && 
      a.getMonth() === b.getMonth() && 
      a.getDate() === b.getDate();

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
  const handleSaveHabit = useCallback(
    async (name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
      try {
        await saveHabit(name, description, frequency, startDate, time, weekDays, intervalDays);
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
  const handleToggleHabit = useCallback(async (id: number, dateIso: string) => {
    try {
      await toggleHabit(id, dateIso);
      return { success: true };
    } catch (error) {
      return { success: false, error };
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

  const handleUpdateHabit = useCallback(async (id: number, name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => {
    try {
      await updateHabit(id, name, description, frequency, startDate, time, weekDays, intervalDays);
      return { success: true };
    } catch (error) {
      console.error('updateHabit error', error);
      return { success: false, error };
    }
  }, [updateHabit]);

  return {
    habits,
    filteredHabits,
    predefinedHabits,
    isLoading,
    selectedFilter,
    setSelectedFilter,
    today,
    fetchHabits,
    saveHabit,
    toggleHabit,
    deleteHabit,
    updateHabit,
    handleSaveHabit,
    handleToggleHabit,
    handleDeleteHabit,
    handleUpdateHabit,
    fetchPredefinedHabits,
    isSameDay,
    setHabits,
  };
}

export default useHabitsController;
