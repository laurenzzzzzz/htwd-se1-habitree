/**
 * Integrationstests für HabitService
 * 
 * Testet: application/services/HabitService.ts
 *         + infrastructure/adapters/ (gemockt)
 *         + domain/entities/Habit.ts
 * 
 * Diese Tests prüfen das Zusammenspiel mehrerer Komponenten.
 */

import { HabitService } from '../../application/services/HabitService';
import { Habit, HabitData } from '../../domain/entities/Habit';
import IHabitsRepository, { HabitPersistencePayload } from '../../domain/repositories/IHabitsRepository';

// Mock Repository (simuliert API ohne echten Server)
class MockHabitsRepository implements IHabitsRepository {
  private habits: HabitData[] = [];
  private shouldFail: boolean = false;
  private lastToggleDate: string | null = null;

  setHabits(habits: HabitData[]) {
    this.habits = habits;
  }

  setShouldFail(fail: boolean) {
    this.shouldFail = fail;
  }

  async growHabit(authToken: string, id: number): Promise<void> {
    return;
  }
  
  async harvestHabit(authToken: string, id: number): Promise<void> {
    return;
  }

  async fetchHarvestedHabits(authToken: string): Promise<any[]> {
    return [];
  }

  async fetchHabits(authToken: string): Promise<Habit[]> {
    if (this.shouldFail) {
      throw new Error('API Error: Server nicht erreichbar');
    }
    if (!authToken) {
      throw new Error('Unauthorized: Token fehlt');
    }
    return this.habits.map(data => new Habit(data));
  }

  async saveHabit(authToken: string, payload: HabitPersistencePayload): Promise<void> {
    if (this.shouldFail) {
      throw new Error('API Error: Speichern fehlgeschlagen');
    }
    if (!authToken) {
      throw new Error('Unauthorized');
    }
    const newHabit: HabitData = {
      id: this.habits.length + 1,
      name: payload.name,
      description: payload.description,
      frequency: payload.frequency,
      entries: [],
    };
    this.habits.push(newHabit);
  }

  async toggleHabit(authToken: string, id: number, dateIso: string): Promise<void> {
    if (this.shouldFail) {
      throw new Error('API Error: Toggle fehlgeschlagen');
    }
    const habit = this.habits.find(h => h.id === id);
    if (!habit) {
      throw new Error('Habit nicht gefunden');
    }
    this.lastToggleDate = dateIso;
    
    const existingEntry = habit.entries.find(e => e.date === dateIso);
    if (existingEntry) {
      existingEntry.status = !existingEntry.status;
    } else {
      habit.entries.push({
        id: habit.entries.length + 1,
        date: dateIso,
        status: true,
        note: null
      });
    }
  }

  getLastToggleDate(): string | null {
    return this.lastToggleDate;
  }

  // --- Ergänzte Methoden, damit das Mock das Interface vollständig implementiert ---
  async deleteHabit(authToken: string, id: number): Promise<void> {
    if (this.shouldFail) {
      throw new Error('API Error: Delete fehlgeschlagen');
    }
    const idx = this.habits.findIndex(h => h.id === id);
    if (idx === -1) {
      throw new Error('Habit nicht gefunden');
    }
    this.habits.splice(idx, 1);
  }

  async updateHabit(authToken: string, id: number, payload: HabitPersistencePayload): Promise<void> {
    if (this.shouldFail) {
      throw new Error('API Error: Update fehlgeschlagen');
    }
    const habit = this.habits.find(h => h.id === id);
    if (!habit) {
      throw new Error('Habit nicht gefunden');
    }
    habit.name = payload.name;
    habit.description = payload.description;
    habit.frequency = payload.frequency;
    if (payload.startDate !== undefined) habit.startDate = payload.startDate;
    if (payload.time !== undefined) habit.time = payload.time;
    if (payload.weekDays !== undefined) habit.weekDays = payload.weekDays;
    if (payload.intervalDays !== undefined) habit.intervalDays = Number(payload.intervalDays);
  }

  async fetchPredefinedHabits(authToken: string): Promise<any[]> {
    if (this.shouldFail) {
      throw new Error('API Error: Server nicht erreichbar');
    }
    return [];
  }
}

