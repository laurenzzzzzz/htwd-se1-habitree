import { useState, useCallback } from 'react';
import { useApplicationServices } from '../providers/ApplicationServicesProvider';
import { useAuth } from '../../context/AuthContext';

export function useAuthController() {
  const { authService } = useApplicationServices();
  const { signOut, signIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsProcessing(true);
    try {
      const res = await authService.login(email, password);
      // Update AuthContext state so the app reflects the logged-in user
      if (res && res.token && res.user) {
        await signIn(res.token, res.user);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [authService, signIn]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsProcessing(true);
    try {
      const res = await authService.register(username, email, password);
      if (res && res.token && res.user) {
        await signIn(res.token, res.user);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [authService, signIn]);

  const logout = useCallback(async () => {
    setIsProcessing(true);
    try {
      await signOut();
    } finally {
      setIsProcessing(false);
    }
  }, [signOut]);

  return { login, register, logout, isProcessing };
}

export default useAuthController;
