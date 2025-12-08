import { Habit } from '../../domain/entities/Habit';
import IHabitsRepository from '../../domain/repositories/IHabitsRepository';
/////////////////////////
export type HabitDailyOverview = {
  habit: Habit;
  checked: boolean;
};
/////////////////////////////////
export class HabitService {
  private repo: IHabitsRepository;

  constructor(repo: IHabitsRepository) {
    this.repo = repo;
  }

  async fetchHabits(authToken: string): Promise<Habit[]> {
    return this.repo.fetchHabits(authToken);
  }

  async saveHabit(authToken: string, name: string, description: string, frequency: string): Promise<Habit[]> {

    await this.repo.saveHabit(authToken, {
      name,
      description,
      frequency
    });
    return this.repo.fetchHabits(authToken);
  }

  async toggleHabit(authToken: string, id: number, dateIso: string): Promise<Habit[]> {
    await this.repo.toggleHabit(authToken, id, dateIso);
    return this.repo.fetchHabits(authToken);
  }
////////////////////////////////////
  buildDailyOverview(habits: Habit[], options: { date: Date; filter: string }): HabitDailyOverview[] {
    const { date, filter } = options;
    return habits
      .filter(habit => habit.matchesFilter(filter))
      .map(habit => ({
        habit,
        checked: habit.isCompletedOn(date),
      }));
  }

  async fetchDailyOverview(authToken: string, options: { date: Date; filter: string }): Promise<HabitDailyOverview[]> {
    const habits = await this.fetchHabits(authToken);
    return this.buildDailyOverview(habits, options);
  }
//////////////////////////////////////////////////////
}

export default HabitService;
