import React from 'react'; // <-- Default Import
import { useState, useEffect } from 'react'; // <-- Benannte Exporte (Hooks)


import { Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');


import {
  useColorScheme,
  Alert,
  TextInput,
  Switch,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

// Neue Imports für Notifications
import * as Notifications from 'expo-notifications';

// Notification-Handler konfigurieren, damit Alerts auch im Vordergrund angezeigt werden
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function TabTwoScreen() {
  const systemColorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [tagesMotivationEnabled, setTagesMotivationEnabled] = useState(false);
  const [taeglicheErinnerungEnabled, setTaeglicheErinnerungEnabled] = useState(false);
  const [oeffentlichesProfilEnabled, setOeffentlichesProfilEnabled] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  // 1. Notification-Permissions anfragen
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Keine Notification-Permissions erhalten!');
        }
      }
    })();
  }, []);

  // Toggle-Funktionen
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleTaeglicheErinnerung = () => setTaeglicheErinnerungEnabled((prev) => !prev);
  const toggleOeffentlichesProfil = () => setOeffentlichesProfilEnabled((prev) => !prev);

  // 2. Toggle Tagesmotivation mit Notification
  const toggleTagesMotivation = async () => {
    const newValue = !tagesMotivationEnabled;
    setTagesMotivationEnabled(newValue);

    if (newValue) {
      // Sofortige Push-Notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Tagesmotivation aktiviert',
          body: 'Bleib heute dran – du schaffst das! 💪',
        },
        trigger: null,
      });
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('http://iseproject01.informatik.htw-dresden.de:8000/user/check', {
        method: 'GET',
      });
      const data = await res.json();

      if (data.exists) {
        Alert.alert('Login erfolgreich', `Willkommen zurück, ${data.email}!`);
      } else {
        Alert.alert('Fehler', 'Der Nutzer ist nicht in der Datenbank registriert.');
      }
      setShowLoginForm(false);
    } catch (error: any) {
      console.error('Login fehlgeschlagen:', error);
      Alert.alert('Fehler', error.message || 'Unbekannter Fehler');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/profile.png')}
          style={styles.headerImage}
          contentFit="cover"
        />
      }
    >
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      <View>
        <ThemedText type="title">Calvin Striegler</ThemedText>
        <ThemedText style={styles.memberSince}>Mitglied seit April 2025</ThemedText>
      </View>

      {/* Informationssektion */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Information</ThemedText>
        <ThemedText>
          66 Tage – so lange dauert es im Schnitt, bis eine Handlung zur Gewohnheit wird. Unsere App begleitet dich auf diesem Weg und feiert deine Erfolge – für echte, nachhaltige Veränderung.
        </ThemedText>
      </ThemedView>

      {/* Freunde-Sektion */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Freunde</ThemedText>
        <View style={styles.friendsRow}>
          <Image source={require('@/assets/images/profil1.png')} style={styles.friendImage} />
          <Image source={require('@/assets/images/profil2.png')} style={styles.friendImage} />
          <Image source={require('@/assets/images/profil3.png')} style={styles.friendImage} />
        </View>
      </ThemedView>

      {/* Einstellungen */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Einstellungen</ThemedText>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Tagesmotivation</ThemedText>
          <Switch value={tagesMotivationEnabled} onValueChange={toggleTagesMotivation} />
        </ThemedView>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Tägliche Erinnerung</ThemedText>
          <Switch value={taeglicheErinnerungEnabled} onValueChange={toggleTaeglicheErinnerung} />
        </ThemedView>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </ThemedView>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Öffentliches Profil</ThemedText>
          <Switch value={oeffentlichesProfilEnabled} onValueChange={toggleOeffentlichesProfil} />
        </ThemedView>

        {/* Aktionen */}
        <TouchableOpacity
          style={[styles.settingRowButton, styles.settingRowTopBorder]}
          onPress={() => console.log('Namen ändern')}
        >
          <ThemedText>Benutzernamen ändern</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRowButton} onPress={() => console.log('Passwort ändern')}>
          <ThemedText>Passwort ändern</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRowButton} onPress={() => console.log('Profilbild ändern')}>
          <ThemedText>Profilbild ändern</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRowButton} onPress={() => console.log('Sprache ändern')}>
          <ThemedText>Sprache ändern</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Auth-Bereich */}
      <ThemedView style={styles.authButtonsContainer}>
        {showLoginForm ? (
          <View style={{ width: '100%', padding: 16 }}>
            <TextInput
              placeholder="E-Mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              placeholder="Passwort"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
              <ThemedText style={styles.authButtonText}>Login</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          
          <TouchableOpacity style={styles.authButton} onPress={() => setShowLoginForm(true)}>          
            <ThemedText style={styles.authButtonText}>Abmelden</ThemedText>      
          </TouchableOpacity>
          
          
        )}
         {/* 
        <TouchableOpacity style={styles.authButton} onPress={() => console.log('Registrieren gedrückt')}>
          <ThemedText style={styles.authButtonText}>Registrieren</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.authButton} onPress={() => console.log('Anmelden gedrückt')}>
          <ThemedText style={styles.authButtonText}>Anmelden</ThemedText>
        </TouchableOpacity>
        */}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    height: windowHeight * 0.3,
  },
  sectionContainer: {
    marginVertical: 20,
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingRowButton: {
    paddingVertical: 12,
  },
  settingRowTopBorder: {
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  authButtonsContainer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 12,
    paddingBottom: 40,
  },
  authButton: {
    backgroundColor: 'rgb(25, 145, 137)',
    paddingVertical: windowHeight * 0.012,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: windowWidth * 0.7,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  friendsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  friendImage: {
    width: windowWidth * 0.12,  // statt: 50
    height: windowWidth * 0.12,
    borderRadius: 25,
  },
  memberSince: {
    fontSize: 14,
    color: '#888',
  },
});
