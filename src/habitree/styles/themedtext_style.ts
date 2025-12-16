import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createThemedTextStyles = (width?: number, height?: number) => {
  const { font } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    default: {
      fontSize: font(16),
      lineHeight: font(24),
    },
    defaultSemiBold: {
      fontSize: font(16),
      lineHeight: font(24),
      fontWeight: '600',
    },
    title: {
      fontSize: font(32),
      fontWeight: 'bold',
      lineHeight: font(32),
    },
    subtitle: {
      fontSize: font(20),
      fontWeight: 'bold',
    },
    link: {
      lineHeight: font(30),
      fontSize: font(16),
      color: '#0a7ea4',
    },
  });
};

export const themedTextStyles = createThemedTextStyles();
