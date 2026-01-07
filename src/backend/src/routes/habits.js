/**
 * Habit-Routen (CRUD, Toggle, Daily Entries, Baumstatus).
 * @module routes/habits
 */
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { isHabitDue } from '../utils/streak.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Liefert alle nicht geernteten Habits des eingeloggten Nutzers.
 * @function listHabits
 * @async
 * @param {express.Request} req - Erwartet JWT, nutzt `req.user.id`.
 * @param {express.Response} res - Antwort mit Habit-Liste oder Fehler.
 * @returns {Promise<void>}
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(' Habits abrufen für User:', userId); // Debug
    const habits = await prisma.habit.findMany({
      where: { 
        userId,
        isHarvested: { not: 2 } // Zeige alle außer geerntete (2)
      },
      include: { entries: true },
    });

    console.log(' Gefundene Habits:', JSON.stringify(habits, null, 2)); // Mehr Übersicht
    res.json(habits);
  } catch (err) {
    console.error(' Fehler beim Abrufen der Habits:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Habits' });
  }
});

/**
 * Listet öffentliche Habit-Vorlagen.
 * @function listPredefinedHabits
 * @async
 * @param {express.Request} req - Keine Parameter erforderlich.
 * @param {express.Response} res - Antwort mit Vorlagen oder Fehler.
 * @returns {Promise<void>}
 */
router.get('/predefined', async (req, res) => {
  try {
    console.log(' Predefined Habits werden abgerufen...');
    const predefinedHabits = await prisma.predefinedHabit.findMany({
      // Wir wollen nur die grundlegenden Daten, keine Einträge etc.
      select: {
        id: true,
        name: true,
        description: true,
        frequency: true,
      },
    });

    console.log(` Gefundene Predefined Habits: ${predefinedHabits.length}`);
    res.json(predefinedHabits);
  } catch (err) {
    console.error(' Fehler beim Abrufen der Predefined Habits:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Habit-Vorlagen' });
  }
});

