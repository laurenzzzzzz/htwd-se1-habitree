import { StyleSheet, Image } from 'react-native'; // Import Image
import { Calendar } from 'react-native-calendars';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Transparent 1x1 pixel image
const transparentImage = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' };

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      // Add headerImage prop with transparent image
      headerImage={
        <Image 
          source={transparentImage} 
          style={{ width: 0, height: 0 }} 
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Kalender</ThemedText>
      </ThemedView>

      {/* Kalender-Komponente */}
      <Calendar
        style={{ marginVertical: 20, borderRadius: 10 }}
        onDayPress={(day) => {
          console.log('Ausgewähltes Datum:', day.dateString);
        }}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          arrowColor: '#00adf5',
          monthTextColor: '#2d4150',
          indicatorColor: '#2d4150',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});