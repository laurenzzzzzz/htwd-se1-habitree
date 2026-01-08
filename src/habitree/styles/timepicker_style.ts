import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createTimePickerStyles = (width?: number, height?: number) => {
  const { spacing, font, radius, scale } = createResponsiveHelpers(width, height);
  const maxWidth = width ? Math.min(width * 0.9, 420) : 400;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    container: {
      width: '85%',
      maxWidth,
      backgroundColor: '#fff',
      borderRadius: radius(14),
      padding: spacing.md,
      elevation: 5,
    },
    title: {
      marginBottom: spacing.md,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    sliderSection: {
      marginBottom: spacing.lg,
    },
    label: {
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    pickerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    pickerContainer: {
      flex: 1,
      alignItems: 'center',
    },
    picker: {
      width: '100%',
      height: scale(150),
    },
    pickerItem: {
      height: scale(40),
    },
    slider: {
      width: '100%',
      height: scale(40),
    },
    timeDisplay: {
      backgroundColor: 'rgb(25, 145, 137)',
      borderRadius: radius(12),
      paddingVertical: spacing.sm,
      marginVertical: spacing.md,
      alignItems: 'center',
    },
    timeText: {
      fontSize: font(24),
      fontWeight: 'bold',
      color: '#fff',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'space-around',
    },
    button: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      paddingVertical: spacing.sm,
      borderRadius: radius(10),
      alignItems: 'center',
    },
    buttonText: {
      color: '#333',
      fontWeight: '500',
    },
  });
};

export const timePickerStyles = createTimePickerStyles();
