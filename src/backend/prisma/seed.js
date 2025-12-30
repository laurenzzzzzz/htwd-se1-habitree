// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; 

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'password123'; 

async function main() {

  // --- Quotes erstellen ---
  const quotes = [
    { quote: 'Heute ist ein guter Tag, um stark zu sein.' },
    { quote: 'Jeder Schritt zählt, auch der kleine!' },
    { quote: 'Gib niemals auf – du bist näher am Ziel als du denkst.' },
    { quote: 'Dein zukünftiges Ich wird dir danken.' },
    { quote: 'Stärke kommt nicht von Siegen, sondern vom Durchhalten.' },
    { quote: 'Der Weg zum Erfolg beginnt mit dem ersten Schritt.' },
  ];

  for (const q of quotes) {
    const exists = await prisma.quote.findFirst({ where: { quote: q.quote } });
    if (!exists) {
      await prisma.quote.create({ data: q });
    }
  }
  
  // --- 1. PREDEFINED HABITS erstellen ---
  const predefinedHabitsData = [
    { name: "Täglich Wasser trinken", description: "Mindestens 2 Liter Wasser pro Tag trinken", frequency: "daily" },
    { name: "Morgendliches Stretching", description: "5 Minuten Stretching nach dem Aufstehen", frequency: "daily" }, 
    { name: "30 Minuten Lesen", description: "Kein Social Media, nur Bücher oder Fachartikel.", frequency: "daily" },
  ];
  
  for (const ph of predefinedHabitsData) {
    const exists = await prisma.predefinedHabit.findUnique({ where: { name: ph.name } });
    if (!exists) {
      await prisma.predefinedHabit.create({ data: ph });
      console.log(`Predefined Habit "${ph.name}" erstellt.`);
    }
  }

  // --- 2. TEST-USER erstellen ---
  let testUser = await prisma.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });

  if (!testUser) {
    const passwordHash = await bcrypt.hash(TEST_USER_PASSWORD, SALT_ROUNDS);

    // ANMERKUNG: Abhängig davon, ob deine User-Tabelle "id" als String (von Firebase) oder Int hat, 
    // muss dieser Block angepasst werden. Da du bcrypt nutzt, nehme ich an, es ist eine lokale Authentifizierung
    // und der User wird über die Login-Route erstellt. Wir lassen diesen Teil, um den Testnutzer zu garantieren.
    
    // Annahme: Wenn keine Firebase-UID verwendet wird, wird die ID von Prisma generiert (Int)
    testUser = await prisma.user.create({
      data: {
        email: TEST_USER_EMAIL,
        username: 'Testnutzer',
        passwordHash: passwordHash,
        // Die 'id' wird automatisch generiert, falls sie nicht als String definiert ist.
      },
    });
    console.log(`Testnutzer ${TEST_USER_EMAIL} wurde neu angelegt. Passwort: ${TEST_USER_PASSWORD}`);
  } else {
    console.log(`Testnutzer ${TEST_USER_EMAIL} existiert bereits.`);
  }

  const TEST_USER_ID = testUser.id; // Kann String oder Int sein, je nach Schema
  
  // ----------------------------------------------------------------------
  // KORREKTUR DER DATUMSLOGIK
  // Setze das Startdatum für den HabitEntry auf HEUTE, Mitternacht UTC
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0); // Wichtig: UTC-Stunden setzen, um Zeitzonenfehler zu vermeiden!
  // ----------------------------------------------------------------------

  // --- 3. HABIT-INSTANZEN FÜR DEN TEST-USER ERSTELLEN (mit Template-Verknüpfung) ---
  
  // Hole alle Predefined Habits, um sie für den Nutzer zu verwenden
  const templates = await prisma.predefinedHabit.findMany();

  for (const template of templates) {
      
      // 3.1 Prüfen, ob der User dieses Habit bereits hat
      let targetHabit = await prisma.habit.findFirst({
        where: {
          userId: TEST_USER_ID,
          predefinedHabitId: template.id, // Suche über die korrekte Verknüpfung
        },
      });

      if (!targetHabit) {
        // 3.2 Erstellt die persönliche Habit-Instanz aus dem Template
        const habitData = {
          userId: TEST_USER_ID,
          name: template.name,
          description: template.description,
          frequency: template.frequency,
          predefinedHabitId: template.id, // ⚠️ Verknüpfung setzen
        };

        targetHabit = await prisma.habit.create({ data: habitData });
        console.log(` Habit "${targetHabit.name}" (Vorlage #${template.id}) für Nutzer erstellt.`);
      } else {
        console.log(`Habit "${template.name}" existiert bereits für Nutzer.`);
      }

      // 3.3 HabitEntry für HEUTE erstellen/prüfen (mit korrigiertem Datum)
      const entryExists = await prisma.habitEntry.findFirst({
        where: {
          habitId: targetHabit.id,
          date: todayUTC, // Korrekte Abfrage auf Mitternacht UTC
        },
      });

      if (!entryExists) {
        await prisma.habitEntry.create({
          data: {
            habitId: targetHabit.id,
            date: todayUTC, // Korrigiertes Datum
            status: false,
            note: `Seed-Eintrag für ${targetHabit.name}.`,
            userId: TEST_USER_ID,
          },
        });
        console.log(`  -> HabitEntry für ${targetHabit.name} (heute) erstellt.`);
      }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });