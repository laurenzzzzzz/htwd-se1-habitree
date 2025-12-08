import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { View, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { treeviewStyles } from '../../styles/treeview_style';
import { TreeGrowth } from '../../domain/entities/TreeGrowth';

type Props = {
  treeGrowth: TreeGrowth | null;
  isLoading: boolean;
  backgroundColor: string;
};

export const TreeView: React.FC<Props> = ({ treeGrowth, isLoading, backgroundColor }) => {
  // //Dummy Hardcoded: Map growth percentage to tree image
  // In real implementation, would have different tree images for each growth stage
  const treeImage = useMemo(() => {
    if (!treeGrowth) return require('@/assets/images/tree.png');
    
    //Dummy Hardcoded: Using single tree image for all stages
    // Stage mapping would be: 1 = seedling, 2 = young, 3 = mature, 4 = full, 5 = ancient
    return require('@/assets/images/tree.png');
  }, [treeGrowth]);

  if (isLoading) {
    return (
      <View style={[treeviewStyles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color="rgb(25, 145, 137)" />
        <ThemedText style={{ marginTop: 10 }}>Lädt Baum-Wachstum...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={[treeviewStyles.container, { backgroundColor }]}>
      <Image
        source={treeImage}
        style={treeviewStyles.treeImage}
        contentFit="contain"
      />

      {treeGrowth && (
        <ThemedView style={treeviewStyles.growthInfoContainer}>
          <ThemedText style={treeviewStyles.growthText}>
            {treeGrowth.getGrowthText()}
          </ThemedText>
          <ThemedText style={treeviewStyles.growthPercentage}>
            Stufe {treeGrowth.getGrowthStage()}/5 • {treeGrowth.streakCount} Tage Streak
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default TreeView;