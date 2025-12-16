import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createInventoryViewStyles = (width?: number, height?: number) => {
  const { spacing, font, radius, scale } = createResponsiveHelpers(width, height);
  const modalWidth = width ? Math.min(width * 0.85, 520) : undefined;

  return StyleSheet.create({
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
    },
    badge: {
      width: scale(80),
      height: scale(80),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    loadingText: {
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: spacing.lg,
      borderRadius: radius(14),
      width: modalWidth,
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
