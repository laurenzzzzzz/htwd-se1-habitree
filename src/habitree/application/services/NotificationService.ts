import { Habit } from '../../domain/entities/Habit';
import INotificationPort from '../../domain/ports/INotificationPort';
import { isSameDay } from '../../domain/policies/HabitSchedulePolicy';

export class NotificationService {
  constructor(private readonly port: INotificationPort) {}

  async rescheduleForHabits(habits: Habit[], targetDate: Date = new Date()): Promise<void> {
    try {
      const ready = await this.port.init();
      if (!ready) return;

      const normalizedTarget = new Date(targetDate);
      normalizedTarget.setHours(0, 0, 0, 0);

      const relevantHabits = habits.filter(habit =>
        Array.isArray(habit.entries) && habit.entries.some(entry => isSameDay(new Date(entry.date), normalizedTarget))
      );

      if (relevantHabits.length === 0) {
        return;
      }

      await this.port.scheduleDailyReminders(relevantHabits, normalizedTarget);
    } catch (error) {
      console.warn('NotificationService.rescheduleForHabits failed', error);
    }
  }

  async showImmediate(title: string, body: string, data?: any): Promise<void> {
    try {
      const ready = await this.port.init();
      if (!ready) return;
      await this.port.showImmediateNotification(title, body, data);
    } catch (error) {
      console.warn('NotificationService.showImmediate failed', error);
    }
  }
}

export default NotificationService;
