import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createRootLayoutStyles = (width?: number, height?: number) => {
  const { font } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    loadingText: {
      flex: 1,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: font(18),
    },
  });
};

export const rootLayoutStyles = createRootLayoutStyles();
