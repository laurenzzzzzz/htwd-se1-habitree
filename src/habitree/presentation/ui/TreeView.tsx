import React, { useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { View, ActivityIndicator, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView'; 
import { treeviewStyles } from '../../styles/treeview_style';
import { TreeGrowth } from '../../domain/entities/TreeGrowth';
import { useHabits } from '../../context/HabitsContext';
import { useStreakController } from '../controllers/useStreakController';
import HabitModal from './HabitModal';

type Props = {
  treeGrowth: TreeGrowth | null;
  isLoading: boolean;
  backgroundColor: string;
};

// WICHTIG: Die Insel wird als Hintergrund benötigt.
const INSEL_GROSS_IMAGE = require('@/assets/images/tree/insel_groß.png');
const INSEL_KLEIN_IMAGE = require('@/assets/images/tree/insel_klein.png');

/**
 * Bestimmt das korrekte Baum-Bild (tree1.png bis tree7.png) basierend auf der Streak-Zahl.
 * @param streakNumber Die Streak-Zahl/den Fortschrittswert (entspricht 0-100)
 * @param isSelected Ob der Baum ausgewählt ist (dann treeX_selected.png)
 */
const getTreeImage = (streakNumber: number, isSelected: boolean = false) => {
  let treeNumber: number;

  if (!streakNumber || streakNumber <= 11) {
    treeNumber = 1; // 0-11%
  } else if (streakNumber <= 22) {
    treeNumber = 2; // 12-22%
  } else if (streakNumber <= 33) {
    treeNumber = 3; // 23-33%
  } else if (streakNumber <= 44) {
    treeNumber = 4; // 34-44%
  } else if (streakNumber <= 55) {
    treeNumber = 5; // 45-55%
  } else if (streakNumber <= 65) {
    treeNumber = 6; // 56-66%
  } else {
    treeNumber = 7; // > 66% (bis 100%)
  }

  if (isSelected) {
    switch (treeNumber) {
      case 1:
        return require('@/assets/images/tree/tree1_selected.png');
      case 2:
        return require('@/assets/images/tree/tree2_selected.png');
      case 3:
        return require('@/assets/images/tree/tree3_selected.png');
      case 4:
        return require('@/assets/images/tree/tree4_selected.png');
      case 5:
        return require('@/assets/images/tree/tree5_selected.png');
      case 6:
        return require('@/assets/images/tree/tree6_selected.png');
      case 7:
      default:
        return require('@/assets/images/tree/tree7_selected.png');
    }
  }

  // Wichtig: React Native muss alle require-Pfade statisch kennen
  switch (treeNumber) {
    case 1:
      return require('@/assets/images/tree/tree1.png');
    case 2:
      return require('@/assets/images/tree/tree2.png');
    case 3:
      return require('@/assets/images/tree/tree3.png');
    case 4:
      return require('@/assets/images/tree/tree4.png');
    case 5:
      return require('@/assets/images/tree/tree5.png');
    case 6:
      return require('@/assets/images/tree/tree6.png');
    case 7:
    default:
      return require('@/assets/images/tree/tree7.png');
  }
};

export const TreeView: React.FC<Props> = ({ treeGrowth, isLoading, backgroundColor }) => {
  const {
    habits,
    fetchHabits,
    isLoading: isHabitsLoading,
    predefinedHabits,
    fetchPredefinedHabits,
    handleSaveHabit,
    handleUpdateHabit,
  } = useHabits();
  const { streak, isLoading: isStreakLoading } = useStreakController();

  type HabitItem = { id: number; streak: number; name: string; description: string };

  const habitItems: HabitItem[] = useMemo(() => {
    const items: HabitItem[] = (habits || []).map(h => ({
      id: h.id,
      name: h.name,
      description: h.description ?? '',
      streak: typeof (h as any).getStreak === 'function' ? (h as any).getStreak() : 0,
    }));
    return items.sort((a, b) => b.streak - a.streak);
  }, [habits]);

  useEffect(() => {
    // ensure habits are loaded when visiting Tree tab
    fetchHabits();
  }, [fetchHabits]);

  const [isInfoVisible, setIsInfoVisible] = useState(true); // Standardmäßig sichtbar
  const [selectedItem, setSelectedItem] = useState<'main' | HabitItem>('main');

  // Modal/Edit state (reuse HabitModal like Habit view)
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

  // Hauptbaum: echte Streak-Tage (Gesamt-Streak)
  const mainStreakDays = streak?.currentStreak ?? 0;
  const mainGrowth = Math.min(100, mainStreakDays);

  // Lade das dynamische Baum-Bild basierend auf der Streak-Zahl (0-100)
  const treeSource = getTreeImage(mainGrowth, selectedItem === 'main');

  const numberOfHabits = habitItems.length;

  // Helper-Komponente für eine kleine Insel mit Baum
  const SmallIslandWithTree = ({ habit, style, treeStyle }: { habit: HabitItem, style: any, treeStyle?: any }) => {
    const isSelected = selectedItem !== 'main' && selectedItem.id === habit.id;
    const treeImg = getTreeImage(habit.streak, isSelected);
    
    return (
      <TouchableOpacity 
        style={[style, isSelected && treeviewStyles.selectedContainer]}  
        onPress={() => {
          setSelectedItem(habit);
          setIsInfoVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Image 
          source={INSEL_KLEIN_IMAGE} 
          style={treeviewStyles.smallIslandImage} 
          contentFit="contain" 
        />
        <Image 
          source={treeImg} 
          style={[treeviewStyles.smallTreeOverlay, treeStyle]} 
          contentFit="contain" 
        />
      </TouchableOpacity>
    );
  };

  const handleNextHabit = () => {
    if (selectedItem === 'main') return;
    const currentIndex = habitItems.findIndex(h => h.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % habitItems.length;
    setSelectedItem(habitItems[nextIndex]);
  };

  const handlePrevHabit = () => {
    if (selectedItem === 'main') return;
    const currentIndex = habitItems.findIndex(h => h.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + habitItems.length) % habitItems.length;
    setSelectedItem(habitItems[prevIndex]);
  };

  const renderHabitIslands = () => {
    const rows = [];
    let habitIndex = 0;
    let isPairRow = true; // Start with a pair row

    while (habitIndex < numberOfHabits) {
      if (isPairRow) {
        const count = Math.min(2, numberOfHabits - habitIndex);
        const habitsInRow = habitItems.slice(habitIndex, habitIndex + count);
        rows.push({ type: 'pair', habits: habitsInRow });
        habitIndex += count;
      } else {
        const habitsInRow = habitItems.slice(habitIndex, habitIndex + 1);
        rows.push({ type: 'middle', habits: habitsInRow });
        habitIndex += 1;
      }
      isPairRow = !isPairRow;
    }

    return rows.map((row, index) => (
      <View key={index} style={treeviewStyles.rowContainer}>
        {row.type === 'pair' ? (
          <>
            <SmallIslandWithTree 
              habit={row.habits[0]} 
              style={treeviewStyles.inselKleinPaar} 
            />
            {row.habits.length === 2 ? (
              <SmallIslandWithTree 
                habit={row.habits[1]} 
                style={treeviewStyles.inselKleinPaar} 
              />
            ) : (
              <View style={[treeviewStyles.inselKleinPaar, { opacity: 0 }]} />
            )}
          </>
        ) : (
          <SmallIslandWithTree 
            habit={row.habits[0]} 
            style={treeviewStyles.inselKleinMiddle} 
            treeStyle={treeviewStyles.smallTreeOverlayMiddle}
          />
        )}
      </View>
    ));
  };

  if (isLoading || isHabitsLoading || isStreakLoading) {
    return (
      <View style={[treeviewStyles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color="rgb(25, 145, 137)" />
        <ThemedText style={{ marginTop: 10 }}>Lädt Baum-Wachstum...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ScrollView contentContainerStyle={treeviewStyles.scrollContentContainer} showsVerticalScrollIndicator={false}>
      
        {/* 1. Reihe: Die große Insel (mit Baum) */}
        <TouchableOpacity 
          style={[
            treeviewStyles.rowContainer, 
            { marginBottom: -80 },
            selectedItem === 'main' && treeviewStyles.selectedContainer
          ]}  
          onPress={() => {
            setSelectedItem('main');
            setIsInfoVisible(true);
          }}
          activeOpacity={0.9}
        >
          <Image
            source={INSEL_GROSS_IMAGE}
            style={treeviewStyles.inselGrossTop}
            contentFit="contain"
          />
          <Image
            source={treeSource}
            style={treeviewStyles.treeOverlay}
            contentFit="contain"
          />
        </TouchableOpacity>

        {/* Generierte Reihen für Habits */}
        {renderHabitIslands()}

      </ScrollView>

      {/* Info Box Overlay */}
      {isInfoVisible && (
        <View style={treeviewStyles.infoBoxContainer}>
          {selectedItem === 'main' ? (
            // --- MAIN HABITREE INFO ---
            <>
              <View style={treeviewStyles.infoBoxHeader}>
                <Text style={treeviewStyles.infoBoxTitle}>Informationen: habitree</Text>
                <Ionicons name="information-circle-outline" size={24} color="black" />
              </View>
              <View style={treeviewStyles.infoBoxContent}>
                <Text style={treeviewStyles.infoBoxStreakText}>
                  Erfolgreiche Streak: {mainStreakDays} Tage
                </Text>
                <Text style={treeviewStyles.infoBoxDescription}>
                  Du hast bereits an {mainStreakDays} Tagen am Stück alle deiner Tages-Habits abgeschlossen und einen gigantischen habitree wachsen lassen!
                </Text>
              </View>
            </>
          ) : (
            // --- INDIVIDUAL HABIT INFO ---
            (() => {
              const progress = Math.min(100, selectedItem.streak);
              return (
                <>
                  <View style={treeviewStyles.infoBoxHeader}>
                    <Text 
                      style={[treeviewStyles.infoBoxTitle, { flex: 1, marginRight: 8 }]} 
                      numberOfLines={1} 
                      ellipsizeMode="tail"
                    >
                      Informationen: {selectedItem.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const habit = habits.find(h => h.id === selectedItem.id);
                        if (!habit) return;
                        setEditHabitId(habit.id);
                        setNewHabitName(habit.name || '');
                        setNewHabitDescription(habit.description || '');
                        setNewHabitStartDate(habit.startDate ? new Date(habit.startDate as any).toLocaleDateString('de-DE') : '');
                        setNewHabitTime(habit.time || '');
                        setNewHabitFrequency(habit.frequency || '');
                        setNewHabitWeekDays(habit.weekDays || []);
                        setNewHabitIntervalDays(habit.intervalDays ? String(habit.intervalDays) : '');
                        setModalMode('custom');
                        setModalVisible(true);
                      }}
                      style={{ padding: 4 }}
                    >
                      <Image 
                        source={require('@/assets/images/edit.png')} 
                        style={{ width: 20, height: 20 }}
                        contentFit="contain"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={treeviewStyles.infoBoxContent}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Text 
                        style={[treeviewStyles.infoBoxStreakText, { marginBottom: 0, flexShrink: 1 }]} 
                        numberOfLines={1} 
                        ellipsizeMode="tail"
                      >
                        {selectedItem.name}
                      </Text>
                      <Text style={[treeviewStyles.infoBoxStreakText, { marginBottom: 0 }]}>-Streak: {selectedItem.streak} Tage</Text>
                    </View>
                    <Text style={treeviewStyles.infoBoxDescription} numberOfLines={1} ellipsizeMode="tail">
                      <Text style={{ fontWeight: 'bold' }}>Beschreibung:</Text> {selectedItem.description || 'Keine Beschreibung'}
                    </Text>
                    
                    {/* Progress Bar */}
                    <View style={treeviewStyles.progressBarContainer}>
                      <View style={[treeviewStyles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    
                    {/* Percentage Badge with Navigation */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -5 }}>
                      <TouchableOpacity onPress={handlePrevHabit} style={{ padding: 5 }}>
                         <MaterialIcons name="keyboard-arrow-left" size={36} color="rgb(25, 145, 137)" />
                      </TouchableOpacity>
                      
                      <View style={[treeviewStyles.percentageBadge, { marginTop: 0, marginHorizontal: 10 }]}>
                        <Text style={treeviewStyles.percentageText}>{progress}%</Text>
                      </View>

                      <TouchableOpacity onPress={handleNextHabit} style={{ padding: 5 }}>
                         <MaterialIcons name="keyboard-arrow-right" size={36} color="rgb(25, 145, 137)" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              );
            })()
          )}
        </View>
      )}

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
        onAddPredefined={async (label, description, freq) => {
          const result = await handleSaveHabit(label, description, freq);
          if (result.success) {
            setModalVisible(false);
            setModalMode(null);
          } else {
            Alert.alert('Fehler', result.error || 'Speichern fehlgeschlagen.');
          }
        }}
        onSelectPredefined={(p) => {
          setNewHabitName(p.label);
          setNewHabitDescription(p.description);
          setNewHabitFrequency(p.frequency || 'Täglich');
          setModalMode('custom');
        }}
        onAddCustom={async () => {
          if (editHabitId) {
            const res = await handleUpdateHabit(
              editHabitId,
              newHabitName,
              newHabitDescription,
              newHabitFrequency || 'Täglich',
              newHabitStartDate,
              newHabitTime,
              newHabitWeekDays,
              newHabitIntervalDays
            );
            if (res.success) {
              setModalVisible(false);
              setEditHabitId(null);
              // Update selected item UI immediately
              setSelectedItem((prev) => {
                if (prev === 'main') return prev;
                if (prev.id !== editHabitId) return prev;
                return {
                  ...prev,
                  name: newHabitName,
                  description: newHabitDescription || '',
                };
              });
              await fetchHabits();
            } else {
              Alert.alert('Fehler', res.error || 'Speichern fehlgeschlagen.');
            }
          } else {
            if (newHabitName.trim() === '') {
              Alert.alert('Fehler', 'Bitte gib einen Namen ein.');
              return;
            }
            const freq = newHabitFrequency || 'Täglich';
            const descValue = newHabitDescription.trim() === '' ? undefined : newHabitDescription;
            const result = await handleSaveHabit(newHabitName, descValue, freq, newHabitStartDate, newHabitTime, newHabitWeekDays, newHabitIntervalDays);
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
};

export default TreeView;

