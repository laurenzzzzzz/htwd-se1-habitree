import React, { useState, useEffect, useCallback } from 'react';

import { Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
import {
  useColorScheme,
  Switch,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Button,
} from 'react-native';
import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuth, CurrentUser } from '../../context/AuthContext';
import { styles } from '../../styles/profile_style';

// --- AUTH UND API KONSTANTEN ---
const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

// --- BENACHRICHTIGUNGSHANDLER ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // Diese beiden Eigenschaften beheben den Fehler:
    shouldShowBanner: true, // Ob ein Banner angezeigt werden soll (oben auf dem Bildschirm)
    shouldShowList: true,   // Ob in der Benachrichtigungsliste angezeigt werden soll
  }),
});

// --- HAUPTKOMPONENTE ---
export default function ProfileScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();

  const { 
    isLoggedIn, 
    currentUser, 
    authToken, 
    isLoading, // Für den Ladezustand des AuthContext
    signOut,   // Globale Logout-Funktion
    signIn     // Globale Login/Save-Funktion (wird für User-Updates wiederverwendet)
  } = useAuth();

  // --- PROFILEINSTELLUNGEN ---
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [tagesMotivationEnabled, setTagesMotivationEnabled] = useState(false);
  const [taeglicheErinnerungEnabled, setTaeglicheErinnerungEnabled] = useState(false);
  const [oeffentlichesProfilEnabled, setOeffentlichesProfilEnabled] = useState(false);

  // --- MODAL-STATES ---
  const [isUpdateUsernameModalVisible, setIsUpdateUsernameModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // --- NOTIFICATIONS ---
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Keine Notification-Permissions erhalten.');
        }
      }
    })();
  }, []);

  // --- LOGOUT ---
  const handleLogout = async () => {
    await signOut();
  
  };

  // --- TOGGLES ---
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleTaeglicheErinnerung = () => setTaeglicheErinnerungEnabled((prev) => !prev);
  const toggleOeffentlichesProfil = () => setOeffentlichesProfilEnabled((prev) => !prev);
  const toggleTagesMotivation = async () => {
    const newValue = !tagesMotivationEnabled;
    setTagesMotivationEnabled(newValue);
    if (newValue) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Tagesmotivation aktiviert',
          body: 'Bleib heute dran – du schaffst das!',
        },
        trigger: null,
      });
    }
  };

  // --- BENUTZERNAME ÄNDERN ---
  const handleUpdateUsername = async () => {
    if (!newUsername || newUsername.length < 3) {
      Alert.alert('Fehler', 'Der Benutzername muss mindestens 3 Zeichen lang sein.');
      return;
    }
    if (!authToken || !currentUser) {
      Alert.alert('Fehler', 'Nicht angemeldet.');
      setIsUpdateUsernameModalVisible(false);
      return;
    }

    setIsUpdatingUsername(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/username`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const updatedUser = {
        ...currentUser,
        username: response.data.username || newUsername,
      };

      await signIn(authToken, updatedUser);

      Alert.alert('Erfolg', `Benutzername geändert zu '${updatedUser.username}'.`);
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Fehler beim Speichern. Name eventuell vergeben?';
      Alert.alert('Fehler', errorMessage);
    } finally {
      setIsUpdatingUsername(false);
      setIsUpdateUsernameModalVisible(false);
      setNewUsername('');
    }
  };

  // --- PASSWORT ÄNDERN ---
  const updatePassword = useCallback(async () => {
    if (!authToken) {
      Alert.alert('Fehler', 'Nicht authentifiziert.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      Alert.alert('Erfolg', response.data.message || 'Passwort erfolgreich geändert.');
      setOldPassword('');
      setNewPassword('');
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Fehler beim Ändern des Passworts.';
      Alert.alert('Fehler', errorMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  }, [authToken, oldPassword, newPassword]);

  // --- NICHT EINGELOGGT ---
  if (!isLoggedIn) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="title" style={{ marginBottom: 20, textAlign: 'center' }} >
          Anmeldung erforderlich
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', marginHorizontal: 30, opacity: 0.8 }}>
          Bitte wechsle zum Home-Tab, um dich anzumelden oder zu registrieren.
        </ThemedText>
      </ThemedView>
    );
  }

  // --- UI ---
  return (
    <>
      {/* Benutzername ändern */}
      <Modal
        animationType="fade"
        transparent
        visible={isUpdateUsernameModalVisible}
        onRequestClose={() => setIsUpdateUsernameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Benutzernamen ändern
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  color: isDarkMode ? '#fff' : '#000',
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                },
              ]}
              onChangeText={setNewUsername}
              value={newUsername}
              placeholder="Neuer Benutzername"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              editable={!isUpdatingUsername}
              autoCapitalize="none"
            />
            <View style={styles.buttonRow}>
              <Button title="Abbrechen" onPress={() => setIsUpdateUsernameModalVisible(false)} />
              <Button
                title={isUpdatingUsername ? 'Speichere...' : 'Speichern'}
                onPress={handleUpdateUsername}
                disabled={isUpdatingUsername || newUsername.length < 3}
                color="rgb(25, 145, 137)"
              />
            </View>
            {isUpdatingUsername && (
              <ActivityIndicator style={{ marginTop: 20 }} size="small" color="rgb(25, 145, 137)" />
            )}
          </ThemedView>
        </View>
      </Modal>

      {/* Passwort ändern */}
      <Modal
        animationType="fade"
        transparent
        visible={isPasswordModalVisible}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Passwort ändern
            </ThemedText>

            <TextInput
              placeholder="Altes Passwort"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              style={[
                styles.input,
                {
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  color: isDarkMode ? '#fff' : '#000',
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                },
              ]}
            />

            <TextInput
              placeholder="Neues Passwort (min. 6 Zeichen)"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={[
                styles.input,
                {
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  color: isDarkMode ? '#fff' : '#000',
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                },
              ]}
            />

            <View style={styles.buttonRow}>
              <Button title="Abbrechen" onPress={() => setIsPasswordModalVisible(false)} />
              <Button
                title={isUpdatingPassword ? 'Aktualisiere...' : 'Speichern'}
                onPress={updatePassword}
                disabled={
                  isUpdatingPassword ||
                  oldPassword.trim() === '' ||
                  newPassword.trim().length < 6
                }
                color="rgb(25, 145, 137)"
              />
            </View>
            {isUpdatingPassword && (
              <ActivityIndicator style={{ marginTop: 20 }} size="small" color="rgb(25, 145, 137)" />
            )}
          </ThemedView>
        </View>
      </Modal>

      {/* Hauptinhalt */}
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
          <ThemedText type="title">
            {currentUser?.username || currentUser?.email || 'Dein Profil'}
          </ThemedText>
          <ThemedText style={styles.memberSince}>Angemeldet als: {currentUser?.email}</ThemedText>
        </View>

        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Information</ThemedText>
          <ThemedText>
            66 Tage – so lange dauert es im Schnitt, bis eine Handlung zur Gewohnheit wird.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Freunde</ThemedText>
          <View style={styles.friendsRow}>
            <Image source={require('@/assets/images/profil1.png')} style={styles.friendImage} />
            <Image source={require('@/assets/images/profil2.png')} style={styles.friendImage} />
            <Image source={require('@/assets/images/profil3.png')} style={styles.friendImage} />
          </View>
        </ThemedView>

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

          <TouchableOpacity
            style={[styles.settingRowButton, styles.settingRowTopBorder]}
            onPress={() => {
              setNewUsername(currentUser?.username || '');
              setIsUpdateUsernameModalVisible(true);
            }}
          >
            <ThemedText>Benutzernamen ändern</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRowButton}
            onPress={() => {
              setOldPassword('');
              setNewPassword('');
              setIsPasswordModalVisible(true);
            }}
          >
            <ThemedText>Passwort ändern</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRowButton}>
            <ThemedText>Profilbild ändern</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRowButton}>
            <ThemedText>Sprache ändern</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.authButtonsContainer}>
          <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
            <ThemedText style={styles.authButtonText}>Abmelden</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
