import { Achievement } from '../../domain/entities/Achievement';

describe('Achievement Entity', () => {
  beforeAll(() => {
    // Freeze system time so date calculations are deterministic
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-12-16T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should create an Achievement with all properties', () => {
    const data = {
      id: 1,
      userId: 2,
      name: 'First Steps',
      description: 'Created first habit',
      imageUrl: 'https://example.com/ach.png',
      unlockedAt: new Date('2025-12-10T12:00:00Z'),
      habitId: 5,
    } as const;

    const a = new Achievement(data as any);

    expect(a.id).toBe(1);
    expect(a.userId).toBe(2);
    expect(a.name).toBe('First Steps');
    expect(a.description).toBe('Created first habit');
    expect(a.imageUrl).toBe('https://example.com/ach.png');
    expect(a.habitId).toBe(5);
    expect(a.unlockedAt).toBeInstanceOf(Date);
  });

  it('getDaysSinceUnlock should return correct day difference', () => {
    // System time is 2025-12-16
    const unlocked = new Date('2025-12-10T12:00:00Z'); // 6 days before
    const a = new Achievement({ id: 1, userId: 1, name: 'X', description: '', imageUrl: '', unlockedAt: unlocked });

    expect(a.getDaysSinceUnlock()).toBe(6);
  });

  it('isRecent should be true for unlock within 7 days and false otherwise', () => {
    const recent = new Achievement({ id: 1, userId: 1, name: 'R', description: '', imageUrl: '', unlockedAt: new Date('2025-12-12T12:00:00Z') }); // 4 days before
    const old = new Achievement({ id: 2, userId: 1, name: 'O', description: '', imageUrl: '', unlockedAt: new Date('2025-11-30T12:00:00Z') }); // 16 days before

    expect(recent.isRecent()).toBe(true);
    expect(old.isRecent()).toBe(false);
  });

  it('getFormattedUnlockDate should return a german formatted date string', () => {
    const target = new Date(Date.UTC(2025, 11, 10, 0, 0, 0)); // 10 Dec 2025 UTC
    const a = new Achievement({ id: 3, userId: 1, name: 'F', description: '', imageUrl: '', unlockedAt: target });

    const formatted = a.getFormattedUnlockDate();
    // Should match the typical de-DE short date format (e.g. 10.12.2025)
    expect(formatted).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
    // And be equal to JS' toLocaleDateString with de-DE
    expect(formatted).toBe(target.toLocaleDateString('de-DE'));
  });
});
