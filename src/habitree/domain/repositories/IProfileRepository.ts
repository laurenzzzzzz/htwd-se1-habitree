import { User } from '../entities/User';

export interface IProfileRepository {
  updateUsername(authToken: string, newUsername: string): Promise<User>;
  updatePassword(authToken: string, oldPassword: string, newPassword: string): Promise<{ message?: string }>;
}

export default IProfileRepository;
