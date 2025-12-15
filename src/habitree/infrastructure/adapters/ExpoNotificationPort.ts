import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Habit } from '../../domain/entities/Habit';
import INotificationPort from '../../domain/ports/INotificationPort';
import { isSameDay } from '../../domain/services/HabitSchedulePolicy';

const notificationLogs: string[] = [];

function pushLog(msg: string) {
  try {
    const ts = new Date().toISOString();
    notificationLogs.push(`${ts} ${msg}`);
    if (notificationLogs.length > 200) notificationLogs.shift();
  } catch (e) {
    console.error('pushLog error', e);
  }
}

export function getNotificationLogs(): string[] {
  return [...notificationLogs];
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class ExpoNotificationPort implements INotificationPort {
  async init(): Promise<boolean> {
    try {
      const perm = await Notifications.getPermissionsAsync();
      pushLog(`permissions current: ${JSON.stringify(perm)}`);
      let status = perm.status;
      if (status !== 'granted') {
        const res = await Notifications.requestPermissionsAsync();
        pushLog(`permissions after request: ${JSON.stringify(res)}`);
        status = res.status;
        if (status !== 'granted') {
          console.warn('Notifications permission not granted');
          return false;
        }
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('habit-reminders', {
          name: 'Habit Reminders',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      pushLog('init completed');
      return true;
    } catch (e) {
      console.error('ExpoNotificationPort.init error', e);
      return false;
    }
  }

  async scheduleDailyReminders(habits: Habit[], targetDate: Date = new Date()): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      pushLog('cancelAllScheduledNotificationsAsync called');

      const normalizedTarget = new Date(targetDate);
      normalizedTarget.setHours(0, 0, 0, 0);
      const now = new Date();

      for (const habit of habits) {
        const entryForTarget = habit.entries.find(entry => isSameDay(new Date(entry.date), normalizedTarget));
        if (!entryForTarget) {
          pushLog(`skip habit ${habit.id}: no entry for target date`);
          continue;
        }
        if (entryForTarget.status) {
          pushLog(`skip habit ${habit.id}: already completed`);
          continue;
        }

        const scheduledDate = new Date(normalizedTarget);
        const { hours, minutes, label } = parseTimeString(habit.time);
        scheduledDate.setHours(hours, minutes, 0, 0);

        if (scheduledDate <= now) {
          pushLog(`skip habit ${habit.id}: scheduled time in past (${scheduledDate.toISOString()})`);
          continue;
        }

        const title = habit.name || 'Habit reminder';
        const body = `Erinnerung: ${title} um ${label}`;
        const secondsUntil = Math.max(1, Math.floor((scheduledDate.getTime() - now.getTime()) / 1000));

        if (Platform.OS === 'ios') {
          await Notifications.scheduleNotificationAsync({
            content: { title, body, data: { habitId: habit.id } },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: secondsUntil,
              repeats: false,
            } as Notifications.NotificationTriggerInput,
          });
        } else {
          await Notifications.scheduleNotificationAsync({
            content: { title, body, data: { habitId: habit.id } },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: scheduledDate,
              channelId: 'habit-reminders',
            } as Notifications.NotificationTriggerInput,
          });
        }

        pushLog(`scheduled habit ${habit.id} at ${scheduledDate.toISOString()}`);
      }
    } catch (e) {
      console.error('ExpoNotificationPort.scheduleDailyReminders error', e);
    }
  }
}

function parseTimeString(value?: string | null): { hours: number; minutes: number; label: string } {
  const fallback = { hours: 9, minutes: 0, label: '09:00' };
  if (!value) return fallback;
  const parts = value.split(':').map(p => p.trim());
  const hours = Number(parts[0]);
  const minutes = parts[1] ? Number(parts[1]) : 0;
  if (isNaN(hours) || isNaN(minutes)) {
    return fallback;
  }
  const normalizedHours = Math.min(Math.max(hours, 0), 23);
  const normalizedMinutes = Math.min(Math.max(minutes, 0), 59);
  const label = `${String(normalizedHours).padStart(2, '0')}:${String(normalizedMinutes).padStart(2, '0')}`;
  return { hours: normalizedHours, minutes: normalizedMinutes, label };
}
