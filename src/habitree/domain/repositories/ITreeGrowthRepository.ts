import { TreeGrowth, TreeGrowthUpdatePayload } from '../entities/TreeGrowth';

export interface ITreeGrowthRepository {
  /**
   * Fetch user's tree growth data
   */
  fetchTreeGrowth(authToken: string, userId: number): Promise<TreeGrowth>;

  /**
   * Update tree growth based on habit completion
   */
  updateTreeGrowth(authToken: string, userId: number, growthData: TreeGrowthUpdatePayload): Promise<void>;
}

export default ITreeGrowthRepository;
