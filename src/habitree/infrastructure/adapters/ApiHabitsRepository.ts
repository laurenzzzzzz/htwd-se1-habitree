import axios from 'axios';
import IHabitsRepository from '../../domain/repositories/IHabitsRepository';
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

  async saveHabit(
    authToken: string,
    payload: { name: string; description: string; frequency: string; startDate?: string; time?: string; weekDays?: number[]; intervalDays?: string }
  ): Promise<void> {
    // Backend requires startDate and time. Prefer values from payload, otherwise generate sensible defaults.
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const defaultStartDate = `${dd}.${mm}.${yyyy}`; // dd.mm.yyyy
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const defaultTime = `${hours}:${minutes}`;

    const body = {
      name: payload.name,
      description: payload.description,
      frequency: payload.frequency,
      startDate: payload.startDate && payload.startDate.trim() !== '' ? payload.startDate : defaultStartDate,
      time: payload.time && payload.time.trim() !== '' ? payload.time : defaultTime,
      weekDays: payload.weekDays && payload.weekDays.length > 0 ? payload.weekDays : [],
      intervalDays: payload.intervalDays && payload.intervalDays.trim() !== '' ? Number(payload.intervalDays) : undefined,
    };

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
    await axios.put(`${HABITS_API_URL}/${id}/toggle`, { date: dateIso }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async deleteHabit(authToken: string, id: number): Promise<void> {
    await axios.delete(`${HABITS_API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async updateHabit(
    authToken: string,
    id: number,
    payload: { name: string; description: string; frequency: string; startDate?: string; time?: string; weekDays?: number[]; intervalDays?: string }
  ): Promise<void> {
    const body = {
      name: payload.name,
      description: payload.description,
      frequency: payload.frequency,
      startDate: payload.startDate,
      time: payload.time,
      weekDays: payload.weekDays,
      intervalDays: payload.intervalDays && payload.intervalDays.trim() !== '' ? Number(payload.intervalDays) : undefined,
    };
    await axios.put(`${HABITS_API_URL}/${id}`, body, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  }

  async fetchPredefinedHabits(authToken: string): Promise<any[]> {
    const response = await axios.get<any[]>(`${HABITS_API_URL}/predefined`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  }
}

export default ApiHabitsRepository;
