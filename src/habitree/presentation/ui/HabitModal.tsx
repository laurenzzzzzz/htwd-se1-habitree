import React from 'react';
import { Modal, View, Button, Pressable, TextInput, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles as loginStyles } from '../../styles/login_style';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
          {mode === 'menu' && (
            <>
              <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Was möchtest du tun?</ThemedText>
              <Button title="Vordefiniertes Ziel wählen" onPress={() => onOpenMode('predefined')} />
              <View style={{ height: 12 }} />
              <Button title="Eigenes Ziel erstellen" onPress={() => onOpenMode('custom')} />
            </>
          )}

          {mode === 'predefined' && (
            <ScrollView style={{ maxHeight: 300 }}>
              <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Vordefiniertes Ziel auswählen:</ThemedText>
              {predefinedHabits.map(({ id, label, description, frequency }) => (
                <Pressable
                  key={id ?? label}
                  onPress={() => onAddPredefined(label, description, frequency)}
                  style={{ paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                >
                  <ThemedText style={{ fontWeight: '500' }}>{label}</ThemedText>
                  <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>{description}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {mode === 'custom' && (
            <>
              <ThemedText type="subtitle" style={{ marginBottom: 12 }}>Eigenes Ziel erstellen</ThemedText>
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
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                <Button title="Hinzufügen" onPress={onAddCustom} />
              </View>
            </>
          )}

          <View style={{ marginTop: 12 }}>
            <Button title="Zurück" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
