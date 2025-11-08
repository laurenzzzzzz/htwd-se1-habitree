import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Image } from 'expo-image';
import axios from 'axios';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native'; // Wichtig für das Polling

// --- KONSTANTEN FÜR DEN TOKEN-SPEICHER ---
const AUTH_TOKEN_KEY = 'userAuthToken';
const USER_DATA_KEY = 'currentAuthUser'; 

// --- SecureStore Ladefunktion ---
type CurrentUser = { id: number; email: string; username: string };
const loadAuthData = async (): Promise<{ token: string | null, user: CurrentUser | null }> => {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(USER_DATA_KEY);
    let user: CurrentUser | null = null;
    if (userJson) {
        try {
            user = JSON.parse(userJson);
        } catch (e) {
            console.error("Fehler beim Parsen der User-Daten:", e);
        }
    }
    return { token, user };
};

// --- SecureStore Speicherfunktion ---
const saveAuthData = async (token: string, user: CurrentUser) => {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
};

// --- SecureStore Löschfunktion ---
const deleteAuthData = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
};

// Typen (wie in Ihrer Originaldatei)
type FilterKey = 'alle' | 'klimmzuege' | 'liegestuetze' | 'schritte';
type Habit = {
  id: number;
  name: string;
  description: string;
  frequency: string;
  entries: { id: number; date: string; status: boolean; note: string | null }[];
};
type Quote = {
  id: number;
  quote: string;
};


export default function HomeScreen() {

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  // ---------- API's ----------
  const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';
  const HABITS_API_URL = `${API_BASE_URL}/habits`;
  const QUOTES_API_URL = `${API_BASE_URL}/quotes`;
  const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
   const REGISTER_API_URL = `${API_BASE_URL}/auth/register`; 


  // ---------- AUTHENTIFIZIERUNGS-STATES ----------
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // ---------- HABIT STATES ----------
  const [habitMode, setHabitMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoadingHabits, setIsLoadingHabits] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  // --- Login Screen States (für den Home-Tab, wenn abgemeldet) ---
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  // ---------- States für Registrieung ----------
  const [isRegistering, setIsRegistering] = useState(false); 
  const [registerUsername, setRegisterUsername] = useState('');


  const today = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();




  // ---------- AUTHENTIFIZIERUNGS-LOGIK ----------

const checkLoginStatus = useCallback(async () => {
  setIsLoadingAuth(true);
  const { token, user } = await loadAuthData();

  setAuthToken(token);
  setCurrentUser(user);

  if (token) {
      // Prüfe den Token gegen das Backend (optional)
      try {
          
          setIsLoggedIn(true);
          /*
          const response = await axios.get(USER_STATUS_API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsLoggedIn(response.data.isLoggedIn);
            if (!response.data.isLoggedIn) {
                await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
                await SecureStore.deleteItemAsync(USER_DATA_KEY);
            }
          */
      } catch (error) {
          console.error("Token-Validierung fehlgeschlagen:", error);
          setIsLoggedIn(false);
          await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY); // Ungültigen Token löschen
          await SecureStore.deleteItemAsync(USER_DATA_KEY);
      }
  } else {
      setIsLoggedIn(false);
  }
  setIsLoadingAuth(false);
}, []);

