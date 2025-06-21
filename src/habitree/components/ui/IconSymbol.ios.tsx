import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { View } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  //weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <SymbolView
        //weight={weight}
        tintColor={color}
        resizeMode="scaleAspectFit"
        name={name}
        style={{ width: '100%', height: '100%' }} // ❗ nur interne Style hier
      />
    </View>
  );
}
