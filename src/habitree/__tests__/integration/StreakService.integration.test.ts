/**
 * Integrationstests für StreakService
 * 
 * Testet: application/services/StreakService.ts
 *         + infrastructure/adapters/ (gemockt)
 * 
 * Diese Tests prüfen Streak-Logik auf Service-Ebene und das Zusammenspiel mit Repositories.
 */

// Unit/Integration Tests für StreakService

import { Streak } from '../../domain/entities/Streak';
import StreakService from '../../application/services/StreakService';
import IStreakRepository from '../../domain/repositories/IStreakRepository';

describe('StreakService', () => {
  const createStreakData = (overrides: Partial<{ userId: number; currentStreak: number; longestStreak: number; lastCompletionDate: Date }> = {}) => {
    const now = new Date();
    return {
      userId: overrides.userId ?? 1,
      currentStreak: overrides.currentStreak ?? 0,
      longestStreak: overrides.longestStreak ?? 0,
      lastCompletionDate: overrides.lastCompletionDate ?? now
    };
  };

  it('delegates fetchStreak to repository and returns Streak', async () => {
    const expected = new Streak(createStreakData({ currentStreak: 4 }));
    const mockRepo: Partial<IStreakRepository> = {
      fetchStreak: jest.fn().mockResolvedValue(expected)
    };

    const service = new StreakService(mockRepo as IStreakRepository);
    const result = await service.fetchStreak('auth-token', 42);

    expect((mockRepo.fetchStreak as jest.Mock).mock.calls.length).toBe(1);
    expect((mockRepo.fetchStreak as jest.Mock).mock.calls[0]).toEqual(['auth-token', 42]);
    expect(result).toBe(expected);
  });

  it('delegates updateStreak to repository and returns updated Streak', async () => {
    const updated = new Streak(createStreakData({ currentStreak: 5 }));
    const mockRepo: Partial<IStreakRepository> = {
      updateStreak: jest.fn().mockResolvedValue(updated)
    };

    const service = new StreakService(mockRepo as IStreakRepository);
    const result = await service.updateStreak('token-2', 7);

    expect((mockRepo.updateStreak as jest.Mock).mock.calls.length).toBe(1);
    expect((mockRepo.updateStreak as jest.Mock).mock.calls[0]).toEqual(['token-2', 7]);
    expect(result).toBe(updated);
  });

  it('propagates errors from repository (fetchStreak)', async () => {
    const mockRepo: Partial<IStreakRepository> = {
      fetchStreak: jest.fn().mockRejectedValue(new Error('repo-fail'))
    };
    const service = new StreakService(mockRepo as IStreakRepository);
    await expect(service.fetchStreak('t', 1)).rejects.toThrow('repo-fail');
  });

  it('propagates errors from repository (updateStreak)', async () => {
    const mockRepo: Partial<IStreakRepository> = {
      updateStreak: jest.fn().mockRejectedValue(new Error('update-fail'))
    };
    const service = new StreakService(mockRepo as IStreakRepository);
    await expect(service.updateStreak('t2', 2)).rejects.toThrow('update-fail');
  });
});
