import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  // Hardcoded user-Daten (Token wird ignoriert)
  req.user = {
    uid: 'test-user-id',
    email: 'test@example.com',
    name: 'Test Benutzer',
    role: 'admin',
  };

  next(); // gehe zur nächsten Middleware oder Route
};
