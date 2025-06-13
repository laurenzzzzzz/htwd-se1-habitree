import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /habits – alle Habits (für einen einzigen User)
router.get('/', async (req, res) => {
  try {
    const habits = await prisma.habit.findMany();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Habits' });
  }
});

// POST /habits – neuen Habit hinzufügen
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name ist erforderlich' });
  }

  try {
    const habit = await prisma.habit.create({
      data: { name },
    });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Habits' });
  }
});

export default router;
