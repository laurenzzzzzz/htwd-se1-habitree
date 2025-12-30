// src/utils/generateDailyEntries.js
import { PrismaClient } from '@prisma/client';
import { isHabitDue } from './streak.js';
const prisma = new PrismaClient();

export async function createDailyHabitEntries() {
  // Nutze den lokalen Tagesbeginn (Mitternacht) statt UTC,
  // damit z.B. 00:08 in Europe/Berlin nicht auf den Vortag (UTC) zeigt.
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0); // Lokale Mitternacht

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  try {
    const habits = await prisma.habit.findMany();

    for (const habit of habits) {
      if (!isHabitDue(habit, todayStart)) {
        console.log(`Habit ID ${habit.id} ist heute nicht fällig – übersprungen.`);
        continue;
      }

      const entryExists = await prisma.habitEntry.findFirst({
        where: {
          habitId: habit.id,
          date: { gte: todayStart, lt: tomorrowStart },
        },
      });

      if (entryExists) {
        console.log(`Eintrag für heute existiert schon: Habit ID ${habit.id} (lokales Datum: ${entryExists.date.toLocaleDateString('de-DE')})`);
        continue;
      }

      await prisma.habitEntry.create({
        data: { habitId: habit.id, userId: habit.userId, date: todayStart },
      });

      console.log(`Neuer HabitEntry für heute erstellt: Habit ID ${habit.id} (lokales Datum: ${todayStart.toLocaleDateString('de-DE')})`);
    }

  } catch (error) {
    if (error.code === 'P2002') {
      console.warn(' Prisma: Doppelter Eintrag verhindert');
    } else {
      console.error(' Fehler beim Erstellen der HabitEntries:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}
