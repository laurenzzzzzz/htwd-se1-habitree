import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

const PRIMARY = 'rgb(25, 145, 137)';
const SECTION_HEADER_COLORS = {
  today: 'rgb(131, 233, 142)',
  upcoming: 'rgb(255, 236, 136)',
  all: 'rgb(255, 112, 112)',
} as const;

export const createCalendarScreenStyles = (width?: number, height?: number) => {
  const { spacing, radius, scale } = createResponsiveHelpers(width, height);

  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: '#fff',
      position: 'relative',
    },
    scrollContent: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    sectionCard: {
      borderWidth: 2,
      borderColor: PRIMARY,
      borderRadius: radius(14),
      padding: spacing.md,
      marginBottom: spacing.lg,
      backgroundColor: '#fff',
    },
    sectionBanner: {
      padding: spacing.sm,
      marginHorizontal: -spacing.sm,
      marginTop: -spacing.sm,
      marginBottom: spacing.sm,
      borderTopLeftRadius: radius(12),
      borderTopRightRadius: radius(12),
    },
    sectionBannerToday: {
      backgroundColor: SECTION_HEADER_COLORS.today,
    },
    sectionBannerUpcoming: {
      backgroundColor: SECTION_HEADER_COLORS.upcoming,
    },
    sectionBannerAll: {
      backgroundColor: SECTION_HEADER_COLORS.all,
    },
    sectionHeaderTitle: {
      color: '#000',
      marginTop: -spacing.xs * 0.5,
      marginBottom: -spacing.xs * 0.5,
    },
    loadingContainer: {
      padding: spacing.md,
    },
    loadingMessage: {
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    habitPressable: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionControl: {
      padding: spacing.xs,
    },
    actionIcon: {
      width: scale(21),
      height: scale(21),
      resizeMode: 'contain',
    },
  });
};

export const calendarScreenStyles = createCalendarScreenStyles();
