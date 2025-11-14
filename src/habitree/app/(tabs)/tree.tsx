import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');


export default function TabTwoScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  // Slider-Wert (1–7)
  const [treeIndex, setTreeIndex] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // Animierte Zahl
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  // Zielwerte (Streaks)
  const streakValues: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, number> = {
    1: 0,
    2: 11,
    3: 22,
    4: 33,
    5: 44,
    6: 55,
    7: 66
  };

  // Baum-Bilder
  const treeImage: any = {
    1: require('@/assets/images/tree1.png'),
    2: require('@/assets/images/tree2.png'),
    3: require('@/assets/images/tree3.png'),
    4: require('@/assets/images/tree4.png'),
    5: require('@/assets/images/tree5.png'),
    6: require('@/assets/images/tree6.png'),
    7: require('@/assets/images/tree7.png'),
  }[treeIndex];

  // Animation bei Änderung des Sliders starten
  useEffect(() => {
    const target = streakValues[treeIndex] || 0;
    Animated.timing(animatedValue, {
      toValue: target,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [treeIndex]);

  // Animierten Wert im Text anzeigen
  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });
    return () => animatedValue.removeAllListeners();
  }, []);

  // Farb-Logik: Wenn bei 66 Tagen (treeIndex === 7), alles golden
  const isGolden = treeIndex === 7;
  const accentColor = isGolden ? '#FFD700' : '#199189'; // Gold oder Türkis

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header mit Streak-Anzeige */}
      <View style={styles.header}>
        <Text style={[styles.streakLabel, { color: accentColor }]}>
          Deine Streak:
        </Text>
        <Text style={[styles.streakNumber, { color: accentColor }]}>
          {displayValue}
        </Text>
      </View>

      {/* Baum-Bild */}
      <Image
        source={treeImage}
        style={styles.treeImage}
        contentFit="contain"
      />

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={7}
        step={1}
        value={treeIndex}
        onValueChange={(val) => setTreeIndex(val as 1 | 2 | 3 | 4 | 5 | 6 | 7)}
        minimumTrackTintColor={accentColor}
        maximumTrackTintColor="#ccc"
        thumbTintColor={accentColor}
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
  header: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
  streakNumber: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  treeImage: {
    width: windowWidth * 0.8,  
    height: windowHeight * 0.35,
    alignSelf: 'center',
    marginVertical: 24,
  },
  slider: {
    width: '80%',
    height: 40,
  },
});