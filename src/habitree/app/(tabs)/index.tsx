import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import axios from 'axios';
import React from 'react';
import {Pressable,ScrollView,StyleSheet,View,Modal,TextInput,Button,} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';


// Typ für die Filter-Schlüssel
type FilterKey = 'alle' | 'klimmzuege' | 'liegestuetze' | 'schritte';

export default function HomeScreen() {

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  //Quotes 
  const motivationalQuotes = [
    'Heute ist ein guter Tag, um stark zu sein.',
    'Jeder Schritt zählt, auch der kleine!',
    'Gib niemals auf – du bist näher am Ziel als du denkst.',
    'Disziplin schlägt Motivation – bleib dran!',
    'Dein zukünftiges Ich wird dir danken.',
    'Stärke kommt nicht von Siegen, sondern vom Durchhalten.',
    'Der Weg zum Erfolg beginnt mit dem ersten Schritt.',
  ];

  // Konfiguration der API-URLs
  const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';
  const HABITS_API_URL = `${API_BASE_URL}/habits`;
  const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;


  const [habitMode, setHabitMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');
  const [authToken, setAuthToken] = useState<string | null>(null);

  interface HabitEntry {
    id: number;
    habitId: number;
    date: string;
    status: boolean;
    note: string | null; 
  }

  interface HabitFromBackend {
    id: number;
    userId: number; // Int in Prisma
    name: string;
    description: string;
    frequency: string;
    createdAt: string;
    entries: HabitEntry[];
  }

  interface HabitView {
    id: number;
    label: string;
    description: string;
    checked: boolean;
  }

  const chartMap: Record<FilterKey, any> = {
    alle: require('@/assets/images/chart1.png'),
    klimmzuege: require('@/assets/images/chart2.png'),
    liegestuetze: require('@/assets/images/chart3.png'),
    schritte: require('@/assets/images/chart4.png'),
  };

  const filterOptions: { key: FilterKey; label: string }[] = [
    { key: 'alle', label: 'Alle' },
    { key: 'klimmzuege', label: 'Klimmzüge' },
    { key: 'liegestuetze', label: 'Liegestütze' },
    { key: 'schritte', label: 'Schritte' },
  ];

  const [habits, setHabits] = useState<HabitView[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Datenabruf mit JWT-Authentifizierung
  useEffect(() => {
    const loginTestUser = async () => {
      try {
        const email = 'test@example.com'; // Hardcoded
        const password = 'password123'; // Hardcoded

        const response = await axios.post(LOGIN_API_URL, { email, password });
        const token = response.data.token;

        if (token) {
          console.log(' Testuser angemeldet, JWT erhalten.');
          setAuthToken(token); // JWT im State speichern
        } else {
          console.error(' Login erfolgreich, aber kein Token erhalten.');
        }
      } catch (error: any) {
        console.error(' Fehler beim automatischen JWT-Login:', error.response?.data?.error || error.message);
      }
    };
    loginTestUser();
  }, []);

  // Habits abrufen, wenn der Token gesetzt ist
  useEffect(() => {
    if (!authToken) return; // Warten, bis der Token gesetzt ist

    const fetchHabits = async () => {
        setLoading(true);
        try {
            // Verwende den gespeicherten JWT-Token
            const token = authToken; 

            const response = await axios.get<HabitFromBackend[]>(HABITS_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`, // Token im Header senden
                },
            });

            console.log('📦 Daten vom Server:', response.data);

            const loadedHabits: HabitView[] = response.data.map((habit) => {
                // Suchen des Eintrags für heute
                const entryForToday = habit.entries.find((entry) =>
                  isSameDay(new Date(entry.date), today)
                );

                return {
                    id: habit.id,
                    label: habit.name,
                    description: habit.description,
                    checked: entryForToday?.status ?? false, // Setze checked basierend auf dem heutigen Eintrag
                };
            });

            setHabits(loadedHabits);
        } catch (error) {
            console.error('Fehler beim Abrufen der Habits:', error);
        } finally {
            setLoading(false);
        }
    }

    fetchHabits();
  }, [authToken]); 

  // Toggle-Funktion für Habits
  const toggleHabit = async (id: number) => {
    // Optimistisches Update
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, checked: !habit.checked } : habit
      )
    );

    try {
      if (!authToken) {
        console.error('Kein Auth-Token vorhanden, kann Status nicht aktualisieren.');
        return;
      }
      const token = authToken; 

      // Status umschalten im Backend
      await axios.put(
        `${HABITS_API_URL}/${id}/toggle`,
        { date: today }, // heutiges Datum senden
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token im Header senden
          },
        }
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      // Rollback bei Fehler (optional)
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id ? { ...habit, checked: !habit.checked } : habit
        )
      );
    }
  };


  const todayQuote = motivationalQuotes[new Date().getDay()];
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const addHabit = () => {
    if (newHabit.trim() === '') return;

    // Erstelle ein Dummy-Habit für die sofortige Anzeige
    const nextId = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
    setHabits(prev => [
      ...prev,
      {
        id: nextId,
        label: newHabit.trim(),
        description: newDescription.trim(),
        checked: false,
      } as HabitView,
    ]);

    // *** Habit-Speicher-Logik auf JWT umgestellt ***
    const saveHabit = async () => {
      try {
        if (!authToken) {
          console.error('Kein Auth-Token vorhanden, kann Habit nicht speichern.');
          return;
        }
        const token = authToken; // Verwende den gespeicherten JWT

        await axios.post(
          HABITS_API_URL,
          {
            name: newHabit.trim(),
            description: newDescription.trim(),
            frequency: 'daily', // Hardcodiert auf 'daily'
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token im Header senden
            },
          }
        );
        // Nach dem Speichern wird die Liste beim nächsten useEffect-Lauf (nachdem der Token gesetzt ist) aktualisiert
        // Für sofortige Konsistenz müsste man hier fetchHabits erneut aufrufen oder die Antwort verarbeiten.
      } catch (error) {
        console.error('Fehler beim Speichern des neuen Habits:', error);
      }
    };
   

    saveHabit();
    setNewHabit('');
    setNewDescription('');
    setHabitMode(null); // Modal schließen
  };

  const predefinedHabits = [
    { label: '6000 Schritte', description: 'Gehe heute mindestens 6000 Schritte.' },
    { label: '1,5h Uni', description: 'Verbringe 1,5 Stunden mit Uni-Aufgaben.' },
    { label: '40 Liegestütze', description: 'Mache 40 saubere Liegestütze.' },
    { label: '10 Klimmzüge', description: 'Schaffe heute 10 Klimmzüge.' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Begrüßungsbereich */}
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.greetingText}>
            Hallo, Calvin!
          </ThemedText>
          <HelloWave />
        </View>

        {/* Tagesspruch */}
        <ThemedText style={styles.motivationQuote}>
          💬 Tagesspruch: "{todayQuote}"
        </ThemedText>

        {/* Statistikbereich */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Deine Statistiken:
        </ThemedText>

        {/* Filter-Buttons */}
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

        {/* Chart-Bild */}
        <Image
          source={chartMap[selectedFilter]}
          style={styles.chartImage}
          contentFit="contain"
        />

        {/* Streak-Bild */}
        <Image
          source={require('@/assets/images/streak.png')}
          style={[styles.chartImage, { height: 280 }]}
          contentFit="contain"
        />

        {/* Gewohnheiten-Liste */}
        <ThemedView style={styles.habitListContainer}>
          <ThemedText type="subtitle" style={styles.habitTitle}>
            Heutige Ziele:
          </ThemedText>

          {loading ? (
            <ThemedText style={styles.noHabitsText}>Lade Habits...</ThemedText>
          ) : habits && habits.length > 0 ? (
            habits.map((habit) => (
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
                  {habit.checked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
                </View>
                <View style={styles.habitTextContainer}>
                  <ThemedText style={styles.habitLabel}>{habit.label}</ThemedText>
                  <ThemedText style={styles.habitDescription}>
                    {habit.description}
                  </ThemedText>
                </View>
              </Pressable>
            ))
          ) : (
            <ThemedText style={styles.noHabitsText}>
              Keine Habits für heute angelegt.
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          setHabitMode('menu');
          setModalVisible(true);
        }}
      >
        <ThemedText style={styles.fabText}>＋</ThemedText>
      </Pressable>

      {/* Modal zum Hinzufügen eines neuen Habits */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setHabitMode(null);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {habitMode === 'menu' && (
              <>
                <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
                  Was möchtest du tun?
                </ThemedText>
                <Button
                  title="Vordefiniertes Ziel wählen"
                  onPress={() => setHabitMode('predefined')}
                />
                <View style={{ height: 12 }} />
                <Button
                  title="Eigenes Ziel erstellen"
                  onPress={() => setHabitMode('custom')}
                />
              </>
            )}

            {habitMode === 'predefined' && (
              <>
                <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
                  Vordefiniertes Ziel auswählen:
                </ThemedText>
                {predefinedHabits.map(({ label, description }, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      const nextId =
                        habits.length > 0 ? Math.max(...habits.map((h) => h.id)) + 1 : 1;
                      setHabits((prev) => [
                        ...prev,
                        { id: nextId, label, description, checked: false },
                      ]);
                      setModalVisible(false);
                      setHabitMode(null);
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderBottomColor: '#ddd',
                      borderBottomWidth: 1,
                    }}
                  >
                    <ThemedText style={{ fontWeight: '500' }}>{label}</ThemedText>
                    <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>
                      {description}
                    </ThemedText>
                  </Pressable>
                ))}
              </>
            )}

            {habitMode === 'custom' && (
              <>
                <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
                  Eigenes Ziel erstellen
                </ThemedText>
                <TextInput
                  placeholder="Kurzname (z. B. Kniebeugen)"
                  value={newHabit}
                  onChangeText={setNewHabit}
                  style={styles.textInput}
                />
                <TextInput
                  placeholder="Beschreibung"
                  value={newDescription}
                  onChangeText={setNewDescription}
                  style={[styles.textInput, { marginTop: 12 }]}
                />
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                  <Button title="Hinzufügen" onPress={addHabit} />
                </View>
              </>
            )}

            {/* Zurück-Button immer zeigen */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  noHabitsText: {
    color: '#888', // Grauton
    fontStyle: 'italic', // Optional: kursiv
    textAlign: 'center',
    marginVertical: 16,
  },

  // Neue Styles für Modal
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
  },

  // FAB-Style mit Theme
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
  // Layout Styles
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

  // Text Styles
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

  // Chart Filter Styles
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
    color: '#1D3D47',
  },
  chartImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
  },

  // Habit List Styles
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
  //checkboxChecked: {
  //backgroundColor: '#34C759',
  //borderColor: '#34C759',
  //},
  checkmark: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});