import React from 'react';
import { Image } from 'expo-image';
import { View, ActivityIndicator } from 'react-native';
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
  } else if (streakNumber <= 66) {
    treeNumber = 6; // 56-66%
  } else {
    treeNumber = 7; // > 66% (bis 100%)
  }

  treeNumber = 7; // Testwert für Baum-Bild-Anzeige

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
  
  // Lade das dynamische Baum-Bild (nutzt Testwert 7)
  const treeSource = getTreeImage(70); // 70% für Baum 7

  if (isLoading) {
    return (
      <View style={[treeviewStyles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color="rgb(25, 145, 137)" />
        <ThemedText style={{ marginTop: 10 }}>Lädt Baum-Wachstum...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={[treeviewStyles.container, { backgroundColor }]}>
      
      {/* 1. Reihe: Die große Insel (mit Baum) */}
      <View style={treeviewStyles.rowContainer}>
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
      </View>

      {/* 2. Reihe: 2x insel_klein (Paar - Großer Abstand) */}
      <View style={treeviewStyles.rowContainer}>
        <Image source={INSEL_KLEIN_IMAGE} style={treeviewStyles.inselKleinPaar} contentFit="contain" />
        <Image source={INSEL_KLEIN_IMAGE} style={treeviewStyles.inselKleinPaar} contentFit="contain" />
      </View>

      {/* 3. Reihe: 1x insel_klein (Mittig, Groß) */}
      <View style={treeviewStyles.rowContainer}>
        <Image source={INSEL_KLEIN_IMAGE} style={treeviewStyles.inselKleinMiddle} contentFit="contain" />
      </View>

      {/* 4. Reihe: 2x insel_klein (Paar - Großer Abstand) */}
      <View style={treeviewStyles.rowContainer}>
        <Image source={INSEL_KLEIN_IMAGE} style={treeviewStyles.inselKleinPaar} contentFit="contain" />
        <Image source={INSEL_KLEIN_IMAGE} style={treeviewStyles.inselKleinPaar} contentFit="contain" />
      </View>
      
      {/* 5. Reihe: 1x insel_klein (Mittig, Klein) */}
      <View style={treeviewStyles.rowContainer}>
        <Image source={INSEL_KLEIN_IMAGE} style={treeviewStyles.inselKleinBottom} contentFit="contain" />
      </View>
      
      {/* 6. Reihe: 2x insel_klein (Paar - Unterste Reihe mit speziellem Abstand) */}
      <View style={treeviewStyles.rowContainer}>
        <Image 
          source={INSEL_KLEIN_IMAGE} 
          style={treeviewStyles.inselKleinPaarBottom} // <--- NEUER STYLE
          contentFit="contain" 
        />
        <Image 
          source={INSEL_KLEIN_IMAGE} 
          style={treeviewStyles.inselKleinPaarBottom} // <--- NEUER STYLE
          contentFit="contain" 
        />
      </View>

      {/* Optionaler Code-Block mit den Wachstums-Infos */}
      {/* ... */}
    </ThemedView>
  );
};

export default TreeView;

