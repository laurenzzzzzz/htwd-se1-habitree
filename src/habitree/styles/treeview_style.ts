import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createTreeViewStyles = (width?: number, height?: number) => {
  const { spacing, font, width: screenWidth, height: screenHeight } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    treeImage: {
      width: screenWidth ? screenWidth * 0.8 : '100%',
      height: screenHeight ? screenHeight * 0.35 : 260,
      alignSelf: 'center',
      marginVertical: spacing.lg,
    },
    growthInfoContainer: {
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
    },
    growthText: {
      fontSize: font(16),
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    growthPercentage: {
      fontSize: font(14),
      opacity: 0.7,
    },
  });
};

export const treeviewStyles = createTreeViewStyles();
