import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyJwtToken } from './middleware/authMiddleware.js'; 
import habitsRoutes from './routes/habits.js';
import userRoutes from './routes/user.js';
import { createDailyHabitEntries } from './utils/generateDailyEntries.js';
import { recalculateStreaks } from './utils/streak.js';
import authRoutes from './routes/auth.js'; 
import quotesRoutes from './routes/quotes.js'; 
import cron from 'node-cron'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//Auth-Routen für Login/Register
app.use('/auth', authRoutes); 

// User-Routen (einige benötigen Auth, andere nicht. /user/status benötigt jetzt Auth)
app.use('/user', userRoutes);

// Auth-Middleware für alle Routen, die Auth benötigen
app.use('/habits', verifyJwtToken, habitsRoutes);

// Root-Route zum Testen (öffentlich)
app.get('/', (req, res) => {
  res.send('API ist online');
});

//Quotes-Route (öffentlich)
app.use('/quotes', quotesRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`Server läuft auf http://iseproject01.informatik.htw-dresden.de:${PORT}`);

  await createDailyHabitEntries();

  // Neu: Streaks neu berechnen (von heute rückwärts zählen)
  await recalculateStreaks();

  // Cron-Job: Täglich um 00:01 Uhr (kurz nach Mitternacht)
  cron.schedule('1 0 * * *', async () => {
    await createDailyHabitEntries();
    await recalculateStreaks();
  },{
    timezone: "Europe/Berlin"
  });
});