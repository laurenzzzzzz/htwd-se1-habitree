// firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyDqXmOdrXfAFYrZHXA1OZEm9biY9bJw75g',
  authDomain: 'habit-tracker-3fed1.firebaseapp.com',
  projectId: 'habit-tracker-3fed1',
  storageBucket: 'habit-tracker-3fed1.appspot.com', // ✅ hier war ein Tippfehler mit .app!
  messagingSenderId: '1043710313852',
  appId: '1:1043710313852:web:66bfb474a15205cf4e50f9',
  measurementId: 'G-24X1HQV1KC',
};

const app = initializeApp(firebaseConfig);

// ✅ authInstance darf NICHT im Modul-Scope initialisiert werden
let _auth: Auth | null = null;

export async function getAuthSafe(): Promise<Auth> {
  if (_auth) return _auth;

  if (Platform.OS !== 'web') {
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    _auth = getAuth(app);
  }

  return _auth;
}
