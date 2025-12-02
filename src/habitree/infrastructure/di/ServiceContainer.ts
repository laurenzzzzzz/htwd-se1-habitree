import { ApiHabitsRepository } from '../adapters/ApiHabitsRepository';
import { ApiQuotesRepository } from '../adapters/ApiQuotesRepository';
import { ApiProfileRepository } from '../adapters/ApiProfileRepository';
import { ApiAuthRepository } from '../adapters/ApiAuthRepository';
import { HabitService } from '../../application/services/HabitService';
import { QuoteService } from '../../application/services/QuoteService';
import { ProfileService } from '../../application/services/ProfileService';
import { AuthenticationService } from '../../application/services/AuthenticationService';
import { AuthService } from '../../application/services/AuthService';
import { SecureStoreAuthRepository } from '../adapters/SecureStoreAuthRepository';

const habitsRepo = new ApiHabitsRepository();
const quotesRepo = new ApiQuotesRepository();
const profileRepo = new ApiProfileRepository();
const authApiRepo = new ApiAuthRepository();

// Auth persistence service (keeps using SecureStoreAuthRepository inside AuthService)
const authRepoForPersistence = new SecureStoreAuthRepository();
export const authService = new AuthService(authRepoForPersistence);
export const authenticationService = new AuthenticationService(authApiRepo, authService);

export const habitService = new HabitService(habitsRepo);
export const quoteService = new QuoteService(quotesRepo);
export const profileService = new ProfileService(profileRepo);

export default {
  habitService,
  quoteService,
  profileService,
  authenticationService,
};
