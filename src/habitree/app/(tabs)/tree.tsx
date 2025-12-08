import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTreeGrowthController } from '../../presentation/controllers/useTreeGrowthController';
import TreeView from '../../presentation/ui/TreeView';

export default function TabTwoScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const { treeGrowth, isLoading } = useTreeGrowthController();

  return <TreeView treeGrowth={treeGrowth} isLoading={isLoading} backgroundColor={backgroundColor} />;
}
