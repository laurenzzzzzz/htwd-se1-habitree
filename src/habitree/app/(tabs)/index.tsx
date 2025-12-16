import React, { useState, useEffect, useMemo } from 'react';
import { Image } from 'expo-image';
import {
  Pressable,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { HelloWave } from '@/presentation/ui/HelloWave';
import { ThemedText } from '@/presentation/ui/ThemedText';
import { ThemedView } from '@/presentation/ui/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { createHomeStyles } from '../../styles/index_style';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitsContext';
import { useQuoteController } from '../../presentation/controllers/useQuoteController';
import { useStreakController } from '../../presentation/controllers/useStreakController';
import HabitModal from '../../presentation/ui/HabitModal';
import { QuoteBanner } from '../../presentation/ui/QuoteBanner';
import { WEEKDAYS } from '../../constants/HomeScreenConstants';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => createHomeStyles(width, height), [width, height]);
  const backgroundColor = useThemeColor({}, 'background');
  const { currentUser } = useAuth();
  const {
    filteredHabits,
    predefinedHabits,
    fetchPredefinedHabits,
    isLoading: isLoadingHabits,
    today,
    fetchHabits,
    handleSaveHabit,
    handleToggleHabit,
    isSameDay,
  } = useHabits();
  // HomeScreen render
  const { quote, fetchQuote } = useQuoteController();
  const { streak, isLoading: isLoadingStreak } = useStreakController();

  // Local UI state only
  const [habitMode, setHabitMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitStartDate, setNewHabitStartDate] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('');
  const [newHabitWeekDays, setNewHabitWeekDays] = useState<number[]>([]);
  const [newHabitIntervalDays, setNewHabitIntervalDays] = useState('');
  const [streakModalVisible, setStreakModalVisible] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Initialize form with current date and time when opening custom habit creation
  useEffect(() => {
    if (habitMode === 'custom' && newHabitStartDate === '' && newHabitTime === '') {
      const now = new Date();
      const dateStr = now.toLocaleDateString('de-DE');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      
      setNewHabitStartDate(dateStr);
      setNewHabitTime(timeStr);
    }
  }, [habitMode]);

  // Load predefined habits when user opens that mode
  useEffect(() => {
    if (habitMode === 'predefined') {
      fetchPredefinedHabits();
    }
  }, [habitMode, fetchPredefinedHabits]);

  // Handler when user selects a predefined habit from the modal: open custom form prefilled
  const handleSelectPredefined = (p: { id?: number; label: string; description: string; frequency: string }) => {
    setNewHabitName(p.label);
    setNewHabitDescription(p.description);
    setNewHabitFrequency(p.frequency || 'Täglich');
    // ensure custom form is shown (will also trigger date/time defaults via effect)
    setHabitMode('custom');
  };

  const handleAddHabit = async () => {
    if (newHabitName.trim() === '' || newHabitDescription.trim() === '') {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    const frequency = newHabitFrequency || 'Täglich';
    const result = await handleSaveHabit(newHabitName, newHabitDescription, frequency, newHabitStartDate, newHabitTime, newHabitWeekDays, newHabitIntervalDays);
    if (result.success) {
      setNewHabitName('');
      setNewHabitDescription('');
      setNewHabitStartDate('');
      setNewHabitTime('');
      setNewHabitFrequency('');
      setNewHabitWeekDays([]);
      setNewHabitIntervalDays('');
      setModalVisible(false);
      setHabitMode(null);
    } else {
      const msg = result.error || 'Speichern des Habits fehlgeschlagen.';
      Alert.alert('Fehler', msg);
    }
  };

  const handleAddPredefinedHabit = async (label: string, description: string, frequency: string) => {
    const result = await handleSaveHabit(label, description, frequency);
    if (result.success) {
      setModalVisible(false);
      setHabitMode(null);
    } else {
      const msg = result.error || 'Speichern des vordefiniert Habits fehlgeschlagen.';
      Alert.alert('Fehler', msg);
    }
  };

  const handleToggleHabitPress = async (id: number) => {
    const result = await handleToggleHabit(id);
    if (!result.success) {
      Alert.alert('Fehler', result.error ?? 'Status-Update fehlgeschlagen. Bitte erneut versuchen.');
    }
  };

  const renderWeekdayCircle = (index: number) => {
    const todayDay = new Date();
    const jsDay = todayDay.getDay();
    const mappedDay = jsDay === 0 ? 6 : jsDay - 1;
    const isToday = index === mappedDay;
    const isPastOrToday = index <= mappedDay;

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
          {WEEKDAYS[index]}
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.greetingText}>
            Hallo, {currentUser ? currentUser.getDisplayName() : 'Nutzer'}!
          </ThemedText>
          <HelloWave />
        </View>

        {/* Daily Quote */}
        <QuoteBanner quote={quote} />

        {/* Habit List Container */}
        <ThemedView style={styles.habitListContainer}>
          {/* Streak Section */}
          <ThemedText type="subtitle" style={styles.habitTitle}>
            Deine Streak:
          </ThemedText>

          <Pressable
            style={styles.streakContainer}
            onPress={() => setStreakModalVisible(true)}
          >
            <Image
              source={require('@/assets/images/wassertropfen.png')}
              style={styles.streakBackgroundImage}
              contentFit="contain"
            />
            <ThemedText style={styles.streakNumber}>
              {isLoadingStreak ? '...' : (streak?.currentStreak ?? 0)}
            </ThemedText>
          </Pressable>

          {/* Weekday Row */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((_, index) => renderWeekdayCircle(index))}
          </View>

          {/* Today's Goals */}
          <ThemedText type="subtitle" style={[styles.habitTitle, { marginTop: 40 }]}>
            Heutige Ziele:
          </ThemedText>

          {isLoadingHabits ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small" color="rgb(25, 145, 137)" />
              <ThemedText style={{ textAlign: 'center', marginTop: 5 }}>
                Lade Habits...
              </ThemedText>
            </View>
          ) : filteredHabits.length > 0 ? (
            filteredHabits.map(({ habit, checked }) => (
              <Pressable
                key={habit.id}
                onPress={() => handleToggleHabitPress(habit.id)}
                style={styles.habitItem}
              >
                <View
                  style={[
                    styles.checkbox,
                    checked && styles.checkboxChecked,
                  ]}
                >
                  {checked && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </View>
                <View style={styles.habitTextContainer}>
                  <ThemedText style={styles.habitLabel}>
                    {habit.name}
                  </ThemedText>
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

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          setHabitMode('menu');
          setModalVisible(true);
        }}
      >
        <ThemedText style={styles.fabText}>＋</ThemedText>
      </Pressable>

      {/* Habit Creation Modal */}
      <HabitModal
        visible={modalVisible}
        mode={habitMode}
        onClose={() => {
          setModalVisible(false);
          setHabitMode(null);
        }}
        onOpenMode={(m) => setHabitMode(m)}
        predefinedHabits={predefinedHabits}
        onSelectPredefined={handleSelectPredefined}
        newHabitName={newHabitName}
        newHabitDescription={newHabitDescription}
        newHabitStartDate={newHabitStartDate}
        newHabitTime={newHabitTime}
        newHabitFrequency={newHabitFrequency}
        newHabitWeekDays={newHabitWeekDays}
        newHabitIntervalDays={newHabitIntervalDays}
        setNewHabitName={setNewHabitName}
        setNewHabitDescription={setNewHabitDescription}
        setNewHabitStartDate={setNewHabitStartDate}
        setNewHabitTime={setNewHabitTime}
        setNewHabitFrequency={setNewHabitFrequency}
        setNewHabitWeekDays={setNewHabitWeekDays}
        setNewHabitIntervalDays={setNewHabitIntervalDays}
        onAddPredefined={handleAddPredefinedHabit}
        onAddCustom={handleAddHabit}
      />

      {/* Streak Modal */}
      <Modal
        visible={streakModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setStreakModalVisible(false)}
      >
        <View style={styles.streakModalOverlay}>
          <View style={styles.streakModalContainer}>
            <Text style={styles.streakModalTitle}>
              Wow – {streak?.currentStreak ?? 0} Tage am Stück!
            </Text>
            <Text style={styles.streakModalText}>
              {streak?.getMilestoneMessage() || 'Starte deine Streak heute!'}
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
              <Text style={styles.streakCloseButtonText}>
                Weiter motiviert bleiben
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}


