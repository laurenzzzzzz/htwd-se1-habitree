import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createCalendarViewStyles = (width?: number, height?: number) => {
  const { spacing, radius } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    calendar: {
      marginVertical: spacing.lg,
      borderRadius: radius(12),
    },
    chart: {
      marginVertical: spacing.md,
      borderRadius: radius(14),
      alignSelf: 'center',
      width: '100%',
    },
  });
};

export const calendarViewStyles = createCalendarViewStyles();
