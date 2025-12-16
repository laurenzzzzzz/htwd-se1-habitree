import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createDatePickerStyles = (width?: number, height?: number) => {
  const { spacing, font, radius } = createResponsiveHelpers(width, height);
  const maxWidth = width ? Math.min(width * 0.9, 420) : 400;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
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
    monthHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    monthText: {
      fontSize: font(16),
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    weekdayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    weekdayCell: {
      width: `${100 / 7}%`,
      alignItems: 'center',
      paddingVertical: spacing.xs * 0.75,
    },
    weekdayText: {
      fontWeight: 'bold',
      fontSize: font(12),
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.md,
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius(10),
      marginBottom: spacing.xs * 0.75,
    },
    dayCellEmpty: {
      backgroundColor: 'transparent',
    },
    dayCellSelected: {
      backgroundColor: 'rgb(25, 145, 137)',
    },
    dayText: {
      fontSize: font(14),
      color: '#000',
    },
    dayTextSelected: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
};

export const datePickerStyles = createDatePickerStyles();
