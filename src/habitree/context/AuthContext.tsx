import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../domain/entities/User';
import { useApplicationServices } from '../presentation/providers/ApplicationServicesProvider';

export type CurrentUser = User;

type AuthContextType = {
  authToken: string | null;
  currentUser: CurrentUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (token: string, user: CurrentUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { authService } = useApplicationServices();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { token, user } = await authService.initialize();
      setAuthToken(token);
      setCurrentUser(user);
      setIsLoading(false);
    };
    checkAuthStatus();
  }, [authService]);

  const signIn = async (token: string, user: CurrentUser) => {
    await authService.signIn(token, user);
    setAuthToken(token);
    setCurrentUser(user);
  };

  const signOut = async () => {
    await authService.signOut();
    setAuthToken(null);
    setCurrentUser(null);
  };

  const isLoggedIn = !!authToken && !!currentUser;

  return (
    <AuthContext.Provider
      value={{ authToken, currentUser, isLoggedIn, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};