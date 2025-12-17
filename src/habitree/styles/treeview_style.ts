import { StyleSheet, Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// --- ZENTRALE VARIABLEN FÜR STYLES ---

// Zentraler Wert zur Steuerung der vertikalen Abstände der kleinen Inseln.
// Ein HÖHERER negativer Wert (-120 ist enger als -80) reduziert den Abstand.
const ROW_GAP_NEG = -160; 

// Die Breite des Row-Containers
const ROW_CONTAINER_WIDTH = windowWidth * 0.8;
const ROW_CONTAINER_HEIGHT = windowWidth * 0.35; 

// Werte für die große Insel (Reihe 1)
const INSEL_GROSS_SIZE = windowWidth * 0.45;
// Die vertikale Position der großen Insel, um sie im oberen Bereich (ca. 2/3 des Containers) zu platzieren.
// WICHTIG: Berechnung außerhalb des StyleSheet.create
const INSEL_GROSS_TOP_POSITION = -windowWidth * 0.15; 

// Werte für den Baum (Tree Overlay)
const TREE_OVERLAY_SIZE = windowWidth * 0.55;
// Position des Baumes, basierend auf der Inselposition minus einer Korrektur (z.B. 30px), um ihn höher zu setzen.
const TREE_OVERLAY_TOP_POSITION = INSEL_GROSS_TOP_POSITION - 122; 

// Werte für die kleinen Inseln
const INSEL_KLEIN_PAAR_SIZE = windowWidth * 0.30;
const INSEL_KLEIN_MIDDLE_SIZE = windowWidth * 0.30;
const INSEL_KLEIN_BOTTOM_SIZE = windowWidth * 0.30;

export const treeviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  scrollContentContainer: {
    alignItems: 'center',
    paddingTop: 160, // Weniger Platz oben
    paddingBottom: 120, // Weniger Platz unten
  },
  
  // Allgemeiner Container für jede Inselreihe
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -80, 
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
    marginHorizontal: 40,
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

  // Styles für die kleinen Inseln als Container
  smallIslandImage: {
    width: '100%',
    height: '100%',
  },
  
  smallTreeOverlay: {
    width: windowWidth * 0.35,
    height: windowWidth * 0.35,
    position: 'absolute',
    bottom: windowWidth * 0.15, // Angepasst, damit der Baum auf der Insel steht
    alignSelf: 'center',
    zIndex: 2,
  },

  // --- INFO BOX STYLES ---
  infoBoxContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 160, // Weiter reduzierte Höhe
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoBoxHeader: {
    backgroundColor: 'rgb(75, 180, 170)', // Teal color similar to image
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  infoBoxTitle: {
    fontSize: 16, // Reduziert von 18
    fontWeight: 'bold',
    color: 'black',
  },
  infoBoxContent: {
    padding: 10, // Reduziert von 15
  },
  infoBoxStreakText: {
    fontSize: 14, // Reduziert von 16
    fontWeight: 'bold',
    marginBottom: 2, // Reduziert von 5
    color: 'black',
  },
  infoBoxDescription: {
    fontSize: 12, // Reduziert von 14
    color: 'black',
    lineHeight: 16, // Reduziert von 20
    marginBottom: 4, // Weiter reduziert
  },
  
  // Progress Bar Styles
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4, // Weiter reduziert
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgb(75, 180, 170)',
    borderRadius: 4,
  },
  percentageBadge: {
    backgroundColor: 'rgb(75, 180, 170)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 5,
  },
  percentageText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

  selectedContainer: {
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 15,
    elevation: 15, // Android shadow
    // Optional: Add a border if shadow is not visible enough
    // borderWidth: 2,
    // borderColor: 'rgba(255, 68, 68, 0.5)',
    // borderRadius: 100, // Try to make it circular-ish
  },

});