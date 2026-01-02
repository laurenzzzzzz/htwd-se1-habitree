import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Pressable, ActivityIndicator, ScrollView, Alert, Image, useWindowDimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/presentation/ui/ThemedText';
import { ThemedView } from '@/presentation/ui/ThemedView';
import { useHabitsController } from '../../presentation/controllers/useHabitsController';
import HabitModal from '../../presentation/ui/HabitModal';
import { styles as homeStyles } from '../../styles/index_style';
import { shouldHabitOccurOnDate } from '../../domain/policies/HabitSchedulePolicy';
import { createCalendarScreenStyles, calendarThemeConfig } from '../../styles/calendar_screen_style';
import { Colors } from '../../constants/Colors';

// Bilder importieren
const EditIcon = require('../../assets/images/edit.png');
const DeleteIcon = require('../../assets/images/delete.png');

LocaleConfig.locales.de = {
  monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  today: 'Heute',
};
LocaleConfig.defaultLocale = 'de';

type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const buildIsoStringForDate = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(12, 0, 0, 0);
  return copy.toISOString();
};

const buildDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarScreen() {
  useThemeColor({}, 'background');
  const { width, height } = useWindowDimensions();
  const calendarStyles = useMemo(() => createCalendarScreenStyles(width, height), [width, height]);

  const {
    habits,
    predefinedHabits,
    fetchPredefinedHabits,
    fetchHabits,
    handleToggleHabit,
    handleDeleteHabit,
    handleUpdateHabit,
    handleSaveHabit,
    isSameDay,
    isLoading: isLoadingHabits,
  } = useHabitsController();
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

  const [today, setToday] = useState(() => {
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    return current;
  });

  const [selectedDate, setSelectedDate] = useState(() => buildDateKey(today));
  const [calendarInstanceKey, setCalendarInstanceKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'calendar' | 'all'>('calendar');

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
    setSelectedDate(buildDateKey(now));
    setCalendarInstanceKey((prev) => prev + 1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      setToday(now);
      setSelectedDate(buildDateKey(now));
      setCalendarInstanceKey((prev) => prev + 1);
    }, [])
  );

  const selectedDateObj = useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const parsed = new Date(year, (month || 1) - 1, day || 1);
    parsed.setHours(0, 0, 0, 0);
    return parsed;
  }, [selectedDate]);

  const selectedDateIsToday = useMemo(() => isSameDay(selectedDateObj, today), [selectedDateObj, today, isSameDay]);

  const formattedSelectedDate = useMemo(
    () => selectedDateObj.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }),
    [selectedDateObj]
  );

  const selectedDateShortLabel = useMemo(
    () => selectedDateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    [selectedDateObj]
  );

  const selectedDayHabits = useMemo(
    () =>
      habits.filter((habit: any) => {
        const occurs = shouldHabitOccurOnDate(habit, selectedDateObj);
        const hasEntryForDay = Array.isArray(habit.entries) && habit.entries.some((entry: any) => isSameDay(new Date(entry.date), selectedDateObj));
        return occurs || hasEntryForDay;
      }),
    [habits, selectedDateObj, isSameDay]
  );

  const markedDates = useMemo(
    () => ({
      [selectedDate]: {
        selected: true,
        selectedColor: Colors.light.accent,
        selectedTextColor: '#000',
      },
    }),
    [selectedDate]
  );

  const handleToggle = async (id: number, date: Date = selectedDateObj) => {
    try {
      await handleToggleHabit(id, buildIsoStringForDate(date));
    } catch (e) {
      console.warn('Toggle failed', e);
    }
  };

  return (
    <ThemedView style={calendarStyles.screenContainer}>
      <ScrollView contentContainerStyle={calendarStyles.scrollContent}>
        <View style={calendarStyles.viewToggleRow}>
          <Pressable
            onPress={() => setActiveTab('calendar')}
            style={[
              calendarStyles.viewTogglePill,
              activeTab === 'calendar' && calendarStyles.viewTogglePillActive,
            ]}
          >
            <ThemedText
              style={[
                calendarStyles.viewToggleText,
                activeTab === 'calendar' && calendarStyles.viewToggleTextActive,
              ]}
            >
              Kalender
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('all')}
            style={[
              calendarStyles.viewTogglePill,
              activeTab === 'all' && calendarStyles.viewTogglePillActive,
            ]}
          >
            <ThemedText
              style={[
                calendarStyles.viewToggleText,
                activeTab === 'all' && calendarStyles.viewToggleTextActive,
              ]}
            >
              Alle Habits
            </ThemedText>
          </Pressable>
        </View>

        {activeTab === 'calendar' ? (
          <>
            {/* Kalender Section */}
            <View style={calendarStyles.sectionCard}>
              <View style={[calendarStyles.sectionBanner, calendarStyles.sectionBannerCalendar]}>
                <ThemedText type="subtitle" style={[homeStyles.habitTitle, calendarStyles.sectionHeaderTitle]}>
                  Kalender
                </ThemedText>
              </View>
              <ThemedText style={calendarStyles.calendarHint}>
                Wähle einen Tag aus, um deine Habits zu sehen.
              </ThemedText>
              <View style={calendarStyles.calendarWrapper}>
                <Calendar
                  key={`${calendarInstanceKey}-${selectedDate}`}
                  style={calendarStyles.calendarComponent}
                  current={selectedDate}
                  initialDate={selectedDate}
                  onDayPress={(day: CalendarDay) => setSelectedDate(day.dateString)}
                  markedDates={markedDates}
                  theme={calendarThemeConfig}
                  firstDay={1}
                  enableSwipeMonths
                  hideExtraDays
                />
              </View>
            </View>

            {/* Habits am ausgewählten Tag */}
            <View style={calendarStyles.sectionCard}>
              <View style={[calendarStyles.sectionBanner, calendarStyles.sectionBannerToday]}>
                <ThemedText type="subtitle" style={[homeStyles.habitTitle, calendarStyles.sectionHeaderTitle]}>
                  {selectedDateIsToday ? 'Heutige Habits' : `Habits am Tag ${selectedDateShortLabel}`}
                </ThemedText>
              </View>
              <View style={calendarStyles.selectedDateRow}>
                <ThemedText style={calendarStyles.selectedDateText}>{formattedSelectedDate}</ThemedText>
                {selectedDateIsToday && (
                  <View style={calendarStyles.selectedDateBadge}>
                    <ThemedText style={calendarStyles.selectedDateBadgeText}>Heute</ThemedText>
                  </View>
                )}
              </View>

              {isLoadingHabits ? (
                <View style={calendarStyles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.light.accent} />
                </View>
              ) : selectedDayHabits.length > 0 ? (
                selectedDayHabits.map((habit: any) => {
                  const entryForSelectedDay = Array.isArray(habit.entries)
                    ? habit.entries.find((e: any) => isSameDay(new Date(e.date), selectedDateObj))
                    : null;
                  const checked = entryForSelectedDay?.status ?? false;
                  return (
                    <View key={habit.id} style={homeStyles.habitItem}>
                      {selectedDateIsToday ? (
                        <Pressable onPress={() => handleToggle(habit.id, selectedDateObj)} style={calendarStyles.habitPressable}>
                          <View style={[homeStyles.checkbox, checked && homeStyles.checkboxChecked]}>
                            {checked && <ThemedText style={homeStyles.checkmark}>✓</ThemedText>}
                          </View>
                          <View style={homeStyles.habitTextContainer}>
                            <ThemedText style={homeStyles.habitLabel}>{habit.name}</ThemedText>
                            <ThemedText style={homeStyles.habitDescription}>{habit.description} ({habit.frequency})</ThemedText>
                          </View>
                        </Pressable>
                      ) : (
                        <View style={calendarStyles.habitPressable}>
                          <View style={homeStyles.habitTextContainer}>
                            <ThemedText style={homeStyles.habitLabel}>{habit.name}</ThemedText>
                            <ThemedText style={homeStyles.habitDescription}>{habit.description} ({habit.frequency})</ThemedText>
                          </View>
                        </View>
                      )}
                      <View style={calendarStyles.actionRow}>
                        <Pressable onPress={() => {
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
                        }} style={calendarStyles.actionControl}>
                          <Image source={EditIcon} style={calendarStyles.actionIcon} />
                        </Pressable>
                        <Pressable onPress={() => {
                          Alert.alert('Löschen', 'Habit wirklich löschen?', [
                            { text: 'Abbrechen', style: 'cancel' },
                            { text: 'Löschen', style: 'destructive', onPress: async () => {
                              await handleDeleteHabit(habit.id);
                            } }
                          ]);
                        }} style={calendarStyles.actionControl}>
                          <Image source={DeleteIcon} style={calendarStyles.actionIcon} />
                        </Pressable>
                      </View>
                    </View>
                  );
                })
              ) : (
                <ThemedText style={homeStyles.noHabitsText}>Keine Habits für diesen Tag.</ThemedText>
              )}
            </View>
          </>
        ) : (
          <View style={calendarStyles.sectionCard}>
            <View style={[calendarStyles.sectionBanner, calendarStyles.sectionBannerAll]}>
              <ThemedText type="subtitle" style={[homeStyles.habitTitle, calendarStyles.sectionHeaderTitle]}>
                Alle Habits
              </ThemedText>
            </View>

            {isLoadingHabits ? (
              <View style={calendarStyles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.light.accent} />
              </View>
            ) : habits.length > 0 ? (
              habits.map((habit: any) => (
                <View key={habit.id} style={homeStyles.habitItem}>
                  <View style={calendarStyles.habitPressable}>
                    <View style={homeStyles.habitTextContainer}>
                      <ThemedText style={homeStyles.habitLabel}>{habit.name}</ThemedText>
                      <ThemedText style={homeStyles.habitDescription}>{habit.description} ({habit.frequency})</ThemedText>
                    </View>
                  </View>
                  <View style={calendarStyles.actionRow}>
                    <Pressable onPress={() => {
                      setEditHabitId(habit.id);
                      setNewHabitName(habit.name || '');
                      setNewHabitDescription(habit.description || '');
                      setNewHabitStartDate(habit.startDate ? new Date(habit.startDate).toLocaleDateString('de-DE') : '');
                      setNewHabitTime(habit.time || '');
                      setNewHabitFrequency(habit.frequency || '');
                      setNewHabitWeekDays(habit.weekDays || []);
                      setNewHabitIntervalDays(habit.intervalDays ? String(habit.intervalDays) : '');
                      setModalVisible(true);
                    }} style={calendarStyles.actionControl}>
                      <Image source={EditIcon} style={calendarStyles.actionIcon} />
                    </Pressable>
                    <Pressable onPress={() => {
                      Alert.alert('Löschen', 'Habit wirklich löschen?', [
                        { text: 'Abbrechen', style: 'cancel' },
                        { text: 'Löschen', style: 'destructive', onPress: async () => {
                          await handleDeleteHabit(habit.id);
                        } }
                      ]);
                    }} style={calendarStyles.actionControl}>
                      <Image source={DeleteIcon} style={calendarStyles.actionIcon} />
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <ThemedText style={homeStyles.noHabitsText}>Keine Habits angelegt.</ThemedText>
            )}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={homeStyles.fab}
        onPress={() => {
          setModalMode('menu');
          setModalVisible(true);
        }}
      >
        <ThemedText style={homeStyles.fabText}>＋</ThemedText>
      </Pressable>

      <HabitModal
        visible={modalVisible}
        mode={modalMode ?? (editHabitId ? 'custom' : null)}
        submitLabel={editHabitId ? 'Speichern' : 'Hinzufügen'}
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
    </ThemedView>
  );
}