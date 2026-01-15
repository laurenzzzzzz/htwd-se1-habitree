/**
 * Integrationstests für ProfileService
 * 
 * Testet: application/services/ProfileService.ts
 *         + infrastructure/adapters/ (gemockt)
 * 
 * Diese Tests prüfen Update-/Validierungs-Logik und Zusammenspiel mit Repository.
 */

import { ProfileService } from '../../application/services/ProfileService';
import IProfileRepository from '../../domain/repositories/IProfileRepository';
import { User } from '../../domain/entities/User';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let mockRepo: jest.Mocked<IProfileRepository>;

  beforeEach(() => {
    mockRepo = {
      updateUsername: jest.fn(),
      updatePassword: jest.fn(),
    } as jest.Mocked<IProfileRepository>;

    profileService = new ProfileService(mockRepo);
  });

  describe('updateUsername', () => {
    it('should_update_username_when_token_and_username_are_valid', async () => {
      const mockUser = new User({ id: 1, email: 'test@example.com', username: 'newusername' });
      mockRepo.updateUsername.mockResolvedValue(mockUser);

      const result = await profileService.updateUsername('valid-token', 'newusername');

      expect(mockRepo.updateUsername).toHaveBeenCalledWith('valid-token', 'newusername');
      expect(result).toEqual(mockUser);
      expect(result.username).toBe('newusername');
    });

    it('should_throw_error_when_token_is_invalid', async () => {
      mockRepo.updateUsername.mockRejectedValue(new Error('Invalid token'));

      await expect(profileService.updateUsername('invalid-token', 'newusername')).rejects.toThrow('Invalid token');
    });

    it('should_throw_error_when_username_is_already_taken', async () => {
      mockRepo.updateUsername.mockRejectedValue(new Error('Username already exists'));

      await expect(profileService.updateUsername('valid-token', 'existinguser')).rejects.toThrow('Username already exists');
    });

    it('should_throw_error_when_username_is_invalid', async () => {
      mockRepo.updateUsername.mockRejectedValue(new Error('Invalid username format'));

      await expect(profileService.updateUsername('valid-token', '')).rejects.toThrow('Invalid username format');
    });
  });

  describe('updatePassword', () => {
    it('should_update_password_when_credentials_are_valid', async () => {
      const mockResponse = { message: 'Password updated successfully' };
      mockRepo.updatePassword.mockResolvedValue(mockResponse);

      const result = await profileService.updatePassword('valid-token', 'oldPassword123', 'newPassword456');

      expect(mockRepo.updatePassword).toHaveBeenCalledWith('valid-token', 'oldPassword123', 'newPassword456');
      expect(result).toEqual(mockResponse);
    });

    it('should_throw_error_when_old_password_is_incorrect', async () => {
      mockRepo.updatePassword.mockRejectedValue(new Error('Old password is incorrect'));

      await expect(profileService.updatePassword('valid-token', 'wrongOldPassword', 'newPassword456')).rejects.toThrow('Old password is incorrect');
    });

    it('should_throw_error_when_token_is_invalid', async () => {
      mockRepo.updatePassword.mockRejectedValue(new Error('Invalid token'));

      await expect(profileService.updatePassword('invalid-token', 'oldPassword123', 'newPassword456')).rejects.toThrow('Invalid token');
    });

    it('should_throw_error_when_new_password_is_too_weak', async () => {
      mockRepo.updatePassword.mockRejectedValue(new Error('Password too weak'));

      await expect(profileService.updatePassword('valid-token', 'oldPassword123', '123')).rejects.toThrow('Password too weak');
    });

    it('should_throw_error_when_new_password_equals_old_password', async () => {
      mockRepo.updatePassword.mockRejectedValue(new Error('New password must be different'));

      await expect(profileService.updatePassword('valid-token', 'samePassword', 'samePassword')).rejects.toThrow('New password must be different');
    });
  });
});
