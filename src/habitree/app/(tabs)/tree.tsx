import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={null} // kein Icon-Header mehr
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Baum</ThemedText>
      </ThemedView>

      <Image
        source={require('@/assets/images/tree.png')}
        style={styles.treeImage}
        contentFit="contain"
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  treeImage: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
    marginVertical: 24,
  },
});
