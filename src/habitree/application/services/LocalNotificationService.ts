import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// In-memory logs for debugging in-app
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
    // newer expo-notifications versions expect these properties as well
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initLocalNotifications(): Promise<boolean> {
  try {
    const perm = await Notifications.getPermissionsAsync();
        console.log('Notification permissions current:', perm);
        pushLog(`permissions current: ${JSON.stringify(perm)}`);
    let status = perm.status;
    if (status !== 'granted') {
      const res = await Notifications.requestPermissionsAsync();
          console.log('Notification permissions after request:', res);
          pushLog(`permissions after request: ${JSON.stringify(res)}`);
      status = res.status;
      if (status !== 'granted') {
        console.warn('Notifications permission not granted');
        return false;
      }
    }

    if (Platform.OS === 'android') {
        pushLog('initLocalNotifications completed');
      await Notifications.setNotificationChannelAsync('habit-reminders', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return true;
  } catch (e) {
    console.error('initLocalNotifications error', e);
    return false;
  }
}

/**
 * Cancel all scheduled notifications and schedule reminders for given habits array.
 * Expects habit objects which include `entries` (array) and `time` string "HH:MM" on habit.
 */
export async function scheduleRemindersForHabits(habits: any[] = []): Promise<void> {
  try {
    // Clear existing scheduled notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();
    pushLog('cancelAllScheduledNotificationsAsync called');

    const now = new Date();

    for (const habit of habits) {
      const timeStrRaw = habit.time || habit.habit?.time || null;
      const timeStr = typeof timeStrRaw === 'string' ? timeStrRaw.trim() : null;

      // entries may be nested under habit.entries or top-level; we want today's entries
      const entries = habit.entries || (habit.habit ? habit.habit.entries : []) || [];

      console.log(`Scheduling for habit ${habit.id || habit.habitId || 'unknown'} name=${habit.name || habit.habit?.name} time=${timeStr}`);
  pushLog(`scheduling for habit id=${habit.id || habit.habitId || 'unknown'} name=${habit.name || habit.habit?.name} time=${timeStr}`);

      for (const entry of entries) {
        try {
          // Only schedule for entries on that day (entries.date), and for not completed ones
          const entryDate = new Date(entry.date);
          if (isNaN(entryDate.getTime())) {
            console.warn('Skipping entry with invalid date', entry);
            continue;
          }

          const scheduledDate = new Date(entryDate);

          let hh = 9, mm = 0; // defaults
          if (timeStr) {
            const parts = timeStr.split(':').map(s => s.trim());
            const p0 = Number(parts[0]);
            const p1 = parts[1] ? Number(parts[1]) : 0;
            if (!isNaN(p0) && p0 >= 0 && p0 <= 23) hh = p0;
            if (!isNaN(p1) && p1 >= 0 && p1 <= 59) mm = p1;
          }

          scheduledDate.setHours(hh, mm, 0, 0);

          // debug info
          console.log(`Entry date=${entryDate.toISOString()} scheduled=${scheduledDate.toISOString()} now=${now.toISOString()} status=${entry.status}`);
          pushLog(`entry date=${entryDate.toISOString()} scheduled=${scheduledDate.toISOString()} now=${now.toISOString()} status=${entry.status}`);

          // skip if entry already completed
          if (entry.status === true) {
            console.log('Skipping scheduling: entry already completed');
                        pushLog('Skipping scheduling: entry already completed');
            continue;
          }

          // only schedule if scheduledDate is in the future
          if (scheduledDate <= now) {
            console.log('Skipping scheduling: scheduled time is in the past');
                        pushLog('Skipping scheduling: scheduled time is in the past');
            continue;
          }

          const title = habit.name || (habit.habit && habit.habit.name) || 'Habit reminder';
          const body = `Erinnerung: ${title} um ${timeStr || '09:00'}`;

          const msUntil = scheduledDate.getTime() - now.getTime();
          const secondsUntil = Math.max(1, Math.floor(msUntil / 1000));

          // If the scheduled time is already past, schedule an immediate placeholder (like tagesMotivation)
          if (scheduledDate <= now) {
            console.log('Scheduling immediate placeholder notification (scheduled time already passed)');
            await Notifications.scheduleNotificationAsync({
              content: { title, body, data: { habitId: habit.id || habit.habitId } },
              trigger: null,
            });
            console.log(`Scheduled immediate placeholder for habit ${habit.id || habit.habitId}`);
          } else {
            // Use relative seconds trigger on iOS/Expo for better reliability in Expo Go
            if (Platform.OS === 'ios') {
              console.log(`Scheduling iOS relative trigger in ${secondsUntil}s`);
              await Notifications.scheduleNotificationAsync({
                content: { title, body, data: { habitId: habit.id || habit.habitId } },
                trigger: { seconds: secondsUntil, repeats: false } as unknown as Notifications.NotificationTriggerInput,
              });
              console.log(`Scheduled iOS notification for habit ${habit.id || habit.habitId} in ${secondsUntil}s`);
            } else {
              // Android can accept a Date trigger directly
              await Notifications.scheduleNotificationAsync({
                content: { title, body, data: { habitId: habit.id || habit.habitId } },
                trigger: scheduledDate as unknown as Notifications.NotificationTriggerInput,
              });
              console.log(`Scheduled notification for habit ${habit.id || habit.habitId} at ${scheduledDate.toISOString()}`);
                      pushLog(`Scheduled notification for habit ${habit.id || habit.habitId} at ${scheduledDate.toISOString()}`);
                        pushLog('Scheduling immediate placeholder notification (scheduled time already passed)');
                        pushLog(`Scheduled immediate placeholder for habit ${habit.id || habit.habitId}`);
                          pushLog(`Scheduled iOS notification for habit ${habit.id || habit.habitId} in ${secondsUntil}s`);
                          pushLog(`Scheduled notification for habit ${habit.id || habit.habitId} at ${scheduledDate.toISOString()}`);
            }
          }
        } catch (e) {
          console.error('Error scheduling for entry', entry, e);
        }
      }
    }
  } catch (e) {
    console.error('scheduleRemindersForHabits error', e);
  }
}
