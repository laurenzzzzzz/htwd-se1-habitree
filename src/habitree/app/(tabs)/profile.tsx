import React, { useState, useEffect, useCallback, useMemo } from 'react';

import {
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Button,
  View,
  useWindowDimensions,
} from 'react-native';
import type { ImageStyle } from 'react-native';

import { Image } from 'expo-image';
import ParallaxScrollView from '@/presentation/ui/ParallaxScrollView';
import { ThemedText } from '@/presentation/ui/ThemedText';
import { ThemedView } from '@/presentation/ui/ThemedView';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useProfileController } from '../../presentation/controllers/useProfileController';
import { ProfileSettings } from '../../presentation/ui/ProfileSettings';
import { useAuth } from '../../context/AuthContext';
import { createProfileStyles } from '../../styles/profile_style';
import { Colors } from '../../constants/Colors';
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
  const { isLoggedIn, currentUser, authToken, signOut } = useAuth();
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => createProfileStyles(width, height), [width, height]);

  const { updateUsername, updatePassword: updatePasswordController, isUpdatingUsername, isUpdatingPassword } = useProfileController();

  // --- PROFILEINSTELLUNGEN ---
  const [habitPushReminderEnabled, setHabitPushReminderEnabled] = useState(false);
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
  const toggleHabitPushReminder = useCallback(async () => {
    const newValue = !habitPushReminderEnabled;
    setHabitPushReminderEnabled(newValue);

    try {
      if (!newValue) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } else {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }
    } catch (error) {
      console.warn('toggleHabitPushReminder failed', error);
    }
  }, [habitPushReminderEnabled]);
  //const toggleOeffentlichesProfil = () => setOeffentlichesProfilEnabled((prev) => !prev);

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
                color={Colors.light.accent}
              />
            </View>
            {isUpdatingUsername && (
              <ActivityIndicator style={styles.activityIndicator} size="small" color={Colors.light.accent} />
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
                color={Colors.light.accent}
              />
            </View>
            {isUpdatingPassword && (
              <ActivityIndicator style={styles.activityIndicator} size="small" color={Colors.light.accent} />
            )}
          </ThemedView>
        </View>
      </Modal>

      {/* Hauptinhalt */}
      <ParallaxScrollView
        headerBackgroundColor={{ light: Colors.light.background, dark: Colors.dark.background }}
        headerImage={
          <Image
            source={require('@/assets/images/profile.png')}
            style={styles.headerImage as ImageStyle}
            contentFit="cover"
          />
        }
      >
        <StatusBar style="dark" backgroundColor={Colors.light.background} />
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
            habitPushReminderEnabled={habitPushReminderEnabled}
            onToggleHabitPushReminder={toggleHabitPushReminder}
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
