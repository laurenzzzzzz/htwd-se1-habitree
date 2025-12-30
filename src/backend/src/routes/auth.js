import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyJwtToken } from '../middleware/authMiddleware.js';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_fallback_key'; 
const SALT_ROUNDS = 10; // Empfohlene Runden für bcrypt

// POST /auth/register: Neuen Benutzer registrieren
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
    }

    try {
        // 1. Passwort hashen
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // 2. Nutzer in Datenbank erstellen
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                username: username || email.split('@')[0], // Standard-Username
            },
        });

        // 3. JWT mit der neuen User-ID und E-Mail erstellen
        const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Registrierung erfolgreich.',
            token, 
            user: {
            userId: user.id,
            email: user.email,
            username: user.username,
            }
        });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Diese E-Mail-Adresse ist bereits registriert.' });
        }
        console.error('Fehler bei der Registrierung:', error);
        res.status(500).json({ error: 'Serverfehler bei der Registrierung.' });
    }
});


// POST /auth/login: Benutzer anmelden
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Nutzer finden
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Ungültige E-Mail oder Passwort.' });
        }

        // 2. Passwort vergleichen
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Ungültige E-Mail oder Passwort.' });
        }

        // 3. JWT erstellen und senden
        const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            message: 'Login erfolgreich',
            token, 
            user:{
            userId: user.id,
            email: user.email,
            username: user.username,
        }
        });

    } catch (error) {
        console.error('Fehler beim Login:', error);
        res.status(500).json({ error: 'Serverfehler beim Login.' });
    }
});

router.put('/password', verifyJwtToken, async (req, res) => {
    // userId kommt von der verifyJwtToken Middleware
    const userId = req.user.id; 
    const { oldPassword, newPassword } = req.body;

    // 1. Validierung
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Altes und neues Passwort sind erforderlich.' });
    }
    // Zusätzliche Validierung für das neue Passwort
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Das neue Passwort muss mindestens 6 Zeichen lang sein.' });
    }
    
    try {
        // 2. Benutzer aus der Datenbank abrufen
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
        }

        // 3. Altes Passwort vergleichen
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Falsches altes Passwort.' });
        }

        // 4. Neues Passwort hashen
        const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // 5. Passwort in der Datenbank aktualisieren
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        // 6. Erfolg zurückmelden
        res.json({ message: 'Passwort erfolgreich geändert.' });

    } catch (error) {
        console.error('SERVER FEHLER beim Aktualisieren des Passworts:', error);
        res.status(500).json({ error: 'Serverfehler beim Aktualisieren des Passworts.' });
    }
});
export default router;