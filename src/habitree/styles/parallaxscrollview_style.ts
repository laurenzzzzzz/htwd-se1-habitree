import { StyleSheet } from 'react-native';

export const PARALLAX_HEADER_HEIGHT = 250;

export const parallaxScrollViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: PARALLAX_HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
