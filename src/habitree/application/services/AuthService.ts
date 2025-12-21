import IAuthRepository from '../../domain/repositories/IAuthRepository';
import IAuthApiRepository from '../../domain/repositories/IAuthApiRepository';
import { User } from '../../domain/entities/User';

export class AuthService {
  private persistenceRepo: IAuthRepository;
  private apiRepo: IAuthApiRepository;

  constructor(persistenceRepo: IAuthRepository, apiRepo: IAuthApiRepository) {
    this.persistenceRepo = persistenceRepo;
    this.apiRepo = apiRepo;
  }

  async initialize(): Promise<{ token: string | null; user: User | null }> {
    return this.persistenceRepo.loadAuthData();
  }

  async signIn(token: string, user: User): Promise<void> {
    await this.persistenceRepo.saveAuthData(token, user);
  }

  async signOut(): Promise<void> {
    await this.persistenceRepo.deleteAuthData();
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.apiRepo.login(email, password);
    await this.signIn(res.token, res.user);
    return { token: res.token, user: res.user };
  }

  async register(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.apiRepo.register(username, email, password);
    await this.signIn(res.token, res.user);
    return { token: res.token, user: res.user };
  }
}

export default AuthService;
