/**
 * Startpunkt des Express-Servers: bindet Routen, Auth-Middleware und Cronjobs.
 */
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
import cron from 'node-cron';

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


// Health-Check-Route für Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root-Route zum Testen (öffentlich)
app.get('/', (req, res) => {
  res.send('API ist online');
});

//Quotes-Route (öffentlich)
app.use('/quotes', quotesRoutes);

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

console.log('process.env.PORT:', process.env.PORT);
console.log('Verwendeter PORT:', PORT);

// Display "localhost" when running against the local compose `db` service
const inferDisplayHost = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  if (dbUrl.includes('@db:') || dbUrl.includes('@db:5432')) return 'localhost';
  if (process.env.HOST_DISPLAY) return process.env.HOST_DISPLAY;
  return 'iseproject01.informatik.htw-dresden.de';
};

app.listen(PORT, HOST, async () => {
  const displayHost = inferDisplayHost();
  console.log(`Server läuft auf http://${displayHost}:${PORT}`);

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