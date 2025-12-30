/**
 * Vorlage für neue Express-Routenmodule.
 * @module routes/express_routes_template
 */
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /__models__ – alle Einträge abrufen
router.get('/', async (req, res) => {
  try {
    const data = await prisma.__model__.findMany();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der __models__' });
  }
});

// POST /__models__ – neuen Eintrag erstellen
router.post('/', async (req, res) => {
  const { __field1__, __field2__, __field3__ } = req.body;

  // Beispielhafte Validierung
  if (!__field1__ || !__field2__) {
    return res.status(400).json({ error: '__field1__ und __field2__ sind erforderlich' });
  }

  try {
    const newEntry = await prisma.__model__.create({
      data: {
        __field1__,
        __field2__,
        __field3__: __field3__ ?? __default__, // Optional mit Fallback
      },
    });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen des Eintrags' });
  }
});

// PUT /__models__/:id – bestehenden Eintrag aktualisieren
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { __field1__, __field2__, __field3__ } = req.body;

  try {
    const updatedEntry = await prisma.__model__.update({
      where: { id: Number(id) },
      data: {
        __field1__,
        __field2__,
        __field3__,
      },
    });
    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Eintrags' });
  }
});

// DELETE /__models__/:id – Eintrag löschen
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.__model__.delete({
      where: { id: Number(id) },
    });
    res.json({ message: '__Model__ erfolgreich gelöscht' });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen des Eintrags' });
  }
});

export default router;
