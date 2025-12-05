import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCalendarStatsController } from '../../presentation/controllers/useCalendarStatsController';
import { CalendarView } from '../../presentation/ui/CalendarView';

export default function CalendarScreen() {
  useThemeColor({}, 'background');
  const { weeklyStats, selectedDate, setSelectedDate, getDayCompletionRate } = 
    useCalendarStatsController();

  return (
    <CalendarView 
      weeklyStats={weeklyStats} 
      selectedDate={selectedDate} 
      onDayPress={setSelectedDate} 
      getDayCompletionRate={getDayCompletionRate} 
    />
  );
}