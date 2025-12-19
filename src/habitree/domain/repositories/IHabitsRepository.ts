import { Habit } from '../entities/Habit';

export type HabitPersistencePayload = {
    name: string;
  description?: string | null;
    frequency: string;
    startDate?: string; // dd.mm.yyyy
    time?: string; // hh:mm
    weekDays?: number[];
    intervalDays?: string;
};

export interface IHabitsRepository {
  fetchHabits(authToken: string): Promise<Habit[]>;
  saveHabit(authToken: string, payload: HabitPersistencePayload): Promise<void>;
  toggleHabit(authToken: string, id: number, dateIso: string): Promise<void>;
  deleteHabit(authToken: string, id: number): Promise<void>;
  updateHabit(
    authToken: string,
    id: number,
    payload: HabitPersistencePayload
  ): Promise<void>;

  fetchPredefinedHabits(authToken: string): Promise<any[]>;
}

export default IHabitsRepository;
