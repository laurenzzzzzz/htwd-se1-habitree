import { User } from '../entities/User';

export type AuthResponse = {
  token: string;
  user: User;
};

export interface IAuthApiRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  register(username: string, email: string, password: string): Promise<AuthResponse>;
}

export default IAuthApiRepository;
