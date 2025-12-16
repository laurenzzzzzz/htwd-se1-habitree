import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createFrequencyDropdownStyles = (width?: number, height?: number) => {
  const { spacing, font, radius } = createResponsiveHelpers(width, height);
  const maxWidth = width ? Math.min(width * 0.9, 420) : 400;

  return StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.xs,
    },
    buttonText: {
      fontSize: font(16),
      color: '#333',
      flex: 1,
    },
    arrow: {
      fontSize: font(12),
      color: '#666',
      marginLeft: spacing.xs,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '85%',
      maxWidth,
      backgroundColor: '#fff',
      borderRadius: radius(12),
      padding: spacing.md,
      elevation: 5,
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    optionsList: {
      marginBottom: spacing.md,
    },
    option: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      borderRadius: radius(8),
    },
    optionSelected: {
      backgroundColor: 'rgb(25, 145, 137)',
    },
    optionText: {
      fontSize: font(16),
      color: '#333',
    },
    optionTextSelected: {
      color: '#fff',
      fontWeight: '600',
    },
    closeButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: '#f0f0f0',
      borderRadius: radius(10),
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: font(16),
      color: '#333',
      fontWeight: '500',
    },
  });
};

export const frequencyDropdownStyles = createFrequencyDropdownStyles();
