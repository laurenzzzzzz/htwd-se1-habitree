import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Hilfsfunktion: Prüft, ob ein Habit am gegebenen Tag fällig ist
export function isHabitDue(habit, date) {
  if (!habit.startDate || !habit.frequency) return false;
  const start = new Date(habit.startDate);
  const target = new Date(date);
  // normalize to local-day precision
  target.setHours(0,0,0,0);
  start.setHours(0,0,0,0);
  if (target < start) return false;

  if (habit.frequency === 'Täglich') {
    return target >= start;
  }

  if (habit.frequency === 'Wöchentlich') {
    // If the habit defines specific weekDays (0=Mon .. 6=Sun), use them.
    // JS getDay(): 0=Sun .. 6=Sat. Convert to 0=Mon..6=Sun via (jsDay+6)%7
    const jsDay = target.getDay();
    const weekdayIndex = (jsDay + 6) % 7; // 0=Mon .. 6=Sun

    if (Array.isArray(habit.weekDays) && habit.weekDays.length > 0) {
      // ensure numbers
      const weekDaysNums = habit.weekDays.map(d => Number(d));
      return weekDaysNums.includes(weekdayIndex) && target >= start;
    }

    // Fallback behaviour (for habits created before weekDays existed):
    const diffDays = Math.floor((target - start) / (1000 * 60 * 60 * 24));
    return diffDays % 7 === 0;
  }

  if (habit.frequency === 'Monatlich') {
    return target.getDate() === start.getDate();
  }

  if (habit.frequency === 'Benutzerdefiniert') {
    // For custom interval: check if target is a multiple of intervalDays from startDate
    if (!habit.intervalDays || habit.intervalDays < 1) return false;
    const diffDays = Math.floor((target - start) / (1000 * 60 * 60 * 24));
    return diffDays % habit.intervalDays === 0;
  }

  return false;
}

// Berechnet Streaks neu, indem von GESTERN rückwärts gezählt wird
// bis zum ersten Tag, an dem die Anforderung nicht erfüllt wurde
// HEUTE wird NICHT gezählt (nur bereits abgeschlossene Tage)
export async function recalculateStreaks() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1); // Gestern 00:00

  const users = await prisma.user.findMany();

  for (const user of users) {
    const habits = await prisma.habit.findMany({ where: { userId: user.id } });
    if (habits.length === 0) continue;

    // --- USER STREAK (alle Habits erfüllt an den Tagen?) ---
    let userCurrentStreak = 0;
    let checkDate = new Date(yesterday);

    // Rückwärts von gestern gehen
    while (true) {
      const dateStart = new Date(checkDate);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 1);

      // Alle HabitEntry-Einträge für diesen Tag auslesen
      // (= nur Habits, die an diesem Tag fällig waren)
      const entriesThisDay = await prisma.habitEntry.findMany({
        where: {
          userId: user.id,
          date: { gte: dateStart, lt: dateEnd },
        },
        select: { habitId: true, status: true },
      });

      if (entriesThisDay.length === 0) {
        // Kein Habit-Eintrag an diesem Tag → Streak endet
        break;
      }

      // Alle Einträge erfüllt?
      const allFulfilled = entriesThisDay.every(e => e.status === true);

      if (!allFulfilled) {
        // Nicht alle erfüllt → Streak endet
        break;
      }

      // Alle erfüllt → Streak erhöhen und einen Tag früher gehen
      userCurrentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Wenn nicht alle erfüllt: Streak um 1 reduzieren (nicht instant auf 0)
    const userStreakToSet = (user.currentStreak || 0) > 0 
      ? Math.max(0, (user.currentStreak || 0) - 1) 
      : 0;

    // User Streak aktualisieren
    // maxStreak: Nur erhöhen wenn currentStreak größer ist, sonst behalten
    const newUserMaxStreak = Math.max(user.maxStreak || 0, userCurrentStreak);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak: userCurrentStreak,
        maxStreak: newUserMaxStreak,
      },
    });
    console.log(`User ${user.id}: Neu berechnet → currentStreak: ${userCurrentStreak}, maxStreak: ${newUserMaxStreak}`);

    // --- HABIT STREAKS (pro Habit) ---
    for (const habit of habits) {
      // Alle HabitEntry-Einträge für dieses Habit, sortiert nach Datum DESC
      const allEntries = await prisma.habitEntry.findMany({
        where: { habitId: habit.id },
        orderBy: { date: 'desc' },
        select: { id: true, date: true, status: true },
      });

      // Rückwärts (absteigend) durch die Einträge gehen
      // und zählen, bis status === false
      let habitCurrentStreak = 0;

      for (const entry of allEntries) {
        // Ist dieser Eintrag von heute? → Überspringen
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (entryDate.getTime() === today.getTime()) {
          // Heute → nicht zählen, weitermachen
          continue;
        }

        if (entry.status === false) {
          // Erster nicht erfüllter Tag → Streak endet
          break;
        }

        // Erfüllt und nicht heute → Streak erhöhen
        habitCurrentStreak++;
      }

      // Wenn habitCurrentStreak 0 ist aber vorher > 0: Um 1 reduzieren statt instant auf 0
      let finalHabitStreak = habitCurrentStreak;
      if (habitCurrentStreak === 0 && (habit.currentStreak || 0) > 0) {
        finalHabitStreak = Math.max(0, (habit.currentStreak || 0) - 1);
      }

      // Habit Streak aktualisieren
      // maxStreak: Nur erhöhen wenn currentStreak größer ist, sonst behalten
      const newHabitMaxStreak = Math.max(habit.maxStreak || 0, finalHabitStreak);
      
      if (finalHabitStreak !== (habit.currentStreak || 0)) {
        await prisma.habit.update({
          where: { id: habit.id },
          data: { 
            currentStreak: finalHabitStreak,
            maxStreak: newHabitMaxStreak,
          },
        });
        console.log(`Habit ${habit.id} (${habit.name}): Neu berechnet → currentStreak: ${finalHabitStreak}, maxStreak: ${newHabitMaxStreak}`);
      } else if (newHabitMaxStreak !== (habit.maxStreak || 0)) {
        // Wenn currentStreak gleich aber maxStreak unterschiedlich
        await prisma.habit.update({
          where: { id: habit.id },
          data: { maxStreak: newHabitMaxStreak },
        });
      }
    }
  }
}
