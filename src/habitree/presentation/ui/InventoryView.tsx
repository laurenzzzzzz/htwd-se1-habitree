import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { Modal, Pressable, Text, View, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { inventoryviewStyles } from '../../styles/inventory_style';
import { Achievement } from '../../domain/entities/Achievement';
import { Habit } from '../../domain/entities/Habit';

type Props = {
  achievements: (Achievement | Habit)[];
  selectedAchievementId: number | null;
  onSelectAchievement: (id: number | null) => void;
};

const isHabit = (item: Achievement | Habit): item is Habit => {
  return 'name' in item && 'startDate' in item && 'createdAt' in item;
};

export const InventoryView: React.FC<Props> = ({ 
  achievements, 
  selectedAchievementId, 
  onSelectAchievement 
}) => {
  const achievementRows = useMemo(() => {
    const rows: (Achievement | Habit)[][] = [];
    for (let i = 0; i < achievements.length; i += 3) {
      rows.push(achievements.slice(i, i + 3));
    }
    return rows;
  }, [achievements]);

  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('de-DE');
  };

  const selectedAchievement = useMemo(() => {
    return achievements.find((a) => a.id === selectedAchievementId);
  }, [achievements, selectedAchievementId]);

  return (
    <ThemedView style={inventoryviewStyles.container}>
      <ThemedText type="subtitle" style={inventoryviewStyles.title}>
        Erfolge
      </ThemedText>

      {/* Render achievement badges in grid */}
      {achievementRows.map((row, rowIndex) => (
        <View key={rowIndex} style={inventoryviewStyles.badgeRow}>
          {row.map((achievement) => (
            <Pressable
              key={achievement.id}
              onPress={() => onSelectAchievement(achievement.id)}
            >
              {isHabit(achievement) ? (
                <Image 
                  source={require('@/assets/images/tree/tree8.png')} 
                  style={[inventoryviewStyles.badge, inventoryviewStyles.completedTree]} 
                  contentFit="contain" 
                />
              ) : (
                <Image 
                  source={(achievement as Achievement).imageUrl} 
                  style={inventoryviewStyles.badge} 
                  contentFit="contain" 
                />
              )}
            </Pressable>
          ))}
        </View>
      ))}

      {/* Achievement/Habit Details Modal */}
      <Modal
        visible={selectedAchievementId !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => onSelectAchievement(null)}
      >
        <View style={inventoryviewStyles.modalOverlay}>
          <View style={inventoryviewStyles.modalContent}>
            {selectedAchievement && (
              <ScrollView>
                {isHabit(selectedAchievement) ? (
                  <>
                    <Image
                      source={require('@/assets/images/tree/tree8.png')}
                      style={inventoryviewStyles.modalImage}
                      contentFit="contain"
                    />
                    <Text style={inventoryviewStyles.modalTitle}>
                      {selectedAchievement.name}
                    </Text>
                    {selectedAchievement.description && (
                      <View style={inventoryviewStyles.modalDescriptionBlock}>
                        <Text style={[inventoryviewStyles.modalText, inventoryviewStyles.modalLabel]}>
                          Beschreibung:
                        </Text>
                        <Text style={inventoryviewStyles.modalText}>
                          {selectedAchievement.description}
                        </Text>
                      </View>
                    )}
                    <View style={inventoryviewStyles.modalSection}>
                      <Text style={[inventoryviewStyles.modalText, inventoryviewStyles.modalLabel]}>
                        Erstellungsdatum:
                      </Text>
                      <Text style={inventoryviewStyles.modalText}>
                        {selectedAchievement.createdAt ? formatDate(selectedAchievement.createdAt) : '-'}
                      </Text>
                    </View>
                    <View style={inventoryviewStyles.modalSection}>
                      <Text style={[inventoryviewStyles.modalText, inventoryviewStyles.modalLabel]}>
                        Startdatum:
                      </Text>
                      <Text style={inventoryviewStyles.modalText}>
                        {selectedAchievement.startDate ? formatDate(selectedAchievement.startDate) : '-'}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Image
                      source={(selectedAchievement as Achievement).imageUrl}
                      style={inventoryviewStyles.modalImage}
                      contentFit="contain"
                    />
                    <Text style={inventoryviewStyles.modalTitle}>
                      {(selectedAchievement as Achievement).name}
                    </Text>
                    <Text style={inventoryviewStyles.modalText}>
                      {(selectedAchievement as Achievement).description}
                    </Text>
                    <Text style={inventoryviewStyles.modalText}>
                      Freigeschaltet: {(selectedAchievement as Achievement).getFormattedUnlockDate()}
                    </Text>
                  </>
                )}
              </ScrollView>
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