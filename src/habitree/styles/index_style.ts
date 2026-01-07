import { StyleSheet, Dimensions } from 'react-native';
import { createResponsiveHelpers } from './responsive';

const { width: defaultWidth, height: defaultHeight } = Dimensions.get('window');

type HomeStyleOptions = {
  backgroundColor?: string;
};

export const createHomeStyles = (
  screenWidth = defaultWidth,
  screenHeight = defaultHeight,
  options: HomeStyleOptions = {},
) => {
  const helpers = createResponsiveHelpers(screenWidth, screenHeight);
  const { spacing, font, scale, verticalScale, radius } = helpers;
  const checkboxSize = Math.max(22, scale(24));
  const circleSize = Math.max(32, scale(32));
  const fabSize = Math.max(56, scale(60));
  const cardRadius = Math.max(12, radius(12));
  const cardPadding = Math.max(16, spacing.md);
  const dropSize = Math.max(80, scale(88));
  const streakModalWidth = Math.min(screenWidth * 0.9, 460);
  const modalWidth = Math.min(screenWidth * 0.9, 420);
  const backgroundColorValue = options.backgroundColor ?? '#fff';

  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: backgroundColorValue,
    },
    authContainer: {
      width: '100%',
      padding: cardPadding,
      borderRadius: cardRadius,
      backgroundColor: '#f9f9f9',
      alignItems: 'center',
    },
    authInput: {
      height: verticalScale(48),
      width: '100%',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: radius(10),
      paddingHorizontal: spacing.sm,
      backgroundColor: 'white',
      fontSize: font(16),
      marginBottom: spacing.sm,
      color: '#333',
    },
    authButton: {
      backgroundColor: 'rgb(25, 145, 137)',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: cardRadius,
      width: '100%',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    authButtonDisabled: {
      backgroundColor: '#9e9e9e',
    },
    authButtonText: {
      color: 'white',
      fontSize: font(18),
      fontWeight: 'bold',
    },
    authMessage: {
      color: '#d32f2f',
      textAlign: 'center',
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
    switchAuthButton: {
      marginTop: spacing.sm,
      paddingVertical: spacing.xs,
    },
    switchAuthButtonText: {
      color: 'rgb(25, 145, 137)',
      textAlign: 'center',
      fontSize: font(14),
    },
    noHabitsText: {
      color: '#888',
      fontStyle: 'italic',
      textAlign: 'center',
      marginVertical: spacing.md,
    },
    loadingBox: {
      padding: spacing.md,
    },
    loadingMessage: {
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: '#00000088',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: cardPadding,
      borderRadius: cardRadius,
      width: modalWidth,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 5,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: radius(10),
      padding: spacing.sm,
      fontSize: font(16),
      marginBottom: spacing.sm,
    },
    predefinedItem: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderBottomColor: '#ddd',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    fab: {
      position: 'absolute',
      bottom: Math.max(screenHeight * 0.025, spacing.lg),
      right: Math.max(screenWidth * 0.05, spacing.md),
      width: fabSize,
      height: fabSize,
      borderRadius: fabSize / 2,
      backgroundColor: 'rgb(25, 145, 137)',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    fabText: {
      color: 'white',
      fontSize: font(30),
      fontWeight: '600',
      lineHeight: font(34),
    },
    contentContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    greetingText: {
      fontSize: font(28),
    },
    motivationQuote: {
      marginBottom: spacing.lg,
      fontSize: font(16),
      fontStyle: 'italic',
    },
    sectionTitle: {
      marginBottom: spacing.sm,
      fontSize: font(22),
      fontWeight: '600',
    },
    habitTitle: {
      marginBottom: spacing.sm,
      fontSize: font(20),
    },
    habitTitleSpacing: {
      marginTop: spacing.xl,
    },
    habitListContainer: {
      borderRadius: cardRadius,
      paddingHorizontal: cardPadding,
      paddingVertical: spacing.lg,
    },
    habitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Math.max(verticalScale(10), spacing.xs),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#e0e0e0',
    },
    habitTextContainer: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    habitLabel: {
      fontSize: font(16),
      fontWeight: '500',
    },
    habitDescription: {
      fontSize: font(14),
      opacity: 0.7,
      marginTop: 4,
    },
    checkbox: {
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: checkboxSize / 2,
      borderWidth: 2,
      borderColor: '#ccc',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#A1CEDC',
      borderColor: '#A1CEDC',
    },
    checkmark: {
      color: 'white',
      fontWeight: '600',
      fontSize: font(16),
    },
    profileRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.xs,
    },
    profileImageWrapper: {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    profileImageToday: {
      borderColor: 'rgb(25, 145, 137)',
    },
    profileImage: {
      width: circleSize * 0.85,
      height: circleSize * 0.85,
      borderRadius: (circleSize * 0.85) / 2,
    },
    streakContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginVertical: spacing.sm,
      marginTop: 0,
    },
    streakBackgroundImage: {
      position: 'absolute',
      width: dropSize,
      height: dropSize,
      top: -dropSize * 0.3,
      opacity: 0.25,
    },
    streakNumber: {
      fontSize: font(42),
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'rgb(25, 145, 137)',
      lineHeight: font(42),
      includeFontPadding: false,
      textAlignVertical: 'center',
      zIndex: 1,
    },
    weekdayRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      marginTop: spacing.sm,
      gap: spacing.xs,
      flexWrap: 'wrap',
    },
    weekdayCircle: {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      borderWidth: 2,
      borderColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      marginBottom: spacing.xs,
    },
    weekdayFilled: {
      backgroundColor: 'rgba(25, 145, 137, 0.2)',
      borderColor: 'rgba(25, 145, 137, 0.3)',
    },
    weekdayToday: {
      borderColor: 'rgb(25, 145, 137)',
      borderWidth: 3,
      backgroundColor: 'rgba(25, 145, 137, 0.35)',
    },
    weekdayText: {
      fontSize: font(13),
      fontWeight: '500',
      color: '#333',
    },
    weekdayTextToday: {
      color: 'rgb(25, 145, 137)',
      fontWeight: '700',
    },
    streakModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    streakModalContainer: {
      backgroundColor: '#fff',
      borderRadius: cardRadius,
      padding: cardPadding,
      width: streakModalWidth,
      alignItems: 'center',
    },
    streakModalTitle: {
      fontSize: font(20),
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: spacing.xs,
      color: 'rgb(25, 145, 137)',
    },
    streakModalText: {
      fontSize: font(15),
      textAlign: 'center',
      color: '#444',
      marginBottom: spacing.sm,
    },
    streakModalImage: {
      width: dropSize,
      height: dropSize,
      opacity: 0.8,
      marginBottom: spacing.sm,
    },
    streakCloseButton: {
      marginTop: spacing.xs,
      backgroundColor: 'rgb(25, 145, 137)',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xs,
      borderRadius: cardRadius,
    },
    streakCloseButtonText: {
      color: '#fff',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: font(14),
    },
    // --- CHART STYLES ---
    chartContainer: {
      marginVertical: spacing.md,
      padding: cardPadding,
      backgroundColor: '#fff',
      borderRadius: cardRadius,
      borderWidth: 2,
      borderColor: 'rgb(25, 145, 137)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    chartTitle: {
      fontSize: font(16),
      fontWeight: 'bold',
      marginBottom: spacing.md,
      color: '#333',
    },
    chartContent: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: verticalScale(150),
      paddingBottom: spacing.xs,
    },
    barContainer: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: scale(45),
      height: '100%',
      marginRight: spacing.xs,
    },
    bar: {
      width: scale(20),
      backgroundColor: 'rgba(25, 145, 137, 0.5)',
      borderRadius: radius(4),
      marginBottom: spacing.xs,
    },
    barSelected: {
      backgroundColor: 'rgb(25, 145, 137)',
    },
    barGold: {
      backgroundColor: 'rgba(255, 215, 0, 0.6)',
    },
    barGoldSelected: {
      backgroundColor: 'rgb(255, 215, 0)',
    },
    barValue: {
      fontSize: font(12),
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 2,
    },
    barLabel: {
      fontSize: font(10),
      color: '#666',
      textAlign: 'center',
      width: '100%',
    },
    statsModalOverlay: {
      flex: 1,
      backgroundColor: '#00000088',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    statsModalContent: {
      width: modalWidth,
      padding: cardPadding,
      borderRadius: cardRadius,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 5,
    },
    statsModalTitle: {
      fontSize: font(18),
      fontWeight: 'bold',
      marginBottom: spacing.sm,
    },
    statsModalStreakText: {
      marginBottom: spacing.xs,
    },
    statsModalDescription: {
      marginBottom: spacing.md,
    },
    statsModalCloseButton: {
      alignSelf: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      backgroundColor: 'rgb(25, 145, 137)',
      borderRadius: radius(8),
      marginTop: spacing.sm,
    },
    statsModalCloseButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: font(14),
    },
  });
};

export const styles = createHomeStyles(defaultWidth, defaultHeight);
