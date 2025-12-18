import { Achievement } from '../../domain/entities/Achievement';
import { Streak } from '../../domain/entities/Streak';
import { TreeGrowth } from '../../domain/entities/TreeGrowth';

import { AchievementService } from '../../application/services/AchievementService';
import { StreakService } from '../../application/services/StreakService';
import { TreeGrowthService } from '../../application/services/TreeGrowthService';

import IAchievementRepository from '../../domain/repositories/IAchievementRepository';
import IStreakRepository from '../../domain/repositories/IStreakRepository';
import ITreeGrowthRepository from '../../domain/repositories/ITreeGrowthRepository';

// Mock TreeGrowthRepo
class MockTreeGrowthRepo implements ITreeGrowthRepository {
  private data: { userId: number; growthPercentage: number; totalCompletedHabits: number; streakCount: number } | null = null;
  private shouldFail = false;

  setData(d: { userId: number; growthPercentage: number; totalCompletedHabits: number; streakCount: number } | null) {
    this.data = d;
  }

  setShouldFail(f: boolean) {
    this.shouldFail = f;
  }

  async fetchTreeGrowth(authToken: string, userId: number): Promise<TreeGrowth> {
    if (this.shouldFail) throw new Error('API Error: TreeGrowth fetch failed');
    if (!authToken) throw new Error('Unauthorized');
    if (!this.data) {
      // return a default
      return new TreeGrowth({ userId, growthPercentage: 0, totalCompletedHabits: 0, streakCount: 0 });
    }
    return new TreeGrowth({ userId: this.data.userId, growthPercentage: this.data.growthPercentage, totalCompletedHabits: this.data.totalCompletedHabits, streakCount: this.data.streakCount });
  }

  async updateTreeGrowth(authToken: string, userId: number, growthData: { growthPercentage: number; totalCompletedHabits: number; streakCount: number }): Promise<void> {
    if (this.shouldFail) throw new Error('API Error: TreeGrowth update failed');
    if (!authToken) throw new Error('Unauthorized');
    this.data = { userId, growthPercentage: growthData.growthPercentage, totalCompletedHabits: growthData.totalCompletedHabits, streakCount: growthData.streakCount };
  }
}

// Mock AchievementRepo
class MockAchievementRepo implements IAchievementRepository {
  private achievements: any[] = [];
  private shouldFail = false;

  setAchievements(a: any[]) { this.achievements = a; }
  setShouldFail(f: boolean) { this.shouldFail = f; }

  async fetchAchievements(authToken: string, userId: number): Promise<Achievement[]> {
    if (this.shouldFail) throw new Error('API Error: Achievements fetch failed');
    if (!authToken) throw new Error('Unauthorized');
    return this.achievements.map(a => new Achievement({ ...a, unlockedAt: new Date(a.unlockedAt) }));
  }

  async unlockAchievement(authToken: string, userId: number, achievementId: number): Promise<void> {
    if (this.shouldFail) throw new Error('API Error: Achievements unlock failed');
    if (!authToken) throw new Error('Unauthorized');
    const exists = this.achievements.find(a => a.id === achievementId);
    if (!exists) {
      // simulate unlocking by adding
      this.achievements.push({ id: achievementId, userId, name: `Ach ${achievementId}`, description: '', imageUrl: '', unlockedAt: new Date().toISOString(), habitId: undefined });
    }
  }
}

// Mock StreakRepo
class MockStreakRepo implements IStreakRepository {
  private streak: any = null;
  private shouldFail = false;

  setStreak(s: any) { this.streak = s; }
  setShouldFail(f: boolean) { this.shouldFail = f; }

  async fetchStreak(authToken: string, userId: number): Promise<Streak> {
    if (this.shouldFail) throw new Error('API Error: Streak fetch failed');
    if (!authToken) throw new Error('Unauthorized');
    if (!this.streak) return new Streak({ userId, currentStreak: 0, longestStreak: 0, lastCompletionDate: new Date() });
    return new Streak(this.streak);
  }

  async updateStreak(authToken: string, userId: number): Promise<Streak> {
    if (this.shouldFail) throw new Error('API Error: Streak update failed');
    if (!authToken) throw new Error('Unauthorized');
    // simulate increment
    if (!this.streak) this.streak = { userId, currentStreak: 1, longestStreak: 1, lastCompletionDate: new Date() };
    else {
      this.streak.currentStreak += 1;
      if (this.streak.currentStreak > this.streak.longestStreak) this.streak.longestStreak = this.streak.currentStreak;
      this.streak.lastCompletionDate = new Date();
    }
    return new Streak(this.streak);
  }
}

