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

  async saveHabit(authToken: string, name: string, description: string, frequency: string): Promise<void> {
    return this.repo.saveHabit(authToken, { name, description, frequency });
  }

  async toggleHabit(authToken: string, id: number, dateIso: string): Promise<void> {
    return this.repo.toggleHabit(authToken, id, dateIso);
  }
}

export default HabitService;
