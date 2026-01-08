// Integration/Unit tests for AchievementService

import { Achievement } from '../../domain/entities/Achievement';
import AchievementService from '../../application/services/AchievementService';
import IAchievementRepository from '../../domain/repositories/IAchievementRepository';

describe('AchievementService', () => {
  const createAchievement = (overrides: Partial<{ id: number; userId: number; name: string; description: string; imageUrl: string; unlockedAt: Date; habitId?: number }> = {}) => {
    const now = new Date();
    return new Achievement({
      id: overrides.id ?? 1,
      userId: overrides.userId ?? 10,
      name: overrides.name ?? 'Badge',
      description: overrides.description ?? 'Nice',
      imageUrl: overrides.imageUrl ?? 'img',
      unlockedAt: overrides.unlockedAt ?? now,
      habitId: overrides.habitId
    });
  };

  it('delegates fetchAchievements to repository and returns array', async () => {
    const list = [createAchievement({ id: 2 }), createAchievement({ id: 3 })];
    const mockRepo: Partial<IAchievementRepository> = {
      fetchAchievements: jest.fn().mockResolvedValue(list)
    };

    const svc = new AchievementService(mockRepo as IAchievementRepository);
    const res = await svc.fetchAchievements('token', 5);

    expect((mockRepo.fetchAchievements as jest.Mock).mock.calls.length).toBe(1);
    expect((mockRepo.fetchAchievements as jest.Mock).mock.calls[0]).toEqual(['token', 5]);
    expect(res).toBe(list);
  });

  it('calls unlockAchievement then fetchAchievements on unlockAchievement', async () => {
    const after = [createAchievement({ id: 99 })];
    const mockRepo: Partial<IAchievementRepository> = {
      unlockAchievement: jest.fn().mockResolvedValue(undefined),
      fetchAchievements: jest.fn().mockResolvedValue(after)
    };

    const svc = new AchievementService(mockRepo as IAchievementRepository);
    const res = await svc.unlockAchievement('t', 11, 7);

    expect((mockRepo.unlockAchievement as jest.Mock).mock.calls.length).toBe(1);
    expect((mockRepo.unlockAchievement as jest.Mock).mock.calls[0]).toEqual(['t', 11, 7]);
    expect((mockRepo.fetchAchievements as jest.Mock).mock.calls.length).toBe(1);
    expect(res).toBe(after);
  });

  it('propagates errors from repository (fetchAchievements)', async () => {
    const mockRepo: Partial<IAchievementRepository> = {
      fetchAchievements: jest.fn().mockRejectedValue(new Error('fetch-fail'))
    };
    const svc = new AchievementService(mockRepo as IAchievementRepository);
    await expect(svc.fetchAchievements('x', 1)).rejects.toThrow('fetch-fail');
  });

  it('propagates errors from repository (unlockAchievement)', async () => {
    const mockRepo: Partial<IAchievementRepository> = {
      unlockAchievement: jest.fn().mockRejectedValue(new Error('unlock-fail'))
    };
    const svc = new AchievementService(mockRepo as IAchievementRepository);
    await expect(svc.unlockAchievement('x', 1, 2)).rejects.toThrow('unlock-fail');
  });
});
