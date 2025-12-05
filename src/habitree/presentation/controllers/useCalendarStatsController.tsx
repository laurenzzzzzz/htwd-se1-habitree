import { useCallback, useState, useMemo } from 'react';
import { useHabitsController } from './useHabitsController';
import { HabitService } from '../../application/services/HabitService';

export function useCalendarStatsController(habitService: HabitService) {
  const { habits } = useHabitsController();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  /**
   * //Dummy Hardcoded: Calculate weekly completion stats
   * In real implementation, would fetch from statistics API
   */
  const weeklyStats = useMemo(() => {
    const labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    // //Dummy Hardcoded: Generate random completion percentages for now
    const data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

    return { labels, data };
  }, []);

  /**
   * Get completion rate for selected date
   */
  const getDayCompletionRate = useCallback((date: string): number => {
    const selectedDay = new Date(date);
    const completedCount = habits.filter((habit) => {
      const entry = habit.entries.find(
        (e) => new Date(e.date).toISOString().split('T')[0] === date
      );
      return entry?.status === true;
    }).length;

    return habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  }, [habits]);

  return {
    weeklyStats,
    selectedDate,
    setSelectedDate,
    getDayCompletionRate,
  };
}

export default useCalendarStatsController;
