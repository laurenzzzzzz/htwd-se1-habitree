import { Habit } from '../entities/Habit';

export interface IHabitsRepository {
  fetchHabits(authToken: string): Promise<Habit[]>;
  saveHabit(authToken: string, payload: { name: string; description: string; frequency: string }): Promise<void>;
  toggleHabit(authToken: string, id: number, dateIso: string): Promise<void>;
}

export default IHabitsRepository;
