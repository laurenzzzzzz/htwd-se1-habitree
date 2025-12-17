import React, { useMemo, useState } from 'react';
import { View, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAchievementController } from '../../presentation/controllers/useAchievementController';
import InventoryView from '../../presentation/ui/InventoryView';
import { ThemedText } from '../../presentation/ui/ThemedText';
import { createInventoryViewStyles } from '../../styles/inventory_style';
import { Colors } from '../../constants/Colors';

export default function InventoryScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const { width, height } = useWindowDimensions();
  const styles = useMemo(
    () => createInventoryViewStyles(width, height, { backgroundColor }),
    [width, height, backgroundColor],
  );
  const { achievements, isLoading } = useAchievementController();
  const [selectedAchievementId, setSelectedAchievementId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.accent} />
        <ThemedText style={styles.loadingText}>Lädt Erfolge...</ThemedText>
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
