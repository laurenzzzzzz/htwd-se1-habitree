import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useHabitsController } from '../presentation/controllers/useHabitsController';
import { Habit } from '../domain/entities/Habit';
import { FilterKey } from '../constants/HomeScreenConstants';

export interface IHabitsContext {
  habits: Habit[];
  filteredHabits: Array<{ habit: Habit; entryForToday?: any; checked: boolean }>;
  isLoading: boolean;
  selectedFilter: FilterKey;
  setSelectedFilter: (filter: FilterKey) => void;
  today: Date;
  fetchHabits: () => Promise<void>;
  predefinedHabits: any[];
  fetchPredefinedHabits: () => Promise<any[]>;
  saveHabit: (name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => Promise<Habit[]>;
  toggleHabit: (id: number, dateIso: string) => Promise<void>;
  deleteHabit: (id: number) => Promise<Habit[]>;
  updateHabit: (id: number, name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => Promise<Habit[]>;
  handleSaveHabit: (name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => Promise<{ success: boolean; error?: any }>;
  handleToggleHabit: (id: number, dateIso: string) => Promise<{ success: boolean; error?: any }>;
  handleDeleteHabit: (id: number) => Promise<{ success: boolean; error?: any }>;
  handleUpdateHabit: (id: number, name: string, description: string, frequency: string, startDate?: string, time?: string, weekDays?: number[], intervalDays?: string) => Promise<{ success: boolean; error?: any }>;
  isSameDay: (a: Date, b: Date) => boolean;
  setHabits: (habits: Habit[]) => void;
}

const HabitsContext = createContext<IHabitsContext | null>(null);

export const HabitsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const habitsController = useHabitsController();

  return (
    <HabitsContext.Provider value={habitsController}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = (): IHabitsContext => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
