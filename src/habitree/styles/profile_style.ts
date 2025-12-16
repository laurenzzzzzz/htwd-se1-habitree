import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

export const createProfileStyles = (width?: number, height?: number) => {
  const { spacing, font, radius, width: screenWidth, height: screenHeight } = createResponsiveHelpers(width, height);
  const modalWidth: number | string = screenWidth ? Math.min(screenWidth * 0.85, 520) : '80%';

  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: spacing.lg,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: spacing.md,
    },
    modalContent: {
      width: modalWidth,
      padding: spacing.lg,
      borderRadius: radius(14),
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: spacing.sm,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderRadius: radius(8),
      fontSize: font(16),
      borderColor: '#ccc',
      color: '#000',
      backgroundColor: '#fff',
    },
    loadingTitle: {
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    loadingText: {
      textAlign: 'center',
      marginHorizontal: spacing.lg,
      opacity: 0.8,
    },
    activityIndicator: {
      marginTop: spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: spacing.sm,
    },
    headerImage: {
      alignSelf: 'center',
      marginTop: spacing.md,
      width: '100%',
      height: screenHeight ? screenHeight * 0.3 : 240,
    },
    sectionContainer: {
      marginVertical: spacing.lg,
      gap: spacing.sm,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    settingRowButton: {
      paddingVertical: spacing.sm,
    },
    settingRowTopBorder: {
      borderTopWidth: 1,
      borderColor: '#ccc',
    },
    authButtonsContainer: {
      marginTop: spacing.xl,
      alignItems: 'center',
      gap: spacing.sm,
      paddingBottom: spacing.xl,
    },
    authButton: {
      backgroundColor: 'rgb(25, 145, 137)',
      paddingVertical: screenHeight ? screenHeight * 0.012 : spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius(12),
      width: screenWidth ? screenWidth * 0.7 : '80%',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: spacing.lg,
    },
    authButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: font(16),
      textAlign: 'center',
    },
    friendsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: spacing.sm,
    },
    friendImage: {
      width: screenWidth ? screenWidth * 0.12 : 50,
      height: screenWidth ? screenWidth * 0.12 : 50,
      borderRadius: radius(25),
    },
    memberSince: {
      fontSize: font(14),
      color: '#888',
    },
  });
};

export const styles = createProfileStyles();
