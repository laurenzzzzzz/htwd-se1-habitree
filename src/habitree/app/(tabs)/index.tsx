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
import { useHabitsController } from '../../presentation/controllers/useHabitsController';
import { useQuoteController } from '../../presentation/controllers/useQuoteController';
import { useStreakController } from '../../presentation/controllers/useStreakController';
import HabitModal from '../../presentation/ui/HabitModal';
import { QuoteBanner } from '../../presentation/ui/QuoteBanner';
import { WEEKDAYS } from '../../constants/HomeScreenConstants';
import { Colors } from '../../constants/Colors';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const styles = useMemo(
    () => createHomeStyles(width, height, { backgroundColor }),
    [width, height, backgroundColor],
  );
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
  } = useHabitsController();
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
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const exampleHabits = [
    { id: 1, name: 'Lesen', streak: 70 },
    { id: 2, name: 'Sport', streak: 20 },
    { id: 3, name: 'Wasser', streak: 40 },
    { id: 4, name: 'Code', streak: 64 },
    { id: 5, name: 'Medit.', streak: 34 },
    { id: 6, name: 'Laufen', streak: 54 },
    { id: 7, name: 'Schlaf', streak: 18 },
    { id: 8, name: 'Lernen', streak: 25 },
    { id: 9, name: 'Yoga', streak: 50 },
    { id: 10, name: 'Kochen', streak: 40 },
    { id: 11, name: 'Gehen', streak: 0 },
    { id: 12, name: 'Planen', streak: 75 },
  ];

  const maxStreak = Math.max(...exampleHabits.map(h => h.streak));

  const renderChart = () => {
    return (
      <View style={styles.chartContainer}>
        <ThemedText style={styles.chartTitle}>Habit-Statistiken (Tage)</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chartContent}>
            {exampleHabits.map((habit) => {
              // Max height 70% to prevent overlap with title and leave room for value text
              const calculatedHeight = maxStreak > 0 ? (habit.streak / maxStreak) * 70 : 0;
              const heightPercentage = Math.max(calculatedHeight, 2); // Min 2% height
              const isSelected = selectedBar === habit.id;
              const isGold = habit.streak >= 66;
              
              return (
                <Pressable 
                  key={habit.id} 
                  style={styles.barContainer}
                  onPress={() => {
                      if (isSelected) {
                          setSelectedBar(null);
                          Alert.alert('Info', `${habit.name}: ${habit.streak} Tage Streak`);
                      } else {
                          setSelectedBar(habit.id);
                      }
                  }}
                >
                {isSelected && (
                    <Text style={styles.barValue}>{habit.streak}</Text>
                )}
                <View 
                  style={[
                    styles.bar, 
                    isGold && styles.barGold,
                    { height: `${heightPercentage}%` },
                    isSelected && (isGold ? styles.barGoldSelected : styles.barSelected)
                  ]} 
                />
                <Text style={styles.barLabel} numberOfLines={1} ellipsizeMode="tail">{habit.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

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
    if (newHabitName.trim() === '') {
      Alert.alert('Fehler', 'Bitte gib einen Namen ein.');
      return;
    }

    const frequency = newHabitFrequency || 'Täglich';
    const descValue = newHabitDescription.trim() === '' ? undefined : newHabitDescription;
    const result = await handleSaveHabit(newHabitName, frequency, descValue, newHabitStartDate, newHabitTime, newHabitWeekDays, newHabitIntervalDays);
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
    <View style={styles.screenContainer}>
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

        {/* Example Habits Chart */}
        {renderChart()}

        {/* Streak Section */}
        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>
            Deine Streak
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
        </View>

        {/* Habit List Container */}
        <View style={styles.chartContainer}>
          {/* Today's Goals */}
          <ThemedText style={styles.chartTitle}>
            Heutige Habits:
          </ThemedText>

          {isLoadingHabits ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={Colors.light.accent} />
              <ThemedText style={styles.loadingMessage}>
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
        </View>
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


