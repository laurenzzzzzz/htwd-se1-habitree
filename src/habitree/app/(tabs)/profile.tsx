import React, { useState } from 'react';
import { useColorScheme, Alert, TextInput, Switch, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

export default function TabTwoScreen() {
  const systemColorScheme = useColorScheme();
  
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [tagesMotivationEnabled, setTagesMotivationEnabled] = useState(false);
  const [taeglicheErinnerungEnabled, setTaeglicheErinnerungEnabled] = useState(false);
  const [oeffentlichesProfilEnabled, setOeffentlichesProfilEnabled] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleTagesMotivation = () => setTagesMotivationEnabled((prev) => !prev);
  const toggleTaeglicheErinnerung = () => setTaeglicheErinnerungEnabled((prev) => !prev);
  const toggleOeffentlichesProfil = () => setOeffentlichesProfilEnabled((prev) => !prev);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogin = async () => {
    try {
      //const userCredential = await signInWithEmailAndPassword(auth, email, password);
      //const token = await userCredential.user.getIdToken();
      //console.log('Login erfolgreich, Token:', token);

      // 🔍 Nutzerexistenz im Backend prüfen
      const res = await fetch('http://iseproject01.informatik.htw-dresden.de:8000/user/check', {
        method: 'GET',
        headers: {
          //Authorization: `Bearer ${token}`,
        },
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
          66 Tage – so lange dauert es im Schnitt, bis eine Handlung zur Gewohnheit wird. Unsere App begleitet dich auf diesem Weg und feiert deine Erfolge – für echte, nachhaltige Veränderung. </ThemedText>
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

        {/* Nur hier Trennlinie */}
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
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12 }}
            />
            <TextInput
              placeholder="Passwort"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12 }}
            />
            <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
              <ThemedText style={styles.authButtonText}>Login</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.authButton} onPress={() => setShowLoginForm(true)}>
            <ThemedText style={styles.authButtonText}>Anmelden</ThemedText>
          </TouchableOpacity>
        )}
      
            <TouchableOpacity style={styles.authButton} onPress={() => console.log('Registrieren gedrückt')}>
          <ThemedText style={styles.authButtonText}>Registrieren</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  headerImage: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    height: 300,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  friendsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberSince: {
  fontSize: 14,
  color: '#888',
},
});

