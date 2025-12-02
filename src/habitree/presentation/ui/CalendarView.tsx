import React from 'react';
import { StyleSheet, Dimensions, View, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width: windowWidth } = Dimensions.get('window');

const generateRandomData = () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

export const CalendarView: React.FC = () => {
  const data = {
    labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    datasets: [
      { data: generateRandomData(), color: (opacity = 1) => `rgba(0,173,245,${opacity})`, strokeWidth: 2 },
    ],
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Calendar
        style={{ marginVertical: 20, borderRadius: 10 }}
        onDayPress={(day) => {
          Alert.alert('Ausgewähltes Datum', day.dateString);
        }}
      />

      <LineChart
        data={data}
        width={windowWidth - 32}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 173, 245, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          propsForDots: { r: '4', strokeWidth: '2', stroke: '#00adf5' },
        }}
        bezier
        style={{ marginVertical: 16, borderRadius: 12, alignSelf: 'center' }}
        onDataPointClick={({ value, index }) => Alert.alert(`Wert am ${data.labels[index]}`, `Y: ${value}`)}
      />
    </ThemedView>
  );
};

export default CalendarView;
