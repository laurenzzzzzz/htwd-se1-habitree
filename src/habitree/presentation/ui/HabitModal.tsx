import React, { useState } from 'react';
import { Modal, View, Button, Pressable, TextInput, Text, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import { styles as loginStyles } from '../../styles/login_style';
import { habitModalStyles } from '../../styles/habitmodal_style';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import FrequencyDropdown from './FrequencyDropdown';

type Predefined = { id?: number; label: string; description: string; frequency: string };

type Props = {
  visible: boolean;
  mode: 'menu' | 'custom' | 'predefined' | null;
  onClose: () => void;
  onOpenMode: (mode: 'menu' | 'custom' | 'predefined') => void;
  predefinedHabits: Predefined[];
  newHabitName: string;
  newHabitDescription: string;
  newHabitStartDate: string;
  newHabitTime: string;
  newHabitFrequency: string;
  newHabitWeekDays: number[];
  newHabitIntervalDays: string;
  setNewHabitName: (s: string) => void;
  setNewHabitDescription: (s: string) => void;
  setNewHabitStartDate: (s: string) => void;
  setNewHabitTime: (s: string) => void;
  setNewHabitFrequency: (s: string) => void;
  setNewHabitWeekDays: (days: number[]) => void;
  setNewHabitIntervalDays: (s: string) => void;
  onAddPredefined: (label: string, description: string, frequency: string) => void;
  onSelectPredefined?: (p: Predefined) => void;
  onAddCustom: () => void;
};

export default function HabitModal({
  visible,
  mode,
  onClose,
  onOpenMode,
  predefinedHabits,
  newHabitName,
  newHabitDescription,
  newHabitStartDate,
  newHabitTime,
  newHabitFrequency,
  newHabitWeekDays,
  newHabitIntervalDays,
  setNewHabitName,
  setNewHabitDescription,
  setNewHabitStartDate,
  setNewHabitTime,
  setNewHabitFrequency,
  setNewHabitWeekDays,
  setNewHabitIntervalDays,
  onAddPredefined,
  onSelectPredefined,
  onAddCustom,
}: Props) {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get('window');

  // Match header/tab sizing used in the TabLayout so modal fits between them
  const HEADER_HEIGHT = Math.max( insets.top, 60);
  const TAB_BAR_HEIGHT = Math.max(48, windowHeight * 0.050);
  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom;

  // Show the dialog between header and tab-bar for all modal modes
  const isBetweenBars = mode === 'custom' || mode === 'predefined' || mode === 'menu';

  // Reset form when closing modal
  const handleClose = () => {
    setNewHabitName('');
    setNewHabitDescription('');
    setNewHabitStartDate('');
    setNewHabitTime('');
    setNewHabitFrequency('');
    setNewHabitWeekDays([]);
    setNewHabitIntervalDays('');
    setDatePickerVisible(false);
    setTimePickerVisible(false);
    onClose();
  };

  return (
    // keep Modal transparent so only the between-area is filled with white
    <Modal visible={visible} transparent animationType={isBetweenBars ? 'slide' : 'fade'} onRequestClose={handleClose}>
      <View
        style={
          isBetweenBars
            ? [habitModalStyles.betweenContainer, { top: HEADER_HEIGHT, bottom: bottomOffset }]
            : habitModalStyles.modalContainer
        }
      >
        <View style={isBetweenBars ? habitModalStyles.betweenContent : habitModalStyles.modalContent}>
          {mode === 'menu' && (
            <>
              <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Was möchtest du tun?</ThemedText>
              <Button title="Vordefiniertes Ziel wählen" onPress={() => onOpenMode('predefined')} />
              <View style={habitModalStyles.spacer} />
              <Button title="Eigenes Ziel erstellen" onPress={() => onOpenMode('custom')} />
            </>
          )}

          {mode === 'predefined' && (
            <>
              <ScrollView style={habitModalStyles.scrollView}>
                <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Vordefiniertes Ziel auswählen:</ThemedText>
                {predefinedHabits.map(({ id, label, description, frequency }) => (
                  <Pressable
                    key={id ?? label}
                    onPress={() => {
                      if (onSelectPredefined) {
                        onSelectPredefined({ id, label, description, frequency });
                      } else {
                        onAddPredefined(label, description, frequency);
                      }
                    }}
                    style={habitModalStyles.predefinedItem}
                  >
                    <ThemedText style={habitModalStyles.predefinedLabel}>{label}</ThemedText>
                    <ThemedText style={habitModalStyles.predefinedDescription}>{description}</ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}

          {mode === 'custom' && (
            <>
              <ScrollView style={habitModalStyles.scrollViewCustom}>
                <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Eigenes Ziel erstellen</ThemedText>
                <TextInput
                  placeholder="Kurzname (z. B. Kniebeugen)"
                  value={newHabitName}
                  onChangeText={setNewHabitName}
                  style={loginStyles.input}
                />
                <TextInput
                  placeholder="Beschreibung"
                  value={newHabitDescription}
                  onChangeText={setNewHabitDescription}
                  style={loginStyles.input}
                />

                {/* Start Date Input */}
                <View style={habitModalStyles.inputRowContainer}>
                  <View style={[habitModalStyles.inputWithIcon, loginStyles.input]}>
                    <TextInput
                      placeholder="Startdatum (dd.mm.yyyy)"
                      value={newHabitStartDate}
                      onChangeText={setNewHabitStartDate}
                      style={habitModalStyles.inputInner}
                      editable={false}
                    />
                    <Pressable
                      style={habitModalStyles.iconInside}
                      onPress={() => setDatePickerVisible(true)}
                    >
                      <Text style={habitModalStyles.iconButtonText}>📅</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Time Input */}
                <View style={habitModalStyles.inputRowContainer}>
                  <View style={[habitModalStyles.inputWithIcon, loginStyles.input]}>
                    <TextInput
                      placeholder="Uhrzeit (hh:mm)"
                      value={newHabitTime}
                      onChangeText={setNewHabitTime}
                      style={habitModalStyles.inputInner}
                      editable={false}
                    />
                    <Pressable
                      style={habitModalStyles.iconInside}
                      onPress={() => setTimePickerVisible(true)}
                    >
                      <Text style={habitModalStyles.iconButtonText}>⏰</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Frequency Dropdown */}
               
                <FrequencyDropdown
                  selectedFrequency={newHabitFrequency}
                  onSelectFrequency={setNewHabitFrequency}
                />

                {/* Interval Input - Only show if frequency is Benutzerdefiniert */}
                {newHabitFrequency === 'Benutzerdefiniert' && (
                  <View style={{ marginTop: 12 }}>
                    <ThemedText style={habitModalStyles.label}>Alle wieviele Tage?</ThemedText>
                    <TextInput
                      placeholder="z.B. 2, 4, 7"
                      value={newHabitIntervalDays}
                      onChangeText={setNewHabitIntervalDays}
                      keyboardType="number-pad"
                      style={loginStyles.input}
                    />
                  </View>
                )}

                {/* Weekday Picker - Only show if frequency is Wöchentlich */}
                {newHabitFrequency === 'Wöchentlich' && (
                  <View style={{ marginTop: 12 }}>
                    <ThemedText style={habitModalStyles.label}>Wochentage auswählen:</ThemedText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((label, index) => {
                        const isSelected = newHabitWeekDays.includes(index);
                        return (
                          <Pressable
                            key={index}
                            onPress={() => {
                              if (isSelected) {
                                setNewHabitWeekDays(newHabitWeekDays.filter(d => d !== index));
                              } else {
                                setNewHabitWeekDays([...newHabitWeekDays, index]);
                              }
                            }}
                            style={{
                              width: '13%',
                              aspectRatio: 1,
                              borderRadius: 8,
                              backgroundColor: isSelected ? '#4CAF50' : '#f0f0f0',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: isSelected ? '#388E3C' : '#ccc',
                            }}
                          >
                            <Text style={{ fontSize: 12, fontWeight: '500', color: isSelected ? '#fff' : '#333' }}>
                              {label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}
              </ScrollView>
            </>
          )}

          {/* Single shared button row to avoid duplicate buttons */}
          {mode && (
            <View style={habitModalStyles.buttonRow}>
              {mode === 'custom' ? (
                <>
                  <Pressable style={habitModalStyles.halfButton} onPress={handleClose}>
                    <ThemedText style={habitModalStyles.buttonText}>Zurück</ThemedText>
                  </Pressable>
                  {/* Disable save button if weekly without selected weekdays or custom without interval */}
                  <Pressable
                    style={[
                      habitModalStyles.halfButton,
                      (newHabitFrequency === 'Wöchentlich' && newHabitWeekDays.length === 0) ||
                      (newHabitFrequency === 'Benutzerdefiniert' && newHabitIntervalDays.trim() === '')
                        ? { opacity: 0.5 }
                        : {},
                    ]}
                    onPress={onAddCustom}
                    disabled={
                      (newHabitFrequency === 'Wöchentlich' && newHabitWeekDays.length === 0) ||
                      (newHabitFrequency === 'Benutzerdefiniert' && newHabitIntervalDays.trim() === '')
                    }
                  >
                    <ThemedText style={habitModalStyles.buttonText}>Hinzufügen</ThemedText>
                  </Pressable>
                </>
              ) : (
                <Pressable style={habitModalStyles.fullButton} onPress={handleClose}>
                  <ThemedText style={habitModalStyles.buttonText}>Zurück</ThemedText>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Date Picker Modal */}
      <DatePicker
        visible={datePickerVisible}
        selectedDate={newHabitStartDate}
        onSelectDate={setNewHabitStartDate}
        onClose={() => setDatePickerVisible(false)}
      />

      {/* Time Picker Modal */}
      <TimePicker
        visible={timePickerVisible}
        selectedTime={newHabitTime}
        onSelectTime={setNewHabitTime}
        onClose={() => setTimePickerVisible(false)}
      />
    </Modal>
  );
}
