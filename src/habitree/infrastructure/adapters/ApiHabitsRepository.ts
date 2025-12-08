import axios, { AxiosError } from 'axios';
import IHabitsRepository, { HabitPersistencePayload } from '../../domain/repositories/IHabitsRepository';
import { Habit, HabitData } from '../../domain/entities/Habit';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';
const HABITS_API_URL = `${API_BASE_URL}/habits`;

export class ApiHabitsRepository implements IHabitsRepository {
  async fetchHabits(authToken: string): Promise<Habit[]> {
    const response = await axios.get<HabitData[]>(HABITS_API_URL, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    // Convert raw data to domain entities
    return response.data.map(data => new Habit(data));
  }

  async saveHabit(authToken: string, payload: HabitPersistencePayload): Promise<void> {
    try {

      await axios.post(HABITS_API_URL, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      throw this.createDetailedError(error, 'Habit konnte nicht gespeichert werden');
    }
  }

  async toggleHabit(authToken: string, id: number, dateIso: string): Promise<void> {
    try {
      await axios.put(`${HABITS_API_URL}/${id}/toggle`, { date: dateIso }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      throw this.createDetailedError(error, 'Habit konnte nicht aktualisiert werden');
    }
  }

  private createDetailedError(originalError: unknown, fallbackMessage: string): Error {
    if (axios.isAxiosError(originalError)) {
      const axiosError = originalError as AxiosError<{ message?: string; error?: string }>;
      const serverMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
      const status = axiosError.response?.status;
      const detail = serverMessage || axiosError.message || fallbackMessage;
      const message = status
        ? `${fallbackMessage} (Status ${status}: ${detail})`
        : `${fallbackMessage}: ${detail}`;
      return new Error(message);
    }

    if (originalError instanceof Error) {
      return originalError;
    }

    return new Error(fallbackMessage);
  }
}

export default ApiHabitsRepository;