describe('Other Services Integration Tests', () => {
  const validToken = 'valid-token-xyz';

  describe('TreeGrowthService', () => {
    let mockRepo: MockTreeGrowthRepo;
    let service: TreeGrowthService;

    beforeEach(() => {
      mockRepo = new MockTreeGrowthRepo();
      service = new TreeGrowthService(mockRepo as unknown as ITreeGrowthRepository);
    });

    it('fetchTreeGrowth should return TreeGrowth entity', async () => {
      mockRepo.setData({ userId: 7, growthPercentage: 45, totalCompletedHabits: 10, streakCount: 3 });
      const tg = await service.fetchTreeGrowth(validToken, 7);
      expect(tg).toBeInstanceOf(TreeGrowth);
      expect(tg.getGrowthStage()).toBeGreaterThanOrEqual(1);
      expect(tg.growthPercentage).toBe(45);
    });

    it('fetchTreeGrowth should throw on unauthorized', async () => {
      await expect(service.fetchTreeGrowth('', 1)).rejects.toThrow('Unauthorized');
    });

    it('updateTreeGrowth should persist changes and be fetchable', async () => {
      await service.updateTreeGrowth(validToken, 5, { growthPercentage: 88, totalCompletedHabits: 20, streakCount: 10 });
      const tg = await service.fetchTreeGrowth(validToken, 5);
      expect(tg.growthPercentage).toBe(88);
      expect(tg.isFullyGrown()).toBe(false);
    });

    it('should propagate API errors', async () => {
      mockRepo.setShouldFail(true);
      await expect(service.fetchTreeGrowth(validToken, 1)).rejects.toThrow('API Error');
      await expect(service.updateTreeGrowth(validToken, 1, { growthPercentage: 1, totalCompletedHabits: 0, streakCount: 0 })).rejects.toThrow('API Error');
    });
  });

  describe('AchievementService', () => {
    let mockRepo: MockAchievementRepo;
    let service: AchievementService;

    beforeEach(() => {
      mockRepo = new MockAchievementRepo();
      service = new AchievementService(mockRepo as unknown as IAchievementRepository);
    });

    it('fetchAchievements should return Achievement entities', async () => {
      mockRepo.setAchievements([
        { id: 1, userId: 2, name: 'A1', description: '', imageUrl: '', unlockedAt: new Date().toISOString(), habitId: undefined }
      ]);
      const arr = await service.fetchAchievements(validToken, 2);
      expect(arr).toHaveLength(1);
      expect(arr[0]).toBeInstanceOf(Achievement);
    });

    it('unlockAchievement should add an achievement and return updated list', async () => {
      mockRepo.setAchievements([]);
      const res = await service.unlockAchievement(validToken, 3, 99);
      const arr = await service.fetchAchievements(validToken, 3);
      expect(arr.some(a => a.id === 99)).toBe(true);
    });

    it('should handle unauthorized and API errors', async () => {
      await expect(service.fetchAchievements('', 1)).rejects.toThrow('Unauthorized');
      mockRepo.setShouldFail(true);
      await expect(service.fetchAchievements(validToken, 1)).rejects.toThrow('API Error');
      await expect(service.unlockAchievement(validToken, 1, 1)).rejects.toThrow('API Error');
    });
  });

  describe('StreakService', () => {
    let mockRepo: MockStreakRepo;
    let service: StreakService;

    beforeEach(() => {
      mockRepo = new MockStreakRepo();
      service = new StreakService(mockRepo as unknown as IStreakRepository);
    });

    it('fetchStreak should return Streak entity', async () => {
      mockRepo.setStreak({ userId: 4, currentStreak: 2, longestStreak: 5, lastCompletionDate: new Date() });
      const s = await service.fetchStreak(validToken, 4);
      expect(s).toBeInstanceOf(Streak);
      expect(s.currentStreak).toBe(2);
    });

    it('updateStreak should increment and return updated Streak', async () => {
      mockRepo.setStreak({ userId: 4, currentStreak: 2, longestStreak: 5, lastCompletionDate: new Date() });
      const updated = await service.updateStreak(validToken, 4);
      expect(updated.currentStreak).toBe(3);
      expect(updated.longestStreak).toBeGreaterThanOrEqual(5);
    });

    it('should propagate unauthorized and API errors', async () => {
      await expect(service.fetchStreak('', 1)).rejects.toThrow('Unauthorized');
      mockRepo.setShouldFail(true);
      await expect(service.fetchStreak(validToken, 1)).rejects.toThrow('API Error');
      await expect(service.updateStreak(validToken, 1)).rejects.toThrow('API Error');
    });
  });
});
