import React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { Habit as HabitType } from '../../domain/entities/Habit';
import { habitListStyles } from '../../styles/habitlist_style';

type Props = {
  habits: HabitType[];
  onToggle: (id: number) => void;
};

export const HabitList: React.FC<Props> = ({ habits, onToggle }) => {
  return (
    <View>
      <ThemedText type="subtitle" style={habitListStyles.title}>Deine Streak:</ThemedText>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => onToggle(item.id)} style={habitListStyles.habitItem}>
            <ThemedText style={habitListStyles.habitName}>{item.name}</ThemedText>
            <ThemedText style={habitListStyles.habitDescription}>{item.description}</ThemedText>
          </Pressable>
        )}
      />
    </View>
  );
};

export default HabitList;
