import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createLoginStyles = (width?: number, height?: number) => {
  const helpers = createResponsiveHelpers(width, height);
  const { spacing, font, radius, width: screenWidth, height: screenHeight } = helpers;
  const resolvedWidth = screenWidth ?? 375;
  const resolvedHeight = screenHeight ?? 812;
  const maxFormWidth = Math.min(resolvedWidth * 0.9, 420);
  const horizontalPadding = resolvedWidth * 0.06;
  const verticalPadding = resolvedHeight * 0.03;

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: horizontalPadding,
      backgroundColor: 'white',
    },
    title: {
      fontSize: font(34),
      fontWeight: 'bold',
      marginBottom: spacing.md,
      textAlign: 'center',
      maxWidth: maxFormWidth,
    },
    input: {
      width: '100%',
      maxWidth: maxFormWidth,
      paddingVertical: verticalPadding,
      paddingHorizontal: resolvedWidth * 0.04,
      marginVertical: spacing.xs,
      borderWidth: Math.min(resolvedWidth * 0.003, 1),
      borderColor: '#ccc',
      borderRadius: radius(10),
      fontSize: font(18),
    },
    authButton: {
      backgroundColor: 'rgb(25, 145, 137)',
      paddingVertical: verticalPadding,
      paddingHorizontal: resolvedWidth * 0.04,
      borderRadius: radius(10),
      width: '100%',
      maxWidth: maxFormWidth,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    authButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: font(20),
    },
    switchButtonText: {
      color: 'rgb(25, 145, 137)',
      marginTop: spacing.md,
      maxWidth: maxFormWidth,
      textAlign: 'center',
      fontSize: font(18),
    },
    logo: {
      width: Math.min(resolvedWidth * 0.4, 180),
      height: Math.min(resolvedHeight * 0.18, 150),
      resizeMode: 'contain',
      marginBottom: spacing.lg,
    },
  });
};

export const styles = createLoginStyles();