describe('HabitService Integration Tests', () => {
  let service: HabitService;
  let mockRepo: MockHabitsRepository;
  const validToken = 'valid-test-token-123';

  beforeEach(() => {
    mockRepo = new MockHabitsRepository();
    service = new HabitService(mockRepo);
  });

  // ============================================
  // fetchHabits - Service + Repository
  // ============================================
  describe('fetchHabits', () => {
    it('sollte Habits als Domain-Entities zurückgeben', async () => {
      mockRepo.setHabits([
        { id: 1, name: 'Sport', description: 'Täglich', frequency: 'daily', entries: [] },
        { id: 2, name: 'Lesen', description: 'Abends', frequency: 'daily', entries: [] }
      ]);

      const habits = await service.fetchHabits(validToken);

      expect(habits).toHaveLength(2);
      expect(habits[0]).toBeInstanceOf(Habit);
      expect(habits[0].name).toBe('Sport');
    });

    it('sollte leeres Array zurückgeben wenn keine Habits', async () => {
      mockRepo.setHabits([]);
      const habits = await service.fetchHabits(validToken);
      expect(habits).toHaveLength(0);
    });

    it('sollte Fehler werfen bei ungültigem Token', async () => {
      await expect(service.fetchHabits('')).rejects.toThrow('Unauthorized');
    });

    it('sollte API-Fehler propagieren', async () => {
      mockRepo.setShouldFail(true);
      await expect(service.fetchHabits(validToken)).rejects.toThrow('API Error');
    });
  });

  // ============================================
  // saveHabit - Create Flow
  // ============================================
  describe('saveHabit', () => {
    it('sollte neuen Habit speichern und Liste zurückgeben', async () => {
      mockRepo.setHabits([]);

      const habits = await service.saveHabit(validToken, 'Meditation', 'Morgens 10 Min', 'daily');

      expect(habits).toHaveLength(1);
      expect(habits[0].name).toBe('Meditation');
    });

    it('sollte Habit zu bestehender Liste hinzufügen', async () => {
      mockRepo.setHabits([
        { id: 1, name: 'Sport', description: 'Test', frequency: 'daily', entries: [] }
      ]);

      const habits = await service.saveHabit(validToken, 'Lesen', 'Abends', 'daily');

      expect(habits).toHaveLength(2);
    });

    it('sollte Fehler werfen bei API-Problemen', async () => {
      mockRepo.setShouldFail(true);
      await expect(
        service.saveHabit(validToken, 'Test', 'Test', 'daily')
      ).rejects.toThrow('API Error');
    });
  });

  // ============================================
  // toggleHabit - Toggle Flow
  // ============================================
  describe('toggleHabit', () => {
    const today = new Date().toISOString().split('T')[0];

    it('sollte Habit-Eintrag erstellen und togggeln', async () => {
      mockRepo.setHabits([
        { id: 1, name: 'Sport', description: 'Test', frequency: 'daily', entries: [] }
      ]);

      const habits = await service.toggleHabit(validToken, 1, today);

      expect(habits[0].entries).toHaveLength(1);
      expect(habits[0].entries[0].status).toBe(true);
    });

    it('sollte bestehenden Eintrag togglen (true -> false)', async () => {
      mockRepo.setHabits([
        { 
          id: 1, name: 'Sport', description: 'Test', frequency: 'daily',
          entries: [{ id: 1, date: today, status: true, note: null }]
        }
      ]);

      const habits = await service.toggleHabit(validToken, 1, today);

      expect(habits[0].entries[0].status).toBe(false);
    });

    it('sollte Fehler werfen wenn Habit nicht existiert', async () => {
      mockRepo.setHabits([]);
      await expect(
        service.toggleHabit(validToken, 999, today)
      ).rejects.toThrow('Habit nicht gefunden');
    });

    it('sollte aktuelles Datum verwenden, wenn keins übergeben wird', async () => {
      mockRepo.setHabits([
        { id: 1, name: 'Sport', description: 'Test', frequency: 'daily', entries: [] }
      ]);

      const habits = await service.toggleHabit(validToken, 1);

      const lastToggleDate = mockRepo.getLastToggleDate();
      expect(lastToggleDate).not.toBeNull();
      if (lastToggleDate) {
        const toggleDate = new Date(lastToggleDate);
        const now = new Date();
        expect(toggleDate.toDateString()).toBe(now.toDateString());
      }
      expect(habits[0].entries).toHaveLength(1);
    });
  });

  // ============================================
  // E2E Workflow: Create -> Toggle -> Verify
  // ============================================
  describe('E2E Workflow', () => {
    it('sollte kompletten Flow durchführen: Erstellen -> Abhaken -> Streak', async () => {
      // 1. Habit erstellen
      let habits = await service.saveHabit(validToken, 'Sport', 'Täglich', 'daily');
      expect(habits).toHaveLength(1);
      expect(habits[0].isCompletedToday()).toBe(false);

      // 2. Heute abhaken
      const today = new Date().toISOString().split('T')[0];
      habits = await service.toggleHabit(validToken, 1, today);
      
      // 3. Prüfen ob Entity-Methoden funktionieren
      expect(habits[0].isCompletedToday()).toBe(true);
      expect(habits[0].getStreak()).toBeGreaterThanOrEqual(1);
      expect(habits[0].getCompletionRate()).toBe(100);
    });
  });
});
