import React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { treeStyles as styles } from '../../styles/tree_style';

export default function TreeView() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Image
        source={require('@/assets/images/tree.png')}
        style={styles.treeImage}
        contentFit="contain"
      />
    </View>
  );
}