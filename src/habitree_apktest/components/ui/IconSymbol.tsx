import React from 'react';
import { Platform, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { OpaqueColorValue } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], keyof typeof MaterialIcons.glyphMap>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle | TextStyle>;
  weight?: SymbolWeight;
}) {
  const finalStyle: StyleProp<ViewStyle> = [
    { width: size, height: size },
    style,
  ];

  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={name}
        tintColor={color}
        weight={weight}
        resizeMode="scaleAspectFit"
        style={finalStyle}
      />
    );
  }

  // ✅ Android/Web fallback: MaterialIcons
  return (
    <View style={finalStyle}>
      <MaterialIcons name={MAPPING[name]} size={size} color={color} />
    </View>
  );
}
