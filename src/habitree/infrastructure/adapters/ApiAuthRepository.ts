
import axios from 'axios';
import IAuthApiRepository from '../../domain/repositories/IAuthApiRepository';
import { User, UserData } from '../../domain/entities/User';
import { API_BASE_URL } from '../../constants/ApiConfig';

export class ApiAuthRepository implements IAuthApiRepository {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const userData = response.data.user as UserData;
    return {
      token: response.data.token,
      user: new User(userData),
    };
  }

  async register(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, { username, email, password });
    const userData = response.data.user as UserData;
    return {
      token: response.data.token,
      user: new User(userData),
    };
  }
}

export default ApiAuthRepository;
