import IAuthApiRepository from '../../domain/repositories/IAuthApiRepository';
import { AuthService } from './AuthService';
import { User } from '../../domain/entities/User';

export class AuthenticationService {
  private apiRepo: IAuthApiRepository;
  private authService: AuthService;

  constructor(apiRepo: IAuthApiRepository, authService: AuthService) {
    this.apiRepo = apiRepo;
    this.authService = authService;
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.apiRepo.login(email, password);
    const user: User = { id: res.user.id, email: res.user.email, username: res.user.username };
    await this.authService.signIn(res.token, user);
    return { token: res.token, user };
  }

  async register(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.apiRepo.register(username, email, password);
    const user: User = { id: res.user.id, email: res.user.email, username: res.user.username };
    await this.authService.signIn(res.token, user);
    return { token: res.token, user };
  }
}

export default AuthenticationService;
