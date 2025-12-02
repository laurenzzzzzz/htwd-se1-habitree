import React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Habit as HabitType } from '../../domain/entities/Habit';

type Props = {
  habits: HabitType[];
  onToggle: (id: number) => void;
};

export const HabitList: React.FC<Props> = ({ habits, onToggle }) => {
  return (
    <View>
      <ThemedText type="subtitle" style={{ marginBottom: 8 }}>Deine Streak:</ThemedText>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => onToggle(item.id)} style={{ paddingVertical: 8 }}>
            <ThemedText style={{ fontWeight: '600' }}>{item.name}</ThemedText>
            <ThemedText style={{ opacity: 0.7 }}>{item.description}</ThemedText>
          </Pressable>
        )}
      />
    </View>
  );
};

export default HabitList;
