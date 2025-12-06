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
    // res.user is already a User instance from ApiAuthRepository
    await this.authService.signIn(res.token, res.user);
    return { token: res.token, user: res.user };
  }

  async register(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.apiRepo.register(username, email, password);
    // res.user is already a User instance from ApiAuthRepository
    await this.authService.signIn(res.token, res.user);
    return { token: res.token, user: res.user };
  }
}

export default AuthenticationService;
