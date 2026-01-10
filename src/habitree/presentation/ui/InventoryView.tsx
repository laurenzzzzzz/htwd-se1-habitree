import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { Modal, Pressable, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { inventoryviewStyles } from '../../styles/inventory_style';
import { styles as homeStyles } from '../../styles/index_style';
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
  const { width } = useWindowDimensions();

  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('de-DE');
  };

  const selectedAchievement = useMemo(() => {
    return achievements.find((a) => a.id === selectedAchievementId);
  }, [achievements, selectedAchievementId]);

  // Layout Constants for Hexagon
  const VIEW_PADDING = 20; 
  const VIEW_WIDTH = width - VIEW_PADDING;
  // Significantly increased width
  const ITEM_WIDTH = Math.min(VIEW_WIDTH * 0.32, 130); 
  // Height a bit larger than width (1.4 ratio)
  const ITEM_HEIGHT = ITEM_WIDTH * 1.4; 
  // Radius adjusted to fit on screen (slight overlap possible to maximize size)
  const RADIUS = ITEM_WIDTH * 1.3; 
  const CONTAINER_HEIGHT = (RADIUS * 2) + ITEM_HEIGHT + 20;
  
  const HEX_CX = (width - VIEW_PADDING) / 2;
  const HEX_CY = CONTAINER_HEIGHT / 2;

  const getHexPosition = (index: number) => {
    const centeredX = HEX_CX - (ITEM_WIDTH / 2);
    const centeredY = HEX_CY - (ITEM_HEIGHT / 2);

    if (index === 0) {
      return { top: centeredY, left: centeredX };
    }
    
    // Position 1 (Top), then clockwise: 2 (TR), 3 (BR), 4 (B), 5 (BL), 6 (TL) ??
    // User asked for "Hexagon around middle".
    // 60 degrees steps. Start at -90deg (Top).
    
    // index 1 -> -90
    // index 2 -> -30
    // ...
    const i = index - 1;
    const angleDeg = -90 + (i * 60);
    const angleRad = (angleDeg * Math.PI) / 180;
    
    const x = centeredX + Math.cos(angleRad) * RADIUS;
    const y = centeredY + Math.sin(angleRad) * RADIUS;
    
    return { top: y, left: x };
  };

  const hexItems = achievements.slice(0, 7);
  const restItems = achievements.slice(7);

  const restRows = useMemo(() => {
    const rows: (Achievement | Habit)[][] = [];
    for (let i = 0; i < restItems.length; i += 3) {
      rows.push(restItems.slice(i, i + 3));
    }
    return rows;
  }, [restItems]);

  return (
    <ThemedView style={inventoryviewStyles.container}>
      {/* <ThemedText type="subtitle" style={inventoryviewStyles.title}>
        Erfolge
      </ThemedText> */}

      {achievements.length === 0 ? (
        <View style={inventoryviewStyles.emptyStateContainer}>
          <ThemedText style={homeStyles.noHabitsText}>Keine Erfolge freigeschaltet.</ThemedText>
          <ThemedText style={homeStyles.noHabitsText}>
            Bleib dran an deinen Habits - der nächste Erfolg wartet schon!
          </ThemedText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Hexagon Cluster */}
            <View style={{ height: CONTAINER_HEIGHT, width: '100%', position: 'relative', marginBottom: 20 }}>
                {hexItems.map((achievement, index) => {
                    const pos = getHexPosition(index);
                    const isTree = isHabit(achievement); 
                    // Special styling to make it a bit taller for trees/badges as requested
                    // "Rahmen ... sehr hoch" (user complained it was TOO high maybe? "ist sehr hoch") -> 
                    // "die Höhe ein wenig größer als die Breite" -> User WANTS height > width.
                    // OK.
                    
                    return (
                        <Pressable
                            key={achievement.id}
                            onPress={() => onSelectAchievement(achievement.id)}
                            style={{
                                position: 'absolute',
                                left: pos.left,
                                top: pos.top,
                                width: ITEM_WIDTH,
                                height: ITEM_HEIGHT,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {isTree ? (
                            <Image 
                                source={require('@/assets/images/tree/tree8.png')} 
                                style={[
                                    inventoryviewStyles.badge, 
                                    inventoryviewStyles.completedTree, 
                                    { width: '100%', height: '100%' } // Force fill container
                                ]} 
                                contentFit="contain" 
                            />
                            ) : (
                            <Image 
                                source={(achievement as Achievement).imageUrl} 
                                style={[
                                    inventoryviewStyles.badge, 
                                    { width: '100%', height: '100%' }
                                ]} 
                                contentFit="contain" 
                            />
                            )}
                        </Pressable>
                    );
                })}
            </View>

            {/* Remaining items in grid */}
            {restRows.map((row, rowIndex) => (
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
        </ScrollView>
      )}

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