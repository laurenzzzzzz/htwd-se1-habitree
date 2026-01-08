// Integration/Unit tests for TreeGrowthService

import { TreeGrowth } from '../../domain/entities/TreeGrowth';
import TreeGrowthService from '../../application/services/TreeGrowthService';
import ITreeGrowthRepository from '../../domain/repositories/ITreeGrowthRepository';

describe('TreeGrowthService', () => {
  const createTreeGrowth = (overrides: Partial<{ userId: number; growthPercentage: number; totalCompletedHabits: number; streakCount: number }> = {}) => {
    const data = {
      userId: overrides.userId ?? 1,
      growthPercentage: overrides.growthPercentage ?? 0,
      totalCompletedHabits: overrides.totalCompletedHabits ?? 0,
      streakCount: overrides.streakCount ?? 0
    };
    return new TreeGrowth(data);
  };

  it('delegates fetchTreeGrowth to repository and returns TreeGrowth', async () => {
    const expected = createTreeGrowth({ growthPercentage: 55 });
    const mockRepo: Partial<ITreeGrowthRepository> = {
      fetchTreeGrowth: jest.fn().mockResolvedValue(expected)
    };

    const svc = new TreeGrowthService(mockRepo as ITreeGrowthRepository);
    const res = await svc.fetchTreeGrowth('token', 11);

    expect((mockRepo.fetchTreeGrowth as jest.Mock).mock.calls.length).toBe(1);
    expect((mockRepo.fetchTreeGrowth as jest.Mock).mock.calls[0]).toEqual(['token', 11]);
    expect(res).toBe(expected);
  });

  it('delegates updateTreeGrowth to repository', async () => {
    const payload = { growthPercentage: 70, totalCompletedHabits: 10, streakCount: 3 };
    const mockRepo: Partial<ITreeGrowthRepository> = {
      updateTreeGrowth: jest.fn().mockResolvedValue(undefined)
    };

    const svc = new TreeGrowthService(mockRepo as ITreeGrowthRepository);
    await svc.updateTreeGrowth('tkn', 5, payload);

    expect((mockRepo.updateTreeGrowth as jest.Mock).mock.calls.length).toBe(1);
    expect((mockRepo.updateTreeGrowth as jest.Mock).mock.calls[0]).toEqual(['tkn', 5, payload]);
  });

  it('propagates errors from repository (fetchTreeGrowth)', async () => {
    const mockRepo: Partial<ITreeGrowthRepository> = {
      fetchTreeGrowth: jest.fn().mockRejectedValue(new Error('fetch-error'))
    };
    const svc = new TreeGrowthService(mockRepo as ITreeGrowthRepository);
    await expect(svc.fetchTreeGrowth('x', 1)).rejects.toThrow('fetch-error');
  });

  it('propagates errors from repository (updateTreeGrowth)', async () => {
    const mockRepo: Partial<ITreeGrowthRepository> = {
      updateTreeGrowth: jest.fn().mockRejectedValue(new Error('update-error'))
    };
    const svc = new TreeGrowthService(mockRepo as ITreeGrowthRepository);
    await expect(svc.updateTreeGrowth('x', 1, { growthPercentage: 1, totalCompletedHabits: 1, streakCount: 0 })).rejects.toThrow('update-error');
  });
});
