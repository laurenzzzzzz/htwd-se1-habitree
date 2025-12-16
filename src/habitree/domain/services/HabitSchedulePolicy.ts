import { Habit } from '../entities/Habit';
import { HabitPersistencePayload } from '../repositories/IHabitsRepository';

export type HabitScheduleLike = Pick<
  Habit,
  'frequency' | 'startDate' | 'weekDays' | 'intervalDays' | 'time'
> & {
  entries?: Habit['entries'];
};

export type HabitPersistenceRequestBody = Omit<HabitPersistencePayload, 'intervalDays'> & {
  intervalDays?: number;
  weekDays?: number[];
};

const DAILY = 'Täglich';
const WEEKLY = 'Wöchentlich';
const MONTHLY = 'Monatlich';
const INTERVAL = 'Benutzerdefiniert';
const LEGACY_INTERVAL = 'Intervalles';

/** Formats date as dd.mm.yyyy for backend */
export function formatDateForPersistence(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/** Formats time as HH:MM */
export function formatTimeForPersistence(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Ensures a habit payload contains sane defaults before persistence.
 */
export function buildHabitPersistenceRequest(
  payload: HabitPersistencePayload,
  referenceDate: Date = new Date()
): HabitPersistenceRequestBody {
  const sanitizedStart = sanitizeDateString(payload.startDate) ?? formatDateForPersistence(referenceDate);
  const sanitizedTime = sanitizeTimeString(payload.time) ?? formatTimeForPersistence(referenceDate);

  return {
    ...payload,
    startDate: sanitizedStart,
    time: sanitizedTime,
    weekDays: payload.weekDays && payload.weekDays.length ? payload.weekDays : [],
    intervalDays:
      payload.intervalDays && payload.intervalDays.trim() !== ''
        ? Number(payload.intervalDays)
        : undefined,
  };
}

/**
 * Determines whether a habit should occur on the provided date.
 */
export function shouldHabitOccurOnDate(habit: HabitScheduleLike, targetDate: Date): boolean {
  const startDate = parseHabitDate(habit.startDate);
  if (!startDate) return false;

  const normalizedTarget = startOfDay(targetDate);
  if (normalizedTarget.getTime() < startDate.getTime()) {
    return false;
  }

  if (habit.frequency === DAILY) {
    return true;
  }

  if (habit.frequency === WEEKLY) {
    const uiWeekdayIndex = (normalizedTarget.getDay() + 6) % 7;
    return Boolean(habit.weekDays?.includes(uiWeekdayIndex));
  }

  if (habit.frequency === MONTHLY) {
    const monthsDiff = calculateMonthDifference(startDate, normalizedTarget);
    if (monthsDiff < 0) return false;
    const expectedDay = clampDayToMonth(startDate.getDate(), normalizedTarget);
    return normalizedTarget.getDate() === expectedDay;
  }

  if (habit.frequency === INTERVAL || habit.frequency === LEGACY_INTERVAL) {
    const daysDifference = Math.floor(
      (normalizedTarget.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const interval = habit.intervalDays && habit.intervalDays > 0 ? habit.intervalDays : 1;
    return daysDifference % interval === 0;
  }

  return false;
}

export function hasEntryForDate(habit: HabitScheduleLike, targetDate: Date): boolean {
  if (!habit.entries) return false;
  return habit.entries.some(entry => isSameDay(new Date(entry.date), targetDate));
}

export function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function sanitizeDateString(value?: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

function sanitizeTimeString(value?: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

function parseHabitDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return startOfDay(value);
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes('.')) {
    const [dd, mm, yyyy] = trimmed.split('.');
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!isNaN(parsed.getTime())) {
      return startOfDay(parsed);
    }
  }

  const iso = new Date(trimmed);
  if (!isNaN(iso.getTime())) {
    return startOfDay(iso);
  }

  return null;
}

function startOfDay(date: Date): Date {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function calculateMonthDifference(start: Date, target: Date): number {
  return (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
}

function clampDayToMonth(desiredDay: number, targetDate: Date): number {
  const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
  return Math.min(desiredDay, daysInMonth);
}
