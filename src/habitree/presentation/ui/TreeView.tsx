import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Dimensions, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

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

const styles = StyleSheet.create({
  treeImage: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.35,
    alignSelf: 'center',
    marginVertical: 24,
  },
});
