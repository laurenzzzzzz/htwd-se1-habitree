import { HabitService } from '../services/HabitService';
import { QuoteService } from '../services/QuoteService';
import { ProfileService } from '../services/ProfileService';
import { AuthenticationService } from '../services/AuthenticationService';
import { AuthService } from '../services/AuthService';
import { TreeGrowthService } from '../services/TreeGrowthService';
import { AchievementService } from '../services/AchievementService';
import { StreakService } from '../services/StreakService';
import { NotificationService } from '../services/NotificationService';

export type ApplicationServices = {
  habitService: HabitService;
  quoteService: QuoteService;
  profileService: ProfileService;
  authenticationService: AuthenticationService;
  authService: AuthService;
  treeGrowthService: TreeGrowthService;
  achievementService: AchievementService;
  streakService: StreakService;
  notificationService: NotificationService;
};
