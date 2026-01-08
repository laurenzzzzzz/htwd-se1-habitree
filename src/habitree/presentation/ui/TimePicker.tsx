import React, { useState } from 'react';
import { Modal, View, Pressable, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from './ThemedText';
import { timePickerStyles } from '../../styles/timepicker_style';

type Props = {
  visible: boolean;
  selectedTime: string; // format: "hh:mm" or empty
  onSelectTime: (time: string) => void;
  onClose: () => void;
};

export default function TimePicker({ visible, selectedTime, onSelectTime, onClose }: Props) {
  // Parse time or default to current time
  const parseTime = (timeStr: string): [number, number] => {
    if (!timeStr) {
      const now = new Date();
      return [now.getHours(), now.getMinutes()];
    }
    const parts = timeStr.split(':');
    if (parts.length !== 2) {
      const now = new Date();
      return [now.getHours(), now.getMinutes()];
    }
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) {
      const now = new Date();
      return [now.getHours(), now.getMinutes()];
    }
    return [Math.max(0, Math.min(23, hours)), Math.max(0, Math.min(59, minutes))];
  };

  const [hours, minutes] = parseTime(selectedTime);
  const [tempHours, setTempHours] = useState(hours);
  const [tempMinutes, setTempMinutes] = useState(minutes);

  const handleConfirm = () => {
    const formatted = `${String(tempHours).padStart(2, '0')}:${String(tempMinutes).padStart(2, '0')}`;
    onSelectTime(formatted);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={timePickerStyles.overlay}>
        <View style={timePickerStyles.container}>
          <ThemedText type="subtitle" style={timePickerStyles.title}>
            Uhrzeit wählen
          </ThemedText>

                  {/* Time Pickers (hours and minutes) */}
                  <View style={timePickerStyles.pickerRow}>
                    <View style={timePickerStyles.pickerContainer}>
                      <ThemedText style={timePickerStyles.label}>Stunden</ThemedText>
                      <Picker
                        selectedValue={tempHours}
                        onValueChange={(v) => setTempHours(Number(v))}
                        style={timePickerStyles.picker}
                        itemStyle={timePickerStyles.pickerItem}
                      >
                        {Array.from({ length: 24 }).map((_, i) => (
                          <Picker.Item key={i} label={String(i).padStart(2, '0')} value={i} />
                        ))}
                      </Picker>
                    </View>

                    <View style={timePickerStyles.pickerContainer}>
                      <ThemedText style={timePickerStyles.label}>Minuten</ThemedText>
                      <Picker
                        selectedValue={tempMinutes}
                        onValueChange={(v) => setTempMinutes(Number(v))}
                        style={timePickerStyles.picker}
                        itemStyle={timePickerStyles.pickerItem}
                      >
                        {Array.from({ length: 60 }).map((_, i) => (
                          <Picker.Item key={i} label={String(i).padStart(2, '0')} value={i} />
                        ))}
                      </Picker>
                    </View>
                  </View>

          {/* Time Display */}
          <View style={timePickerStyles.timeDisplay}>
            <ThemedText style={timePickerStyles.timeText}>
              {String(tempHours).padStart(2, '0')}:{String(tempMinutes).padStart(2, '0')}
            </ThemedText>
          </View>

          {/* Buttons */}
          <View style={timePickerStyles.buttonRow}>
            <Pressable style={timePickerStyles.button} onPress={onClose} accessibilityLabel="Uhrzeitauswahl abbrechen">
              <ThemedText style={timePickerStyles.buttonText}>Abbrechen</ThemedText>
            </Pressable>
            <Pressable style={timePickerStyles.button} onPress={handleConfirm} accessibilityLabel="Uhrzeit bestätigen">
              <ThemedText style={timePickerStyles.buttonText}>OK</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
