/**
 * Integrationstests für AuthService
 * 
 * Testet: application/services/AuthService.ts
 *         + infrastructure/adapters/ (gemockt)
 * 
 * Diese Tests prüfen Authentifizierung, Registrierung und Fehlerpfade.
 */

import { AuthService } from '../../application/services/AuthService';
import IAuthRepository from '../../domain/repositories/IAuthRepository';
import IAuthApiRepository from '../../domain/repositories/IAuthApiRepository';
import { User } from '../../domain/entities/User';

describe('AuthService', () => {
  let authService: AuthService;
  let mockPersistenceRepo: jest.Mocked<IAuthRepository>;
  let mockApiRepo: jest.Mocked<IAuthApiRepository>;

  beforeEach(() => {
    mockPersistenceRepo = {
      loadAuthData: jest.fn(),
      saveAuthData: jest.fn(),
      deleteAuthData: jest.fn(),
    } as jest.Mocked<IAuthRepository>;

    mockApiRepo = {
      login: jest.fn(),
      register: jest.fn(),
    } as jest.Mocked<IAuthApiRepository>;

    authService = new AuthService(mockPersistenceRepo, mockApiRepo);
  });

  describe('initialize', () => {
    it('should_load_auth_data_when_initializing', async () => {
      const mockUser = new User({ id: 1, email: 'test@example.com', username: 'testuser' });
      const mockData = { token: 'test-token', user: mockUser };
      mockPersistenceRepo.loadAuthData.mockResolvedValue(mockData);

      const result = await authService.initialize();

      expect(result).toEqual(mockData);
      expect(mockPersistenceRepo.loadAuthData).toHaveBeenCalledTimes(1);
    });

    it('should_return_null_when_no_auth_data_exists', async () => {
      mockPersistenceRepo.loadAuthData.mockResolvedValue({ token: null, user: null });

      const result = await authService.initialize();

      expect(result.token).toBeNull();
      expect(result.user).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should_save_auth_data_when_signing_in', async () => {
      const mockUser = new User({ id: 1, email: 'test@example.com', username: 'testuser' });
      const token = 'test-token';

      await authService.signIn(token, mockUser);

      expect(mockPersistenceRepo.saveAuthData).toHaveBeenCalledWith(token, mockUser);
      expect(mockPersistenceRepo.saveAuthData).toHaveBeenCalledTimes(1);
    });
  });

  describe('signOut', () => {
    it('should_delete_auth_data_when_signing_out', async () => {
      await authService.signOut();

      expect(mockPersistenceRepo.deleteAuthData).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should_login_and_save_auth_data_when_credentials_are_valid', async () => {
      const mockUser = new User({ id: 1, email: 'test@example.com', username: 'testuser' });
      const mockResponse = { token: 'auth-token', user: mockUser };
      mockApiRepo.login.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(mockApiRepo.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockPersistenceRepo.saveAuthData).toHaveBeenCalledWith('auth-token', mockUser);
      expect(result).toEqual(mockResponse);
    });

    it('should_throw_error_when_credentials_are_invalid', async () => {
      mockApiRepo.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login('wrong@example.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
      expect(mockPersistenceRepo.saveAuthData).not.toHaveBeenCalled();
    });

    it('should_throw_error_when_api_is_unavailable', async () => {
      mockApiRepo.login.mockRejectedValue(new Error('Network error'));

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should_register_and_save_auth_data_when_data_is_valid', async () => {
      const mockUser = new User({ id: 1, email: 'new@example.com', username: 'newuser' });
      const mockResponse = { token: 'new-token', user: mockUser };
      mockApiRepo.register.mockResolvedValue(mockResponse);

      const result = await authService.register('newuser', 'new@example.com', 'password123');

      expect(mockApiRepo.register).toHaveBeenCalledWith('newuser', 'new@example.com', 'password123');
      expect(mockPersistenceRepo.saveAuthData).toHaveBeenCalledWith('new-token', mockUser);
      expect(result).toEqual(mockResponse);
    });

    it('should_throw_error_when_user_already_exists', async () => {
      mockApiRepo.register.mockRejectedValue(new Error('User already exists'));

      await expect(authService.register('existinguser', 'existing@example.com', 'password123')).rejects.toThrow('User already exists');
      expect(mockPersistenceRepo.saveAuthData).not.toHaveBeenCalled();
    });

    it('should_throw_error_when_registration_data_is_invalid', async () => {
      mockApiRepo.register.mockRejectedValue(new Error('Invalid registration data'));

      await expect(authService.register('', 'invalid-email', 'short')).rejects.toThrow('Invalid registration data');
    });
  });
});
