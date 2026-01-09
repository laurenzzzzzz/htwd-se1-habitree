import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';
import { Colors } from '../constants/Colors';

type InventoryStyleOptions = {
  backgroundColor?: string;
};

export const createInventoryViewStyles = (
  width?: number,
  height?: number,
  options: InventoryStyleOptions = {},
) => {
  const { spacing, font, radius, scale, width: screenWidth } = createResponsiveHelpers(width, height);
  const modalWidth = Math.min(screenWidth * 0.9, 560);
  const backgroundColorValue = options.backgroundColor ?? '#fff';

  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: backgroundColorValue,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    title: {
      fontSize: font(20),
      fontWeight: 'bold',
      marginBottom: spacing.lg,
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      gap: spacing.xs,
    },
    badgeRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.lg,
      flexWrap: 'wrap',
      gap: spacing.md,
      alignItems: 'flex-start',
    },
    badge: {
      width: scale(80),
      height: scale(80),
      flexBasis: '33.333%',
      maxWidth: scale(80),
    },
    completedTree: {
      borderWidth: 3,
      borderColor: Colors.light.accent,
      borderRadius: radius(16),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: backgroundColorValue,
    },
    loadingText: {
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: spacing.lg,
      borderRadius: radius(14),
      width: modalWidth,
      maxHeight: height ? height * 0.7 : 500,
      alignItems: 'center',
    },
    modalImage: {
      width: scale(80),
      height: scale(80),
      marginBottom: spacing.lg,
      alignSelf: 'center',
    },
    modalTitle: {
      fontSize: font(18),
      fontWeight: '700',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    modalText: {
      fontSize: font(14),
      lineHeight: font(20),
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    modalLabel: {
      fontWeight: 'bold',
      marginTop: spacing.sm,
    },
    modalDescriptionBlock: {
      marginBottom: spacing.md,
      alignItems: 'center',
    },
    modalSection: {
      marginBottom: spacing.md,
      width: '100%',
    },
    closeButton: {
      backgroundColor: '#1E9189',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius(12),
    },
    closeButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
};

export const inventoryviewStyles = createInventoryViewStyles();