/**
 * Erstellt ein neues Habit für den eingeloggten Nutzer.
 * @function createHabit
 * @async
 * @param {express.Request} req - Erwartet u.a. `name`, `frequency`, `startDate`, `time`, optional `weekDays`, `intervalDays`.
 * @param {express.Response} res - Antwort mit neuem Habit und optional initialem Entry.
 * @returns {Promise<void>}
 */
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { name, description, frequency, startDate, time, weekDays, intervalDays, durationDays } = req.body;

  if (!name || !frequency || !startDate || !time) {
    return res.status(400).json({ error: 'Name, Frequenz, Startdatum und Uhrzeit sind erforderlich' });
  }

  // Validate weekDays if provided
  if (weekDays !== undefined) {
    if (!Array.isArray(weekDays) || weekDays.some(d => isNaN(Number(d)) || Number(d) < 0 || Number(d) > 6)) {
      return res.status(400).json({ error: 'weekDays muss ein Array mit Werten 0..6 (0=Montag..6=Sonntag) sein' });
    }
  }

  // For weekly habits, at least one weekday must be selected
  if (frequency === 'Wöchentlich' && (!Array.isArray(weekDays) || weekDays.length === 0)) {
    return res.status(400).json({ error: 'Für wöchentliche Habits müssen mindestens ein Wochentag ausgewählt werden' });
  }

  // Validate intervalDays for custom frequency
  if (frequency === 'Benutzerdefiniert') {
    if (!intervalDays || isNaN(Number(intervalDays)) || Number(intervalDays) < 1) {
      return res.status(400).json({ error: 'Für benutzerdefinierte Habits muss ein Intervall >= 1 Tag angegeben werden' });
    }
  }

  try {
    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        description: description ?? null,
        frequency,
        startDate: new Date(startDate.split('.').reverse().join('-')), // dd.mm.yyyy zu Date
        time,
        weekDays: Array.isArray(weekDays) ? weekDays.map(d => Number(d)) : undefined,
        intervalDays: frequency === 'Benutzerdefiniert' ? Number(intervalDays) : undefined,
        durationDays: durationDays !== undefined && durationDays !== null && `${durationDays}`.trim() !== ''
          ? Number(durationDays)
          : undefined,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // HabitEntry für heute nur erstellen, wenn das Habit auch fällig ist
    let habitEntry = null;
    try {
      if (isHabitDue(habit, today)) {
        habitEntry = await prisma.habitEntry.create({
          data: {
            habitId: habit.id,
            userId: userId,
            date: today,
            status: false,
            note: null,
          },
        });
      } else {
        console.log(`Neues Habit (ID ${habit.id}) ist heute nicht fällig — kein Eintrag erstellt.`);
      }
    } catch (e) {
      // Falls es einen Konflikt gibt (z. B. Doppelter Eintrag), ignorieren wir ihn hier
      console.warn('Fehler beim optionalen Erstellen desHabitEntry:', e.message || e);
    }

    // Hinweis: Streak wird nicht sofort aktualisiert. Stattdessen wird sie einmal täglich
    // um Mitternacht aktualisiert via evaluateDayStreaks() im Cron-Job.

    res.status(201).json({
      ...habit,
      entries: habitEntry ? [habitEntry] : [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Habits' });
  }
});

/**
 * Aktualisiert ein bestehendes Habit des eingeloggten Nutzers.
 * @function updateHabit
 * @async
 * @param {express.Request} req - Pfadparam `id`; Body wie beim Erstellen (optional).
 * @param {express.Response} res - Antwort mit aktualisiertem Habit oder Fehler.
 * @returns {Promise<void>}
 */
router.put('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, description, frequency, startDate, time, weekDays, intervalDays, durationDays } = req.body;

  try {
    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } });
    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ error: 'Habit nicht gefunden oder kein Zugriff' });
    }

    // Validate weekDays if provided
    if (weekDays !== undefined) {
      if (!Array.isArray(weekDays) || weekDays.some(d => isNaN(Number(d)) || Number(d) < 0 || Number(d) > 6)) {
        return res.status(400).json({ error: 'weekDays muss ein Array mit Werten 0..6 (0=Montag..6=Sonntag) sein' });
      }
    }

    // Validate intervalDays for custom frequency
    if (frequency === 'Benutzerdefiniert') {
      if (!intervalDays || isNaN(Number(intervalDays)) || Number(intervalDays) < 1) {
        return res.status(400).json({ error: 'Für benutzerdefinierte Habits muss ein Intervall >= 1 Tag angegeben werden' });
      }
    }

    // Parse new startDate if provided
    const newStartDate = startDate ? new Date(startDate.split('.').reverse().join('-')) : habit.startDate;
    const startDateChanged = startDate && habit.startDate.toISOString().split('T')[0] !== newStartDate.toISOString().split('T')[0];

    const updatedHabit = await prisma.habit.update({
      where: { id: Number(id) },
      data: {
        name,
        description: description ?? habit.description,
        frequency,
        startDate: newStartDate,
        time: time || habit.time,
        weekDays: Array.isArray(weekDays) ? weekDays.map(d => Number(d)) : habit.weekDays,
        intervalDays: frequency === 'Benutzerdefiniert' ? Number(intervalDays) : undefined,
        durationDays: durationDays !== undefined && durationDays !== null && `${durationDays}`.trim() !== ''
          ? Number(durationDays)
          : null, // explizit auf null setzen, wenn leer
      },
    });

    // Wenn das Startdatum oder die Frequenz sich geändert hat, müssen wir die HabitEntry-Einträge anpassen
    if (startDateChanged || frequency !== habit.frequency || (Array.isArray(weekDays) && JSON.stringify(weekDays) !== JSON.stringify(habit.weekDays))) {
      // Lösche alle bisherigen Einträge für dieses Habit
      await prisma.habitEntry.deleteMany({
        where: { habitId: Number(id) }
      });

      // Erstelle neue Einträge für heute, falls das Habit heute fällig ist
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isHabitDue(updatedHabit, today)) {
        try {
          await prisma.habitEntry.create({
            data: {
              habitId: Number(id),
              userId: userId,
              date: today,
              status: false,
              note: null,
            },
          });
        } catch (e) {
          console.warn('Fehler beim Erstellen des HabitEntry nach Update:', e.message);
        }
      }
    }

    res.json(updatedHabit);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Habits' });
  }
});

