import React, { useState } from 'react';
import { useAuthController } from '../../presentation/controllers/useAuthController';
import { AuthForm } from '../../presentation/ui/AuthForm';
import {
  Pressable,
  View,
  Text,
  Image,
  Alert,
} from 'react-native';
// Removed unused useAuth import (login handled via useAuthController)
import { styles } from '../../styles/login_style';

// --- LOGIN/REGISTER LOGIK UND UI (aus index.tsx verschoben) ---
export default function LoginScreen() {
  // States für die Eingabefelder (aus index.tsx extrahiert)
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const { login, register, isProcessing } = useAuthController();


  const handleLogin = async () => {
    try {
      await login(authEmail, authPassword);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login fehlgeschlagen', 'Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.');
    }
  };

  const handleRegister = async () => {
    try {
      await register(authUsername, authEmail, authPassword);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Die Registrierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.';
      Alert.alert('Registrierung fehlgeschlagen', errorMessage);
    }
  };


  return (
    <View style={styles.container}>
      

      <Image 
        source={require('../../assets/images/header.png')}
        style={styles.logo} // Definiere 'logo' in login_style.ts
      /> 
 
      {/*<Text style={styles.title}>{isRegisterMode ? 'Konto erstellen' : 'Anmelden'}</Text>*/}

      <AuthForm
        email={authEmail}
        password={authPassword}
        username={authUsername}
        isRegisterMode={isRegisterMode}
        onChangeEmail={setAuthEmail}
        onChangePassword={setAuthPassword}
        onChangeUsername={setAuthUsername}
        onSubmit={isRegisterMode ? handleRegister : handleLogin}
        isProcessing={isProcessing}
      />

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