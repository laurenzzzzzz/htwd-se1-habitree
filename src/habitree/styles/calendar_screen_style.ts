import { StyleSheet } from 'react-native';
import type { Theme } from 'react-native-calendars/src/types';
import { Colors } from '../constants/Colors';
import { createResponsiveHelpers } from './responsive';

const PRIMARY = 'rgb(25, 145, 137)';
const SECTION_HEADER_COLORS = {
  calendar: 'rgb(166, 218, 255)',
  today: 'rgb(131, 233, 142)',
  upcoming: 'rgb(255, 236, 136)',
  all: 'rgb(255, 112, 112)',
} as const;

export const createCalendarScreenStyles = (width?: number, height?: number) => {
  const { spacing, radius, scale } = createResponsiveHelpers(width, height);
  const calendarContentHeight = (() => {
    if (!height) return 305;
    const computed = height * 0.375;
    return Math.max(270, Math.min(computed, 400));
  })();

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
    viewToggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    viewTogglePill: {
      flex: 1,
      paddingVertical: Math.max(spacing.sm * 0.65, 10),
      borderRadius: radius(999),
      borderWidth: 2,
      borderColor: PRIMARY,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      marginHorizontal: spacing.xs * 0.4,
    },
    viewTogglePillActive: {
      backgroundColor: PRIMARY,
    },
    viewToggleText: {
      color: PRIMARY,
      fontWeight: '600',
    },
    viewToggleTextActive: {
      color: '#fff',
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
    sectionBannerCalendar: {
      backgroundColor: SECTION_HEADER_COLORS.calendar,
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
    calendarHint: {
      color: '#3a3a3a',
      marginBottom: spacing.sm,
    },
    calendarWrapper: {
      minHeight: calendarContentHeight,
      width: '100%',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: PRIMARY,
      borderRadius: radius(12),
      padding: spacing.sm,
      paddingBottom: spacing.md,
      backgroundColor: '#f8fffe',
    },
    calendarComponent: {
      flexGrow: 1,
      width: '100%',
      minHeight: calendarContentHeight - spacing.md,
    },
    selectedDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    selectedDateText: {
      color: '#1f1f1f',
      fontWeight: '600',
    },
    selectedDateBadge: {
      backgroundColor: PRIMARY,
      paddingVertical: spacing.xs * 0.4,
      paddingHorizontal: spacing.sm,
      borderRadius: radius(999),
    },
    selectedDateBadgeText: {
      color: '#fff',
      fontSize: 12,
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

export const calendarThemeConfig: Theme = {
  selectedDayBackgroundColor: Colors.light.accent,
  selectedDayTextColor: '#000',
  todayTextColor: Colors.light.accent,
  arrowColor: Colors.light.accent,
  monthTextColor: '#1f1f1f',
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textMonthFontWeight: '600',
  textDayHeaderFontWeight: '600',
};
