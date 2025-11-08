import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';

import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabTwoScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  // Zustand für den aktuellen Baumindex (1–4)
  const [treeIndex, setTreeIndex] = useState(1);

  // Dynamische Bildquelle je nach Sliderwert
  const treeImage = {
    1: require('@/assets/images/tree1.png'),
    2: require('@/assets/images/tree2.png'),
    3: require('@/assets/images/tree3.png'),
    4: require('@/assets/images/tree4.png'),
    5: require('@/assets/images/tree5.png'),
    6: require('@/assets/images/tree6.png'),
    7: require('@/assets/images/tree7.png'),
  }[treeIndex];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image
        source={treeImage}
        style={styles.treeImage}
        contentFit="contain"
      />
      
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={7}
        step={1}
        value={1}
        onValueChange={setTreeIndex}
        minimumTrackTintColor="rgb(25, 145, 137)"
        maximumTrackTintColor="#ccc"
        thumbTintColor="rgb(25, 145, 137)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeImage: {
    width: '100%',
    height: 300,
    marginVertical: 24,
  },
  slider: {
    width: '80%',
    height: 40,
  },
});
