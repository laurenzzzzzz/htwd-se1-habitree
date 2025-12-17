import React, { useState } from 'react';
import { Image } from 'expo-image';
import { View, ActivityIndicator, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView'; 
import { treeviewStyles } from '../../styles/treeview_style';
import { TreeGrowth } from '../../domain/entities/TreeGrowth';

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
 */
const getTreeImage = (streakNumber: number) => {
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
  
  // Mock-Daten für Habits mit Streak-Zahlen
  // Sortiert nach Streak absteigend, damit größere Bäume oben stehen
  const mockHabits = [
    { id: 1, streak: 80, name: 'Joggen', description: '30 Minuten entspanntes Laufen im Park.' }, 
    { id: 2, streak: 60, name: 'Lesen', description: '20 Seiten in einem Buch lesen.' }, 
    { id: 3, streak: 55, name: 'Trinken', description: 'Mindestens 2 Liter Wasser trinken.' }, 
    { id: 4, streak: 55, name: 'Meditieren', description: '10 Minuten Achtsamkeitsmeditation.' }, 
    { id: 5, streak: 44, name: 'Lernen', description: 'Eine Stunde programmieren lernen.' }, 
    { id: 6, streak: 34, name: 'Aufräumen', description: '15 Minuten die Wohnung aufräumen.' }, 
    { id: 7, streak: 24, name: 'Kochen', description: 'Ein gesundes Abendessen zubereiten.' }, 
    { id: 8, streak: 24, name: 'Spazieren', description: 'Ein kurzer Spaziergang an der frischen Luft.' },
    { id: 9, streak: 15, name: 'Journaling', description: 'Gedanken und Erlebnisse des Tages aufschreiben.' },
    { id: 10, streak: 10, name: 'Dehnen', description: '10 Minuten Stretching am Morgen.' },
    { id: 11, streak: 5, name: 'Vokabeln', description: '10 neue Vokabeln lernen.' },
    { id: 12, streak: 2, name: 'Zahnseide', description: 'Tägliche Zahnreinigung nicht vergessen.' },
  ];

  const [isInfoVisible, setIsInfoVisible] = useState(true); // Standardmäßig sichtbar
  const [selectedItem, setSelectedItem] = useState<'main' | typeof mockHabits[0]>('main');

  // Konfigurierbare Streak-Zahl für den Haupt-Habit-Baum
  const HABITREE_STREAK = 66;

  // Lade das dynamische Baum-Bild basierend auf der Streak-Zahl
  const treeSource = getTreeImage(HABITREE_STREAK);

  const numberOfHabits = mockHabits.length;

  // Helper-Komponente für eine kleine Insel mit Baum
  const SmallIslandWithTree = ({ habit, style, treeStyle }: { habit: typeof mockHabits[0], style: any, treeStyle?: any }) => {
    const treeImg = getTreeImage(habit.streak);
    const isSelected = selectedItem !== 'main' && selectedItem.id === habit.id;
    
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

  const renderHabitIslands = () => {
    const rows = [];
    let habitIndex = 0;
    let isPairRow = true; // Start with a pair row

    while (habitIndex < numberOfHabits) {
      if (isPairRow) {
        const count = Math.min(2, numberOfHabits - habitIndex);
        const habitsInRow = mockHabits.slice(habitIndex, habitIndex + count);
        rows.push({ type: 'pair', habits: habitsInRow });
        habitIndex += count;
      } else {
        const habitsInRow = mockHabits.slice(habitIndex, habitIndex + 1);
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

  if (isLoading) {
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
                  Erfolgreiche Streak: {HABITREE_STREAK} Tage
                </Text>
                <Text style={treeviewStyles.infoBoxDescription}>
                  Du hast bereits an {HABITREE_STREAK} Tagen am Stück alle deiner Tages-Habits abgeschlossen und einen gigantischen habitree wachsen lassen!
                </Text>
              </View>
            </>
          ) : (
            // --- INDIVIDUAL HABIT INFO ---
            (() => {
              const progress = Math.min(100, Math.round((selectedItem.streak / 66) * 100));
              return (
                <>
                  <View style={treeviewStyles.infoBoxHeader}>
                    <Text style={treeviewStyles.infoBoxTitle}>Informationen: {selectedItem.name}</Text>
                    <Image 
                      source={require('@/assets/images/edit.png')} 
                      style={{ width: 20, height: 20 }}
                      contentFit="contain"
                    />
                  </View>
                  <View style={treeviewStyles.infoBoxContent}>
                    <Text style={treeviewStyles.infoBoxStreakText}>
                      {selectedItem.name}-Streak: {selectedItem.streak} Tage
                    </Text>
                    <Text style={treeviewStyles.infoBoxDescription} numberOfLines={1} ellipsizeMode="tail">
                      <Text style={{ fontWeight: 'bold' }}>Beschreibung:</Text> {selectedItem.description}
                    </Text>
                    
                    {/* Progress Bar */}
                    <View style={treeviewStyles.progressBarContainer}>
                      <View style={[treeviewStyles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    
                    {/* Percentage Badge */}
                    <View style={treeviewStyles.percentageBadge}>
                      <Text style={treeviewStyles.percentageText}>{progress}%</Text>
                    </View>
                  </View>
                </>
              );
            })()
          )}
        </View>
      )}
    </ThemedView>
  );
};

export default TreeView;

