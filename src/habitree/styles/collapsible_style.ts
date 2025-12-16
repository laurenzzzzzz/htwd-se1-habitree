import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createCollapsibleStyles = (width?: number, height?: number) => {
  const { spacing, scale } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    content: {
      marginTop: spacing.xs,
      marginLeft: scale(24),
    },
    iconStyle: {
      width: scale(24),
      height: scale(24),
    },
  });
};

export const collapsibleStyles = createCollapsibleStyles();
