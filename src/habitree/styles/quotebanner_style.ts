import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createQuoteBannerStyles = (width?: number, height?: number) => {
  const { spacing, font } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    container: {
      marginVertical: spacing.sm,
    },
    text: {
      fontStyle: 'italic',
      opacity: 0.9,
      fontSize: font(14),
    },
  });
};

export const quoteBannerStyles = createQuoteBannerStyles();
