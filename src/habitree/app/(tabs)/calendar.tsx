import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, ActivityIndicator, ScrollView, Alert, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/presentation/ui/ThemedText';
import { ThemedView } from '@/presentation/ui/ThemedView';
import { useHabits } from '../../context/HabitsContext';
import HabitModal from '../../presentation/ui/HabitModal';
import { styles } from '../../styles/index_style';
import { shouldHabitOccurOnDate } from '../../domain/services/HabitSchedulePolicy';

// Bilder importieren
const EditIcon = require('../../assets/images/edit.png');
const DeleteIcon = require('../../assets/images/delete.png');

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
    handleSaveHabit,
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

  // Initialize form with current date and time when opening custom habit creation
  useEffect(() => {
    if (modalMode === 'custom' && !editHabitId && newHabitStartDate === '' && newHabitTime === '') {
      const now = new Date();
      const dateStr = now.toLocaleDateString('de-DE');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      
      setNewHabitStartDate(dateStr);
      setNewHabitTime(timeStr);
      if (!newHabitFrequency) {
        setNewHabitFrequency('Täglich');
      }
    }
  }, [modalMode, editHabitId]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Heutige Habits Section */}
      <View style={{ borderWidth: 2, borderColor: 'rgb(25, 145, 137)', borderRadius: 8, padding: 12, marginBottom: 20 }}>
        <View style={{ backgroundColor: 'rgb(131, 233, 142)', padding: 12, marginHorizontal: -12, marginTop: -12, marginBottom: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
          <ThemedText type="subtitle" style={[styles.habitTitle, { color: 'black', marginTop: -2, marginBottom: -2 }]}>
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
                    <Image source={EditIcon} style={{ width: 21, height: 21 }} /> 
                  </Pressable>
                  <Pressable onPress={() => {
                    Alert.alert('Löschen', 'Habit wirklich löschen?', [
                      { text: 'Abbrechen', style: 'cancel' },
                      { text: 'Löschen', style: 'destructive', onPress: async () => {
                        await handleDeleteHabit(habit.id);
                      } }
                    ]);
                  }} style={{ padding: 8 }}>
                    <Image source={DeleteIcon} style={{ width: 21, height: 21 }} />
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
      <View style={{ borderWidth: 2, borderColor: 'rgb(25, 145, 137)', borderRadius: 8, padding: 12, marginBottom: 20 }}>
        <View style={{ backgroundColor: 'rgb(255, 236, 136)', padding: 12, marginHorizontal: -12, marginTop: -12, marginBottom: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
          <ThemedText type="subtitle" style={[styles.habitTitle, { color: 'black', marginTop: -2, marginBottom: -2 }]}>
            Morgige Habits
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
                  <Image source={EditIcon} style={{ width: 21, height: 21 }} />
                </Pressable>
                <Pressable onPress={() => {
                  Alert.alert('Löschen', 'Habit wirklich löschen?', [
                    { text: 'Abbrechen', style: 'cancel' },
                    { text: 'Löschen', style: 'destructive', onPress: async () => {
                      await handleDeleteHabit(habit.id);
                    } }
                  ]);
                }} style={{ padding: 8 }}>
                  <Image source={DeleteIcon} style={{ width: 21, height: 21 }} />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noHabitsText}>Keine anstehenden Habits.</ThemedText>
        )}
      </View>

      {/* Alle Habits Section */}
      <View style={{ borderWidth: 2, borderColor: 'rgb(25, 145, 137)', borderRadius: 8, padding: 12 }}>
        <View style={{ backgroundColor: 'rgb(255,112,112)', padding: 12, marginHorizontal: -12, marginTop: -12, marginBottom: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
          <ThemedText type="subtitle" style={[styles.habitTitle, { color: 'black', marginTop: -2, marginBottom: -2 }]}>
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
                  <Image source={EditIcon} style={{ width: 21, height: 21 }} />
                </Pressable>
                <Pressable onPress={() => {
                  Alert.alert('Löschen', 'Habit wirklich löschen?', [
                    { text: 'Abbrechen', style: 'cancel' },
                    { text: 'Löschen', style: 'destructive', onPress: async () => {
                      await handleDeleteHabit(habit.id);
                    } }
                  ]);
                }} style={{ padding: 8 }}>
                  <Image source={DeleteIcon} style={{ width: 21, height: 21 }} />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noHabitsText}>Keine Habits angelegt.</ThemedText>
        )}
      </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          setModalMode('menu');
          setModalVisible(true);
        }}
      >
        <ThemedText style={styles.fabText}>＋</ThemedText>
      </Pressable>

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
        onAddPredefined={async (label, description, frequency) => {
          const result = await handleSaveHabit(label, description, frequency);
          if (result.success) {
            setModalVisible(false);
            setModalMode(null);
          } else {
            Alert.alert('Fehler', result.error || 'Speichern fehlgeschlagen.');
          }
        }}
        onSelectPredefined={(p) => {
          // Prefill custom form with selected predefined and switch to custom mode
          setNewHabitName(p.label);
          setNewHabitDescription(p.description);
          setNewHabitFrequency(p.frequency || 'Täglich');
          setModalMode('custom');
        }}
        onAddCustom={async () => {
          if (editHabitId) {
            const res = await handleUpdateHabit(editHabitId, newHabitName, newHabitDescription, newHabitFrequency || 'Täglich', newHabitStartDate, newHabitTime, newHabitWeekDays, newHabitIntervalDays);
            if (res.success) {
              setModalVisible(false);
              setEditHabitId(null);
            }
          } else {
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
              setModalMode(null);
            } else {
              Alert.alert('Fehler', result.error || 'Speichern fehlgeschlagen.');
            }
          }
        }}
      />
    </View>
  );
}