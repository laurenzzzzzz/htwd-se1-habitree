/**
 * Quote-Routen (öffentlich).
 * @module routes/quotes
 */
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Liefert alle Zitate.
 * @function listQuotes
 * @async
 * @param {express.Request} req - Keine Parameter erforderlich.
 * @param {express.Response} res - Antwort mit Quote-Liste oder Fehler.
 * @returns {Promise<void>}
 */
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