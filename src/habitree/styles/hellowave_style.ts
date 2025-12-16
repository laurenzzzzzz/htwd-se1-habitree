import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createHelloWaveStyles = (width?: number, height?: number) => {
  const { font, scale } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    text: {
      fontSize: font(28),
      lineHeight: font(32),
      marginTop: -scale(6),
    },
  });
};

export const helloWaveStyles = createHelloWaveStyles();
