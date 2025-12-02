import React, { useState, useEffect, useMemo } from 'react';
import { Image } from 'expo-image';
import {
  Pressable,
  FlatList,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { styles } from '../../styles/index_style';
import { useAuth } from '../../context/AuthContext';
import { useHabitsController } from '../../presentation/controllers/useHabitsController';
import { useQuoteController } from '../../presentation/controllers/useQuoteController';
import HabitModal from '../../presentation/ui/HabitModal';
import { QuoteBanner } from '../../presentation/ui/QuoteBanner';

type FilterKey = 'alle' | 'klimmzuege' | 'liegestuetze' | 'schritte';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const { authToken, currentUser } = useAuth();
  const { habits, isLoading: isLoadingHabits, fetchHabits, saveHabit, toggleHabit } = useHabitsController();
  const { quote, fetchQuote } = useQuoteController();

  const [habitMode, setHabitMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('alle');
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [streakModalVisible, setStreakModalVisible] = useState(false);

  const today = useMemo(() => new Date(), []);
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const predefinedHabits = [
    { id: 1, label: '6000 Schritte', description: 'Gehe heute mindestens 6000 Schritte.', frequency: 'Täglich' },
    { id: 2, label: '1,5h Uni', description: 'Verbringe 1,5 Stunden mit Uni-Aufgaben.', frequency: 'Wöchentlich' },
    { id: 3, label: '40 Liegestütze', description: 'Mache 40 saubere Liegestütze.', frequency: '2x Pro Woche' },
    { id: 4, label: '10 Klimmzüge', description: 'Schaffe heute 10 Klimmzüge.', frequency: '3x Pro Woche' },
  ];

  useEffect(() => { fetchQuote(); }, [fetchQuote]);
  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const saveHabitHandler = async (name: string, description: string, frequency: string) => {
    try {
      await saveHabit(name, description, frequency);
    } catch (error) {
      console.error('Fehler beim Speichern des neuen Habits:', error);
      Alert.alert('Fehler', 'Speichern des Habits fehlgeschlagen.');
    }
  };

  const addHabit = () => {
    if (newHabitName.trim() === '' || newHabitDescription.trim() === '') return;
    saveHabitHandler(newHabitName, newHabitDescription, 'Täglich');
    setNewHabitName('');
    setNewHabitDescription('');
    setModalVisible(false);
    setHabitMode(null);
  };

  const addPredefinedHabit = (label: string, description: string, frequency: string) => {
    saveHabitHandler(label, description, frequency);
    setModalVisible(false);
    setHabitMode(null);
  };

  const toggleHabitHandler = async (id: number) => {
    if (!authToken) return;
    const habitToToggle = habits.find(h => h.id === id);
    const entryForToday = habitToToggle?.entries.find(entry => isSameDay(new Date(entry.date), today));
    if (!entryForToday) {
      Alert.alert('Fehler', 'Kein heutiger Eintrag zum Umschalten gefunden.');
      return;
    }

    try {
      await toggleHabit(id, today.toISOString());
      await fetchHabits();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      Alert.alert('Fehler', 'Status-Update fehlgeschlagen. Bitte erneut versuchen.');
    }
  };

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
      const entryForToday = habit.entries.find((entry) => isSameDay(new Date(entry.date), today));
      return { ...habit, checked: entryForToday?.status ?? false };
    }).filter(habit => {
      if (selectedFilter === 'alle') return true;
      return habit.name.toLowerCase().includes(selectedFilter);
    });
    return activeHabits;
  }, [habits, selectedFilter, today]);

  const renderHabitItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => toggleHabitHandler(item.id)} style={{ paddingVertical: 8 }}>
      <ThemedText style={{ fontWeight: '600' }}>{item.name}</ThemedText>
      <ThemedText style={{ opacity: 0.7 }}>{item.description}</ThemedText>
    </Pressable>
  );

  const ListHeader = () => (
    <>
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={styles.greetingText}>Hallo, {currentUser?.username || 'Nutzer'}!</ThemedText>
        <HelloWave />
      </View>

      <QuoteBanner quote={quote} />

      <ThemedText type="subtitle" style={styles.sectionTitle}>Deine Statistiken:</ThemedText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartSelector}>
        {filterOptions.map((option) => (
          <Pressable key={option.key} style={[styles.chartButton, selectedFilter === option.key && styles.chartButtonSelected]} onPress={() => setSelectedFilter(option.key)}>
            <ThemedText style={[styles.chartButtonText, { color: '#000' }, selectedFilter === option.key && styles.chartButtonTextSelected]}>{option.label}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <Image source={chartMap[selectedFilter]} style={styles.chartImage} contentFit="contain" />

      <ThemedView style={styles.habitListContainer}>
        <ThemedText type="subtitle" style={styles.habitTitle}>Deine Streak:</ThemedText>

        <Pressable style={styles.streakContainer} onPress={() => setStreakModalVisible(true)}>
          <Image source={require('@/assets/images/wassertropfen.png')} style={styles.streakBackgroundImage} contentFit="contain" />
          <ThemedText style={styles.streakNumber}>14</ThemedText>
        </Pressable>

        <View style={styles.weekdayRow}>
          {['Mo','Di','Mi','Do','Fr','Sa','So'].map((day, index) => {
            const todayDay = new Date();
            const jsDay = todayDay.getDay();
            const mappedDay = jsDay === 0 ? 6 : jsDay - 1;
            const isToday = index === mappedDay;
            const isPastOrToday = index <= mappedDay;
            return (
              <View key={index} style={[styles.weekdayCircle, isPastOrToday && styles.weekdayFilled, isToday && styles.weekdayToday]}>
                <ThemedText style={[styles.weekdayText, isToday && styles.weekdayTextToday]}>{day}</ThemedText>
              </View>
            );
          })}
        </View>

        <ThemedText type="subtitle" style={[styles.habitTitle, { marginTop: 40 }]}>Heutige Ziele:</ThemedText>

        {isLoadingHabits ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" color="rgb(25,145,137)" />
            <ThemedText style={{ textAlign: 'center', marginTop: 5 }}>Lade Habits...</ThemedText>
          </View>
        ) : null}
      </ThemedView>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Header, Quote, Statistiken, Chart-Filter, Chart */}
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.greetingText}>Hallo, {currentUser?.username || 'Nutzer'}!</ThemedText>
          <HelloWave />
        </View>
        <QuoteBanner quote={quote} />
        <ThemedText type="subtitle" style={styles.sectionTitle}>Deine Statistiken:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartSelector}>
          {filterOptions.map((option) => (
            <Pressable key={option.key} style={[styles.chartButton, selectedFilter === option.key && styles.chartButtonSelected]} onPress={() => setSelectedFilter(option.key)}>
              <ThemedText style={[styles.chartButtonText, { color: '#000' }, selectedFilter === option.key && styles.chartButtonTextSelected]}>{option.label}</ThemedText>
            </Pressable>
          ))}
        </ScrollView>
        <Image source={chartMap[selectedFilter]} style={styles.chartImage} contentFit="contain" />

        {/* Streak + Wochentage */}
        <ThemedView style={styles.habitListContainer}>
          <ThemedText type="subtitle" style={styles.habitTitle}>Deine Streak:</ThemedText>
          <Pressable style={styles.streakContainer} onPress={() => setStreakModalVisible(true)}>
            <Image source={require('@/assets/images/wassertropfen.png')} style={styles.streakBackgroundImage} contentFit="contain" />
            <ThemedText style={styles.streakNumber}>14</ThemedText>
          </Pressable>
          <View style={styles.weekdayRow}>
            {['Mo','Di','Mi','Do','Fr','Sa','So'].map((day, index) => {
              const todayDay = new Date();
              const jsDay = todayDay.getDay();
              const mappedDay = jsDay === 0 ? 6 : jsDay - 1;
              const isToday = index === mappedDay;
              const isPastOrToday = index <= mappedDay;
              return (
                <View key={index} style={[styles.weekdayCircle, isPastOrToday && styles.weekdayFilled, isToday && styles.weekdayToday]}>
                  <ThemedText style={[styles.weekdayText, isToday && styles.weekdayTextToday]}>{day}</ThemedText>
                </View>
              );
            })}
          </View>

          {/* Heutige Ziele mit Checkboxen */}
          <ThemedText type="subtitle" style={[styles.habitTitle, { marginTop: 40 }]}>Heutige Ziele:</ThemedText>
          {isLoadingHabits ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small" color="rgb(25, 145, 137)" />
              <ThemedText style={{ textAlign: 'center', marginTop: 5 }}>Lade Habits...</ThemedText>
            </View>
          ) : filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <Pressable
                key={habit.id}
                onPress={() => toggleHabit(habit.id, today.toISOString())}
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
      {/* FAB, Modal, Streak-Modal */}
      <Pressable style={styles.fab} onPress={() => { setHabitMode('menu'); setModalVisible(true); }}>
        <ThemedText style={styles.fabText}>＋</ThemedText>
      </Pressable>
      <HabitModal
        visible={modalVisible}
        mode={habitMode}
        onClose={() => { setModalVisible(false); setHabitMode(null); }}
        onOpenMode={(m) => setHabitMode(m)}
        predefinedHabits={predefinedHabits}
        newHabitName={newHabitName}
        newHabitDescription={newHabitDescription}
        setNewHabitName={setNewHabitName}
        setNewHabitDescription={setNewHabitDescription}
        onAddPredefined={addPredefinedHabit}
        onAddCustom={addHabit}
      />
      <Modal visible={streakModalVisible} animationType="fade" transparent onRequestClose={() => setStreakModalVisible(false)}>
        <View style={styles.streakModalOverlay}>
          <View style={styles.streakModalContainer}>
            <Text style={styles.streakModalTitle}>Wow – 14 Tage am Stück!</Text>
            <Text style={styles.streakModalText}>Super gemacht!  Du hast bereits 14 Tage in Folge deine Streak gehalten. Bleib dran – dein Durchhaltevermögen zahlt sich aus!</Text>
            <Image source={require('@/assets/images/wassertropfen.png')} style={styles.streakModalImage} contentFit="contain" />
            <Pressable style={styles.streakCloseButton} onPress={() => setStreakModalVisible(false)}>
              <Text style={styles.streakCloseButtonText}>Weiter motiviert bleiben</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}


