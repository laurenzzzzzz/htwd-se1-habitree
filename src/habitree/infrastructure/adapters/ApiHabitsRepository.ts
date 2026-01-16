import axios, { AxiosError } from 'axios';
import IHabitsRepository, { HabitPersistencePayload } from '../../domain/repositories/IHabitsRepository';
import { Habit, HabitData } from '../../domain/entities/Habit';
import {
  buildHabitPersistenceRequest,
  HabitPersistenceRequestBody,
} from '../../domain/policies/HabitSchedulePolicy';

import { API_BASE_URL } from '../../constants/ApiConfig';
const HABITS_API_URL = `${API_BASE_URL}/habits`;

export class ApiHabitsRepository implements IHabitsRepository {
  async fetchHabits(authToken: string): Promise<Habit[]> {
    const response = await axios.get<HabitData[]>(HABITS_API_URL, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    // Convert raw data to domain entities
    return response.data.map(data => new Habit(data));
  }

  async saveHabit(
    authToken: string,
    payload: HabitPersistencePayload
  ): Promise<void> {
    const body: HabitPersistenceRequestBody = buildHabitPersistenceRequest(payload);

    try {
      await axios.post(HABITS_API_URL, body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (err) {
      // Normalize axios error to a readable message
      const axiosErr = err as any;
      let message = 'Unbekannter Fehler beim Erstellen des Habits.';
      if (axiosErr.response && axiosErr.response.data) {
        if (typeof axiosErr.response.data === 'string') message = axiosErr.response.data;
        else if (axiosErr.response.data.error) message = axiosErr.response.data.error;
        else message = JSON.stringify(axiosErr.response.data);
      } else if (axiosErr.message) {
        message = axiosErr.message;
      }
      throw new Error(message);
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

  async deleteHabit(authToken: string, id: number): Promise<void> {
    await axios.delete(`${HABITS_API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async updateHabit(
    authToken: string,
    id: number,
    payload: HabitPersistencePayload
  ): Promise<void> {
    const body: HabitPersistenceRequestBody = buildHabitPersistenceRequest(payload);
    await axios.put(`${HABITS_API_URL}/${id}`, body, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async growHabit(authToken: string, id: number): Promise<void> {
    await axios.put(`${HABITS_API_URL}/${id}/grow`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async harvestHabit(authToken: string, id: number): Promise<void> {
    await axios.put(`${HABITS_API_URL}/${id}/harvest`, {}, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async fetchHarvestedHabits(authToken: string): Promise<Habit[]> {
    const response = await axios.get<HabitData[]>(`${HABITS_API_URL}/harvested`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    // Convert raw data to domain entities
    return response.data.map(data => new Habit(data));
  }

  async fetchPredefinedHabits(authToken: string): Promise<any[]> {
    const response = await axios.get<any[]>(`${HABITS_API_URL}/predefined`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  }
}

export default ApiHabitsRepository;
