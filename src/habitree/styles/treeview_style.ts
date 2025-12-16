import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createTreeViewStyles = (width?: number, height?: number) => {
  const {
    spacing,
    font,
    width: screenWidth,
    height: screenHeight,
    scale,
    verticalScale,
    radius,
  } = createResponsiveHelpers(width, height);

  const safeWidth = screenWidth || 375;
  const safeHeight = screenHeight || 812;
  const shortSide = Math.min(safeWidth, safeHeight);
  const longSide = Math.max(safeWidth, safeHeight);

  const rowGap = -Math.round(Math.max(verticalScale(70), shortSide * 0.12));
  const rowWidth = Math.min(safeWidth * 0.9, 540);
  const rowHeight = Math.max(verticalScale(165), shortSide * 0.32);

  const largeIsland = Math.min(shortSide * 0.6, safeWidth * 0.5);
  const largeIslandTop = -Math.round(rowHeight * 0.32);
  const treeOverlaySize = largeIsland * 1.12;
  const treeOverlayTop = largeIslandTop - verticalScale(80);

  const pairIsland = Math.min(shortSide * 0.4, safeWidth * 0.34);
  const middleIsland = Math.min(shortSide * 0.38, safeWidth * 0.32);
  const bottomIsland = Math.min(shortSide * 0.36, safeWidth * 0.3);
  const smallTreeSize = Math.min(shortSide * 0.4, safeWidth * 0.35);

  const infoHeight = Math.max(verticalScale(135), 120);
  const infoHorizontal = Math.max(spacing.md, safeWidth * 0.05);
  const progressHeight = Math.max(scale(6), 6);

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    scrollContentContainer: {
      alignItems: 'center',
      paddingTop: verticalScale(120),
      paddingBottom: verticalScale(150),
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: rowGap,
      position: 'relative',
      width: rowWidth,
      height: rowHeight,
    },
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
    },
    inselKleinPaar: {
      width: pairIsland,
      height: pairIsland,
      marginHorizontal: Math.max(spacing.md, safeWidth * 0.08),
      marginTop: rowGap,
    },
    inselKleinPaarBottom: {
      width: pairIsland,
      height: pairIsland,
      marginHorizontal: Math.max(spacing.sm, safeWidth * 0.06),
      marginTop: rowGap,
    },
    inselKleinMiddle: {
      width: middleIsland,
      height: middleIsland,
      marginHorizontal: spacing.sm,
      marginTop: rowGap,
    },
    inselKleinBottom: {
      width: bottomIsland,
      height: bottomIsland,
      marginHorizontal: Math.max(spacing.lg, safeWidth * 0.12),
      marginTop: rowGap,
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
    smallIslandImage: {
      width: '100%',
      height: '100%',
    },
    smallTreeOverlay: {
      width: smallTreeSize,
      height: smallTreeSize,
      position: 'absolute',
      bottom: smallTreeSize * 0.45,
      alignSelf: 'center',
      zIndex: 2,
    },
    infoBoxContainer: {
      position: 'absolute',
      bottom: spacing.md,
      left: infoHorizontal,
      right: infoHorizontal,
      height: infoHeight,
      backgroundColor: '#fff',
      borderRadius: radius(16),
      borderWidth: 2,
      borderColor: '#000',
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
      borderBottomColor: '#000',
    },
    infoBoxTitle: {
      fontSize: font(16),
      fontWeight: 'bold',
      color: '#000',
    },
    infoBoxContent: {
      padding: spacing.sm,
    },
    infoBoxStreakText: {
      fontSize: font(14),
      fontWeight: 'bold',
      marginBottom: spacing.xs * 0.5,
      color: '#000',
    },
    infoBoxDescription: {
      fontSize: font(12),
      color: '#000',
      lineHeight: font(14),
      marginBottom: spacing.xs,
    },
    progressBarContainer: {
      height: progressHeight,
      backgroundColor: '#E0E0E0',
      borderRadius: progressHeight / 2,
      marginBottom: spacing.xs,
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
      paddingVertical: spacing.xs * 0.6,
      borderRadius: radius(20),
      alignSelf: 'center',
      marginTop: spacing.xs,
    },
    percentageText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: font(15),
    },
    selectedContainer: {
      shadowColor: '#ff4444',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 12,
    },
  });
};

export const treeviewStyles = createTreeViewStyles();
