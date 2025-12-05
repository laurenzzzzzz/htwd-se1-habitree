import { TreeGrowth, TreeGrowthUpdatePayload } from '../../domain/entities/TreeGrowth';
import ITreeGrowthRepository from '../../domain/repositories/ITreeGrowthRepository';

export class TreeGrowthService {
  private repo: ITreeGrowthRepository;

  constructor(repo: ITreeGrowthRepository) {
    this.repo = repo;
  }

  async fetchTreeGrowth(authToken: string, userId: number): Promise<TreeGrowth> {
    return this.repo.fetchTreeGrowth(authToken, userId);
  }

  async updateTreeGrowth(authToken: string, userId: number, growthData: TreeGrowthUpdatePayload): Promise<void> {
    return this.repo.updateTreeGrowth(authToken, userId, growthData);
  }
}

export default TreeGrowthService;
