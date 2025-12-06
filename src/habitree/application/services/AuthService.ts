import IAuthRepository from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';

export class AuthService {
  private repo: IAuthRepository;

  constructor(repo: IAuthRepository) {
    this.repo = repo;
  }

  async initialize(): Promise<{ token: string | null; user: User | null }> {
    return this.repo.loadAuthData();
  }

  async signIn(token: string, user: User): Promise<void> {
    await this.repo.saveAuthData(token, user);
  }

  async signOut(): Promise<void> {
    await this.repo.deleteAuthData();
  }
}

export default AuthService;
