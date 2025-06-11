import { useState } from 'react';
import { Image } from 'expo-image';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Button,
  SafeAreaView,
} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Typ für die Filter-Schlüssel
type FilterKey = 'alle' | 'klimmzuege' | 'liegestuetze' | 'schritte';

export default function HomeScreen() {
  const [habitMode, setHabitMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');

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

  const [habits, setHabits] = useState([
    { id: 1, label: '10 Klimmzüge', checked: false },
    { id: 2, label: '40 Liegestütze', checked: false },
    { id: 3, label: '6000 Schritte', checked: false },
    { id: 4, label: '2L Wasser', checked: false },
    { id: 5, label: '1,5h Uni', checked: false },
  ]);

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, checked: !habit.checked } : habit
      )
    );
  };

  const motivationalQuotes = [
    "Heute ist ein guter Tag, um stark zu sein.",
    "Jeder Schritt zählt, auch der kleine!",
    "Gib niemals auf – du bist näher am Ziel als du denkst.",
    "Disziplin schlägt Motivation – bleib dran!",
    "Dein zukünftiges Ich wird dir danken.",
    "Stärke kommt nicht von Siegen, sondern vom Durchhalten.",
    "Der Weg zum Erfolg beginnt mit dem ersten Schritt.",
  ];

  const todayQuote = motivationalQuotes[new Date().getDay()];

  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  const addHabit = () => {
    if (newHabit.trim() === '') return;
    const nextId = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
    setHabits(prev => [...prev, { id: nextId, label: newHabit.trim(), checked: false }]);
    setNewHabit('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Hallo, Calvin!</ThemedText>
          <HelloWave />
        </View>

        <ThemedText style={[styles.motivationQuote, { marginBottom: 8 }]}>
          💬 Tagesspruch: "{todayQuote}"
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

        {/* Streak-Bild anzeigen */}
        <Image
          source={require('@/assets/images/streak.png')}
          style={[styles.chartImage, { height: 280 }]}  // z.B. 280 statt 200
          contentFit="contain"
        />

        <ThemedView style={styles.habitListContainer}>
          <ThemedText type="subtitle" style={styles.habitTitle}>
            Heutige Ziele:
          </ThemedText>

          {habits.map((habit) => (
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
              <ThemedText>{habit.label}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ParallaxScrollView>

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
        animationType="slide"
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
                {['6000 Schritte', '1,5h Uni', '40 Liegestütze', '10 Klimmzüge'].map((label, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      const nextId = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
                      setHabits(prev => [...prev, { id: nextId, label, checked: false }]);
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
                    <ThemedText>{label}</ThemedText>
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

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  reactLogo: {
    height: 250,
    width: 400,
    alignSelf: 'center',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  chartSelector: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chartButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  backgroundColor: '#e0e0e0', // bleibt für nicht-ausgewählt
  },
  chartButtonSelected: {
    backgroundColor: 'rgb(25, 145, 137)', // ✅ neue Farbe
  },
  chartButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  chartButtonTextSelected: {
    color: '#fff', // weißer Text auf grünem Button
  },
  chartImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  habitListContainer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 100, // Platz für FAB
  },
  habitTitle: {
    marginBottom: 4,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
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
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  checkmark: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  motivationQuote: {
    marginTop: 16,
    fontStyle: 'italic',
    paddingHorizontal: 4,
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
    lineHeight: 32,
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
  },
});