// Führe die Prüfung nur einmal aus, wenn der Tab fokussiert wird
useFocusEffect(
  useCallback(() => {
    checkLoginStatus();
    // Entferne Polling: Es wird kein setInterval mehr benötigt
  }, [checkLoginStatus])
);
  
  // Polling/Re-Check, wenn der Home-Tab fokussiert wird oder initial lädt
  useFocusEffect(
    useCallback(() => {
      // 1. Status sofort prüfen
      checkLoginStatus();
    
      // Die Rückgabe-Funktion ist leer, da kein Timer aufgeräumt werden muss.
      return () => {
        // Cleanup-Funktion (wird beim Verlassen des Tabs ausgeführt)
      };
    }, [checkLoginStatus])
  );


  // --- Eigener Login-Handler für den Home-Tab (wenn abgemeldet) ---
  const handleHomeLogin = async () => {
    if (!authEmail || !authPassword) {
      setAuthMessage('Bitte E-Mail und Passwort eingeben.');
      return;
    }

    setIsLoadingLogin(true);
    setAuthMessage('');

    try {
      const response = await axios.post(LOGIN_API_URL, {
        email: authEmail.trim(),
        password: authPassword,
      });

      const { token, message, userId, email, username } = response.data;
      
      const user: CurrentUser = {
          id: userId,
          email: email,
          username: username || email.split('@')[0]
      };

      // *** Globale Speicherung (damit Profile.tsx den Login erkennt) ***
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));

      // Lokalen State aktualisieren
      setAuthToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);

      // UI aufräumen
      setAuthEmail('');
      setAuthPassword('');
      
      // Daten laden
      fetchQuote();
      fetchHabits(); 

    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data?.error || 'Unbekannter API-Fehler.')
        : 'Netzwerkfehler oder unerwarteter Fehler.';

      setAuthMessage(errorMessage);
    } finally {
      setIsLoadingLogin(false);
    }
  };

    const handleHomeRegister = async () => {
    if (!authEmail || !authPassword) {
      setAuthMessage('Bitte E-Mail und Passwort eingeben.');
      return;
    }

    setIsLoadingLogin(true); // Verwenden des gleichen Lade-States
    setAuthMessage('');

    try {
      // POST-Request zum Registrierungs-Endpunkt
      const response = await axios.post(REGISTER_API_URL, {
        email: authEmail.trim(),
        password: authPassword,
        username: registerUsername.trim() || undefined, // Optionalen Username senden
      });

      const { token, message, userId, email, username } = response.data;
      
      const user: CurrentUser = {
        id: userId,
        email: email,
        username: username || email.split('@')[0]
      };

      // *** Globale Speicherung (damit Profile.tsx den Login erkennt) ***
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));

      // Lokalen State aktualisieren
      setAuthToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);

      // UI aufräumen
      setAuthEmail('');
      setAuthPassword('');
      setRegisterUsername('');
      setIsRegistering(false);
      Alert.alert('Erfolg', message || 'Registrierung erfolgreich. Du bist jetzt eingeloggt.');
      
      // Daten laden
      fetchQuote();
      fetchHabits(); 

    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data?.error || 'Fehler bei der Registrierung.')
        : 'Netzwerkfehler oder unerwarteter Fehler.';

      setAuthMessage(errorMessage);
    } finally {
      setIsLoadingLogin(false);
    }
  };

  // ---------- API-FUNKTIONEN  ----------

  const fetchHabits = useCallback(async () => {
    if (!authToken || !isLoggedIn) return;
    setIsLoadingHabits(true);
    try {
      const response = await axios.get<Habit[]>(HABITS_API_URL, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setHabits(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Habits:', error);
    } finally {
      setIsLoadingHabits(false);
    }
  }, [authToken, isLoggedIn]);

  const fetchQuote = useCallback(async () => {
    try {
      const response = await axios.get<Quote[]>(QUOTES_API_URL);
      const quotes = response.data;
      if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
      } else {
        setQuote({ id: 0, quote: "Keine Zitate verfügbar. Bleib trotzdem motiviert!" });
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Quotes:', error);
      setQuote({ id: 0, quote: "Fehler beim Laden des Spruchs." });
    }
  }, []);

  const addHabit = () => {
      // ... (Ihre bestehende Logik zum Hinzufügen von Habits, mit AuthToken-Check)
      if (newHabitName.trim() === '' || newHabitDescription.trim() === '') return;

      const saveHabit = async (name: string, description: string) => {
      try {
        if (!authToken) {
          Alert.alert('Fehler', 'Nicht angemeldet. Bitte melden Sie sich an.');
          return;
        }
          await axios.post(
            HABITS_API_URL,
            { name: name.trim(), description: description.trim(), frequency: 'Täglich' },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          fetchHabits();
        } catch (error) {
          console.error('Fehler beim Speichern des neuen Habits:', error);
          Alert.alert('Fehler', 'Speichern des Habits fehlgeschlagen.');
        }
      };

      saveHabit(newHabitName, newHabitDescription);
      setNewHabitName('');
      setNewHabitDescription('');
      setModalVisible(false);
      setHabitMode(null);
  };
  
  const addPredefinedHabit = (label: string, description: string, frequency: string) => {
      // ... (Ihre bestehende Logik für vordefinierte Habits, mit AuthToken-Check)
      const saveHabit = async (name: string, description: string, frequency: string) => {
        try {
          if (!authToken) {
            Alert.alert('Fehler', 'Nicht angemeldet. Bitte melden Sie sich an.');
            return;
          }
          await axios.post(
            HABITS_API_URL,
            { name, description, frequency },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          fetchHabits();
        } catch (error) {
          console.error('Fehler beim Speichern des vordefinierten Habits:', error);
          Alert.alert('Fehler', 'Speichern fehlgeschlagen.');
        }
      };

      saveHabit(label, description, frequency);
      setModalVisible(false);
      setHabitMode(null);
  }

  const toggleHabit = async (id: number) => {
    // Stellen Sie sicher, dass der Benutzer angemeldet ist
    if (!authToken) return;

    const habitToToggle = habits.find(h => h.id === id);
    const entryForToday = habitToToggle?.entries.find(entry => isSameDay(new Date(entry.date), today));

    if (!entryForToday) {
        Alert.alert('Fehler', 'Kein heutiger Eintrag zum Umschalten gefunden.');
        return;
    }
    
    // Optimistische UI-Aktualisierung (vor dem API-Call)
    const newStatus = !entryForToday.status;
    setHabits((prev) =>
        prev.map((habit) =>
            habit.id === id ? {
                ...habit,
                entries: habit.entries.map(e =>
                    e.id === entryForToday.id ? {...e, status: newStatus} : e
                )
            } : habit
        )
    );

    try {
        // *** KORRIGIERT: Verwende die Route /:id/toggle und sende das Datum im Body ***
        await axios.put(
            `${HABITS_API_URL}/${id}/toggle`, // <--- Korrigierte URL (Backend erwartet /toggle)
            { date: today.toISOString() },    // <--- Backend erwartet das Datum im Body 
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        // Die API-Antwort enthält nun den aktualisierten Eintrag, was bestätigt, dass der Toggle erfolgreich war.
        
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Status:', error);
        
        // Rollback der UI bei Fehler
        setHabits((prev) =>
            prev.map((habit) =>
                habit.id === id ? {
                    ...habit,
                    entries: habit.entries.map(e =>
                        e.id === entryForToday.id ? {...e, status: !newStatus} : e
                    )
                } : habit
            )
        );
        Alert.alert('Fehler', 'Status-Update fehlgeschlagen. Bitte erneut versuchen.');
    }
};


  // Daten laden, sobald sich der Zustand ändert
  useEffect(() => {
    if (isLoggedIn) {
      fetchHabits();
      fetchQuote();
    }
  }, [isLoggedIn, fetchHabits, fetchQuote]);


  const filterOptions: { key: FilterKey; label: string }[] = [
    // ... (Ihre bestehenden Filter-Optionen)
    { key: 'alle', label: 'Alle' },
    { key: 'klimmzuege', label: 'Klimmzüge' },
    { key: 'liegestuetze', label: 'Liegestütze' },
    { key: 'schritte', label: 'Schritte' },
  ];
  const chartMap: Record<FilterKey, any> = {
    alle: require('@/assets/images/chart1.png'),
    klimmzuege: require('@/assets/images/chart2.png'),
    liegestuetze: require('@/assets/images/chart3.png'),
    schritte: require('@/assets/images/chart4.png'),
  };
  const predefinedHabits = [
    { id: 1, label: '6000 Schritte', description: 'Gehe heute mindestens 6000 Schritte.', frequency: 'Täglich' },
    { id: 2, label: '1,5h Uni', description: 'Verbringe 1,5 Stunden mit Uni-Aufgaben.', frequency: 'Wöchentlich' },
    { id: 3, label: '40 Liegestütze', description: 'Mache 40 saubere Liegestütze.', frequency: '2x Pro Woche' },
    { id: 4, label: '10 Klimmzüge', description: 'Schaffe heute 10 Klimmzüge.', frequency: '3x Pro Woche' },
  ];

  const filteredHabits = useMemo(() => {
    const activeHabits = habits.map(habit => {
        const entryForToday = habit.entries.find((entry) =>
            isSameDay(new Date(entry.date), today)
        );
        return {
            ...habit,
            checked: entryForToday?.status ?? false,
        };
    }).filter(habit => {
      if (selectedFilter === 'alle') return true;
      return habit.name.toLowerCase().includes(selectedFilter);
    });

    return activeHabits;
  }, [habits, selectedFilter, today]);


  // Hilfsfunktion zum Öffnen des Modals (mit behobenem Typfehler)
  const openHabitModal = (mode: 'menu' | 'custom' | 'predefined') => {
    if (!isLoggedIn) {
        Alert.alert('Login erforderlich', 'Bitte melde dich zuerst an, um Habits zu erstellen.');
        return;
    }
    setHabitMode(mode);
    setModalVisible(true);
  };
  
  // Funktion zum Rendern des Modals (Hier ist der Typfehler behoben)
  const renderModals = () => {
    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => { setModalVisible(false); setHabitMode(null); }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Modal-Menü */}
            {habitMode === 'menu' && (
              <>
                <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Was möchtest du tun?</ThemedText>
                <Button title="Vordefiniertes Ziel wählen" onPress={() => setHabitMode('predefined')} />
                <View style={{ height: 12 }} />
                <Button title="Eigenes Ziel erstellen" onPress={() => setHabitMode('custom')} />
              </>
            )}

            {/* Vordefinierte Habits */}
            {habitMode === 'predefined' && (
              <>
                <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Vordefiniertes Ziel auswählen:</ThemedText>
                {predefinedHabits.map(({ id,label, description, frequency }) => (
                  <Pressable
                    key={id}
                    onPress={() => addPredefinedHabit(label, description, frequency)}
                    style={styles.predefinedItem}
                  >
                    <ThemedText style={{ fontWeight: '500' }}>{label}</ThemedText>
                    <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>{description}</ThemedText>
                  </Pressable>
                ))}
              </>
            )}

            {/* Eigene Habit */}
            {habitMode === 'custom' && (
              <>
                <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Eigenes Ziel erstellen</ThemedText>
                <TextInput
                  placeholder="Kurzname (z. B. Kniebeugen)"
                  value={newHabitName}
                  onChangeText={setNewHabitName}
                  style={styles.textInput}
                />
                <TextInput
                  placeholder="Beschreibung"
                  value={newHabitDescription}
                  onChangeText={setNewHabitDescription}
                  style={styles.textInput}
                />
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                  <Button title="Hinzufügen" onPress={addHabit} />
                </View>
              </>
            )}

            <View style={{ marginTop: 24 }}>
              <Button
                title="Zurück"
                onPress={() => {
                  if (habitMode === 'menu') {
                    setModalVisible(false);
                    setHabitMode(null);
                  } else {
                    setHabitMode('menu');
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  // ---------- BEDINGTES RENDERING FÜR LOGIN ----------

  const renderLoginScreen = () => (
    <View style={[styles.container, styles.loadingContainer]}>
        <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 20 }}>
            Willkommen bei Habitree!
        </ThemedText>

        <ThemedView style={styles.authContainer}>
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
                {isRegistering ? 'Neuen Account erstellen' : 'Anmelden'}
            </ThemedText>
            
            <TextInput
                style={styles.authInput}
                placeholder="E-Mail"
                placeholderTextColor="#888"
                value={authEmail}
                onChangeText={setAuthEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoadingLogin}
            />
            
            {/* 🆕 NEUES FELD NUR FÜR REGISTRIERUNG */}
            {isRegistering && (
                <TextInput
                    style={styles.authInput}
                    placeholder="Benutzername"
                    placeholderTextColor="#888"
                    value={registerUsername}
                    onChangeText={setRegisterUsername}
                    autoCapitalize="words"
                    editable={!isLoadingLogin}
                />
            )}

            <TextInput
                style={styles.authInput}
                placeholder="Passwort"
                placeholderTextColor="#888"
                value={authPassword}
                onChangeText={setAuthPassword}
                secureTextEntry
                editable={!isLoadingLogin}
            />
            
            {authMessage ? <ThemedText style={styles.authMessage}>{authMessage}</ThemedText> : null}

            {/* Haupt-Button: ANMELDEN oder REGISTRIEREN */}
            <TouchableOpacity
                style={[styles.authButton, isLoadingLogin && styles.authButtonDisabled]}
                onPress={isRegistering ? handleHomeRegister : handleHomeLogin} // 🔄 Wählt Handler
                disabled={isLoadingLogin}
            >
                {isLoadingLogin ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <ThemedText style={styles.authButtonText}>
                        {isRegistering ? 'Registrieren' : 'Anmelden'} 
                    </ThemedText>
                )}
            </TouchableOpacity>
            
            {/* 🆕 Umschalt-Button */}
            <TouchableOpacity
                style={styles.switchAuthButton}
                onPress={() => {
                    setIsRegistering(prev => !prev);
                    setAuthMessage(''); // Nachricht beim Wechsel löschen
                }}
                disabled={isLoadingLogin}
            >
                <ThemedText style={styles.switchAuthButtonText}>
                    {isRegistering ? 'Schon registriert? Hier anmelden' : 'Noch keinen Account? Hier registrieren'}
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    </View>
);

  if (isLoadingAuth) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="rgb(25, 145, 137)" />
        <ThemedText style={{ marginTop: 10 }}>Lade Authentifizierungsstatus...</ThemedText>
      </View>
    );
  }

  if (!isLoggedIn) {
    return renderLoginScreen(); // Zeige Login-Screen, wenn nicht eingeloggt
  }


  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.greetingText}>
            Hallo, {currentUser?.username || 'Nutzer'}!
          </ThemedText>
          <HelloWave />
        </View>

        <ThemedText style={styles.motivationQuote}>
          💬 Tagesspruch: "{quote?.quote || 'Lade Tagesspruch...'}"
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Deine Statistiken:
        </ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chartSelector}
        >
          {filterOptions.map((option) => (
            <Pressable
              key={option.key}
              style={[
                styles.chartButton,
                selectedFilter === option.key && styles.chartButtonSelected,
              ]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <ThemedText
                style={[
                  styles.chartButtonText,
                  { color: '#000000' },
                  selectedFilter === option.key && styles.chartButtonTextSelected,
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <Image
          source={chartMap[selectedFilter]}
          style={styles.chartImage}
          contentFit="contain"
        />

        <Image
          source={require('@/assets/images/streak.png')}
          style={[styles.chartImage, { height: 280 }]}
          contentFit="contain"
        />

        <ThemedView style={styles.habitListContainer}>
          <ThemedText type="subtitle" style={styles.habitTitle}>
            Heutige Ziele:
          </ThemedText>

          {isLoadingHabits ? (
             <View style={{ padding: 20 }}>
                <ActivityIndicator size="small" color="rgb(25, 145, 137)" />
                <ThemedText style={{ textAlign: 'center', marginTop: 5 }}>Lade Habits...</ThemedText>
            </View>
          ) : filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <Pressable
                key={habit.id}
                onPress={() => toggleHabit(habit.id)}
                style={styles.habitItem}
              >
                <View
                  style={[
                    styles.checkbox,
                    habit.checked && styles.checkboxChecked,
                  ]}
                >
                  {habit.checked && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </View>
                <View style={styles.habitTextContainer}>
                  <ThemedText style={styles.habitLabel}>{habit.name}</ThemedText>
                  <ThemedText style={styles.habitDescription}>
                    {habit.description} ({habit.frequency})
                  </ThemedText>
                </View>
              </Pressable>
            ))
          ) : (
            <ThemedText style={styles.noHabitsText}>
              Keine Habits angelegt.
            </ThemedText>
          )}
        </ThemedView>

      </ScrollView>

      <Pressable style={styles.fab} onPress={() => openHabitModal('menu')}>
          <ThemedText style={styles.fabText}>＋</ThemedText>
      </Pressable>

      {renderModals()}
    </View>
  );
}

const styles = StyleSheet.create({
  // --- NEUE/GEÄNDERTE STYLES FÜR LOGIN-SCREEN ---
  authContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  authInput: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  authButton: {
    backgroundColor: 'rgb(25, 145, 137)',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authMessage: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  // --- BESTEHENDE STYLES (wie in der letzten Version) ---
  noHabitsText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  predefinedItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 54,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgb(25, 145, 137)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 28,
  },
  motivationQuote: {
    marginBottom: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '600',
  },
  habitTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  chartSelector: {
    marginBottom: 16,
  },
  chartButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  chartButtonSelected: {
    backgroundColor: 'rgb(25, 145, 137)',
  },
  chartButtonText: {
    fontSize: 14,
  },
  chartButtonTextSelected: {
    fontWeight: 'bold',
    color: 'white',
  },
  chartImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
  },
  habitListContainer: {
    borderRadius: 12,
    padding: 16,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  habitTextContainer: {
    marginLeft: 12,
  },
  habitLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  habitDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#A1CEDC',
    borderColor: '#A1CEDC',
  },
  checkmark: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  // --- NEUE STYLES FÜR LOGIN/REGISTER-UMSCHALTUNG ---
  switchAuthButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  switchAuthButtonText: {
    color: 'rgb(25, 145, 137)', // Passend zur Akzentfarbe
    textAlign: 'center',
    fontSize: 14,
  },
});