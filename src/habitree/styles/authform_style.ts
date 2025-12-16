import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createAuthFormStyles = (width?: number, height?: number) => {
  const { spacing } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      gap: spacing.xs,
    },
  });
};

export const authFormStyles = createAuthFormStyles();
