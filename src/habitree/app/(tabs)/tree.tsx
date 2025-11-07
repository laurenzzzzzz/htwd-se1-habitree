import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useThemeColor } from '@/hooks/useThemeColor';

import { View } from 'react-native';

import React from 'react';

import { Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');


export default function TabTwoScreen() {
  
  const backgroundColor = useThemeColor({}, 'background');
  
  return (
    <View
        style={{ flex: 1, backgroundColor }}
    >
      <Image
        source={require('@/assets/images/tree.png')}
        style={styles.treeImage}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  treeImage: {
    width: windowWidth * 0.8,  
    height: windowHeight * 0.35,
    alignSelf: 'center',
    marginVertical: 24,
  },
});
