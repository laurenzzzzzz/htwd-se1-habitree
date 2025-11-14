import { StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { View } from 'react-native';


import { useThemeColor } from '@/hooks/useThemeColor';

//ResponsiveDesign
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');


const transparentImage = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
};

// Zufällige Daten generieren
const generateRandomData = () => {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
};

export default function TabTwoScreen() {
  
 const backgroundColor = useThemeColor({}, 'background');

  const data = {
    labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    datasets: [
      {
        data: generateRandomData(),
        color: (opacity = 1) => `rgba(0, 173, 245, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View
        style={{ flex: 1, backgroundColor }}
    >

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

      {/* Interaktives Liniendiagramm */}
      <LineChart
        data={data}
        width={windowWidth - 32}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 173, 245, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#00adf5',
          },
        }}
        bezier
        style={{ marginVertical: 16, borderRadius: 12, alignSelf: 'center' }}
        onDataPointClick={({ value, index }) => {
          Alert.alert(`Wert am ${data.labels[index]}`, `Y: ${value}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});