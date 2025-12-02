import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CalendarView } from '../../presentation/ui/CalendarView';

export default function CalendarScreen() {
  useThemeColor({}, 'background');
  return <CalendarView />;
}