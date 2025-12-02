import * as SecureStore from 'expo-secure-store';
import IAuthRepository from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';

const AUTH_TOKEN_KEY = 'userAuthToken';
const USER_DATA_KEY = 'currentAuthUser';

export class SecureStoreAuthRepository implements IAuthRepository {
  async loadAuthData(): Promise<{ token: string | null; user: User | null }> {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_DATA_KEY);

    let user: User | null = null;
    if (userJson) {
      try {
        user = JSON.parse(userJson) as User;
      } catch (e) {
        console.error('Failed to parse user data from secure store', e);
      }
    }

    return { token, user };
  }

  async saveAuthData(token: string, user: User): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
  }

  async deleteAuthData(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  }
}

export default SecureStoreAuthRepository;
