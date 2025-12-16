import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';
import { Colors } from '../constants/Colors';

export type TabsLayoutInsets = {
  top?: number;
  bottom?: number;
};

export const createTabsLayoutStyles = (
  width?: number,
  height?: number,
  insets?: TabsLayoutInsets,
) => {
  const helpers = createResponsiveHelpers(width, height);
  const resolvedWidth = width ?? helpers.width;
  const resolvedHeight = height ?? helpers.height;
  const topInset = insets?.top ?? 0;
  const bottomInset = insets?.bottom ?? 0;
  const headerHeight = Math.max(70 + topInset, 60);
  const tabBarHeight = Math.max(48, resolvedHeight * 0.05);
  const responsiveMarginTop = topInset * 0.2;

  return StyleSheet.create({
    headerStyle: {
      backgroundColor: Colors.light.background,
      borderBottomColor: Colors.light.border,
      height: headerHeight,
    },
    headerTitleStyle: {
      fontSize: Math.min(resolvedWidth * 0.08, 34),
      fontWeight: '700',
    },
    tabBarStyle: {
      height: tabBarHeight + bottomInset,
      paddingBottom: bottomInset,
    },
    headerLogo: {
      width: Math.min(resolvedWidth * 0.35, 140),
      height: resolvedHeight * 0.07,
      resizeMode: 'contain',
      marginTop: responsiveMarginTop,
    },
    headerTitleText: {
      fontSize: Math.min(resolvedWidth * 0.08, 34),
      fontWeight: '700',
      marginTop: responsiveMarginTop,
      textAlign: 'center',
    },
  });
};

export const tabsLayoutStyles = createTabsLayoutStyles();
