import { Habit } from '../entities/Habit';

export interface IHabitsRepository {
  fetchHabits(authToken: string): Promise<Habit[]>;
  saveHabit(
    authToken: string,
    payload: {
      name: string;
      description: string;
      frequency: string;
      startDate?: string; // dd.mm.yyyy
      time?: string; // hh:mm
    }
  ): Promise<void>;
  toggleHabit(authToken: string, id: number, dateIso: string): Promise<void>;
  deleteHabit(authToken: string, id: number): Promise<void>;
  updateHabit(
    authToken: string,
    id: number,
    payload: {
      name: string;
      description: string;
      frequency: string;
      startDate?: string;
      time?: string;
      weekDays?: number[];
      intervalDays?: string;
    }
  ): Promise<void>;

  fetchPredefinedHabits(authToken: string): Promise<any[]>;
}

export default IHabitsRepository;
