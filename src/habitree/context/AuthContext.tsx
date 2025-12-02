import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../domain/entities/User';
import { AuthService } from '../application/services/AuthService';
import { SecureStoreAuthRepository } from '../infrastructure/adapters/SecureStoreAuthRepository';

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

// Instantiate repository + service here (can be replaced with DI later)
const authRepo = new SecureStoreAuthRepository();
const authService = new AuthService(authRepo);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
  }, []);

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