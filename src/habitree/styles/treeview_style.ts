import { StyleSheet, Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// --- ZENTRALE VARIABLEN FÜR STYLES ---

// Zentraler Wert zur Steuerung der vertikalen Abstände der kleinen Inseln.
// Ein HÖHERER negativer Wert (-120 ist enger als -80) reduziert den Abstand.
const ROW_GAP_NEG = -90; 

// Die Breite des Row-Containers
const ROW_CONTAINER_WIDTH = windowWidth * 0.8;
const ROW_CONTAINER_HEIGHT = windowWidth * 0.35; 

// Werte für die große Insel (Reihe 1)
const INSEL_GROSS_SIZE = windowWidth * 0.35;
// Die vertikale Position der großen Insel, um sie im oberen Bereich (ca. 2/3 des Containers) zu platzieren.
// WICHTIG: Berechnung außerhalb des StyleSheet.create
const INSEL_GROSS_TOP_POSITION = -windowWidth * 0.15; 

// Werte für den Baum (Tree Overlay)
const TREE_OVERLAY_SIZE = windowWidth * 0.5;
// Position des Baumes, basierend auf der Inselposition minus einer Korrektur (z.B. 30px), um ihn höher zu setzen.
const TREE_OVERLAY_TOP_POSITION = INSEL_GROSS_TOP_POSITION - 122; 

// Werte für die kleinen Inseln
const INSEL_KLEIN_PAAR_SIZE = windowWidth * 0.25;
const INSEL_KLEIN_MIDDLE_SIZE = windowWidth * 0.25;
const INSEL_KLEIN_BOTTOM_SIZE = windowWidth * 0.25;

export const treeviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  
  // Allgemeiner Container für jede Inselreihe
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -100, 
    position: 'relative',
    width: ROW_CONTAINER_WIDTH,
    height: ROW_CONTAINER_HEIGHT, 
  },
  
  // --- REIHEN 1: GROSSE INSEL MIT BAUM ---
  
  inselGrossTop: {
    width: INSEL_GROSS_SIZE,
    height: INSEL_GROSS_SIZE,
    position: 'absolute',
    top: INSEL_GROSS_TOP_POSITION, 
    alignSelf: 'center',
  },

  treeOverlay: {
    width: TREE_OVERLAY_SIZE, 
    height: TREE_OVERLAY_SIZE,
    position: 'absolute', 
    zIndex: 2, 
    top: TREE_OVERLAY_TOP_POSITION, 
    alignSelf: 'center',
    marginLeft: -5,
  },
  
  // --- REIHEN 2, 3, 4, 5, 6: KLEINE INSELN ---
  
  // inselKleinPaar: Steuert die oberen 2er-Reihen (Reihe 2, 4) mit großem Abstand (35)
  inselKleinPaar: {
    width: INSEL_KLEIN_PAAR_SIZE,
    height: INSEL_KLEIN_PAAR_SIZE,
    marginHorizontal: 35,
    marginTop: ROW_GAP_NEG,
  },

  // inselKleinPaarBottom: Steuert die unterste 2er-Reihe (Reihe 6) mit speziellem Abstand
  inselKleinPaarBottom: {
    width: INSEL_KLEIN_PAAR_SIZE,
    height: INSEL_KLEIN_PAAR_SIZE,
    marginHorizontal: 15, // Spezieller, enger Abstand für die unterste Reihe
    marginTop: ROW_GAP_NEG,
  },

  // inselKleinMiddle: Steuert die einzelne Insel in Reihe 3 (Größer)
  inselKleinMiddle: {
    width: INSEL_KLEIN_MIDDLE_SIZE,
    height: INSEL_KLEIN_MIDDLE_SIZE,
    marginHorizontal: 5,
    marginTop: ROW_GAP_NEG, 
  },
  
  // inselKleinBottom: Steuert die einzelne Insel in Reihe 5 (Kleiner)
  inselKleinBottom: {
    width: INSEL_KLEIN_BOTTOM_SIZE,
    height: INSEL_KLEIN_BOTTOM_SIZE,
    marginHorizontal: 50,
    marginTop: ROW_GAP_NEG, 
  },
  
  growthInfoContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  growthText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  growthPercentage: {
    fontSize: 14,
    opacity: 0.7,
  },
});