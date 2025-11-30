import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  Image, // <-- Wichtig: Image-Komponente importieren (ist bereits in deinem Original-Code enthalten)
} from 'react-native';
import { useAuth, CurrentUser } from '../../context/AuthContext';
import { styles } from '../../styles/login_style';

// --- AUTH UND API KONSTANTEN & TYPEN (aus index.tsx und profile.tsx extrahiert) ---
const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

// --- LOGIN/REGISTER LOGIK UND UI (aus index.tsx verschoben) ---
export default function LoginScreen() {
  const router = useRouter();

  // States für die Eingabefelder (aus index.tsx extrahiert)
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const { signIn } = useAuth()!; // Verwenden Sie den Auth-Hook


  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: authEmail,
        password: authPassword,
      });

      const { token, user } = response.data;
      const currentUser: CurrentUser = {
          id: user.id,
          email: user.email,
          username: user.username
      };

      // Jetzt verwenden wir die globale signIn-Funktion
      await signIn(token, currentUser);

      // Die Weiterleitung erfolgt nun automatisch über das Root-Layout (_layout.tsx)
      // Wenn Sie sicher gehen wollen:
      // router.replace('/(tabs)');

    } catch (error) {
        console.error('Login error:', error);
        Alert.alert(
          'Login fehlgeschlagen',
          'Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.'
        );
      } finally {
        setIsAuthenticating(false);
      }
    };

  const handleRegister = async () => {
    setIsAuthenticating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
        username: authUsername,
        email: authEmail,
        password: authPassword,
      });

      const { token, user } = response.data;
      const currentUser: CurrentUser = {
        id: user.id,
        email: user.email,
        username: user.username
      };

      // Jetzt verwenden wir die globale signIn-Funktion
      await signIn(token, currentUser);

      // Weiterleitung erfolgt über Root-Layout
      // router.replace('/(tabs)');

    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Die Registrierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.';
        if (axios.isAxiosError(error) && error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
        }

        Alert.alert('Registrierung fehlgeschlagen', errorMessage);

    } finally {
      setIsAuthenticating(false);
    }
  };


  return (
    <View style={styles.container}>
      

      <Image 
        source={require('../../assets/images/header.png')}
        style={styles.logo} // Definiere 'logo' in login_style.ts
      /> 
 
      {/*<Text style={styles.title}>{isRegisterMode ? 'Konto erstellen' : 'Anmelden'}</Text>*/}

      {isRegisterMode && (
        <TextInput
          style={styles.input}
          placeholder="Benutzername"
          value={authUsername}
          onChangeText={setAuthUsername}
          autoCapitalize="none"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        value={authEmail}
        onChangeText={setAuthEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Passwort"
        value={authPassword}
        onChangeText={setAuthPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.authButton}
        onPress={isRegisterMode ? handleRegister : handleLogin}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.authButtonText}>
            {isRegisterMode ? 'Registrieren & Anmelden' : 'Anmelden'}
          </Text>
        )}
      </TouchableOpacity>

      <Pressable onPress={() => setIsRegisterMode(prev => !prev)}>
        <Text style={styles.switchButtonText}>
          {isRegisterMode
            ? 'Sie haben bereits ein Konto? Zur Anmeldung'
            : 'Sie haben noch kein Konto? Jetzt registrieren'}
        </Text>
      </Pressable>

    </View>
  );
}