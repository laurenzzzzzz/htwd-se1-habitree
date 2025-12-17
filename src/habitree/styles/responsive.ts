import { Dimensions } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const defaultWindow = Dimensions.get('window');

export type ResponsiveHelpers = ReturnType<typeof createResponsiveHelpers>;

export function createResponsiveHelpers(width = defaultWindow.width, height = defaultWindow.height) {
  const scale = (size: number) => (width / BASE_WIDTH) * size;
  const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;
  const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
  const font = (size: number, factor = 0.45) => Math.round(moderateScale(size, factor));
  const spacingBase = Math.max(14, width * 0.04);
  const spacing = {
    xs: Math.round(spacingBase * 0.5),
    sm: Math.round(spacingBase * 0.75),
    md: Math.round(spacingBase),
    lg: Math.round(spacingBase * 1.25),
    xl: Math.round(spacingBase * 1.6),
  } as const;
  const radius = (size = 12) => Math.round(moderateScale(size));

  return {
    width,
    height,
    scale,
    verticalScale,
    moderateScale,
    font,
    spacing,
    radius,
  };
}
