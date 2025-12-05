import { useCallback, useState, useEffect } from 'react';
import { TreeGrowthService } from '../../application/services/TreeGrowthService';
import { useAuth } from '../../context/AuthContext';
import { TreeGrowth } from '../../domain/entities/TreeGrowth';

export function useTreeGrowthController(treeGrowthService: TreeGrowthService) {
  const { authToken, currentUser } = useAuth();
  const [treeGrowth, setTreeGrowth] = useState<TreeGrowth | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTreeGrowth = useCallback(async () => {
    if (!authToken || !currentUser) return;
    setIsLoading(true);
    try {
      const data = await treeGrowthService.fetchTreeGrowth(authToken, currentUser.id);
      setTreeGrowth(data);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, currentUser, treeGrowthService]);

  useEffect(() => {
    fetchTreeGrowth();
  }, [fetchTreeGrowth]);

  return {
    treeGrowth,
    isLoading,
    fetchTreeGrowth,
  };
}

export default useTreeGrowthController;
