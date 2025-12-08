import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAchievementController } from '../../presentation/controllers/useAchievementController';
import InventoryView from '../../presentation/ui/InventoryView';
import { ThemedText } from '../../presentation/ui/ThemedText';

export default function InventoryScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const { achievements, isLoading } = useAchievementController();
  const [selectedAchievementId, setSelectedAchievementId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <ActivityIndicator size="large" color="rgb(25, 145, 137)" />
        <ThemedText style={{ marginTop: 10, textAlign: 'center' }}>Lädt Erfolge...</ThemedText>
      </View>
    );
  }

  return (
    <InventoryView 
      achievements={achievements} 
      selectedAchievementId={selectedAchievementId} 
      onSelectAchievement={setSelectedAchievementId} 
    />
  );
}
