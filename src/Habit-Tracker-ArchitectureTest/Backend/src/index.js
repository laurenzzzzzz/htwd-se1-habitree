import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './utils/firebase.js';
import habitsRoutes from './routes/habits.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth (optional aktuell, da 1 User)
app.use(authMiddleware);

// Habits-Routen aktivieren
app.use('/habits', habitsRoutes);

// Root-Route zum Testen
app.get('/', (req, res) => {
  res.send('API ist online');
});

app.listen(process.env.PORT, () =>
  console.log(`Server läuft auf http://localhost:${process.env.PORT}`)
);
