// routes/quotes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /quotes – alle Quotes abrufen 
router.get('/', async (req, res) => {
  try {
    const quotes = await prisma.quote.findMany();
    console.log(` Gefundene Quotes: ${quotes.length}`);
    res.json(quotes);
  } catch (err) {
    console.error(' Fehler beim Abrufen der Quotes:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Quotes' });
  }
});

export default router;