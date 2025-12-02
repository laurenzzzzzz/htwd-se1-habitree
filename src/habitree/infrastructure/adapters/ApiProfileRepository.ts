import axios from 'axios';
import IProfileRepository from '../../domain/repositories/IProfileRepository';
import { User } from '../../domain/entities/User';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

export class ApiProfileRepository implements IProfileRepository {
  async updateUsername(authToken: string, newUsername: string): Promise<User> {
    const response = await axios.put(
      `${API_BASE_URL}/user/username`,
      { username: newUsername },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return response.data;
  }

  async updatePassword(authToken: string, oldPassword: string, newPassword: string): Promise<{ message?: string }> {
    const response = await axios.put(
      `${API_BASE_URL}/auth/password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return response.data;
  }
}

export default ApiProfileRepository;
