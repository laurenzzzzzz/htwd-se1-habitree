/**
 * Benutzerbezogene Routen (Status, Streak, Username).
 * @module routes/user
 */
import express from 'express';
import { verifyJwtToken } from '../middleware/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Gibt den Login-Status des aktuellen Nutzers zurück.
 * @function getUserStatus
 * @async
 * @param {express.Request} req - JWT liefert `req.user` mit `id`, `email`, `username`.
 * @param {express.Response} res - Antwort mit Statusobjekt.
 * @returns {Promise<void>}
 */
router.get('/status', verifyJwtToken, async (req, res) => {

    // req.user enthält jetzt die User-ID (Int), Email und Username
    res.json({ 
        isLoggedIn: true, 
        userId: req.user.id,
        email: req.user.email,
        username: req.user.username 
    });
});


/**
 * Liefert Streak-Informationen des aktuellen Nutzers.
 * @function getUserStreak
 * @async
 * @param {express.Request} req - JWT liefert `req.user.id`.
 * @param {express.Response} res - Antwort mit `currentStreak` und `maxStreak` oder Fehler.
 * @returns {Promise<void>}
 */
router.get('/streak', verifyJwtToken, async (req, res) => {
  try {
    const userId = req.user.id; // Kommt aus dem JWT-Token

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        currentStreak: true,
        maxStreak: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    res.json({
      userId: user.id,
      currentStreak: user.currentStreak || 0,
      maxStreak: user.maxStreak || 0,
      lastCompletionDate: new Date(), // Optional: könnte auch aus DB gelesen werden
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Streak:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Streak' });
  }
});

/**
 * Aktualisiert den Benutzernamen des eingeloggten Nutzers.
 * @function updateUsername
 * @async
 * @param {express.Request} req - Erwartet `username` im Body; JWT liefert `req.user.id`.
 * @param {express.Response} res - Antwort mit aktualisierten Userdaten oder Fehler.
 * @returns {Promise<void>}
 */
router.put('/username', verifyJwtToken, async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ error: 'Ungültiger Benutzername. Mindestens 3 Zeichen erforderlich.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username: username.trim() },
    });

    return res.json({
      message: 'Benutzername erfolgreich aktualisiert.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
      },
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzernamens:', error);
    return res.status(500).json({ error: 'Serverfehler beim Aktualisieren des Benutzernamens.' });
  }
});

export default router;