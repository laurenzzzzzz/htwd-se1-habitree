import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createHabitListStyles = (width?: number, height?: number) => {
  const { spacing, font } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    title: {
      marginBottom: spacing.sm,
    },
    habitItem: {
      paddingVertical: spacing.xs,
    },
    habitName: {
      fontWeight: '600',
      fontSize: font(16),
    },
    habitDescription: {
      opacity: 0.7,
      fontSize: font(14),
    },
  });
};

export const habitListStyles = createHabitListStyles();
