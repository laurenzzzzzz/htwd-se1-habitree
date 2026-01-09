import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

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
    modalTitle: {
      fontSize: font(18),
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    modalText: {
      fontSize: font(14),
      lineHeight: font(20),
      marginBottom: spacing.lg,
      textAlign: 'center',
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
