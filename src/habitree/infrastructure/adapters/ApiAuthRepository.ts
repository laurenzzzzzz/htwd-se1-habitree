import axios from 'axios';
import IAuthApiRepository from '../../domain/repositories/IAuthApiRepository';

const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

export class ApiAuthRepository implements IAuthApiRepository {
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  }

  async register(username: string, email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, { username, email, password });
    return response.data;
  }
}

export default ApiAuthRepository;
