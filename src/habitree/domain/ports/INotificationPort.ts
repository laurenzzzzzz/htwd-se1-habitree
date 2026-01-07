import { Habit } from '../entities/Habit';

export interface INotificationPort {
  /** Initializes the notification channel / permissions. */
  init(): Promise<boolean>;
  /** Schedules reminders for the provided habits (expects entries for the target date). */
  scheduleDailyReminders(habits: Habit[], targetDate?: Date): Promise<void>;
  /** Shows an immediate notification with title/body and optional data payload. */
  showImmediateNotification(title: string, body: string, data?: any): Promise<void>;
}

export default INotificationPort;
