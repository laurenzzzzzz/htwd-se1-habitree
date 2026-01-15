// Integration test - NotificationService
// SUT: NotificationService (Port-Adapter Interaktion, Fehlerhandling)

// Integration/Unit tests for NotificationService

import NotificationService from '../../application/services/NotificationService';
import INotificationPort from '../../domain/ports/INotificationPort';
import { Habit } from '../../domain/entities/Habit';

describe('NotificationService', () => {
  let mockPort: jest.Mocked<INotificationPort>;
  let svc: NotificationService;

  beforeEach(() => {
    mockPort = {
      init: jest.fn(),
      scheduleDailyReminders: jest.fn(),
      showImmediateNotification: jest.fn(),
    } as unknown as jest.Mocked<INotificationPort>;

    svc = new NotificationService(mockPort);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore && (console.warn as jest.Mock).mockRestore();
  });

  describe('rescheduleForHabits', () => {
    it('does nothing when port.init returns false', async () => {
      mockPort.init.mockResolvedValue(false);
      const habits: Habit[] = [];
      await expect(svc.rescheduleForHabits(habits, new Date('2025-06-01'))).resolves.toBeUndefined();
      expect(mockPort.scheduleDailyReminders).not.toHaveBeenCalled();
    });

    it('does nothing when no relevant habits for the target date', async () => {
      mockPort.init.mockResolvedValue(true);
      const habits: Habit[] = [new Habit({ id: 1, name: 'H', description: '', frequency: 'daily', entries: [] })];
      const target = new Date('2025-06-01');
      await svc.rescheduleForHabits(habits, target);
      expect(mockPort.scheduleDailyReminders).not.toHaveBeenCalled();
    });

    it('calls scheduleDailyReminders with normalized date when relevant entries exist', async () => {
      mockPort.init.mockResolvedValue(true);
      const target = new Date('2025-06-15T10:30:00Z');
      // entry date equal to target (date part)
      const iso = new Date(target);
      iso.setHours(0, 0, 0, 0);
      const habit = new Habit({ id: 2, name: 'X', description: '', frequency: 'daily', entries: [{ id: 1, date: iso.toISOString(), status: true, note: null }] });

      await svc.rescheduleForHabits([habit], target);

      expect(mockPort.scheduleDailyReminders).toHaveBeenCalledTimes(1);
      const calledDate = (mockPort.scheduleDailyReminders as jest.Mock).mock.calls[0][1];
      // normalized target should have zeroed time
      expect(calledDate.getHours()).toBe(0);
      expect(calledDate.getMinutes()).toBe(0);
      expect(calledDate.getSeconds()).toBe(0);
    });

    it('catches errors from port methods and does not throw', async () => {
      mockPort.init.mockResolvedValue(true);
      mockPort.scheduleDailyReminders.mockRejectedValue(new Error('boom'));
      const target = new Date('2025-06-20');
      const iso = new Date(target);
      iso.setHours(0, 0, 0, 0);
      const habit = new Habit({ id: 3, name: 'Y', description: '', frequency: 'daily', entries: [{ id: 1, date: iso.toISOString(), status: true, note: null }] });

      await expect(svc.rescheduleForHabits([habit], target)).resolves.toBeUndefined();
      expect(mockPort.scheduleDailyReminders).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('showImmediate', () => {
    it('does nothing when init returns false', async () => {
      mockPort.init.mockResolvedValue(false);
      await expect(svc.showImmediate('T', 'B')).resolves.toBeUndefined();
      expect(mockPort.showImmediateNotification).not.toHaveBeenCalled();
    });

    it('calls showImmediateNotification when ready', async () => {
      mockPort.init.mockResolvedValue(true);
      await svc.showImmediate('Hello', 'Body', { foo: 1 });
      expect(mockPort.showImmediateNotification).toHaveBeenCalledWith('Hello', 'Body', { foo: 1 });
    });

    it('catches errors and does not throw', async () => {
      mockPort.init.mockResolvedValue(true);
      mockPort.showImmediateNotification.mockRejectedValue(new Error('notify-fail'));
      await expect(svc.showImmediate('T', 'B')).resolves.toBeUndefined();
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
