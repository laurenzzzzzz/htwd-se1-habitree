import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/presentation/ui/ThemedText';
import { ThemedView } from '@/presentation/ui/ThemedView';
import { useHabits } from '../../context/HabitsContext';
import HabitModal from '../../presentation/ui/HabitModal';
import { styles } from '../../styles/index_style';

export default function CalendarScreen() {
  useThemeColor({}, 'background');

  const {
    habits,
    predefinedHabits,
    fetchPredefinedHabits,
    fetchHabits,
    handleToggleHabit,
    handleDeleteHabit,
    handleUpdateHabit,
    isLoading: isLoadingHabits,
  } = useHabits();
  // CalendarScreen render

  // modal/edit state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'menu' | 'custom' | 'predefined' | null>(null);
  const [editHabitId, setEditHabitId] = useState<number | null>(null);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitStartDate, setNewHabitStartDate] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('');
  const [newHabitWeekDays, setNewHabitWeekDays] = useState<number[]>([]);
  const [newHabitIntervalDays, setNewHabitIntervalDays] = useState('');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const shouldHabitOccurOnDate = (habit: any, date: Date): boolean => {
    if (!habit.startDate) return false;

    const startDate = new Date(habit.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Habit hat noch nicht angefangen
    if (date < startDate) return false;

    const daysDifference = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (habit.frequency === 'Täglich') {
      return true;
    } else if (habit.frequency === 'Wöchentlich') {
      const dayOfWeek = date.getDay();
      const mappedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday from 0 to 7
      return habit.weekDays?.includes(mappedDay) ?? false;
    } else if (habit.frequency === 'Intervalles') {
      return daysDifference % (habit.intervalDays ?? 1) === 0;
    }
    return false;
  };

  const todayHabits = habits.filter((h: any) =>
    Array.isArray(h.entries) && h.entries.some((e: any) => isSameDay(new Date(e.date), today))
  );

  const upcomingHabits = habits.filter((h: any) => {
    const hasEntryForTomorrow = Array.isArray(h.entries) && h.entries.some((e: any) => isSameDay(new Date(e.date), tomorrow));
    const shouldOccurTomorrow = shouldHabitOccurOnDate(h, tomorrow);
    return shouldOccurTomorrow && !hasEntryForTomorrow;
  });

  const handleToggle = async (id: number) => {
    try {
      await handleToggleHabit(id, new Date().toISOString());
    } catch (e) {
      console.warn('Toggle failed', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Heutige Habits Section */}
      <View style={{ borderWidth: 2, borderColor: '#000', borderRadius: 8, padding: 12, marginBottom: 20 }}>
        <View style={{ backgroundColor: 'rgb(131, 233, 142)', padding: 12, marginHorizontal: -12, marginTop: -12, marginBottom: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
          <ThemedText type="subtitle" style={[styles.habitTitle, { color: '#000000ff', marginTop: 0 }]}>
            Heutige Habits
          </ThemedText>
        </View>

        {isLoadingHabits ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" color="rgb(25, 145, 137)" />
          </View>
        ) : todayHabits.length > 0 ? (
          todayHabits.map((habit: any) => {
            const entryForToday = habit.entries.find((e: any) => isSameDay(new Date(e.date), today));
            const checked = entryForToday?.status ?? false;
            return (
              <View key={habit.id} style={styles.habitItem}>
                <Pressable onPress={() => handleToggle(habit.id)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
                  </View>
                  <View style={styles.habitTextContainer}>
                    <ThemedText style={styles.habitLabel}>{habit.name}</ThemedText>
                    <ThemedText style={styles.habitDescription}>{habit.description} ({habit.frequency})</ThemedText>
                  </View>
                </Pressable>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pressable onPress={() => {
                    // open edit modal prefilled
                    setEditHabitId(habit.id);
                    setNewHabitName(habit.name || '');
                    setNewHabitDescription(habit.description || '');
                    setNewHabitStartDate(habit.startDate ? new Date(habit.startDate).toLocaleDateString('de-DE') : '');
                    setNewHabitTime(habit.time || '');
                    setNewHabitFrequency(habit.frequency || '');
                    setNewHabitWeekDays(habit.weekDays || []);
                    setNewHabitIntervalDays(habit.intervalDays ? String(habit.intervalDays) : '');
                    setModalMode('custom');
                    setModalVisible(true);
                  }} style={{ padding: 8 }}>
                    <ThemedText>✏️</ThemedText>
                  </Pressable>
                  <Pressable onPress={() => {
                    Alert.alert('Löschen', 'Habit wirklich löschen?', [
                      { text: 'Abbrechen', style: 'cancel' },
                      { text: 'Löschen', style: 'destructive', onPress: async () => {
                        await handleDeleteHabit(habit.id);
                      } }
                    ]);
                  }} style={{ padding: 8 }}>
                    <ThemedText>🗑️</ThemedText>
                  </Pressable>
                </View>
              </View>
            );
          })
        ) : (
          <ThemedText style={styles.noHabitsText}>Keine Habits für heute.</ThemedText>
        )}
      </View>

      {/* Anstehende Habits Section */}
      <View style={{ borderWidth: 2, borderColor: '#000', borderRadius: 8, padding: 12, marginBottom: 20 }}>
        <View style={{ backgroundColor: 'rgb(255, 236, 136)', padding: 12, marginHorizontal: -12, marginTop: -12, marginBottom: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
          <ThemedText type="subtitle" style={[styles.habitTitle, { color: '#000000ff', marginTop: 0 }]}>
            Anstehende Habits für den nächsten Tag
          </ThemedText>
        </View>

        {isLoadingHabits ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" color="rgb(25, 145, 137)" />
          </View>
        ) : upcomingHabits.length > 0 ? (
          upcomingHabits.map((habit: any) => (
            <View key={habit.id} style={styles.habitItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={styles.habitTextContainer}>
                  <ThemedText style={styles.habitLabel}>{habit.name}</ThemedText>
                  <ThemedText style={styles.habitDescription}>{habit.description} ({habit.frequency})</ThemedText>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => {
                  // open edit modal prefilled
                  setEditHabitId(habit.id);
                  setNewHabitName(habit.name || '');
                  setNewHabitDescription(habit.description || '');
                  setNewHabitStartDate(habit.startDate ? new Date(habit.startDate).toLocaleDateString('de-DE') : '');
                  setNewHabitTime(habit.time || '');
                  setNewHabitFrequency(habit.frequency || '');
                  setNewHabitWeekDays(habit.weekDays || []);
                  setNewHabitIntervalDays(habit.intervalDays ? String(habit.intervalDays) : '');
                    setModalMode('custom');
                    setModalVisible(true);
                }} style={{ padding: 8 }}>
                  <ThemedText>✏️</ThemedText>
                </Pressable>
                <Pressable onPress={() => {
                  Alert.alert('Löschen', 'Habit wirklich löschen?', [
                    { text: 'Abbrechen', style: 'cancel' },
                    { text: 'Löschen', style: 'destructive', onPress: async () => {
                      await handleDeleteHabit(habit.id);
                    } }
                  ]);
                }} style={{ padding: 8 }}>
                  <ThemedText>🗑️</ThemedText>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noHabitsText}>Keine anstehenden Habits.</ThemedText>
        )}
      </View>

      {/* Alle Habits Section */}
      <View style={{ borderWidth: 2, borderColor: '#000', borderRadius: 8, padding: 12 }}>
        <View style={{ backgroundColor: 'rgb(255,112,112)', padding: 12, marginHorizontal: -12, marginTop: -12, marginBottom: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
          <ThemedText type="subtitle" style={[styles.habitTitle, { color: '#000000ff', marginTop: 0 }]}>
            Alle Habits
          </ThemedText>
        </View>

        {isLoadingHabits ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" color="rgb(25, 145, 137)" />
          </View>
        ) : habits.length > 0 ? (
          habits.map((habit: any) => (
            <View key={habit.id} style={styles.habitItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={styles.habitTextContainer}>
                  <ThemedText style={styles.habitLabel}>{habit.name}</ThemedText>
                  <ThemedText style={styles.habitDescription}>{habit.description} ({habit.frequency})</ThemedText>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => {
                  // open edit modal prefilled
                  setEditHabitId(habit.id);
                  setNewHabitName(habit.name || '');
                  setNewHabitDescription(habit.description || '');
                  setNewHabitStartDate(habit.startDate ? new Date(habit.startDate).toLocaleDateString('de-DE') : '');
                  setNewHabitTime(habit.time || '');
                  setNewHabitFrequency(habit.frequency || '');
                  setNewHabitWeekDays(habit.weekDays || []);
                  setNewHabitIntervalDays(habit.intervalDays ? String(habit.intervalDays) : '');
                  setModalVisible(true);
                }} style={{ padding: 8 }}>
                  <ThemedText>✏️</ThemedText>
                </Pressable>
                <Pressable onPress={() => {
                  Alert.alert('Löschen', 'Habit wirklich löschen?', [
                    { text: 'Abbrechen', style: 'cancel' },
                    { text: 'Löschen', style: 'destructive', onPress: async () => {
                      await handleDeleteHabit(habit.id);
                    } }
                  ]);
                }} style={{ padding: 8 }}>
                  <ThemedText>🗑️</ThemedText>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noHabitsText}>Keine Habits angelegt.</ThemedText>
        )}
      </View>
      <HabitModal
        visible={modalVisible}
        mode={modalMode ?? (editHabitId ? 'custom' : null)}
        onClose={() => {
          setModalVisible(false);
          setEditHabitId(null);
          setModalMode(null);
          setNewHabitName('');
          setNewHabitDescription('');
          setNewHabitStartDate('');
          setNewHabitTime('');
          setNewHabitFrequency('');
          setNewHabitWeekDays([]);
          setNewHabitIntervalDays('');
        }}
        onOpenMode={(m) => {
          if (m === 'predefined') fetchPredefinedHabits();
          setModalMode(m);
        }}
        predefinedHabits={predefinedHabits}
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
        onAddPredefined={() => {}}
        onSelectPredefined={(p) => {
          // Prefill custom form with selected predefined and switch to custom mode
          setNewHabitName(p.label);
          setNewHabitDescription(p.description);
          setNewHabitFrequency(p.frequency || 'Täglich');
          setModalMode('custom');
        }}
        onAddCustom={async () => {
          if (!editHabitId) return;
          const res = await handleUpdateHabit(editHabitId, newHabitName, newHabitDescription, newHabitFrequency || 'Täglich', newHabitStartDate, newHabitTime, newHabitWeekDays, newHabitIntervalDays);
          if (res.success) {
            setModalVisible(false);
            setEditHabitId(null);
          }
        }}
      />
    </ScrollView>
  );
}