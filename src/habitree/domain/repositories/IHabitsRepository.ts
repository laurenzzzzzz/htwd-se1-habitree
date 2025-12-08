import { Habit } from '../entities/Habit';

export type HabitPersistencePayload = {
  name: string;
  description: string;
  frequency: string;
  startDate?: string;
  startTime?: string;
};

export interface IHabitsRepository {
  fetchHabits(authToken: string): Promise<Habit[]>;
  saveHabit(authToken: string, payload: HabitPersistencePayload): Promise<void>;
  toggleHabit(authToken: string, id: number, dateIso: string): Promise<void>;
}

export default IHabitsRepository;
