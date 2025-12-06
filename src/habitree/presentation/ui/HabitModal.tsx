import React from 'react';
import { Modal, View, Button, Pressable, TextInput, Text, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles as loginStyles } from '../../styles/login_style';
import { habitModalStyles } from '../../styles/habitmodal_style';

type Predefined = { id?: number; label: string; description: string; frequency: string };

type Props = {
  visible: boolean;
  mode: 'menu' | 'custom' | 'predefined' | null;
  onClose: () => void;
  onOpenMode: (mode: 'menu' | 'custom' | 'predefined') => void;
  predefinedHabits: Predefined[];
  newHabitName: string;
  newHabitDescription: string;
  setNewHabitName: (s: string) => void;
  setNewHabitDescription: (s: string) => void;
  onAddPredefined: (label: string, description: string, frequency: string) => void;
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
  setNewHabitName,
  setNewHabitDescription,
  onAddPredefined,
  onAddCustom,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={habitModalStyles.modalContainer}>
        <View style={habitModalStyles.modalContent}>
          {mode === 'menu' && (
            <>
              <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Was möchtest du tun?</ThemedText>
              <Button title="Vordefiniertes Ziel wählen" onPress={() => onOpenMode('predefined')} />
              <View style={habitModalStyles.spacer} />
              <Button title="Eigenes Ziel erstellen" onPress={() => onOpenMode('custom')} />
            </>
          )}

          {mode === 'predefined' && (
            <ScrollView style={habitModalStyles.scrollView}>
              <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Vordefiniertes Ziel auswählen:</ThemedText>
              {predefinedHabits.map(({ id, label, description, frequency }) => (
                <Pressable
                  key={id ?? label}
                  onPress={() => onAddPredefined(label, description, frequency)}
                  style={habitModalStyles.predefinedItem}
                >
                  <ThemedText style={habitModalStyles.predefinedLabel}>{label}</ThemedText>
                  <ThemedText style={habitModalStyles.predefinedDescription}>{description}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {mode === 'custom' && (
            <>
              <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Eigenes Ziel erstellen</ThemedText>
              <TextInput
                placeholder="Kurzname (z. B. Kniebeugen)"
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
              <View style={habitModalStyles.buttonRow}>
                <Button title="Hinzufügen" onPress={onAddCustom} />
              </View>
            </>
          )}

          <View style={habitModalStyles.marginTop}>
            <Button title="Zurück" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
