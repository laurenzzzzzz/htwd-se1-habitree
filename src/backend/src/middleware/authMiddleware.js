import jwt from 'jsonwebtoken'; // NEU: JWT importieren
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
// Lese den Secret aus der .env oder nutze den gleichen Fallback wie in auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_fallback_key'; 

// Funktion umbenannt und Logik ersetzt
export async function verifyJwtToken(req, res, next) { 
    let token = null;

    // 1. Token aus dem Authorization Header abrufen
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split('Bearer ')[1];
    }
    
    // (Optional: Entferne den Query-Parameter-Versuch, da JWTs nicht in Query-Params gehören)

    if (!token) {
        return res.status(401).json({ message: 'Authentifizierung fehlgeschlagen: Token fehlt.' });
    }

    try {
        // 2. Token verifizieren
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId; // userId ist jetzt ein Integer
        
        // 3. User-Objekt abrufen und an den Request anhängen (zur Sicherheit)
        const user = await prisma.user.findUnique({ 
            where: { id: userId },
            select: { id: true, email: true, username: true }
        });
        
        if (!user) {
             return res.status(401).json({ message: 'Authentifizierung fehlgeschlagen: Ungültiger Benutzer im Token.' });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.error('JWT Verifizierungsfehler:', error.message);
        // Error wird geworfen, wenn Token abgelaufen oder ungültig ist
        return res.status(401).json({ message: 'Authentifizierung fehlgeschlagen: Ungültiger oder abgelaufener Token.' });
    }
}