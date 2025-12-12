import React, { useState } from 'react';
import { View, Pressable, Modal, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { frequencyDropdownStyles } from '../../styles/frequencydropdown_style';
import { styles as loginStyles } from '../../styles/login_style';

type Props = {
  selectedFrequency: string; // 'Täglich', 'Wöchentlich', 'Monatlich'
  onSelectFrequency: (frequency: string) => void;
};

const FREQUENCIES = ['Täglich', 'Wöchentlich', 'Monatlich', 'Benutzerdefiniert'];

export default function FrequencyDropdown({ selectedFrequency = 'Täglich', onSelectFrequency }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (frequency: string) => {
    onSelectFrequency(frequency);
    setIsOpen(false);
  };

  return (
    <View style={frequencyDropdownStyles.container}>
      <Pressable
        style={[loginStyles.input, frequencyDropdownStyles.button]}
        onPress={() => setIsOpen(true)}
      >
          <ThemedText style={frequencyDropdownStyles.buttonText}>
          {selectedFrequency || 'Täglich'}
        </ThemedText>
        <Text style={frequencyDropdownStyles.arrow}>▼</Text>
      </Pressable>

      {/* Modal for Frequency Selection */}
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <View style={frequencyDropdownStyles.overlay}>
          <View style={frequencyDropdownStyles.modalContainer}>
            <ThemedText type="subtitle" style={frequencyDropdownStyles.modalTitle}>
              Häufigkeit wählen
            </ThemedText>

            <View style={frequencyDropdownStyles.optionsList}>
              {FREQUENCIES.map((freq) => (
                <Pressable
                  key={freq}
                  style={[
                    frequencyDropdownStyles.option,
                    selectedFrequency === freq && frequencyDropdownStyles.optionSelected,
                  ]}
                  onPress={() => handleSelect(freq)}
                >
                  <ThemedText
                    style={[
                      frequencyDropdownStyles.optionText,
                      selectedFrequency === freq && frequencyDropdownStyles.optionTextSelected,
                    ]}
                  >
                    {freq}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={frequencyDropdownStyles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={frequencyDropdownStyles.closeButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
