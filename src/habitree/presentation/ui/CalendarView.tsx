import React, { useMemo } from 'react';
import { Dimensions, View, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { calendarViewStyles } from '../../styles/calenderview_style';

type WeeklyStats = {
  labels: string[];
  data: number[];
};

type Props = {
  weeklyStats: WeeklyStats;
  selectedDate: string;
  onDayPress: (dateString: string) => void;
  getDayCompletionRate: (dateString: string) => number;
};

const { width: windowWidth } = Dimensions.get('window');

export const CalendarView: React.FC<Props> = ({ 
  weeklyStats, 
  selectedDate, 
  onDayPress, 
  getDayCompletionRate 
}) => {
  /**
   * //Dummy Hardcoded: Chart data with weekly stats
   * In real implementation, would fetch historical completion data
   */
  const chartData = useMemo(() => ({
    labels: weeklyStats.labels,
    datasets: [
      {
        data: weeklyStats.data,
        color: (opacity = 1) => `rgba(0,173,245,${opacity})`,
        strokeWidth: 2,
      },
    ],
  }), [weeklyStats]);

  const handleDayPress = (day: { dateString: string }) => {
    onDayPress(day.dateString);
    const rate = getDayCompletionRate(day.dateString);
    Alert.alert(
      'Fortschritt',
      `${day.dateString}: ${rate}% Habits abgeschlossen`,
      [{ text: 'OK' }]
    );
  };

  const handleChartDataPointClick = ({ value, index }: { value: number; index: number }) => {
    Alert.alert(
      `${weeklyStats.labels[index]}`,
      `Completion Rate: ${value}%`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={calendarViewStyles.container}>
      {/* //Dummy Hardcoded: Calendar component with dummy data */}
      <Calendar
        style={calendarViewStyles.calendar}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#1E9189' },
        }}
      />

      {/* //Dummy Hardcoded: Weekly completion chart */}
      <LineChart
        data={chartData}
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
        style={calendarViewStyles.chart}
        onDataPointClick={handleChartDataPointClick}
      />

      <ThemedText style={{ marginTop: 16, textAlign: 'center' }}>
        Wöchentlicher Fortschritt: {Math.round(weeklyStats.data.reduce((a, b) => a + b, 0) / 7)}% ⌀
      </ThemedText>
    </ThemedView>
  );
};

export default CalendarView;
