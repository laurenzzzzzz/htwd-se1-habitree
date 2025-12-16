/**
 * This hook now always returns the light palette to avoid any system-driven
 * dark-mode text/background changes.
 */

import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const colorFromProps = props.light;
  return colorFromProps ? colorFromProps : Colors.light[colorName];
}
