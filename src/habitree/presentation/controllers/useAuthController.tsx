import { useState } from 'react';
import { authenticationService } from '../../infrastructure/di/ServiceContainer';
import { useAuth } from '../../context/AuthContext';

export function useAuthController() {
  const { signOut, signIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const login = async (email: string, password: string) => {
    setIsProcessing(true);
    try {
      const res = await authenticationService.login(email, password);
      // Update AuthContext state so the app reflects the logged-in user
      if (res && res.token && res.user) {
        await signIn(res.token, res.user);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsProcessing(true);
    try {
      const res = await authenticationService.register(username, email, password);
      if (res && res.token && res.user) {
        await signIn(res.token, res.user);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const logout = async () => {
    setIsProcessing(true);
    try {
      await signOut();
    } finally {
      setIsProcessing(false);
    }
  };

  return { login, register, logout, isProcessing };
}

export default useAuthController;
