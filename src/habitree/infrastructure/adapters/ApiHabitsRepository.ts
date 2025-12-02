import axios from 'axios';
import IHabitsRepository from '../../domain/repositories/IHabitsRepository';
import { Habit } from '../../domain/entities/Habit';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';
const HABITS_API_URL = `${API_BASE_URL}/habits`;

export class ApiHabitsRepository implements IHabitsRepository {
  async fetchHabits(authToken: string): Promise<Habit[]> {
    const response = await axios.get<Habit[]>(HABITS_API_URL, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  }

  async saveHabit(authToken: string, payload: { name: string; description: string; frequency: string }): Promise<void> {
    await axios.post(HABITS_API_URL, payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async toggleHabit(authToken: string, id: number, dateIso: string): Promise<void> {
    await axios.put(`${HABITS_API_URL}/${id}/toggle`, { date: dateIso }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }
}

export default ApiHabitsRepository;
