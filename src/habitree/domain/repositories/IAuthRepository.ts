import { User } from '../entities/User';

export interface IAuthRepository {
  loadAuthData(): Promise<{ token: string | null; user: User | null }>;
  saveAuthData(token: string, user: User): Promise<void>;
  deleteAuthData(): Promise<void>;
}

export default IAuthRepository;
