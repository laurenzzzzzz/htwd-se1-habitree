import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const PARALLAX_HEADER_HEIGHT = 250;

export const createParallaxScrollViewStyles = (width?: number, height?: number) => {
  const { spacing } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: PARALLAX_HEADER_HEIGHT,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      padding: spacing.lg,
      gap: spacing.md,
      overflow: 'hidden',
    },
  });
};

export const parallaxScrollViewStyles = createParallaxScrollViewStyles();
