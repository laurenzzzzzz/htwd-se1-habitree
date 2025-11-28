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
  Text,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import {styles} from './_style/index_style';
import { useAuth } from '../_context/AuthContext';


// --- TYPEN ---
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
  const { isLoggedIn, authToken, currentUser } = useAuth();

  // --- API KONSTANTEN ---
  const API_BASE_URL = 'http://iseproject01.informatik.htw-dresden.de:8000';
  const HABITS_API_URL = `${API_BASE_URL}/habits`;
  const QUOTES_API_URL = `${API_BASE_URL}/quotes`;


  // --- HABIT STATES ---
  const [habitMode, setHabitMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoadingHabits, setIsLoadingHabits] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [streakModalVisible, setStreakModalVisible] = useState(false);

  // --- UTILITY ---
  const today = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const predefinedHabits = [
    { id: 1, label: '6000 Schritte', description: 'Gehe heute mindestens 6000 Schritte.', frequency: 'Täglich' },
    { id: 2, label: '1,5h Uni', description: 'Verbringe 1,5 Stunden mit Uni-Aufgaben.', frequency: 'Wöchentlich' },
    { id: 3, label: '40 Liegestütze', description: 'Mache 40 saubere Liegestütze.', frequency: '2x Pro Woche' },
    { id: 4, label: '10 Klimmzüge', description: 'Schaffe heute 10 Klimmzüge.', frequency: '3x Pro Woche' },
  ];

  // --- DATENLADE FUNKTIONEN ---
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
  }, [QUOTES_API_URL]);

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
  }, [authToken, isLoggedIn, HABITS_API_URL]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  useEffect(() => { 
    fetchHabits();
  }, [fetchHabits]);

  // --- HABIT FUNKTIONEN ---
  const saveHabit = async (name: string, description: string, frequency: string) => {
    try {
      if (!authToken) {
        Alert.alert('Fehler', 'Nicht angemeldet. Bitte melden Sie sich an.');
        return;
      }
        await axios.post(
          HABITS_API_URL,
          { name: name.trim(), description: description.trim(), frequency },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        fetchHabits();
      } catch (error) {
        console.error('Fehler beim Speichern des neuen Habits:', error);
        Alert.alert('Fehler', 'Speichern des Habits fehlgeschlagen.');
      }
    };

  const addHabit = () => {
      if (newHabitName.trim() === '' || newHabitDescription.trim() === '') return;
      saveHabit(newHabitName, newHabitDescription, 'Täglich');
      setNewHabitName('');
      setNewHabitDescription('');
      setModalVisible(false);
      setHabitMode(null);
  };
  
  const addPredefinedHabit = (label: string, description: string, frequency: string) => {
      saveHabit(label, description, frequency);
      setModalVisible(false);
      setHabitMode(null);
  }

  const toggleHabit = async (id: number) => {
    if (!authToken) return;

    const habitToToggle = habits.find(h => h.id === id);
    const entryForToday = habitToToggle?.entries.find(entry => isSameDay(new Date(entry.date), today));

    if (!entryForToday) {
        Alert.alert('Fehler', 'Kein heutiger Eintrag zum Umschalten gefunden.');
        return;
    }
    
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
        await axios.put(
            `${HABITS_API_URL}/${id}/toggle`,
            { date: today.toISOString() },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
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

  // --- USEMEMO UND HILFSFUNKTIONEN ---
  const filterOptions: { key: FilterKey; label: string }[] = [
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


  const openHabitModal = (mode: 'menu' | 'custom' | 'predefined') => {
    if (!isLoggedIn) {
        Alert.alert('Login erforderlich', 'Bitte melde dich zuerst an, um Habits zu erstellen.');
        return;
    }
    setHabitMode(mode);
    setModalVisible(true);
  };
  
  // --- RENDERING FUNKTIONEN ---
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
  

  // --- MAIN RENDER ---
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
          Tagesspruch: "{quote?.quote || 'Lade Tagesspruch...'}"
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

        {/* Streak-Bild */}
        
        {/* 
          <Image
            source={require('@/assets/images/streak.png')}
            style={[styles.chartImage, { height: 280 }]}
            contentFit="contain"
          /> 
          */}
        

        <ThemedView style={styles.habitListContainer}>
          
          <ThemedText type="subtitle" style={styles.habitTitle}>
            Deine Streak:
          </ThemedText>

          {/* Streak-Zahl mit transparenten Wassertropfen-Bild */}
          <Pressable style={styles.streakContainer} onPress={() => setStreakModalVisible(true)}>
            <Image
              source={require('@/assets/images/wassertropfen.png')}
              style={styles.streakBackgroundImage}
              contentFit="contain"
            />
            <ThemedText style={styles.streakNumber}>14</ThemedText>
          </Pressable>
          

          {/* Neue Profilbilder-Leiste mit gelbem Rahmen für den heutigen Tag */}
          <View style={styles.weekdayRow}>
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, index) => {
              const today = new Date();
              const jsDay = today.getDay(); // Sonntag = 0, Montag = 1, ...
              const mappedDay = jsDay === 0 ? 6 : jsDay - 1; // Montag = 0, Sonntag = 6

              const isToday = index === mappedDay;
              const isPastOrToday = index <= mappedDay; // alles bis einschließlich heute

              return (
                <View
                  key={index}
                  style={[
                    styles.weekdayCircle,
                    isPastOrToday && styles.weekdayFilled,
                    isToday && styles.weekdayToday,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.weekdayText,
                      isToday && styles.weekdayTextToday,
                    ]}
                  >
                    {day}
                  </ThemedText>
                </View>
              );
            })}
          </View>

          <ThemedText type="subtitle" style={[styles.habitTitle, { marginTop: 40 }]}>
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
                  <Button title="Vordefiniertes Ziel wählen" onPress={() => setHabitMode('predefined')} />
                  <View style={{ height: 12 }} />
                  <Button title="Eigenes Ziel erstellen" onPress={() => setHabitMode('custom')} />
                </>
              )}

              
              {habitMode === 'predefined' && (
                <>
                  <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
                    Vordefiniertes Ziel auswählen:
                  </ThemedText>
                  {predefinedHabits.map(({ label, description, frequency }, index) => (
                    <Pressable
                      key={index}
                      
                      onPress={() => addPredefinedHabit(label, description, frequency)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderBottomColor: '#ddd',
                        borderBottomWidth: 1,
                      }}
                    >
                      <ThemedText style={{ fontWeight: '500' }}>{label}</ThemedText>
                      <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>{description}</ThemedText>
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
        
        {/* Modal für Streak-Info */}
        <Modal
          visible={streakModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setStreakModalVisible(false)}
        >
          <View style={styles.streakModalOverlay}>
            <View style={styles.streakModalContainer}>
              <Text style={styles.streakModalTitle}>Wow – 14 Tage am Stück!</Text>
              <Text style={styles.streakModalText}>
                Super gemacht!  Du hast bereits 14 Tage in Folge deine Streak gehalten. 
                Bleib dran – dein Durchhaltevermögen zahlt sich aus!
              </Text>

              <Image
                source={require('@/assets/images/wassertropfen.png')}
                style={styles.streakModalImage}
                contentFit="contain"
              />

              <Pressable
                style={styles.streakCloseButton}
                onPress={() => setStreakModalVisible(false)}
              >
                <Text style={styles.streakCloseButtonText}>Weiter motiviert bleiben</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        
    </View>
    
  );
}