/**
 * Löscht ein Habit des eingeloggten Nutzers.
 * @function deleteHabit
 * @async
 * @param {express.Request} req - Pfadparam `id` und JWT (`req.user.id`).
 * @param {express.Response} res - Antwort mit Erfolgsmeldung oder Fehler.
 * @returns {Promise<void>}
 */
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } });
    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ error: 'Habit nicht gefunden oder kein Zugriff' });
    }

    await prisma.habit.delete({ where: { id: Number(id) } });
    res.json({ message: 'Habit erfolgreich gelöscht' });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen des Habits' });
  }
});

/**
 * Markiert ein Habit als wachsend (`isHarvested = 1`).
 * @function growHabit
 * @async
 * @param {express.Request} req - Pfadparam `id` und JWT (`req.user.id`).
 * @param {express.Response} res - Antwort mit aktualisiertem Habit oder Fehler.
 * @returns {Promise<void>}
 */
router.put('/:id/grow', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } });
    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ error: 'Habit nicht gefunden oder kein Zugriff' });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: Number(id) },
      data: { isHarvested: 1 },
    });

    res.json(updatedHabit);
  } catch (err) {
    console.error(' Fehler beim Wachsen des Baums:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Habits' });
  }
});

/**
 * Markiert ein Habit als geerntet (`isHarvested = 2`).
 * @function harvestHabit
 * @async
 * @param {express.Request} req - Pfadparam `id` und JWT (`req.user.id`).
 * @param {express.Response} res - Antwort mit aktualisiertem Habit oder Fehler.
 * @returns {Promise<void>}
 */
router.put('/:id/harvest', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const habit = await prisma.habit.findUnique({ where: { id: Number(id) } });
    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ error: 'Habit nicht gefunden oder kein Zugriff' });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: Number(id) },
      data: { isHarvested: 2 },
    });

    res.json(updatedHabit);
  } catch (err) {
    console.error(' Fehler beim Ernten:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Habits' });
  }
});

/**
 * Schaltet den Status eines Habit-Eintrags für ein Datum um.
 * @function toggleHabitEntry
 * @async
 * @param {express.Request} req - Pfadparam `id`; Body mit `date`; JWT liefert `req.user.id`.
 * @param {express.Response} res - Antwort mit aktualisiertem Entry oder Fehler.
 * @returns {Promise<void>}
 */
router.put('/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Vom JWT-Token
  const { date } = req.body;

  try {
    // Check if habit is harvested
    const habit = await prisma.habit.findUnique({ 
      where: { id: Number(id) },
      select: { userId: true, isHarvested: true }
    });

    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ error: 'Habit nicht gefunden oder kein Zugriff' });
    }

    if (habit.isHarvested === 2) {
      return res.status(403).json({ error: 'Geernte Habits können nicht bearbeitet werden' });
    }

    // 1. Datum normalisieren, um nur nach dem Tag zu suchen (00:00:00 Uhr)
    const clientDate = new Date(date);
    clientDate.setHours(0, 0, 0, 0); // Wichtig: Auf UTC-Mitternacht setzen!

    const tomorrow = new Date(clientDate);
    tomorrow.setDate(clientDate.getDate() + 1);

    // 2. Das HabitEntry finden, das zum Habit, dem heutigen Datum UND dem Benutzer gehört
    const entry = await prisma.habitEntry.findFirst({
      where: {
        habitId: Number(id),
        habit: { userId: userId },
        date: { gte: clientDate, lt: tomorrow },
      },
    });

    if (!entry) {
      return res.status(404).json({ message: 'HabitEntry für heute nicht gefunden oder nicht zugehörig.' });
    }

    // 3. Status umschalten
    const updatedEntry = await prisma.habitEntry.update({
      where: { id: entry.id },
      data: { status: !entry.status },
    });

    // Hinweis: Streak wird nicht sofort aktualisiert. Stattdessen wird sie einmal täglich
    // um Mitternacht aktualisiert via evaluateDayStreaks() im Cron-Job.

    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Umschalten des Status' });
  }
});

