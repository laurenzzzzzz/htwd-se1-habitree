
import axios from 'axios';
import { TreeGrowth, TreeGrowthData, TreeGrowthUpdatePayload } from '../../domain/entities/TreeGrowth';
import ITreeGrowthRepository from '../../domain/repositories/ITreeGrowthRepository';
import { API_BASE_URL } from '../../constants/ApiConfig';

export class ApiTreeGrowthRepository implements ITreeGrowthRepository {
  async fetchTreeGrowth(authToken: string, userId: number): Promise<TreeGrowth> {
    try {
      //Dummy Hardcoded: In real implementation would fetch from API
      // const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/tree-growth`, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });

      //Dummy Hardcoded: Using dummy data for now
      const dummyData: TreeGrowthData = {
        userId,
        growthPercentage: 65, // Mock: 65% grown
        totalCompletedHabits: 13,
        streakCount: 7,
      };

      return new TreeGrowth(dummyData);
    } catch (error) {
      console.error('Error fetching tree growth:', error);
      throw error;
    }
  }

  async updateTreeGrowth(authToken: string, userId: number, growthData: TreeGrowthUpdatePayload): Promise<void> {
    try {
      //Dummy Hardcoded: In real implementation would send to API
      // await axios.put(`${API_BASE_URL}/api/users/${userId}/tree-growth`, growthData, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });
      console.log('Tree growth updated (dummy):', growthData);
    } catch (error) {
      console.error('Error updating tree growth:', error);
      throw error;
    }
  }
}

export default ApiTreeGrowthRepository;
