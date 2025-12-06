import React, { useState, useMemo } from 'react';
import { Modal, View, Button, Pressable, Text, Dimensions, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { datePickerStyles } from '../../styles/datepicker_style';

type Props = {
  visible: boolean;
  selectedDate: string; // format: "dd.mm.yyyy" or empty
  onSelectDate: (date: string) => void;
  onClose: () => void;
};

export default function DatePicker({ visible, selectedDate, onSelectDate, onClose }: Props) {
  const [displayMonth, setDisplayMonth] = useState(new Date());

  // Parse selected date to highlight it
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, day);
  };

  const selectedDateObj = useMemo(() => parseDate(selectedDate), [selectedDate]);

  // Generate calendar days for current display month
  const generateCalendarDays = () => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();

    // First day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, ...

    const days: (number | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDayLabels = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  const handleDayPress = (day: number) => {
    const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
    const formatted = `${String(day).padStart(2, '0')}.${String(displayMonth.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    onSelectDate(formatted);
    onClose();
  };

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1));
  };

  const monthYear = displayMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={datePickerStyles.overlay}>
        <View style={datePickerStyles.container}>
          <ThemedText type="subtitle" style={datePickerStyles.title}>
            Datum wählen
          </ThemedText>

          {/* Month/Year and Navigation */}
          <View style={datePickerStyles.monthHeader}>
            <Button title="◄" onPress={handlePrevMonth} />
            <ThemedText style={datePickerStyles.monthText}>{monthYear}</ThemedText>
            <Button title="►" onPress={handleNextMonth} />
          </View>

          {/* Weekday Labels */}
          <View style={datePickerStyles.weekdayRow}>
            {weekDayLabels.map((label) => (
              <View key={label} style={datePickerStyles.weekdayCell}>
                <ThemedText style={datePickerStyles.weekdayText}>{label}</ThemedText>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={datePickerStyles.calendarGrid}>
            {calendarDays.map((day, index) => {
              const isSelected =
                day !== null &&
                selectedDateObj &&
                selectedDateObj.getDate() === day &&
                selectedDateObj.getMonth() === displayMonth.getMonth() &&
                selectedDateObj.getFullYear() === displayMonth.getFullYear();

              return (
                <Pressable
                  key={index}
                  style={[
                    datePickerStyles.dayCell,
                    day === null && datePickerStyles.dayCellEmpty,
                    isSelected && datePickerStyles.dayCellSelected,
                  ]}
                  onPress={() => day !== null && handleDayPress(day)}
                  disabled={day === null}
                >
                  {day !== null && (
                    <ThemedText style={[datePickerStyles.dayText, isSelected && datePickerStyles.dayTextSelected]}>
                      {day}
                    </ThemedText>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Close Button */}
          <Button title="Schließen" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
