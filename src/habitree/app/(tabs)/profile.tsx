import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
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

// --- AUTH UND API KONSTANTEN ---
const AUTH_TOKEN_KEY = 'userAuthToken';
const USER_DATA_KEY = 'currentAuthUser';
const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';

// --- TYPEN ---
type CurrentUser = { id: number; email: string; username: string };

// --- SECURE STORE FUNKTIONEN ---
const loadAuthData = async (): Promise<{ token: string | null; user: CurrentUser | null }> => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  const userJson = await SecureStore.getItemAsync(USER_DATA_KEY);
  let user: CurrentUser | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (e) {
      console.error('Fehler beim Parsen der User-Daten:', e);
    }
  }
  return { token, user };
};

const saveAuthData = async (token: string, user: CurrentUser) => {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
};

const deleteAuthData = async () => {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_DATA_KEY);
};

// --- BENACHRICHTIGUNGSHANDLER ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false, 
    shouldShowList: false,
  }),
});

// --- HAUPTKOMPONENTE ---
export default function ProfileScreen() {
  const navigation = useNavigation();
  const systemColorScheme = useColorScheme();

  // --- AUTH STATES ---
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

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

  // --- AUTHENTIFIZIERUNG PRÜFEN ---
  useFocusEffect(
    useCallback(() => {
      const checkStoredAuth = async () => {
        setIsLoadingAuth(true);
        const { token, user } = await loadAuthData();
        if (token && user) {
          setAuthToken(token);
          setCurrentUser(user);
          setIsLoggedIn(true);
        } else {
          setAuthToken(null);
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
        setIsLoadingAuth(false);
      };
      checkStoredAuth();
    }, [])
  );

  // --- LOGOUT ---
  const handleLogout = async () => {
    setIsLoadingAuth(true);
    await deleteAuthData();
    setAuthToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsLoadingAuth(false);
    navigation.navigate('index' as never);
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

      setCurrentUser(updatedUser);
      await saveAuthData(authToken, updatedUser);

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
        <ThemedText type="title" style={{ marginBottom: 20 }}>
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

// --- STYLES ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerImage: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    height: 300,
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
