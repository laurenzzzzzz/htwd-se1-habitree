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
    frequency: string,
    description?: string | null,
    startDate?: string,
    time?: string,
    weekDays?: number[],
    intervalDays?: string,
    durationDays?: string
  ): Promise<Habit[]> {
    await this.repo.saveHabit(authToken, { name, description, frequency, startDate, time, weekDays, intervalDays, durationDays });
    return this.repo.fetchHabits(authToken);
  }

  async toggleHabit(authToken: string, id: number, dateIso?: string): Promise<Habit[]> {
    const effectiveDateIso = dateIso ?? new Date().toISOString();
    await this.repo.toggleHabit(authToken, id, effectiveDateIso);
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
    frequency: string,
    description?: string | null,
    startDate?: string,
    time?: string,
    weekDays?: number[],
    intervalDays?: string,
    durationDays?: string
  ): Promise<Habit[]> {
    await this.repo.updateHabit(authToken, id, { name, description, frequency, startDate, time, weekDays, intervalDays, durationDays });
    return this.repo.fetchHabits(authToken);
  }

  async growHabit(authToken: string, id: number): Promise<Habit[]> {
    await this.repo.growHabit(authToken, id);
    return this.repo.fetchHabits(authToken);
  }

  async harvestHabit(authToken: string, id: number): Promise<Habit[]> {
    await this.repo.harvestHabit(authToken, id);
    return this.repo.fetchHabits(authToken);
  }

  async fetchHarvestedHabits(authToken: string): Promise<Habit[]> {
    return this.repo.fetchHarvestedHabits(authToken);
  }

  async fetchPredefinedHabits(authToken: string): Promise<any[]> {
    return this.repo.fetchPredefinedHabits(authToken);
  }
}

export default HabitService;
