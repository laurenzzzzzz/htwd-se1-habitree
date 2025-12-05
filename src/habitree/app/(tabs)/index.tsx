import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import {
  Pressable,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { HelloWave } from '@/presentation/ui/HelloWave';
import { ThemedText } from '@/presentation/ui/ThemedText';
import { ThemedView } from '@/presentation/ui/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { styles } from '../../styles/index_style';
import { useAuth } from '../../context/AuthContext';
import { useHabitsController } from '../../presentation/controllers/useHabitsController';
import { useQuoteController } from '../../presentation/controllers/useQuoteController';
import { useStreakController } from '../../presentation/controllers/useStreakController';
import { streakService } from '../../infrastructure/di/ServiceContainer';
import HabitModal from '../../presentation/ui/HabitModal';
import { QuoteBanner } from '../../presentation/ui/QuoteBanner';
import {
  FILTER_OPTIONS,
  CHART_MAP,
  PREDEFINED_HABITS,
  WEEKDAYS,
} from '../../constants/HomeScreenConstants';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const { currentUser } = useAuth();
  const {
    filteredHabits,
    isLoading: isLoadingHabits,
    selectedFilter,
    setSelectedFilter,
    today,
    fetchHabits,
    handleSaveHabit,
    handleToggleHabit,
    isSameDay,
  } = useHabitsController();
  const { quote, fetchQuote } = useQuoteController();
  const { streak, isLoading: isLoadingStreak } = useStreakController(streakService);

  // Local UI state only
  const [habitMode, setHabitMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [streakModalVisible, setStreakModalVisible] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddHabit = async () => {
    if (newHabitName.trim() === '' || newHabitDescription.trim() === '') {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    const result = await handleSaveHabit(newHabitName, newHabitDescription, 'Täglich');
    if (result.success) {
      setNewHabitName('');
      setNewHabitDescription('');
      setModalVisible(false);
      setHabitMode(null);
    } else {
      Alert.alert('Fehler', 'Speichern des Habits fehlgeschlagen.');
    }
  };

  const handleAddPredefinedHabit = async (label: string, description: string, frequency: string) => {
    const result = await handleSaveHabit(label, description, frequency);
    if (result.success) {
      setModalVisible(false);
      setHabitMode(null);
    } else {
      Alert.alert('Fehler', 'Speichern des vordefiniert Habits fehlgeschlagen.');
    }
  };

  const handleToggleHabitPress = async (id: number) => {
    const result = await handleToggleHabit(id, today.toISOString());
    if (!result.success) {
      Alert.alert('Fehler', 'Status-Update fehlgeschlagen. Bitte erneut versuchen.');
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

        {/* Statistics Section */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Deine Statistiken:
        </ThemedText>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chartSelector}
        >
          {FILTER_OPTIONS.map((option) => (
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
                  { color: '#000' },
                  selectedFilter === option.key && styles.chartButtonTextSelected,
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Chart */}
        <Image
          source={CHART_MAP[selectedFilter]}
          style={styles.chartImage}
          contentFit="contain"
        />

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
              {isLoadingStreak ? '...' : streak?.getDisplayText() || '0'}
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
        predefinedHabits={PREDEFINED_HABITS}
        newHabitName={newHabitName}
        newHabitDescription={newHabitDescription}
        setNewHabitName={setNewHabitName}
        setNewHabitDescription={setNewHabitDescription}
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
              Wow – {streak?.getDisplayText() || '0'} Tage am Stück!
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