/**
 * Erstellt für heute fehlende Habit-Einträge für fällige Habits.
 * @function createDailyHabitEntries
 * @async
 * @param {express.Request} req - JWT liefert `req.user.id`.
 * @param {express.Response} res - Antwort mit Anzahl der erstellten Einträge.
 * @returns {Promise<void>}
 */
router.post('/daily', async (req, res) => {
  try {
    const userId = req.user.id;
    // Lokale Tagesgrenzen (Mitternacht bis Mitternacht)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const habits = await prisma.habit.findMany({
      where: { 
        userId,
        isHarvested: { not: 2 } // Zeige alle außer geerntete (2)
      },
      include: { entries: true },
    });

    const createdEntries = [];

    for (const habit of habits) {
      // Nur fällige Habits für heute berücksichtigen
      if (!isHabitDue(habit, todayStart)) {
        continue;
      }

      const exists = habit.entries.some(
        (entry) => entry.date >= todayStart && entry.date < tomorrowStart
      );

      if (!exists) {
        const entry = await prisma.habitEntry.create({
          data: {
            habitId: habit.id,
            userId,
            date: todayStart,
            note: '',
            status: false,
          },
        });
        createdEntries.push(entry);
      }
    }

    res.json({ message: 'Heutige HabitEntries erstellt', count: createdEntries.length });
  } catch (err) {
    console.error('Fehler beim Erstellen der täglichen Einträge:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen der Einträge' });
  }
});

/**
 * Liefert Habits des Nutzers mit Einträgen für den heutigen Tag.
 * @function listTodaysHabits
 * @async
 * @param {express.Request} req - JWT liefert `req.user.id`.
 * @param {express.Response} res - Antwort mit Habits und heutigen Entries oder Fehler.
 * @returns {Promise<void>}
 */
router.get('/today', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Datumsgrenzen für heute setzen (Mitternacht)
    // Wichtig: Wir verwenden UTC-Methoden, da Prisma/Postgres das Datum standardmäßig so speichert.
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Ein Tag nach heute (Mitternacht)

    // 2. Habits abrufen und nur den Eintrag von heute inkludieren
    const habitsWithTodayEntry = await prisma.habit.findMany({
      where: { 
        userId,
        isHarvested: { not: 2 } // Zeige alle außer geerntete (2)
      },
      include: { 
        entries: {
          where: {
            date: {
              gte: today,    // größer oder gleich heute 00:00:00
              lt: tomorrow,  // kleiner als morgen 00:00:00
            },
          },
        },
      },
      // Optional: Habits nach Name sortieren
      orderBy: {
        name: 'asc',
      }
    });

    // 3. Optional: Habits herausfiltern, die keinen Eintrag für heute haben
    // (Dies ist nur relevant, falls die createDailyHabitEntries-Funktion nicht gelaufen ist.
    //  Da sie aber beim Serverstart läuft, sollte das entries-Array meistens gefüllt sein.)
    const habitsForToday = habitsWithTodayEntry.filter(habit => habit.entries.length > 0);

    console.log(` Habits für heute abgerufen: ${habitsForToday.length}`);
    res.json(habitsForToday);
  } catch (err) {
    console.error(' Fehler beim Abrufen der heutigen Habits:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Habits für heute' });
  }
});

/**
 * Listet alle geernteten Habits des Nutzers (`isHarvested = 2`).
 * @function listHarvestedHabits
 * @async
 * @param {express.Request} req - JWT liefert `req.user.id`.
 * @param {express.Response} res - Antwort mit geernteten Habits oder Fehler.
 * @returns {Promise<void>}
 */
router.get('/harvested', async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(' Geerntete Habits abrufen für User:', userId);
    const harvestedHabits = await prisma.habit.findMany({
      where: { 
        userId,
        isHarvested: 2 // Nur geerntete Habits
      },
      include: { entries: true },
      orderBy: { createdAt: 'desc' }, // Neueste zuerst
    });

    console.log(' Gefundene geerntete Habits:', harvestedHabits.length);
    res.json(harvestedHabits);
  } catch (err) {
    console.error(' Fehler beim Abrufen der geernteten Habits:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der geernteten Habits' });
  }
});

export default router;
