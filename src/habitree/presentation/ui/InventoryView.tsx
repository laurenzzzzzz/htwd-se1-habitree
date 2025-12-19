
import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { Modal, Pressable, Text, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { inventoryviewStyles } from '../../styles/inventory_style';
import { Achievement } from '../../domain/entities/Achievement';

type Props = {
  achievements: Achievement[];
  selectedAchievementId: number | null;
  onSelectAchievement: (id: number | null) => void;
};

export const InventoryView: React.FC<Props> = ({ 
  achievements, 
  selectedAchievementId, 
  onSelectAchievement 
}) => {
  // //Dummy Hardcoded: Organize achievements into rows for display
  // In real implementation, would fetch row organization from backend
  const achievementRows = useMemo(() => {
    const rows: Achievement[][] = [];
    for (let i = 0; i < achievements.length; i += 3) {
      rows.push(achievements.slice(i, i + 3));
    }
    return rows;
  }, [achievements]);

  const selectedAchievement = useMemo(() => {
    return achievements.find((a) => a.id === selectedAchievementId);
  }, [achievements, selectedAchievementId]);

  return (
    <ThemedView style={inventoryviewStyles.container}>
      <ThemedText type="subtitle" style={inventoryviewStyles.title}>
        Erfolge
      </ThemedText>

      <View style={{ marginBottom: 20 }}>
        {[
          "Erstelle dein 1. Habit",
          "Habe 5 Habits gleichzeitig laufen",
          "Erreiche eine 66 Tage Streak für eine Gewohnheit",
          "Absolviere 7 Tage am Stück alle Habits",
          "Hake 50x eine Gewohnheit ab",
          "Schließe 30 Tage mindestens ein Habit pro Tag ab",
          "Absolviere 66 Tage am Stück alle Habits"
        ].map((item, index) => (
          <ThemedText key={index} style={{ marginBottom: 8 }}>
            • {item}
          </ThemedText>
        ))}
      </View>

      {/* //Dummy Hardcoded: Render achievement badges in grid */}
      {achievementRows.map((row, rowIndex) => (
        <View key={rowIndex} style={inventoryviewStyles.badgeRow}>
          {row.map((achievement) => (
            <Pressable
              key={achievement.id}
              onPress={() => onSelectAchievement(achievement.id)}
            >
              <Image 
                source={achievement.imageUrl} 
                style={inventoryviewStyles.badge} 
                contentFit="contain" 
              />
            </Pressable>
          ))}
        </View>
      ))}

      {/* Achievement Details Modal */}
      <Modal
        visible={selectedAchievementId !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => onSelectAchievement(null)}
      >
        <View style={inventoryviewStyles.modalOverlay}>
          <View style={inventoryviewStyles.modalContent}>
            {selectedAchievement && (
              <>
                <Image
                  source={selectedAchievement.imageUrl}
                  style={{ width: 80, height: 80, marginBottom: 16 }}
                  contentFit="contain"
                />
                <Text style={inventoryviewStyles.modalTitle}>
                  {selectedAchievement.name}
                </Text>
                <Text style={inventoryviewStyles.modalText}>
                  {selectedAchievement.description}
                </Text>
                <Text style={inventoryviewStyles.modalText}>
                  Freigeschaltet: {selectedAchievement.getFormattedUnlockDate()}
                </Text>
              </>
            )}
            <Pressable
              style={inventoryviewStyles.closeButton}
              onPress={() => onSelectAchievement(null)}
            >
              <Text style={inventoryviewStyles.closeButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

export default InventoryView;