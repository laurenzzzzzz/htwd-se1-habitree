import { ApiHabitsRepository } from '../adapters/ApiHabitsRepository';
import { ApiQuotesRepository } from '../adapters/ApiQuotesRepository';
import { ApiProfileRepository } from '../adapters/ApiProfileRepository';
import { ApiAuthRepository } from '../adapters/ApiAuthRepository';
import { ApiTreeGrowthRepository } from '../adapters/ApiTreeGrowthRepository';
import { ApiAchievementRepository } from '../adapters/ApiAchievementRepository';
import { ApiStreakRepository } from '../adapters/ApiStreakRepository';
import { HabitService } from '../../application/services/HabitService';
import { QuoteService } from '../../application/services/QuoteService';
import { ProfileService } from '../../application/services/ProfileService';
import { AuthenticationService } from '../../application/services/AuthenticationService';
import { AuthService } from '../../application/services/AuthService';
import { TreeGrowthService } from '../../application/services/TreeGrowthService';
import { AchievementService } from '../../application/services/AchievementService';
import { StreakService } from '../../application/services/StreakService';
import { SecureStoreAuthRepository } from '../adapters/SecureStoreAuthRepository';
import { ApplicationServices } from '../../application/types/ApplicationServices';
import { NotificationService } from '../../application/services/NotificationService';
import { ExpoNotificationPort } from '../adapters/ExpoNotificationPort';

const habitsRepo = new ApiHabitsRepository();
const quotesRepo = new ApiQuotesRepository();
const profileRepo = new ApiProfileRepository();
const authApiRepo = new ApiAuthRepository();
const treeGrowthRepo = new ApiTreeGrowthRepository();
const achievementRepo = new ApiAchievementRepository();
const streakRepo = new ApiStreakRepository();
const notificationPort = new ExpoNotificationPort();

// Auth persistence service (keeps using SecureStoreAuthRepository inside AuthService)
const authRepoForPersistence = new SecureStoreAuthRepository();
export const authService = new AuthService(authRepoForPersistence);
export const authenticationService = new AuthenticationService(authApiRepo, authService);

export const habitService = new HabitService(habitsRepo);
export const quoteService = new QuoteService(quotesRepo);
export const profileService = new ProfileService(profileRepo);
export const treeGrowthService = new TreeGrowthService(treeGrowthRepo);
export const achievementService = new AchievementService(achievementRepo);
export const streakService = new StreakService(streakRepo);
export const notificationService = new NotificationService(notificationPort);

export const applicationServices: ApplicationServices = {
  habitService,
  quoteService,
  profileService,
  authenticationService,
  authService,
  treeGrowthService,
  achievementService,
  streakService,
  notificationService,
};

export default applicationServices;
