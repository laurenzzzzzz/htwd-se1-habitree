import IProfileRepository from '../../domain/repositories/IProfileRepository';
import { User } from '../../domain/entities/User';

export class ProfileService {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  async updateUsername(authToken: string, newUsername: string): Promise<User> {
    return this.repo.updateUsername(authToken, newUsername);
  }

  async updatePassword(authToken: string, oldPassword: string, newPassword: string): Promise<{ message?: string }> {
    return this.repo.updatePassword(authToken, oldPassword, newPassword);
  }
}

export default ProfileService;
