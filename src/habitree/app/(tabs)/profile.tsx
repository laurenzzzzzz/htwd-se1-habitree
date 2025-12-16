import React, { useState, useEffect, useCallback } from 'react';

import {
  useColorScheme,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Button,
  View,
} from 'react-native';

import { Image } from 'expo-image';
import ParallaxScrollView from '@/presentation/ui/ParallaxScrollView';
import { ThemedText } from '@/presentation/ui/ThemedText';
import { ThemedView } from '@/presentation/ui/ThemedView';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useProfileController } from '../../presentation/controllers/useProfileController';
import { ProfileSettings } from '../../presentation/ui/ProfileSettings';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/profile_style';
// --- AUTH UND API KONSTANTEN ---

// --- BENACHRICHTIGUNGSHANDLER ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, // Ob ein Banner angezeigt werden soll (oben auf dem Bildschirm)
    shouldShowList: true,   // Ob in der Benachrichtigungsliste angezeigt werden soll
  }),
});

// --- HAUPTKOMPONENTE ---
export default function ProfileScreen() {
  // const systemColorScheme = useColorScheme();

  const { isLoggedIn, currentUser, authToken, signOut } = useAuth();

  const { updateUsername, updatePassword: updatePasswordController, isUpdatingUsername, isUpdatingPassword } = useProfileController();

  // --- PROFILEINSTELLUNGEN ---
  const [tagesMotivationEnabled, setTagesMotivationEnabled] = useState(false);
  const [taeglicheErinnerungEnabled, setTaeglicheErinnerungEnabled] = useState(false);
  //const [oeffentlichesProfilEnabled, setOeffentlichesProfilEnabled] = useState(false);

  // --- MODAL-STATES ---
  const [isUpdateUsernameModalVisible, setIsUpdateUsernameModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
  const toggleTaeglicheErinnerung = () => setTaeglicheErinnerungEnabled((prev) => !prev);
  //const toggleOeffentlichesProfil = () => setOeffentlichesProfilEnabled((prev) => !prev);
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

    try {
      const updatedUser = await updateUsername(newUsername);
      Alert.alert('Erfolg', `Benutzername geändert zu '${updatedUser.username}'.`);
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      Alert.alert('Fehler', 'Fehler beim Speichern. Name eventuell vergeben?');
    } finally {
      setIsUpdateUsernameModalVisible(false);
      setNewUsername('');
    }
  };

  // --- PASSWORT ÄNDERN ---
  const handleUpdatePassword = useCallback(async () => {
    if (!authToken) {
      Alert.alert('Fehler', 'Nicht authentifiziert.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
    try {
      const res = await updatePasswordController(oldPassword, newPassword);
      Alert.alert('Erfolg', res.message || 'Passwort erfolgreich geändert.');
      setOldPassword('');
      setNewPassword('');
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      Alert.alert('Fehler', 'Fehler beim Ändern des Passworts.');
    }
  }, [authToken, oldPassword, newPassword, updatePasswordController]);

  // --- NICHT EINGELOGGT ---
  if (!isLoggedIn) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="title" style={styles.loadingTitle} >
          Anmeldung erforderlich
        </ThemedText>
        <ThemedText style={styles.loadingText}>
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
              style={styles.input}
              onChangeText={setNewUsername}
              value={newUsername}
              placeholder="Neuer Benutzername"
              placeholderTextColor="#888"
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
              <ActivityIndicator style={styles.activityIndicator} size="small" color="rgb(25, 145, 137)" />
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
              placeholderTextColor="#888"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              style={styles.input}
            />

            <TextInput
              placeholder="Neues Passwort (min. 6 Zeichen)"
              placeholderTextColor="#888"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <Button title="Abbrechen" onPress={() => setIsPasswordModalVisible(false)} />
              <Button
                title={isUpdatingPassword ? 'Aktualisiere...' : 'Speichern'}
                onPress={handleUpdatePassword}
                disabled={
                  isUpdatingPassword ||
                  oldPassword.trim() === '' ||
                  newPassword.trim().length < 6
                }
                color="rgb(25, 145, 137)"
              />
            </View>
            {isUpdatingPassword && (
              <ActivityIndicator style={styles.activityIndicator} size="small" color="rgb(25, 145, 137)" />
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
          <ProfileSettings
            //isDarkMode={isDarkMode}
            //onToggleDarkMode={toggleDarkMode}
            tagesMotivationEnabled={tagesMotivationEnabled}
            onToggleTagesMotivation={toggleTagesMotivation}
            taeglicheErinnerungEnabled={taeglicheErinnerungEnabled}
            onToggleTaeglicheErinnerung={toggleTaeglicheErinnerung}
            //oeffentlichesProfilEnabled={oeffentlichesProfilEnabled}
            //onToggleOeffentlichesProfil={toggleOeffentlichesProfil}
            onChangeUsername={() => { setNewUsername(currentUser?.username || ''); setIsUpdateUsernameModalVisible(true); }}
            onChangePassword={() => { setOldPassword(''); setNewPassword(''); setIsPasswordModalVisible(true); }}
            onLogout={handleLogout}
          />
         
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
