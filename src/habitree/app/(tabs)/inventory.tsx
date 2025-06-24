import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import React from 'react';


// import ParallaxScrollView from '@/components/ParallaxScrollView'; // Achte hier auf default vs. named export
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import { useThemeColor } from '@/hooks/useThemeColor';




const abzeichenZeilen = [
  [
    require('@/assets/images/abzeichen1.png'),
    require('@/assets/images/abzeichen2.png'),
  ],
  [
    require('@/assets/images/abzeichen3.png'),
    require('@/assets/images/abzeichen4.png'),
    require('@/assets/images/abzeichen5.png'),
  ],
  [
    require('@/assets/images/abzeichen6.png'),
    require('@/assets/images/abzeichen7.png'),
  ],
];

export default function TabTwoScreen() {
  
  const backgroundColor = useThemeColor({}, 'background');
  
  return (
    <View
      style={{ flex: 1, backgroundColor }}
    >

      <ThemedText type="subtitle" style={styles.erfolgeTitle}>
        Erfolge
      </ThemedText>

      {abzeichenZeilen.map((zeile, zeilenIndex) => (
        <View key={zeilenIndex} style={styles.badgeRow}>
          {zeile.map((source, index) => (
            <Image
              key={index}
              source={source}
              style={styles.badge}
              contentFit="contain"
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  erfolgeTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    width: 100,
    height: 100,
  },
});
