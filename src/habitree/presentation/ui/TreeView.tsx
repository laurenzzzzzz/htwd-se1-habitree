import React, { useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { View, ActivityIndicator, ScrollView, TouchableOpacity, Text, Alert, Modal } from 'react-native';
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
 * Bestimmt das korrekte Baum-Bild (tree1.png bis tree8.png) basierend auf der Streak-Zahl.
 * @param streakNumber Die Streak-Zahl/den Fortschrittswert (entspricht 0-100)
 * @param isSelected Ob der Baum ausgewählt ist (dann treeX_selected.png)
 * @param isGrown Ob der Baum zu tree8 wachsen soll
 */
const getTreeImage = (streakNumber: number, isSelected: boolean = false, isGrown: boolean = false) => {
  // Wenn Baum wachsen lassen wurde, nutze tree8
  if (isGrown) {
    if (isSelected) {
      return require('@/assets/images/tree/tree8_selected.png');
    }
    return require('@/assets/images/tree/tree8.png');
  }

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
    handleGrowHabit,
    handleHarvestHabit,
  } = useHabits();
  const { streak, isLoading: isStreakLoading } = useStreakController();

  //type HabitItem = { id: number; streak: number; name: string; description: string };

  type HabitItem = { id: number; streak: number; maxStreak?: number | null; name: string; description: string; isHarvested?: number };

  const habitItems: HabitItem[] = useMemo(() => {
    const items: HabitItem[] = (habits || []).map(h => ({
      id: h.id,
      name: h.name,
      description: h.description ?? '',
      streak: typeof (h as any).getStreak === 'function' ? (h as any).getStreak() : 0,
      maxStreak: (h as any).maxStreak ?? null,
      isHarvested: (h as any).isHarvested ?? 0,
    }));
    return items.sort((a, b) => b.streak - a.streak);
  }, [habits]);

  const [isInfoVisible, setIsInfoVisible] = useState(true); // Standardmäßig sichtbar
  const [selectedItem, setSelectedItem] = useState<'main' | HabitItem>('main');
  const [showStreakInfoModal, setShowStreakInfoModal] = useState(false); // Info-Modal für Streak-Erklärung
  const [milestoneHabit, setMilestoneHabit] = useState<{ id: number; name: string; streak: number } | null>(null);
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  const [grownHabitIds, setGrownHabitIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // ensure habits are loaded when visiting Tree tab
    fetchHabits();
  }, [fetchHabits]);

  // Hydrate grownHabitIds from database (isHarvested = 1)
  useEffect(() => {
    if (habits && habits.length > 0) {
      const grownIds = new Set<number>();
      habits.forEach(habit => {
        if ((habit as any).isHarvested === 1) {
          grownIds.add(habit.id);
        }
      });
      setGrownHabitIds(grownIds);
    }
  }, [habits]);

  // Check for milestone habits (streak >= 66 and isHarvested = 0) and open modal
  useEffect(() => {
    if (habitItems.length > 0) {
      const habitWith66Streak = habitItems.find(h => h.streak >= 66 && h.isHarvested === 0);
      if (habitWith66Streak && !milestoneModalVisible) {
        setMilestoneHabit({
          id: habitWith66Streak.id,
          name: habitWith66Streak.name,
          streak: habitWith66Streak.streak,
        });
        setMilestoneModalVisible(true);
      }
    }
  }, [habitItems, milestoneModalVisible]);

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
  const mainMaxStreak = streak?.longestStreak ?? null;
  const mainGrowth = Math.min(100, mainStreakDays);

  // Lade das dynamische Baum-Bild basierend auf der Streak-Zahl (0-100)
  const treeSource = getTreeImage(mainGrowth, selectedItem === 'main');

  const numberOfHabits = habitItems.length;

  // Helper-Komponente für eine kleine Insel mit Baum
  const SmallIslandWithTree = ({ habit, style, treeStyle }: { habit: HabitItem, style: any, treeStyle?: any }) => {
    const isSelected = selectedItem !== 'main' && selectedItem.id === habit.id;
    const isGrown = habit.streak >= 66 && grownHabitIds.has(habit.id); // Nur zeige tree8 wenn Baum gewachsen ist
    const treeImg = getTreeImage(habit.streak, isSelected, isGrown);
    
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
                <TouchableOpacity onPress={() => setShowStreakInfoModal(true)}>
                  <Ionicons name="information-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={treeviewStyles.infoBoxContent}>
                <Text style={treeviewStyles.infoBoxStreakText}>
                  Erfolgreiche Streak: {mainStreakDays} {mainStreakDays === 1 ? 'Tag' : 'Tage'}
                  {mainMaxStreak ? <Text style={{ color: '#999' }}>      (beste Streak:{mainMaxStreak})</Text> : null}
                </Text>
                <Text style={treeviewStyles.infoBoxDescription}>
                  Du hast bereits an {mainStreakDays} {mainStreakDays === 1 ? 'Tag am Stück' : 'Tagen am Stück'} alle deiner Tages-Habits abgeschlossen und einen gigantischen habitree wachsen lassen!
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
                      style={[treeviewStyles.infoBoxTitle, treeviewStyles.infoBoxTitleExpanded]} 
                      numberOfLines={1} 
                      ellipsizeMode="tail"
                    >
                      Informationen: {selectedItem.name}
                    </Text>
                    {selectedItem.streak >= 66 && (
                      <TouchableOpacity
                        onPress={() => {
                          // Show modal if isHarvested = 0 or 1 (not 2)
                          if (selectedItem.isHarvested !== 2) {
                            setMilestoneHabit({
                              id: selectedItem.id,
                              name: selectedItem.name,
                              streak: selectedItem.streak,
                            });
                            setMilestoneModalVisible(true);
                          }
                        }}
                        style={[treeviewStyles.headerIconContainer, { marginRight: 8 }]}
                      >
                        <Image 
                          source={require('@/assets/images/trophy.png')} 
                          style={treeviewStyles.headerIcon} 
                          contentFit="contain" 
                        />
                      </TouchableOpacity>
                    )}
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
                      style={treeviewStyles.headerIconContainer}
                    >
                      <Image 
                        source={require('@/assets/images/edit.png')} 
                        style={treeviewStyles.headerIcon}
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
                      <Text style={[treeviewStyles.infoBoxStreakText, { marginBottom: 0 }]}>
                        -Streak: {selectedItem.streak} {selectedItem.streak === 1 ? 'Tag' : 'Tage'}
                        {selectedItem.maxStreak ? <Text style={{ color: '#999' }}> ({selectedItem.maxStreak})</Text> : null}
                      </Text>
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

      {/* Overlay wenn HabitModal offen ist */}
      {modalVisible && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }} />
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

      {/* Streak Info Modal */}
      <Modal
        visible={showStreakInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStreakInfoModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, marginHorizontal: 20, maxWidth: 400 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#000' }}>
              Was ist ein Streak?
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 20, color: '#333', marginBottom: 16 }}>
              Ein Streak ist eine ununterbrochene Folge von Tagen, an denen du alle deine Tages-Habits erfolgreich abgeschlossen hast.

              {'\n\n'}
              <Text style={{ fontWeight: 'bold' }}>Beispiel:</Text> Wenn du 5 Tage hintereinander alle deine Daily-Habits erledigst, hast du einen 5-Tage-Streak.

              {'\n\n'}
              <Text style={{ fontWeight: 'bold' }}>Dein habitree wächst</Text> mit jedem erfolgreichen Streak und wird größer, je länger dein Streak andauert!
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: 'rgb(25, 145, 137)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' }}
              onPress={() => setShowStreakInfoModal(false)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Verstanden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Milestone Modal (66+ Streak) */}
      <Modal
        visible={milestoneModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMilestoneModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, marginHorizontal: 20, maxWidth: 400, alignItems: 'center' }}>
            {/* Zurück Button */}
            <TouchableOpacity
              style={{ alignSelf: 'flex-start', marginBottom: 16, padding: 4 }}
              onPress={() => setMilestoneModalVisible(false)}
            >
              <Text style={{ fontSize: 24, color: '#666' }}>←</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#000' }}>
              🏆 Glückwunsch!
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 12, textAlign: 'center' }}>
              "{milestoneHabit?.name}" hat {milestoneHabit?.streak} Tage Streak erreicht!
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 24, textAlign: 'center' }}>
              Das ist eine großartige Leistung! 🌟
            </Text>

            {/* Action Buttons */}
            <View style={{ width: '100%', gap: 12 }}>
              <TouchableOpacity
                style={{ backgroundColor: 'rgb(25, 145, 137)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' }}
                onPress={async () => {
                  if (milestoneHabit) {
                    await handleHarvestHabit(milestoneHabit.id);
                    setMilestoneModalVisible(false);
                    fetchHabits(); // Refresh habits after harvest
                  }
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>🍎 Früchte Ernten</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: 'rgb(100, 200, 100)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' }}
                onPress={async () => {
                  if (milestoneHabit) {
                    const result = await handleGrowHabit(milestoneHabit.id);
                    if (result.success) {
                      setGrownHabitIds(prev => new Set([...prev, milestoneHabit.id]));
                    }
                    setMilestoneModalVisible(false);
                  }
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>🌱 Baum wachsen lassen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

export default TreeView;

