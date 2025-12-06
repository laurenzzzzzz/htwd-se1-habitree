import { Habit } from '../../domain/entities/Habit';
import IHabitsRepository from '../../domain/repositories/IHabitsRepository';

export class HabitService {
  private repo: IHabitsRepository;

  constructor(repo: IHabitsRepository) {
    this.repo = repo;
  }

  async fetchHabits(authToken: string): Promise<Habit[]> {
    return this.repo.fetchHabits(authToken);
  }

  async saveHabit(
    authToken: string,
    name: string,
    description: string,
    frequency: string,
    startDate?: string,
    time?: string,
    weekDays?: number[],
    intervalDays?: string
  ): Promise<Habit[]> {
    await this.repo.saveHabit(authToken, { name, description, frequency, startDate, time, weekDays, intervalDays });
    return this.repo.fetchHabits(authToken);
  }

  async toggleHabit(authToken: string, id: number, dateIso: string): Promise<Habit[]> {
    await this.repo.toggleHabit(authToken, id, dateIso);
    return this.repo.fetchHabits(authToken);
  }

  async deleteHabit(authToken: string, id: number): Promise<Habit[]> {
    await this.repo.deleteHabit(authToken, id);
    return this.repo.fetchHabits(authToken);
  }

  async updateHabit(
    authToken: string,
    id: number,
    name: string,
    description: string,
    frequency: string,
    startDate?: string,
    time?: string,
    weekDays?: number[],
    intervalDays?: string
  ): Promise<Habit[]> {
    await this.repo.updateHabit(authToken, id, { name, description, frequency, startDate, time, weekDays, intervalDays });
    return this.repo.fetchHabits(authToken);
  }

  async fetchPredefinedHabits(authToken: string): Promise<any[]> {
    return this.repo.fetchPredefinedHabits(authToken);
  }
}

export default HabitService;
