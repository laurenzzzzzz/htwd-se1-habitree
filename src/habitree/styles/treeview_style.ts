import { StyleSheet, Dimensions } from 'react-native';
import { createResponsiveHelpers } from './responsive';

// Initialisiere Responsive-Helper mit aktuellen Fensterdimensionen
const { width, height } = Dimensions.get('window');
const {
  spacing,
  font,
  scale,
  verticalScale,
  radius,
} = createResponsiveHelpers(width, height);

const safeWidth = width;
const safeHeight = height;
const shortSide = Math.min(safeWidth, safeHeight);

// --- KONFIGURATION ABSTÄNDE (Responsive) ---
// Hier können die Abstände angepasst werden.

// Vertikaler Abstand zwischen den Reihen (negativ, damit sie sich überlappen)
// Ein höherer negativer Wert zieht die Reihen enger zusammen.
const ISLAND_VERTICAL_SPACING = -verticalScale(100); 

// Horizontaler Abstand (Margin) für die Insel-Paare
const ISLAND_HORIZONTAL_SPACING = scale(25);

// --- BERECHNETE GRÖSSEN ---

const rowWidth = Math.min(safeWidth * 0.9, 540);
const rowHeight = Math.max(verticalScale(165), shortSide * 0.32);

// Werte für die große Insel (Reihe 1)
const largeIsland = Math.min(shortSide * 0.6, safeWidth * 0.5);
const largeIslandTop = -Math.round(rowHeight * 0.45); // ca. -15% width

// Werte für den Baum (Tree Overlay)
const treeOverlaySize = largeIsland * 1.12; // etwas größer als die Insel
const treeOverlayTop = largeIslandTop - verticalScale(110); // Position angepasst

// Werte für die kleinen Inseln
const pairIsland = Math.min(shortSide * 0.4, safeWidth * 0.34); // ca. 30% width
const middleIsland = Math.min(shortSide * 0.38, safeWidth * 0.32);
const bottomIsland = Math.min(shortSide * 0.36, safeWidth * 0.3);
const smallTreeSize = Math.min(shortSide * 0.4, safeWidth * 0.35);

// Info Box
const infoHeight = 160; // Fixe Höhe wie gewünscht
const infoHorizontal = Math.max(spacing.md, safeWidth * 0.05);
const progressHeight = Math.max(scale(6), 6);

export const treeviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  scrollContentContainer: {
    alignItems: 'center',
    paddingTop: verticalScale(170),
    paddingBottom: verticalScale(147),
  },
  
  // Allgemeiner Container für jede Inselreihe
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ISLAND_VERTICAL_SPACING, 
    position: 'relative',
    width: rowWidth,
    height: rowHeight,
  },
  
  // --- REIHEN 1: GROSSE INSEL MIT BAUM ---
  inselGrossTop: {
    width: largeIsland,
    height: largeIsland,
    position: 'absolute',
    top: largeIslandTop,
    alignSelf: 'center',
  },
  treeOverlay: {
    width: treeOverlaySize,
    height: treeOverlaySize,
    position: 'absolute',
    zIndex: 2,
    top: treeOverlayTop,
    alignSelf: 'center',
    marginLeft: -5,
  },
  
  // --- REIHEN 2, 3, 4, 5, 6: KLEINE INSELN ---
  inselKleinPaar: {
    width: pairIsland,
    height: pairIsland,
    marginHorizontal: ISLAND_HORIZONTAL_SPACING,
    marginTop: ISLAND_VERTICAL_SPACING,
  },
  inselKleinPaarBottom: {
    width: pairIsland,
    height: pairIsland,
    marginHorizontal: scale(15),
    marginTop: ISLAND_VERTICAL_SPACING,
  },
  inselKleinMiddle: {
    width: middleIsland,
    height: middleIsland,
    marginHorizontal: scale(5),
    marginTop: ISLAND_VERTICAL_SPACING,
  },
  inselKleinBottom: {
    width: bottomIsland,
    height: bottomIsland,
    marginHorizontal: scale(50),
    marginTop: ISLAND_VERTICAL_SPACING,
  },
  
  growthInfoContainer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  growthText: {
    fontSize: font(16),
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  growthPercentage: {
    fontSize: font(14),
    opacity: 0.7,
  },

  // Styles für die kleinen Inseln als Container
  smallIslandImage: {
    width: '100%',
    height: '100%',
  },
  smallTreeOverlay: {
    width: smallTreeSize,
    height: smallTreeSize,
    position: 'absolute',
    bottom: smallTreeSize * 0.50,
    alignSelf: 'center',
    zIndex: 2,
  },
  smallTreeOverlayMiddle: {
    bottom: smallTreeSize * 0.46, // Etwas höher für die mittleren Inseln
  },

  // --- INFO BOX STYLES ---
  infoBoxContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: infoHorizontal,
    right: infoHorizontal,
    height: infoHeight,
    backgroundColor: 'white',
    borderRadius: radius(12),
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
    backgroundColor: 'rgb(75, 180, 170)',
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  infoBoxTitle: {
    fontSize: font(16),
    fontWeight: 'bold',
    color: 'black',
  },
  infoBoxContent: {
    padding: spacing.sm,
  },
  infoBoxStreakText: {
    fontSize: font(14),
    fontWeight: 'bold',
    marginBottom: 2,
    color: 'black',
  },
  infoBoxDescription: {
    fontSize: font(12),
    color: 'black',
    lineHeight: font(16),
    marginBottom: 4,
  },
  
  // Progress Bar Styles
  progressBarContainer: {
    height: progressHeight,
    backgroundColor: '#E0E0E0',
    borderRadius: progressHeight / 2,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgb(75, 180, 170)',
    borderRadius: progressHeight / 2,
  },
  percentageBadge: {
    backgroundColor: 'rgb(75, 180, 170)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius(12),
    alignSelf: 'center',
    marginTop: 5,
  },
  percentageText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: font(16),
  },

  selectedContainer: {
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 15,
    elevation: 15,
  },
});
